'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import gsap from 'gsap';

// ─── GLSL Shaders ───────────────────────────────────────────────────────────

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_texCoord;
  
  uniform sampler2D u_lightTex;
  uniform sampler2D u_darkTex;
  uniform float u_mix;       // 0.0 = light, 1.0 = dark
  uniform float u_time;      // continuous time for living effect
  uniform vec2 u_resolution;
  
  // Simplex-style noise for organic flow
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m;
    m = m * m;
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

  void main() {
    vec2 uv = v_texCoord;
    
    // Living Canvas: subtle flowing distortion
    float speed = u_time * 0.15;
    
    // Multi-octave noise for organic swirl movement
    float n1 = snoise(uv * 3.0 + vec2(speed * 0.7, speed * 0.5));
    float n2 = snoise(uv * 5.0 + vec2(-speed * 0.3, speed * 0.8));
    float n3 = snoise(uv * 8.0 + vec2(speed * 0.4, -speed * 0.6));
    
    // Combine noise layers — stronger in the sky (top), subtler at bottom (village)
    float skyMask = smoothstep(0.6, 0.0, uv.y); // stronger at top
    float distortionStrength = 0.006 + skyMask * 0.008; // village: 0.006, sky: 0.014
    
    vec2 distortion = vec2(
      n1 * 0.6 + n2 * 0.3 + n3 * 0.1,
      n1 * 0.3 + n2 * 0.5 + n3 * 0.2
    ) * distortionStrength;
    
    vec2 distortedUV = uv + distortion;
    
    // Clamp to prevent edge artifacts
    distortedUV = clamp(distortedUV, 0.001, 0.999);
    
    // In-painting to hide the Veo watermark in the bottom right corner.
    // The watermark is typically in the bottom 8% (y > 0.92) and right 10% (x > 0.90).
    // We clone a patch of the painting from just to the left of the watermark to cover it up seamlessly.
    if (distortedUV.x > 0.88 && distortedUV.y > 0.92) {
      // Smooth blend edge to avoid a hard seam line
      float blend = smoothstep(0.88, 0.89, distortedUV.x) * smoothstep(0.92, 0.93, distortedUV.y);
      distortedUV.x -= 0.15 * blend; // Shift sampling 15% to the left
    }
    
    // Sample both textures with distorted UVs
    vec4 lightColor = texture2D(u_lightTex, distortedUV);
    vec4 darkColor  = texture2D(u_darkTex, distortedUV);
    
    // Cross-fade between light and dark
    vec4 finalColor = mix(lightColor, darkColor, u_mix);
    
    gl_FragColor = finalColor;
  }
`;

// ─── Helper: compile shader ─────────────────────────────────────────────────

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function loadTexture(gl: WebGLRenderingContext, img: HTMLImageElement): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  return tex;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function LivingBackground() {
  const pathname = usePathname();
  const { theme, isTransitioning } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const mixRef = useRef({ value: theme === 'dark' ? 1.0 : 0.0 });
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isReadyRef = useRef(false);
  const lightTexRef = useRef<WebGLTexture | null>(null);
  const darkTexRef = useRef<WebGLTexture | null>(null);

  // Don't render on admin pages
  const isAdmin = pathname?.startsWith('/admin');

  // Cleanup WebGL when navigating to admin
  useEffect(() => {
    if (isAdmin && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [isAdmin]);

  // ── Initialize WebGL ─────────────────────────────────────────────────────
  const initGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext('webgl', { 
      alpha: false, 
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) { console.error('WebGL not supported'); return; }
    glRef.current = gl;

    // Compile shaders
    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;
    programRef.current = program;
    gl.useProgram(program);

    // Fullscreen quad
    const positions = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const texCoords = new Float32Array([0,1, 1,1, 0,0, 1,0]);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texLoc = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    uniformsRef.current = {
      u_lightTex: gl.getUniformLocation(program, 'u_lightTex'),
      u_darkTex: gl.getUniformLocation(program, 'u_darkTex'),
      u_mix: gl.getUniformLocation(program, 'u_mix'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
    };

    // Load the light (frame 001) and dark (frame 240) textures
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === 2) {
        isReadyRef.current = true;
      }
    };

    const lightImg = new Image();
    lightImg.crossOrigin = 'anonymous';
    lightImg.onload = () => {
      lightTexRef.current = loadTexture(gl, lightImg);
      onLoad();
    };
    lightImg.src = '/animation/ezgif-frame-001.jpg';

    const darkImg = new Image();
    darkImg.crossOrigin = 'anonymous';
    darkImg.onload = () => {
      darkTexRef.current = loadTexture(gl, darkImg);
      onLoad();
    };
    darkImg.src = '/animation/ezgif-frame-240.jpg';
  }, []);

  // ── Resize handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      if (glRef.current) {
        glRef.current.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    initGL(canvas);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initGL]);

  // ── Theme transition via GSAP ────────────────────────────────────────────
  useEffect(() => {
    const target = theme === 'dark' ? 1.0 : 0.0;
    gsap.to(mixRef.current, {
      value: target,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  }, [theme]);

  // ── Render loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      timeRef.current += dt;

      const gl = glRef.current;
      const program = programRef.current;
      const u = uniformsRef.current;
      const canvas = canvasRef.current;

      if (gl && program && isReadyRef.current && canvas && lightTexRef.current && darkTexRef.current) {
        gl.useProgram(program);

        // Bind light texture to unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, lightTexRef.current);
        gl.uniform1i(u.u_lightTex!, 0);

        // Bind dark texture to unit 1
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, darkTexRef.current);
        gl.uniform1i(u.u_darkTex!, 1);

        // Update uniforms
        gl.uniform1f(u.u_mix!, mixRef.current.value);
        gl.uniform1f(u.u_time!, timeRef.current);
        gl.uniform2f(u.u_resolution!, canvas.width, canvas.height);

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (isAdmin) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
