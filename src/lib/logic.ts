export type Vibe = 'urban'|'deluxe'|'artsy'|'spicy'|'chill';
export const VIBE_ORDER: Vibe[] = ['urban','deluxe','artsy','spicy','chill']; // desempate 3+

export type Scores = Record<Vibe, number>;
export function computeScores(answers: Vibe[]): Scores {
  const s: Scores = { urban:0, deluxe:0, artsy:0, spicy:0, chill:0 };
  for(const v of answers){ s[v]++; }
  return s;
}

export type Outcome =
  | { kind:'pure', vibe: Vibe, pct:number }
  | { kind:'dominant', vibe: Vibe, pct:number }
  | { kind:'dual', first: Vibe, second: Vibe };

export function pickOutcome(answers: Vibe[], totalQuestions: number): Outcome {
  const scores = computeScores(answers);
  const entries = Object.entries(scores) as [Vibe, number][];
  entries.sort((a,b)=> b[1]-a[1]);

  const top = entries[0];
  const second = entries[1];
  const topPct = top[1] / totalQuestions;
  const secondPct = second[1] / totalQuestions;

  // PURE: >= 70%
  if(topPct >= 0.70) return { kind:'pure', vibe: top[0], pct: topPct };

  // DOMINANT: 60% y resto fragmentado (<30% el segundo)
  if(topPct === 0.60 && secondPct < 0.30) return { kind:'dominant', vibe: top[0], pct: topPct };

  // DUAL
  const maxVal = top[1];
  const tiedTop = entries.filter(([_,v])=> v===maxVal).map(([k])=> k);

  if(tiedTop.length === 1){
    return { kind:'dual', first: top[0], second: second[0] };
  }

  if(tiedTop.length === 2){
    const [a,b] = tiedTop;
    const rev = [...answers].reverse();
    let dominant: Vibe | null = null;
    for(const v of rev){ if(v===a || v===b){ dominant = v as Vibe; break; } }
    const secondV = dominant === a ? b : a;
    return { kind:'dual', first: dominant!, second: secondV as Vibe };
  }

  const ordered = [...tiedTop].sort((x,y)=> VIBE_ORDER.indexOf(x)-VIBE_ORDER.indexOf(y));
  return { kind:'dual', first: ordered[0], second: ordered[1] };
}
