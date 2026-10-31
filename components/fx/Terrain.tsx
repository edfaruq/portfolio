"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion";

const vertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;      // plane-space pointer position
uniform float uMouseAmp;  // hill height under pointer
uniform float uScroll;    // 0..1 hero scroll progress
varying float vH;
varying float vFade;
varying float vMouse;

// Simplex noise (Ashima / Stefan Gustavson)
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(){
  vec3 p = position;
  vec2 q = p.xy * 0.11 + vec2(0.0, uTime * 0.06 + uScroll * 1.5);
  float h = snoise(q) * 1.6 + snoise(q * 2.3 + 4.0) * 0.55 + snoise(q * 5.0 - 2.0) * 0.15;
  float d = distance(p.xy, uMouse);
  float hill = exp(-d * d * 0.09) * uMouseAmp;
  p.z += h + hill;
  vH = h;
  vMouse = hill / max(uMouseAmp, 0.001);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vFade = smoothstep(-58.0, -12.0, mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.4 + vMouse * 2.6) * (34.0 / -mv.z);
}
`;

const fragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uHigh;
uniform vec3 uHot;
varying float vH;
varying float vFade;
varying float vMouse;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  // Contour banding: brighten points near whole-number heights.
  float band = 1.0 - smoothstep(0.0, 0.12, abs(fract(vH * 2.2) - 0.5));
  vec3 col = mix(uBase, uHigh, clamp(vH * 0.35 + 0.5, 0.0, 1.0));
  col = mix(col, uHigh, band * 0.6);
  col = mix(col, uHot, smoothstep(0.15, 0.85, vMouse));
  float a = vFade * (0.35 + band * 0.55 + vMouse * 0.6);
  gl_FragColor = vec4(col, a);
}
`;

/**
 * Point-cloud terrain. The pointer raises a glowing hill; scroll flies over it.
 * Pauses when offscreen; renders one still frame for reduced motion.
 */
export function Terrain({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the hero still works without it.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    camera.position.set(0, -22, 9);
    camera.lookAt(0, 6, 0);

    const geo = new THREE.PlaneGeometry(90, 70, 170, 130);
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseAmp: { value: 0 },
      uScroll: { value: 0 },
      uBase: { value: new THREE.Color("#3b3f2c") },
      uHigh: { value: new THREE.Color("#d4ff3a") },
      uHot: { value: new THREE.Color("#ff5b1f") },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Pointer → plane (z=0) via raycast.
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const target = new THREE.Vector2(999, 999);
    let targetAmp = 0;
    let pressed = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        target.set(hit.x, hit.y);
        targetAmp = pressed ? 7 : 4;
      }
    };
    const onLeave = () => (targetAmp = 0);
    const onDown = () => { pressed = true; targetAmp = 7; };
    const onUp = () => { pressed = false; targetAmp = 4; };
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const reduced = prefersReducedMotion();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    const clock = new THREE.Clock();
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      const m = uniforms.uMouse.value;
      if (m.x > 900) m.copy(target);
      m.lerp(target, 0.08);
      uniforms.uMouseAmp.value += (targetAmp - uniforms.uMouseAmp.value) * 0.06;
      const sp = Math.min(window.scrollY / window.innerHeight, 1);
      uniforms.uScroll.value = sp;
      camera.position.z = 9 + sp * 6;
      camera.rotation.x = 1.15 + sp * 0.25;
      renderer.render(scene, camera);
    };
    camera.rotation.x = 1.15;
    renderer.render(scene, camera);
    // Start animating only once the intro is done, so it doesn't compete for the main thread.
    const w = window as unknown as { __loaded?: boolean };
    const start = () => { clock.getDelta(); render(); };
    if (!reduced) {
      if (w.__loaded) start();
      else window.addEventListener("app:loaded", start, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("app:loaded", start);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden className={className} />;
}
