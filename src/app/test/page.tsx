'use client';

import React, { useEffect, useMemo, useState } from 'react';
import OptionCard from '@/components/OptionCard';
import Progress from '@/components/Progress';
import ResultCard from '@/components/ResultCard';
import MobileOptions from '@/components/MobileOptions';
import { QUESTIONS, TOTAL_QUESTIONS } from '@/data/questions';
import { RESULTS } from '@/data/results';
import { pickOutcome, type Vibe } from '@/lib/logic';

export default function TestPage(){
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<(Vibe|null)[]>(Array(TOTAL_QUESTIONS).fill(null));
  const [viewKey, setViewKey] = useState<string | null>(null); // resultado elegido
  const [badge, setBadge] = useState<string | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const mm = window.matchMedia('(max-width: 760px)');
    const apply = () => setIsMobile(mm.matches);
    apply();
    mm.addEventListener?.('change', apply);
    return () => mm.removeEventListener?.('change', apply);
  }, []);

  const q = useMemo(
    () => QUESTIONS[Math.max(0, Math.min(QUESTIONS.length - 1, step - 1))],
    [step]
  );

  const onSelect = (vibe: Vibe) => {
    const next = [...answers];
    next[step - 1] = vibe;
    setAnswers(next);
    // no auto-advance: solo pasa con “Siguiente”
  };

  const finish = () => {
    if (answers.some(a => a === null)) {
      alert('Te falta alguna respuesta. Revísalo ❤️');
      return;
    }
    const finalized = answers as Vibe[];
    const outcome = pickOutcome(finalized, TOTAL_QUESTIONS);

    let key = '';
    let b: string | undefined;
    if (outcome.kind === 'pure')         { key = outcome.vibe; b = 'PURE VIBE'; }
    else if (outcome.kind === 'dominant'){ key = outcome.vibe; b = 'DOMINANT VIBE'; }
    else                                 { key = `${outcome.first}_${outcome.second}`; }

    setViewKey(key);
    setBadge(b);
  };

  // Vista de resultado
  if (viewKey){
    const data = RESULTS[viewKey];
    return (
      <div className="container">
        <main className="main">
          <div className="wrap result-wrap">
            <ResultCard
              data={data}
              badgeOverride={badge}
              resultKey={viewKey}
              mode="view"              // vista normal (interactiva)
              onBack={()=>{ setViewKey(null); setBadge(undefined); }}
            />
          </div>
        </main>
      </div>
    );
  }

  // Vista del test
  const canPrev = step > 1;
  const canNext = step < TOTAL_QUESTIONS;
  const hasSelection = answers[step - 1] !== null;

  return (
    <div className="container">
      <main className="main">
        <div className="wrap">
          {/* Título centrado, jerárquico y sin descripción */}
          <h1 className="title-center">
            <span className="eyebrow accent">WANTED TEST:</span><br/>
            <span className="headline">QUÉ VIBE TE BUSCA?</span>
          </h1>

          <Progress step={step} total={TOTAL_QUESTIONS} />

          <h3 className="question-title">{q.t}</h3>

          {/* Desktop grid */}
          {!isMobile && (
            <div className="grid cols-3">
              {q.opts.map((opt, i)=> (
                <OptionCard
                  key={i}
                  option={opt}
                  qIndex={step - 1}
                  onSelect={onSelect}
                  selected={answers[step - 1] === opt.vibe}
                />
              ))}
            </div>
          )}

          {/* Mobile carousel */}
          {isMobile && (
            <MobileOptions
              options={q.opts}
              qIndex={step - 1}
              onSelect={onSelect}
              selectedVibe={answers[step - 1] as Vibe | null}
            />
          )}

          {/* Botonera centrada */}
          <div className="actions">
            <button className="btn" disabled={!canPrev} onClick={()=> setStep(s=> Math.max(1, s-1))}>
              Anterior
            </button>

            {canNext ? (
              <button
                className="btn btn-primary"
                onClick={()=> setStep(s=> Math.min(TOTAL_QUESTIONS, s+1))}
                disabled={!hasSelection}
                aria-disabled={!hasSelection}
                title={!hasSelection ? 'Elige una opción para continuar' : 'Siguiente'}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={finish}
                disabled={answers.some(a => a === null)}
                aria-disabled={answers.some(a => a === null)}
                title={answers.some(a => a === null) ? 'Completa todas las preguntas' : 'Ver mi VIBE'}
              >
                Ver mi VIBE
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
