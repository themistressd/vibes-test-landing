'use client';
import React from 'react';

export default function Progress({ step, total }: { step:number; total:number }){
  const pct = Math.max(0, Math.min(100, Math.round((step-1)/total*100)));
  return (
    <div className="progress" aria-live="polite">
      <div className="bar" aria-hidden="true"><i style={{width: pct+'%'}} /></div>
      <div className="step">{step}/{total}</div>
    </div>
  );
}
