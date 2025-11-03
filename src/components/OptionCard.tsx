'use client';
import React from 'react';
import clsx from 'clsx';
import type { Option } from '@/data/questions';

type Props = {
  option: Option;
  qIndex: number;
  onSelect: (vibe: Option['vibe']) => void;
  selected?: boolean;
};

function clipPath(vibe: Option['vibe'], qIndex: number, letter: Option['letter']){
  const q = String(qIndex + 1).padStart(2, '0');
  return `/assets/vibes/gifs/${vibe}/q${q}_${letter}.mp4`;
}
function posterPath(vibe: Option['vibe'], qIndex: number, letter: Option['letter']){
  const q = String(qIndex + 1).padStart(2, '0');
  return `/assets/vibes/gifs/${vibe}/q${q}_${letter}.jpg`;
}

export default function OptionCard({ option, qIndex, onSelect, selected }: Props){
  return (
    <button
      type="button"
      className={clsx('card opt', selected && 'selected')}
      data-vibe={option.vibe}
      aria-pressed={!!selected}
      onClick={() => onSelect(option.vibe)}
    >
      <div className="gif" aria-hidden="true">
        <video
          preload="none"
          autoPlay
          muted
          loop
          playsInline
          src={clipPath(option.vibe, qIndex, option.letter)}
          poster={posterPath(option.vibe, qIndex, option.letter)}
        />
      </div>
      <div className="opt-text">
        <strong>{option.letter.toUpperCase()})</strong> {option.txt}
      </div>
    </button>
  );
}
