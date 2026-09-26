"use client";
import { useEffect, useRef } from "react";

const VS = `
attribute vec2 pos;
uniform float t;
uniform vec2 mouse;
uniform float aspect;
varying float glow;
void main() {
  float wave = sin(pos.x * 4.0 + t * 0.7) * 0.06 + cos(pos.y * 5.0 + t * 0.5) * 0.05;
  vec2 p = vec2(pos.x * aspect, pos.y + wave);
  float d = distance(pos, mouse);
  float lift = smoothstep(0.45, 0.0, d) * 0.12;
  p.y += lift;
  glow = 0.25 + 0.55 * smoothstep(0.5, 0.0, d) + wave * 2.0;
  gl_Position = vec4(p, 0.0, 1.0);
  gl_PointSize = 2.2 + lift * 40.0;
}`;
const FS = `
precision mediump float;
uniform vec3 color;
varying float glow;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.12, length(c)) * clamp(glow, 0.05, 1.0) * 0.5;
  gl_FragColor = vec4(color, a);
}`;

/** Zero-dependency WebGL dot-wave behind the hero. Pauses offscreen / calm-motion. */
export default function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const cols = window.innerWidth < 560 ? 14 : 22;
    const rows = window.innerWidth < 560 ? 9 : 13;
    const pts = new Float32Array(cols * rows * 2);
    let k = 0;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      pts[k++] = (x / (cols - 1)) * 2 - 1;
      pts[k++] = (y / (rows - 1)) * 2 - 1;
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "mouse");
    const uA = gl.getUniformLocation(prog, "aspect");
    const uC = gl.getUniformLocation(prog, "color");

    const paint = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      const c = dark ? [0.56, 0.5, 1.0] : [0.23, 0.18, 1.0];
      gl.uniform3f(uC, c[0], c[1], c[2]);
    };
    paint();

    const mouse = { x: 10, y: 10 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, r.width * dpr);
      canvas.height = Math.max(1, r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uA, r.width / Math.max(1, r.height));
    };
    resize();

    let raf = 0;
    let visible = true;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (t: number) => {
      gl.uniform1f(uT, t / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, cols * rows);
    };
    let lastFrame = 0;
    const loop = (t: number) => {
      if (visible && !document.hidden && t - lastFrame > 33) { lastFrame = t; draw(t); }
      raf = requestAnimationFrame(loop);
    };
    if (calm) {
      draw(1200); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pdev-theme-change", paint);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pdev-theme-change", paint);
    };
  }, []);

  return <canvas ref={ref} className="hero-scene" aria-hidden="true" />;
}
