'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { ResultCard as R } from '@/data/results';
import html2canvas from 'html2canvas';

const STAT_KEYS: { key: keyof R['stats']; label: string }[] = [
  { key: 'energia', label: 'Energía' },
  { key: 'estilo',  label: 'Estilo'  },
  { key: 'plan',    label: 'Plan ideal' },
  { key: 'social',  label: 'Social'  },
  { key: 'actitud', label: 'Actitud' },
];

export default function ResultCard({ data, badgeOverride }: { data: R; badgeOverride?: string }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  // Relleno “estable” de barras por carta
  useEffect(() => {
    const seed = Math.abs(hashCode(data.id || data.key));
    const fills = document.querySelectorAll<HTMLDivElement>('.meter i');
    fills.forEach((el, idx) => {
      const pct = 55 + ((seed + idx * 13) % 40); // 55–95%
      el.style.width = `${pct}%`;
    });
  }, [data.id, data.key]);

  const prettyKey = (key: string) => key.replace('_', ' × ').toUpperCase();
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  async function shareStory() {
    if (busy) return;
    setBusy(true);
    try {
      // Mantener el gesto de usuario: todo ocurre dentro del click
      // Prioriza animado si se puede; si no, PNG.
      const canAnimated =
        !isIOS() &&
        typeof MediaRecorder !== 'undefined' &&
        !!HTMLCanvasElement.prototype.captureStream &&
        !!videoRef.current &&
        !videoRef.current.paused;

      if (canAnimated) {
        const ok = await tryShareAnimatedOnlyCard();
        if (ok) return;
      }
      await shareStaticPNGOnlyCard();
    } catch (e) {
      console.error(e);
      setToast('No se pudo generar la Story. Guarda la imagen y súbela manualmente.');
    } finally {
      setBusy(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  /** STORY ESTÁTICO = SOLO LA CARTA (sin fondo ni footer).
   *  html2canvas no dibuja <video>, así que colocamos un <img> con el poster
   *  como overlay durante la captura.
   */
  async function shareStaticPNGOnlyCard() {
    const card = cardRef.current!;
    const hero = card.querySelector('.result-hero') as HTMLElement | null;
    const vid  = videoRef.current;

    let posterImg: HTMLImageElement | null = null;

    try {
      setCapturing(true);
      await nextFrame();

      if (hero) {
        const posterSrc = data.video?.poster;
        if (posterSrc) {
          posterImg = new Image();
          posterImg.crossOrigin = 'anonymous';
          posterImg.decoding = 'async';
          posterImg.src = posterSrc;
          posterImg.alt = 'poster';
          Object.assign(posterImg.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            zIndex: '1',
          } as CSSStyleDeclaration);
          hero.appendChild(posterImg);
          try { await posterImg.decode?.(); } catch {}
          if (vid) vid.style.opacity = '0';
          await nextFrame();
        } else if (vid) {
          // si no hay poster, al menos oculta el <video> para que html2canvas no lo “ignore” raro
          vid.style.opacity = '0';
        }
      }

      const SCALE = clamp(window.devicePixelRatio || 2, 1.5, 2.5);
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: SCALE,
        useCORS: true,
        windowWidth: card.scrollWidth,
        windowHeight: card.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const blob = await canvasToBlobPng(canvas);
      const file = new File([blob], `VIBE-${data.key}.png`, { type: 'image/png' });
      const canFiles = (navigator as any).canShare?.({ files: [file] });

      if ((navigator as any).share && canFiles) {
        await (navigator as any).share({
          files: [file],
          title: 'Mi VIBE',
          text: `Mi VIBE es ${prettyKey(data.key)} — ${data.title}`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `VIBE-${data.key}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        setToast('Imagen guardada (solo la carta). Súbela a tu Story ✨');
      }
    } finally {
      if (posterImg && posterImg.parentNode) posterImg.parentNode.removeChild(posterImg);
      if (videoRef.current) videoRef.current.style.opacity = '';
      setCapturing(false);
    }
  }

  /** STORY ANIMADO = SOLO LA CARTA (pinta el vídeo dentro del hero en cada frame). */
  async function tryShareAnimatedOnlyCard(): Promise<boolean> {
    try {
      const card = cardRef.current!;
      const hero = card.querySelector('.result-hero') as HTMLElement | null;
      const vid  = videoRef.current!;
      if (!hero) return false;

      try { await vid.play(); } catch {}

      // Snapshot base SIN vídeo
      setCapturing(true);
      const prevOpacity = vid.style.opacity;
      vid.style.opacity = '0';
      await nextFrame();

      const SCALE = clamp(window.devicePixelRatio || 2, 1.5, 2.5);
      const baseCanvas = await html2canvas(card, {
        backgroundColor: null,
        scale: SCALE,
        useCORS: true,
        windowWidth: card.scrollWidth,
        windowHeight: card.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });
      vid.style.opacity = prevOpacity || '';

      // Coordenadas hero en el canvas escalado
      const cardRect = card.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const heroX = (heroRect.left - cardRect.left) * SCALE;
      const heroY = (heroRect.top  - cardRect.top ) * SCALE;
      const heroW = heroRect.width  * SCALE;
      const heroH = heroRect.height * SCALE;

      // Canvas de salida
      const W = baseCanvas.width;
      const H = baseCanvas.height;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      const stream = (canvas as any).captureStream?.(30);
      if (!stream) { setCapturing(false); return false; }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      const durationMs = 6000;
      const t0 = performance.now();

      function drawFrame(now: number) {
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(baseCanvas, 0, 0);

        // object-fit: cover para el vídeo en el rect hero
        const vw = vid.videoWidth || 9;
        const vh = vid.videoHeight || 16;
        const scale = Math.max(heroW / vw, heroH / vh);
        const dw = vw * scale;
        const dh = vh * scale;
        const dx = heroX + (heroW - dw) / 2;
        const dy = heroY + (heroH - dh) / 2;
        try { ctx.drawImage(vid, dx, dy, dw, dh); } catch {}

        if (now - t0 < durationMs) requestAnimationFrame(drawFrame);
        else recorder.stop();
      }

      recorder.start();
      requestAnimationFrame(drawFrame);

      const blob: Blob = await new Promise((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
      });

      const file = new File([blob], `VIBE-${data.key}.webm`, { type: 'video/webm' });
      const canFiles = (navigator as any).canShare?.({ files: [file] });

      if ((navigator as any).share && canFiles) {
        await (navigator as any).share({ files: [file], title: 'Mi VIBE' });
        setCapturing(false);
        return true;
      }

      // Fallback: descarga
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `VIBE-${data.key}.webm`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      setToast('Vídeo guardado (solo la carta). Si Instagram no admite .webm, usa la imagen PNG.');
      setCapturing(false);
      return true;
    } catch (e) {
      console.warn(e);
      setCapturing(false);
      return false;
    }
  }

  // Variables CSS por-VIBE (badge, botón, barras)
  const styleVars = {
    // @ts-ignore custom props
    '--color-start': data.colors?.[0] || 'var(--urban)',
    '--color-end':   data.colors?.[1] || 'var(--deluxe)',
  } as React.CSSProperties;

  return (
    <article
      className={`result-card ${capturing ? 'capture' : ''}`}
      ref={cardRef as any}
      style={styleVars}
      aria-label={`Carta ${data.key}`}
    >
      <div className="result-hero">
        <span className="badge">{badgeOverride || data.legend}</span>
        <video ref={videoRef} autoPlay muted loop playsInline poster={data.video.poster || ''}>
          <source src={data.video.src} type="video/mp4" />
        </video>
      </div>

      <div className="result-body">
        <div className="h1">{data.title}</div>
        <div className="tagline">{data.tagline}</div>
        <div className="bio">{data.bio}</div>

        <div className="stats">
          {STAT_KEYS.map((s) => (
            <div className="stat" key={s.key as string}>
              <div className="label">{s.label}</div>
              <div className="meter"><i /></div>
              <div style={{ fontSize: 12, opacity: .9 }}>{data.stats[s.key] || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-row">
        <span className="small">{data.id}</span>
        <button
          className="btn btn-primary"
          onClick={shareStory}
          disabled={busy}
          // Oculto durante captura para que no salga en imagen/vídeo
          style={{ visibility: capturing ? 'hidden' : 'visible', color: '#0b0b10', fontWeight: 800 }}
          aria-label="Compartir Story"
        >
          {busy ? 'Preparando Story…' : 'Compartir Story'}
        </button>
      </div>

      {toast && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 20,
            transform: 'translateX(-50%)',
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(0,0,0,.6)',
            fontSize: 12
          }}
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </article>
  );
}

/* utils */
function nextFrame(): Promise<void> {
  return new Promise(r => requestAnimationFrame(() => r()));
}
function clamp(n: number, min: number, max: number){ return Math.max(min, Math.min(max, n)); }
function hashCode(str: string){
  let h = 0, i = 0, len = str.length;
  while (i < len) { h = (h<<5) - h + str.charCodeAt(i++) | 0; }
  return h;
}
async function canvasToBlobPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return await new Promise((res, rej) => {
    canvas.toBlob((b) => b ? res(b) : rej(new Error('toBlob null')), 'image/png', 1);
  });
}
