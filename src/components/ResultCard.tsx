'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ResultCard as R } from '@/data/results';
import html2canvas from 'html2canvas';

const STAT_KEYS: { key: keyof R['stats']; label: string }[] = [
  { key: 'energia', label: 'Energía' },
  { key: 'estilo',  label: 'Estilo'  },
  { key: 'plan',    label: 'Plan ideal' },
  { key: 'social',  label: 'Social'  },
  { key: 'actitud', label: 'Actitud' },
];

const STORY_SIZE = { width: 1080, height: 1920 };

const ROOT_COLOR_MAP = {
  '--spicy':  '#FF441A',
  '--deluxe': '#00D4FF',
  '--deluxe2': '#B6FFF8',
  '--urban':  '#FF2F9C',
  '--chill':  '#C9FFE9',
  '--artsy':  '#E4FF00',
  '--ink':    '#0b0b10',
} as const;

const DEFAULT_START = ROOT_COLOR_MAP['--urban'];
const DEFAULT_END = ROOT_COLOR_MAP['--deluxe'];

function prettyKey(key: string) {
  return key.replace('_', ' × ').toUpperCase();
}

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

  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

  async function shareStory() {
    if (busy) return;
    setBusy(true);
    try {
      // Mantener el gesto de usuario: todo ocurre dentro del click
      // Prioriza animado si se puede; si no, PNG.
      const canAnimated =
        !isIOS() &&
        typeof MediaRecorder !== 'undefined' &&
        typeof HTMLCanvasElement.prototype.captureStream === 'function' &&
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

  /** STORY ESTÁTICO: compone la carta dentro de un lienzo 9:16 listo para Instagram.
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

      const cardRect = card.getBoundingClientRect();
      const heroRect = hero ? relativeRect(hero.getBoundingClientRect(), cardRect) : null;
      const colors = getCardColors(card);
      const SCALE = clamp(window.devicePixelRatio || 2, 1.5, 2.5);
      const cardCanvas = await html2canvas(card, {
        backgroundColor: null,
        scale: SCALE,
        useCORS: true,
        windowWidth: card.scrollWidth,
        windowHeight: card.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

        const composition = composeStoryBase({
          cardCanvas,
          cardSize: { width: cardRect.width, height: cardRect.height },
          heroRect,
          colors,
          data,
        });

        const blob = await canvasToBlobPng(composition.canvas);
        const file = new File([blob], `VIBE-${data.key}.png`, { type: 'image/png' });
        const shareData: ShareData = {
          files: [file],
          title: 'Mi VIBE',
          text: `Mi VIBE es ${prettyKey(data.key)} — ${data.title}`,
        };

        if (
          typeof navigator.canShare === 'function' &&
          navigator.canShare(shareData) &&
          typeof navigator.share === 'function'
        ) {
          await navigator.share(shareData);
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `VIBE-${data.key}.png`;
          document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        setToast('Imagen guardada en formato Story ✨');
      }
    } finally {
      if (posterImg && posterImg.parentNode) posterImg.parentNode.removeChild(posterImg);
      if (videoRef.current) videoRef.current.style.opacity = '';
      setCapturing(false);
    }
  }

  /** STORY ANIMADO: reconstituye la carta animada dentro del lienzo 9:16. */
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

      const cardRect = card.getBoundingClientRect();
      const heroRect = relativeRect(hero.getBoundingClientRect(), cardRect);
      const colors = getCardColors(card);
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

      const composition = composeStoryBase({
        cardCanvas: baseCanvas,
        cardSize: { width: cardRect.width, height: cardRect.height },
        heroRect,
        colors,
        data,
      });

      const { canvas: storyBase, heroRect: heroOnStory } = composition;
      const canvas = document.createElement('canvas');
      canvas.width = storyBase.width;
      canvas.height = storyBase.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setCapturing(false); return false; }
      const stream = canvas.captureStream?.(30);
      if (!stream) { setCapturing(false); return false; }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      const durationMs = 6000;
      const t0 = performance.now();

      function drawFrame(now: number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(storyBase, 0, 0);

        if (heroOnStory) {
          // object-fit: cover para el vídeo en el rect hero escalado dentro del Story
          const vw = vid.videoWidth || 9;
          const vh = vid.videoHeight || 16;
          const scale = Math.max(heroOnStory.width / vw, heroOnStory.height / vh);
          const dw = vw * scale;
          const dh = vh * scale;
          const dx = heroOnStory.x + (heroOnStory.width - dw) / 2;
          const dy = heroOnStory.y + (heroOnStory.height - dh) / 2;
          try { ctx.drawImage(vid, dx, dy, dw, dh); } catch {}
        }

        if (now - t0 < durationMs) requestAnimationFrame(drawFrame);
        else recorder.stop();
      }

      recorder.start();
      requestAnimationFrame(drawFrame);

      const blob: Blob = await new Promise((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
      });

      const file = new File([blob], `VIBE-${data.key}.webm`, { type: 'video/webm' });
      const videoShareData: ShareData = { files: [file], title: 'Mi VIBE' };

      if (
        typeof navigator.canShare === 'function' &&
        navigator.canShare(videoShareData) &&
        typeof navigator.share === 'function'
      ) {
        await navigator.share(videoShareData);
        setCapturing(false);
        return true;
      }

      // Fallback: descarga
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `VIBE-${data.key}.webm`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      setToast('Vídeo guardado en formato Story. Si Instagram no admite .webm, usa la imagen PNG.');
      setCapturing(false);
      return true;
    } catch (e) {
      console.warn(e);
      setCapturing(false);
      return false;
    }
  }

  // Variables CSS por-VIBE (badge, botón, barras)
  const startSource = data.colors?.[0];
  const endSource = data.colors?.[1];

  const styleVars = useMemo<React.CSSProperties>(() => {
    const startColor = resolveColorToken(startSource, DEFAULT_START);
    const endColor = resolveColorToken(endSource, DEFAULT_END);

    return {
      '--color-start': startColor,
      '--color-end': endColor,
      '--color-start-40': withAlpha(startColor, 0.4, DEFAULT_START),
      '--color-end-35': withAlpha(endColor, 0.35, DEFAULT_END),
      '--color-end-28': withAlpha(endColor, 0.28, DEFAULT_END),
      '--color-end-25': withAlpha(endColor, 0.25, DEFAULT_END),
      '--color-end-45': withAlpha(endColor, 0.45, DEFAULT_END),
      '--color-end-75': withAlpha(endColor, 0.75, DEFAULT_END),
    } as React.CSSProperties;
  }, [startSource, endSource]);

  return (
    <article
      className={`result-card ${capturing ? 'capture' : ''}`}
        ref={cardRef}
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
type SimpleRect = { x: number; y: number; width: number; height: number };
type StoryLayout = {
  width: number;
  height: number;
  drawWidth: number;
  drawHeight: number;
  offsetX: number;
  offsetY: number;
  scale: number;
};

function composeStoryBase({
  cardCanvas,
  cardSize,
  heroRect,
  colors,
  data,
}: {
  cardCanvas: HTMLCanvasElement;
  cardSize: { width: number; height: number };
  heroRect: SimpleRect | null;
  colors: [string, string];
  data: R;
}): { canvas: HTMLCanvasElement; layout: StoryLayout; heroRect: SimpleRect | null } {
  const layout = computeStoryLayout(cardSize.width, cardSize.height);
  const canvas = document.createElement('canvas');
  canvas.width = layout.width;
  canvas.height = layout.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  paintStoryBackground(ctx, layout, colors);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 120;
  ctx.shadowOffsetY = 50;
  ctx.drawImage(
    cardCanvas,
    0,
    0,
    cardCanvas.width,
    cardCanvas.height,
    layout.offsetX,
    layout.offsetY,
    layout.drawWidth,
    layout.drawHeight,
  );
  ctx.restore();

  drawStoryBranding(ctx, layout, data);

  const heroOnStory = heroRect
    ? {
        x: layout.offsetX + heroRect.x * layout.scale,
        y: layout.offsetY + heroRect.y * layout.scale,
        width: heroRect.width * layout.scale,
        height: heroRect.height * layout.scale,
      }
    : null;

  return { canvas, layout, heroRect: heroOnStory };
}

function computeStoryLayout(cardWidth: number, cardHeight: number): StoryLayout {
  const { width: STORY_W, height: STORY_H } = STORY_SIZE;
  const maxCardWidth = STORY_W * 0.78;
  const maxCardHeight = STORY_H * 0.68;
  const scale = Math.min(maxCardWidth / cardWidth, maxCardHeight / cardHeight);
  const drawWidth = Math.round(cardWidth * scale);
  const drawHeight = Math.round(cardHeight * scale);
  const centeredY = (STORY_H - drawHeight) / 2;
  const minY = 220;
  const maxY = Math.max(minY, STORY_H - drawHeight - 160);
  const offsetY = Math.round(clamp(centeredY + 40, minY, maxY));
  const offsetX = Math.round((STORY_W - drawWidth) / 2);

  return {
    width: STORY_W,
    height: STORY_H,
    drawWidth,
    drawHeight,
    offsetX,
    offsetY,
    scale,
  };
}

function paintStoryBackground(ctx: CanvasRenderingContext2D, layout: StoryLayout, colors: [string, string]) {
  const [start, end] = colors;
  const { width: W, height: H } = layout;
  ctx.fillStyle = '#060611';
  ctx.fillRect(0, 0, W, H);

  const glowA = ctx.createRadialGradient(W * 0.25, H * 0.2, W * 0.05, W * 0.25, H * 0.2, W * 0.9);
  glowA.addColorStop(0, withAlpha(start, 0.7, DEFAULT_START));
  glowA.addColorStop(1, 'rgba(6,6,17,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, W, H);

  const glowB = ctx.createRadialGradient(W * 0.85, H * 0.8, W * 0.05, W * 0.85, H * 0.8, W * 0.75);
  glowB.addColorStop(0, withAlpha(end, 0.6, DEFAULT_END));
  glowB.addColorStop(1, 'rgba(6,6,17,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, W, H);

  const overlay = ctx.createLinearGradient(0, 0, 0, H);
  overlay.addColorStop(0, 'rgba(255,255,255,0.05)');
  overlay.addColorStop(0.45, 'rgba(0,0,0,0)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);
}

function drawStoryBranding(ctx: CanvasRenderingContext2D, layout: StoryLayout, data: R) {
  const centerX = layout.width / 2;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  ctx.font = '600 56px "Sora", "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText('MI VIBE ES', centerX, 150);

  ctx.fillStyle = '#fff';
  ctx.font = '800 86px "Sora", "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText(prettyKey(data.key), centerX, 250);

  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  ctx.font = '500 32px "Sora", "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText('Comparte tu resultado con #VibesTest', centerX, layout.height - 90);
  ctx.restore();
}

function relativeRect(child: DOMRect, parent: DOMRect): SimpleRect {
  return {
    x: child.left - parent.left,
    y: child.top - parent.top,
    width: child.width,
    height: child.height,
  };
}

function getCardColors(card: HTMLElement): [string, string] {
  const styles = getComputedStyle(card);
  const startRaw = styles.getPropertyValue('--color-start').trim();
  const endRaw = styles.getPropertyValue('--color-end').trim();
  const start = resolveColorToken(startRaw || undefined, DEFAULT_START);
  const end = resolveColorToken(endRaw || undefined, DEFAULT_END);
  return [start, end];
}

function resolveColorToken(color: string | undefined, fallback: string): string {
  if (!color) return fallback;
  const trimmed = color.trim();
  if (trimmed.startsWith('var(')) {
    const match = trimmed.match(/var\((--[^),\s]+)/);
    if (match) {
      const varName = match[1] as keyof typeof ROOT_COLOR_MAP;
      const mapped = ROOT_COLOR_MAP[varName];
      if (mapped) return mapped;
      if (typeof window !== 'undefined') {
        const resolved = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
        if (resolved) return resolved;
      }
    }
    return fallback;
  }
  return trimmed;
}

function withAlpha(color: string, alpha: number, fallback: string = DEFAULT_START): string {
  const source = resolveColorToken(color, fallback);
  const rgb = source.startsWith('rgb') ? parseRgbComponents(source) : hexToRgb(source);
  if (!rgb) return `rgba(255,255,255,${alpha})`;
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseRgbComponents(input: string): [number, number, number] | null {
  const match = input.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const [r, g, b] = match[1]
    .split(',')
    .slice(0, 3)
    .map((part) => Number.parseInt(part.trim(), 10));
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}

function hexToRgb(hex: string): [number, number, number] | null {
  let normalized = hex.replace('#', '').trim();
  if (normalized.length === 3) {
    normalized = normalized.split('').map(ch => ch + ch).join('');
  }
  if (normalized.length !== 6) return null;
  const num = Number.parseInt(normalized, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
}

function nextFrame(): Promise<void> {
  return new Promise(r => requestAnimationFrame(() => r()));
}
function clamp(n: number, min: number, max: number){ return Math.max(min, Math.min(max, n)); }
function hashCode(str: string){
  let h = 0;
  let i = 0;
  const len = str.length;
  while (i < len) { h = (h<<5) - h + str.charCodeAt(i++) | 0; }
  return h;
}
async function canvasToBlobPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return await new Promise((res, rej) => {
    canvas.toBlob((b) => b ? res(b) : rej(new Error('toBlob null')), 'image/png', 1);
  });
}
