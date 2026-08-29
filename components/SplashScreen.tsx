'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ============================================================================
   SPLASH -> HOME HANDOFF

   Ported from the reference `tfam-splash-handoff.html` (Direct Forge, time-
   scaled). Four beats, in order, no two ever animating the same property:

     1  FORGE     0     -> 1200   the mark forges from ~90k particles
     2  STALL     1200  -> 1700   it just sits there — without this beat the
                                  sink reads as an interruption, not a departure
     3  SINK      1700  -> 2280   the mark recedes; the ground lifts black -> white
     4  CASCADE   2180  -> ~3480  Home arrives element by element

   Beat 4 starts 100ms before beat 3 finishes on purpose — by then the mark is
   under 15% opacity, so the overlap is invisible but the join reads as one
   continuous motion instead of two sequential ones. All durations/eases below
   are copied verbatim from the reference; don't retune by feel.

   Live prototype: this plays on every load, no persisted "seen" flag. A
   beforeInteractive script (app/layout.tsx) sets `data-splash="pending"` on
   <html> pre-hydration, and a plain-CSS rule (app/globals.css) paints the
   ground solid black off that attribute alone, with zero JS, so there's
   never a flash of Home before this component's canvas mounts. This
   component checks that same attribute in a layout effect and renders
   nothing at all — no canvas, no listeners — if it's ever absent.
   ============================================================================ */

const LOGO_W = 397.5
const LOGO_H = 253.6
const ART_SVG =
  '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="98.9 98.2 397.5 253.6">' +
  '<polygon points="289.4 144.4 289.3 142.9 289.2 141.5 289 140.1 288.8 138.6 288.6 137.3 288.2 135.9 287.8 134.5 287.5 133.2 287.1 131.9 286.5 130.5 286.1 129.2 285.6 127.9 284.9 126.6 284.3 125.2 283.7 124 282.9 122.7 282.1 121.5 281.5 120.3 280.6 119.1 279.7 117.9 278.9 116.7 278 115.7 277.2 114.7 276.2 113.6 275.1 112.6 274.1 111.6 273.1 110.6 272 109.7 270.9 108.8 269.8 107.9 268.7 107.1 267.5 106.4 266.3 105.5 265 104.8 263.7 104 262.4 103.4 261.1 102.7 259.8 102.2 258.6 101.7 257.2 101.1 255.9 100.6 254.6 100.2 253.1 99.8 251.8 99.5 250.5 99.2 249 98.9 247.6 98.7 246.2 98.5 244.8 98.3 243.3 98.3 241.9 98.2 240.5 98.2 98.9 98.2 98.9 148.4 240.2 148.4 240.2 166.7 98.9 166.7 98.9 216.9 289.6 216.9 289.6 147.3 289.5 145.8 289.4 144.4"/>' +
  '<polygon points="353.3 98.2 351.8 98.3 350.4 98.3 349 98.5 347.5 98.7 346.2 98.9 344.8 99.2 343.4 99.5 342 99.9 340.6 100.2 339.3 100.6 338 101.1 336.6 101.7 335.4 102.2 334.1 102.7 332.8 103.4 331.5 104.1 330.3 104.8 328.9 105.6 327.7 106.4 326.6 107.1 325.4 107.9 324.3 108.8 323.1 109.7 322.1 110.6 321.1 111.6 320 112.6 319 113.6 318.1 114.6 317.2 115.7 316.3 116.7 315.4 117.9 314.6 119.1 313.7 120.3 313 121.5 312.3 122.7 311.6 124 310.8 125.2 310.2 126.6 309.6 127.9 309.1 129.2 308.6 130.5 308.2 131.9 307.7 133.2 307.3 134.6 306.9 135.9 306.7 137.3 306.4 138.6 306.1 140.1 306 141.6 305.9 142.9 305.7 144.4 305.7 145.8 305.7 147.3 305.7 216.9 496.4 216.9 496.4 166.7 355 166.7 355 148.4 496.4 148.4 496.4 98.2 354.7 98.2 353.3 98.2"/>' +
  '<polygon points="98.9 283.3 240.2 283.3 240.2 301.6 98.9 301.6 98.9 351.8 240.5 351.8 241.9 351.8 243.3 351.7 244.8 351.7 246.2 351.5 247.6 351.3 249 351.1 250.5 350.8 251.8 350.5 253.1 350.2 254.6 349.9 255.9 349.4 257.2 348.9 258.6 348.4 259.8 347.9 261.1 347.3 262.4 346.6 263.7 346 265 345.3 266.3 344.5 267.5 343.7 268.7 342.9 269.8 342.1 270.9 341.2 272 340.4 273.1 339.4 274.1 338.5 275.1 337.4 276.2 336.5 277.2 335.4 278 334.4 278.9 333.3 279.7 332.2 280.6 331 281.5 329.8 282.1 328.5 282.9 327.4 283.7 326.1 284.3 324.8 284.9 323.5 285.6 322.2 286.1 320.9 286.5 319.5 287.1 318.2 287.5 316.8 287.8 315.5 288.2 314.2 288.6 312.7 288.8 311.4 289 309.9 289.2 308.5 289.3 307.1 289.4 305.7 289.5 304.3 289.6 302.8 289.6 233.1 98.9 233.1 98.9 283.3"/>' +
  '<polygon points="305.7 302.8 305.7 304.3 305.7 305.6 305.9 307.1 306 308.5 306.1 309.9 306.4 311.3 306.7 312.7 306.9 314.2 307.3 315.5 307.7 316.8 308.2 318.2 308.6 319.5 309.1 320.9 309.6 322.2 310.2 323.5 310.8 324.8 311.5 326.1 312.3 327.4 313 328.5 313.7 329.8 314.6 331 315.4 332.2 316.3 333.3 317.2 334.3 318.1 335.4 319 336.5 320 337.4 321.1 338.5 322.1 339.4 323.1 340.4 324.3 341.2 325.4 342.1 326.6 342.9 327.7 343.7 328.9 344.5 330.2 345.3 331.5 346 332.8 346.6 334.1 347.3 335.4 347.9 336.7 348.4 338 348.9 339.3 349.4 340.7 349.9 342 350.2 343.4 350.5 344.8 350.8 346.2 351.1 347.5 351.3 349 351.5 350.4 351.7 351.8 351.7 353.3 351.8 354.7 351.8 496.4 351.8 496.4 301.6 355 301.6 355 283.3 496.4 283.3 496.4 233.1 305.7 233.1 305.7 302.8"/>' +
  '</svg>'

const artURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ART_SVG)

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
function ramp(t: number, a: number, b: number) {
  return clamp01((t - a) / (b - a))
}
function outCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/* Rows that cascade are tagged `.splash-rise` by the sections that use them
   (HomeClient, HomeFeaturedExhibition, HomeCards, HomePlanVisit, BottomNav).
   Order is derived here from actual DOM position, never from a hand-written
   list — a hardcoded order silently breaks the moment someone reorders a
   section, and the failure is subtle (a heading animating in after its own
   card). Rows inside a hidden view still consume `--i` and delay everything
   after them for no visible reason, so hidden ones are filtered out; a
   `position:fixed` row (the bottom nav) reports `offsetParent === null` in
   most browsers even though it's visible, so it's allowed through too. */
function tagCascadeRows() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.splash-rise')).filter(
    (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed',
  )
  els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
  els.forEach((el, i) => el.style.setProperty('--i', String(i)))
}

export default function SplashScreen() {
  const [active, setActive] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sunkRef = useRef<HTMLImageElement>(null)

  // Runs before paint so the pending check can't lose a race with anything
  // this component itself renders — but the check is cheap (one dataset
  // read), so it can't block paint either. Both SSR and this component's
  // very first client render return null unconditionally (`active` starts
  // false always), so there is no hydration mismatch: the CSS-only cover in
  // globals.css (keyed off the same `data-splash` attribute, no JS required)
  // is what actually prevents any flash while this effect gets to run.
  useLayoutEffect(() => {
    if (document.documentElement.dataset.splash === 'pending') setActive(true)
  }, [])

  useEffect(() => {
    if (!active) return
    const root = rootRef.current
    const canvas = canvasRef.current
    const sunk = sunkRef.current
    if (!root || !canvas || !sunk) return

    const html = document.documentElement
    let raf: number | null = null
    let guard: ReturnType<typeof setTimeout> | null = null
    let clock = 0
    let last = 0
    let phase = 0 // 0 forge/stall, 2 sink, 3 cascade, 4 finished

    function finishAndUnmount() {
      if (phase >= 4) return
      phase = 4
      if (guard !== null) {
        clearTimeout(guard)
        guard = null
      }
      if (raf !== null) {
        cancelAnimationFrame(raf)
        raf = null
      }
      html.classList.remove('splash-entering')
      html.removeAttribute('data-splash')
      root!.style.display = 'none'
      setActive(false)
    }

    /* If WebGL or the artwork is unavailable the splash must not trap the
       user: skip straight to a fully painted Home. */
    function bail(why?: string) {
      if (why) console.warn('[splash]', why)
      beginCascade()
      // no forge/sink played, so give the cascade rows time to actually
      // transition before tearing everything down
      window.setTimeout(finishAndUnmount, 500)
    }

    function beginCascade() {
      if (phase >= 3) return
      phase = 3
      tagCascadeRows()
      html.classList.add('splash-entering')
    }

    function sinkVisual() {
      canvas!.style.display = 'none'
      sunk!.src = artURL
      sunk!.classList.add('on')
      void sunk!.offsetWidth // commit before transitioning
      sunk!.classList.add('anim')
      requestAnimationFrame(() => {
        root!.classList.add('splash-lifting')
        sunk!.style.transform = 'translate(-50%,-50%) scale(.88)'
        sunk!.style.opacity = '0'
      })
    }

    /* -------------------------- reduced motion: no particles, no forge -- */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      const img = new Image()
      img.onload = () => {
        sunk.src = artURL
        sunk.style.width = '164px'
        sunk.style.height = 'auto'
        sunk.classList.add('on')
        canvas.style.display = 'none'
        window.setTimeout(() => {
          sunk.style.transition = 'opacity .2s linear'
          sunk.style.opacity = '0'
          beginCascade()
          window.setTimeout(finishAndUnmount, 400)
        }, 400)
      }
      img.onerror = () => bail('artwork failed to decode')
      img.src = artURL
      guard = setTimeout(() => {
        if (phase < 4) finishAndUnmount()
      }, 2500)
      return () => {
        if (raf !== null) cancelAnimationFrame(raf)
        if (guard !== null) clearTimeout(guard)
      }
    }

    /* ------------------------------------------------------------- WebGL */
    const FRAME_W = 8.25
    const FRAME_H = (FRAME_W * 16) / 9
    const CX = FRAME_W / 2
    const CY = FRAME_H / 2
    const M_W = FRAME_W * 0.4
    const M_H = (M_W * LOGO_H) / LOGO_W
    const MARK: [number, number, number, number] = [CX - M_W / 2, CY - M_H / 2, M_W, M_H]

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true })
    if (!gl) {
      bail('WebGL unavailable')
      return () => {
        if (raf !== null) cancelAnimationFrame(raf)
        if (guard !== null) clearTimeout(guard)
      }
    }

    const img = new Image()
    img.onload = () => {
      try {
        boot()
      } catch (e) {
        bail(e instanceof Error ? e.message : String(e))
      }
    }
    img.onerror = () => bail('artwork failed to decode')
    img.src = artURL

    function boot() {
      const g = gl!

      function sh(t: number, src: string) {
        const s = g.createShader(t)!
        g.shaderSource(s, src)
        g.compileShader(s)
        if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) || 'shader compile failed')
        return s
      }
      function prog(v: string, f: string) {
        const p = g.createProgram()!
        g.attachShader(p, sh(g.VERTEX_SHADER, v))
        g.attachShader(p, sh(g.FRAGMENT_SHADER, f))
        g.linkProgram(p)
        if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p) || 'program link failed')
        return p
      }
      function uni(p: WebGLProgram, names: string[]) {
        const o: Record<string, WebGLUniformLocation | null> = {}
        names.forEach((n) => { o[n] = g.getUniformLocation(p, n) })
        return o
      }

      // premultiplied white: rgb and a carry the same value, so additive
      // accumulation composites correctly over a transparent canvas
      const P = prog(
        [
          'attribute vec2 a_p0,a_p1; attribute float a_seed,a_delay;',
          'uniform vec2 u_res,u_ctr,u_off; uniform float u_S,u_size,u_t,u_k,u_swirl;',
          'varying float v_b;',
          'void main(){',
          '  vec2 pos = mix(a_p0,a_p1,u_k);',
          '  float hump = u_k*(1.0-u_k);',
          '  vec2 rel = pos-u_ctr;',
          '  float a = hump*u_swirl*(a_seed-0.5)*2.0, s=sin(a), c=cos(a);',
          '  rel = vec2(rel.x*c-rel.y*s, rel.x*s+rel.y*c);',
          '  pos = u_ctr+rel;',
          '  vec2 px = pos*u_S + u_off;',
          '  gl_Position = vec4(px.x/u_res.x*2.0-1.0, 1.0-px.y/u_res.y*2.0, 0.0, 1.0);',
          '  gl_PointSize = u_size;',
          '  v_b = clamp((u_t-a_delay)*26.0, 0.0, 1.0);',
          '}',
        ].join('\n'),
        [
          'precision highp float; varying float v_b; uniform float u_a;',
          'void main(){',
          '  float d = smoothstep(1.0, 0.0, length(gl_PointCoord-0.5)*2.0);',
          '  float c = clamp(d*v_b*u_a, 0.0, 1.0);',
          '  gl_FragColor = vec4(c,c,c,c);',
          '}',
        ].join('\n'),
      )
      const PU = uni(P, ['u_res', 'u_ctr', 'u_off', 'u_S', 'u_size', 'u_t', 'u_k', 'u_swirl', 'u_a'])
      const aP0 = g.getAttribLocation(P, 'a_p0')
      const aP1 = g.getAttribLocation(P, 'a_p1')
      const aSe = g.getAttribLocation(P, 'a_seed')
      const aDe = g.getAttribLocation(P, 'a_delay')

      const Q = prog(
        [
          'attribute vec2 a_pos; uniform vec2 u_res,u_off; uniform float u_S; uniform vec4 u_rect;',
          'varying vec2 v_uv;',
          'void main(){ vec2 px=(u_rect.xy+a_pos*u_rect.zw)*u_S + u_off; v_uv=a_pos;',
          ' gl_Position=vec4(px.x/u_res.x*2.0-1.0, 1.0-px.y/u_res.y*2.0, 0.0, 1.0); }',
        ].join('\n'),
        [
          'precision highp float; varying vec2 v_uv; uniform sampler2D u_tex; uniform float u_a;',
          'void main(){ float c = texture2D(u_tex,v_uv).a * u_a; gl_FragColor = vec4(c,c,c,c); }',
        ].join('\n'),
      )
      const QU = uni(Q, ['u_res', 'u_off', 'u_S', 'u_rect', 'u_tex', 'u_a'])
      const quad = g.createBuffer()
      g.bindBuffer(g.ARRAY_BUFFER, quad)
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), g.STATIC_DRAW)
      const aQ = g.getAttribLocation(Q, 'a_pos')
      const tex = g.createTexture()
      const texCv = document.createElement('canvas')

      // sample real ink so particles never target empty box
      const MW = 520
      const MH = Math.round((MW * LOGO_H) / LOGO_W)
      const mc = document.createElement('canvas')
      mc.width = MW
      mc.height = MH
      const mctx = mc.getContext('2d')!
      mctx.clearRect(0, 0, MW, MH)
      mctx.drawImage(img, 0, 0, MW, MH)
      const md = mctx.getImageData(0, 0, MW, MH).data
      const cu: number[] = []
      const cv: number[] = []
      for (let y = 0; y < MH; y++) {
        for (let x = 0; x < MW; x++) {
          if (md[(y * MW + x) * 4 + 3] > 128) {
            cu.push(x / MW)
            cv.push(y / MH)
          }
        }
      }
      const NC = cu.length

      const N = 90000
      const SC_LO = 0.4545
      const SC_HI = 1.1818
      const GAIN = 0.2
      const p0 = new Float32Array(N * 2)
      const p1 = new Float32Array(N * 2)
      const sd = new Float32Array(N)
      const dl = new Float32Array(N)
      for (let i = 0; i < N; i++) {
        const c = (Math.random() * NC) | 0
        const ang = Math.random() * Math.PI * 2
        const rad = (SC_LO + Math.random() * (SC_HI - SC_LO)) * MARK[2]
        p0[i * 2] = CX + Math.cos(ang) * rad
        p0[i * 2 + 1] = CY + Math.sin(ang) * rad
        p1[i * 2] = MARK[0] + cu[c] * MARK[2]
        p1[i * 2 + 1] = MARK[1] + cv[c] * MARK[3]
        const r = Math.random()
        sd[i] = r
        dl[i] = r * 0.1
      }
      function vbo(a: Float32Array) {
        const b = g.createBuffer()
        g.bindBuffer(g.ARRAY_BUFFER, b)
        g.bufferData(g.ARRAY_BUFFER, a, g.STATIC_DRAW)
        return b
      }
      const b0 = vbo(p0)
      const b1 = vbo(p1)
      const bs = vbo(sd)
      const bd = vbo(dl)

      let S = 1
      let OX = 0
      let OY = 0
      function resize() {
        const w = Math.max(90, Math.round(root!.clientWidth * Math.min(2, window.devicePixelRatio || 1)))
        const h = Math.max(90, Math.round(root!.clientHeight * Math.min(2, window.devicePixelRatio || 1)))
        if (canvas!.width !== w || canvas!.height !== h) {
          canvas!.width = w
          canvas!.height = h
        }
        // Cover-fit the 9:16 scene into whatever box the splash actually is,
        // then re-centre it. Scaling alone pins the scene's origin to the
        // top-left, so on any viewport that isn't exactly 9:16 the overflow
        // all lands on one side and the mark drifts off centre.
        S = Math.max(canvas!.width / FRAME_W, canvas!.height / FRAME_H)
        OX = (canvas!.width - FRAME_W * S) / 2
        OY = (canvas!.height - FRAME_H * S) / 2
        const pxW = Math.round(MARK[2] * S)
        if (texCv.width !== pxW) {
          texCv.width = Math.max(2, pxW)
          texCv.height = Math.max(2, Math.round((pxW * LOGO_H) / LOGO_W))
          const t2 = texCv.getContext('2d')!
          t2.clearRect(0, 0, texCv.width, texCv.height)
          t2.drawImage(img, 0, 0, texCv.width, texCv.height)
          g.bindTexture(g.TEXTURE_2D, tex)
          g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
          g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
          g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, texCv)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
        }
        // keep the DOM mark exactly where the canvas drew it
        const cssS = S / Math.min(2, window.devicePixelRatio || 1)
        sunk!.style.width = MARK[2] * cssS + 'px'
        sunk!.style.height = 'auto'
      }

      // the original Direct Forge fractions, unchanged — time-scaled, not
      // re-choreographed, so these don't round to neat numbers
      const DUR = 1.2
      const F = {
        conv: 4.2 / 5.9,
        solid: [4.0 / 5.9, 5.1 / 5.9] as [number, number],
        fade: [4.4 / 5.9, 5.45 / 5.9] as [number, number],
        swirl: 1.7 * 0.7,
      }

      function drawForge(t: number) {
        resize()
        g.viewport(0, 0, canvas!.width, canvas!.height)
        g.disable(g.DEPTH_TEST)
        g.enable(g.BLEND)
        g.blendFunc(g.ONE, g.ONE)
        g.clearColor(0, 0, 0, 0)
        g.clear(g.COLOR_BUFFER_BIT)
        const k = outCubic(ramp(t, 0, DUR * F.conv))
        const fieldOut = ramp(t, DUR * F.fade[0], DUR * F.fade[1])
        const crisp = ramp(t, DUR * F.solid[0], DUR * F.solid[1])
        const a = (1 - fieldOut) * GAIN
        if (a > 0.002) {
          g.useProgram(P)
          ;[
            [b0, aP0, 2],
            [b1, aP1, 2],
            [bs, aSe, 1],
            [bd, aDe, 1],
          ].forEach(([buf, loc, size]) => {
            g.bindBuffer(g.ARRAY_BUFFER, buf as WebGLBuffer)
            g.enableVertexAttribArray(loc as number)
            g.vertexAttribPointer(loc as number, size as number, g.FLOAT, false, 0, 0)
          })
          g.uniform2f(PU.u_res, canvas!.width, canvas!.height)
          g.uniform2f(PU.u_ctr, CX, CY)
          g.uniform2f(PU.u_off, OX, OY)
          g.uniform1f(PU.u_S, S)
          g.uniform1f(PU.u_size, Math.max(1.0, S * 0.0075))
          g.uniform1f(PU.u_t, t)
          g.uniform1f(PU.u_k, k)
          g.uniform1f(PU.u_swirl, F.swirl)
          g.uniform1f(PU.u_a, a)
          g.drawArrays(g.POINTS, 0, N)
        }
        if (crisp > 0.002) {
          g.useProgram(Q)
          g.bindBuffer(g.ARRAY_BUFFER, quad)
          g.enableVertexAttribArray(aQ)
          g.vertexAttribPointer(aQ, 2, g.FLOAT, false, 0, 0)
          g.activeTexture(g.TEXTURE0)
          g.bindTexture(g.TEXTURE_2D, tex)
          g.uniform1i(QU.u_tex, 0)
          g.uniform2f(QU.u_res, canvas!.width, canvas!.height)
          g.uniform2f(QU.u_off, OX, OY)
          g.uniform1f(QU.u_S, S)
          g.uniform4f(QU.u_rect, MARK[0], MARK[1], MARK[2], MARK[3])
          g.uniform1f(QU.u_a, crisp)
          g.drawArrays(g.TRIANGLES, 0, 6)
        }
      }

      const STALL = 0.5
      const SINK = 0.58
      const T_SINK = DUR + STALL

      function beginSink() {
        if (phase >= 2) return
        phase = 2
        sinkVisual()
      }

      function tick(now: number) {
        if (!last) last = now
        clock += Math.min(0.05, (now - last) / 1000)
        last = now
        if (phase === 0) {
          drawForge(Math.min(clock, DUR))
          if (clock >= T_SINK) beginSink()
        }
        if (phase === 2 && clock >= T_SINK + SINK - 0.1) beginCascade()
        if (phase === 3 && clock >= T_SINK + SINK + 0.1) finishAndUnmount()
        if (phase < 4) raf = requestAnimationFrame(tick)
      }

      // A tap anywhere skips the forge/stall straight into the sink+cascade
      // — it must not jump to the end and play only the outro.
      function handleSkip() {
        if (phase === 0) beginSink()
      }
      root!.addEventListener('pointerdown', handleSkip)

      // The cascade rows start at opacity 0, so a stalled timeline doesn't
      // just mean a missed animation — it means a permanently invisible
      // Home. rAF is not a guarantee (backgrounded tab, low-power mode), so
      // a wall-clock timer forces the reveal if the loop never gets there.
      guard = setTimeout(() => {
        guard = null
        if (phase < 4) {
          beginCascade()
          finishAndUnmount()
        }
      }, Math.round((T_SINK + SINK) * 1000) + 1500)

      resize()
      window.addEventListener('resize', resize)
      raf = requestAnimationFrame(tick)

      return () => {
        window.removeEventListener('resize', resize)
        root!.removeEventListener('pointerdown', handleSkip)
      }
    }

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      if (guard !== null) clearTimeout(guard)
    }
  }, [active])

  if (!active) return null

  return (
    <div ref={rootRef} className="tfam-splash-root">
      <canvas ref={canvasRef} className="tfam-splash-canvas" />
      <img ref={sunkRef} alt="" className="tfam-splash-sunk" />
    </div>
  )
}
