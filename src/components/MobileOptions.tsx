'use client';

import React, { useEffect, useRef, useState } from 'react';
import OptionCard from '@/components/OptionCard';
import type { Option } from '@/data/questions';

type Props = {
  options: Option[];
  qIndex: number;
  onSelect: (vibe: Option['vibe']) => void;
  selectedVibe: Option['vibe'] | null;
};

export default function MobileOptions({ options, qIndex, onSelect, selectedVibe }: Props){
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(()=>{
    const wrap = wrapRef.current;
    if(!wrap) return;
    const handler = () => {
      const idx = Math.round(wrap.scrollLeft / wrap.clientWidth);
      setActive(Math.max(0, Math.min(options.length - 1, idx)));
    };
    wrap.addEventListener('scroll', handler, { passive:true });
    return () => wrap.removeEventListener('scroll', handler);
  }, [options.length]);

  useEffect(()=>{
    const wrap = wrapRef.current;
    if(!wrap) return;
    wrap.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
    const frame = requestAnimationFrame(() => setActive(0));
    return () => cancelAnimationFrame(frame);
  }, [qIndex]);

  return (
    <div className="mobile-carousel">
      <div className="mobile-track" ref={wrapRef} aria-roledescription="carrusel">
        {options.map((opt, i)=> (
          <div className="mobile-slide" key={i}>
            <OptionCard
              option={opt}
              qIndex={qIndex}
              onSelect={onSelect}
              selected={selectedVibe === opt.vibe}
            />
          </div>
        ))}
      </div>
      <div className="dots" aria-label="Indicador de opción">
        {options.map((_, i)=> (
          <button
            key={i}
            aria-label={`Ir a opción ${i+1}`}
            className={'dot' + (i===active ? ' active' : '')}
            onClick={()=>{
              const wrap = wrapRef.current!;
              wrap.scrollTo({ left: i * wrap.clientWidth, behavior: 'smooth' });
              setActive(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
