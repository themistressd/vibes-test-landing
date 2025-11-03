import type { Vibe } from '@/lib/logic';

export type Option = { txt: string; vibe: Vibe; letter: 'a'|'b'|'c'|'d'|'e' };
export type Question = { t: string; opts: Option[] };

export const QUESTIONS: Question[] = [
  { t: '1. Tu plan perfecto de viernes por la noche es...',
    opts: [
      { txt:'Salir con tu grupo y acabar cantando en un local tomando unas birras.', vibe:'urban', letter:'a' },
      { txt:'Cena con copas en un sitio bonito y exclusivo con gente fabulosa.',     vibe:'deluxe',letter:'b' },
      { txt:'Sesión de cine con amigxs, unas tiradas de Tarot y charlita existencial..', vibe:'artsy', letter:'c' },
      { txt:'Fiesta hasta que cierren el garito, baile a tope y risas.',             vibe:'spicy', letter:'d' },
      { txt:'Plan tranquilo: cena en casa, pijama y peli con tu gente o tu crush.',  vibe:'chill', letter:'e' },
    ],
  },
  { t: '2. Si fueras un personaje de una serie, serías...',
    opts: [
      { txt:'El alma libre que improvisa y termina en medio del caos (pero todo el mundo la adora).', vibe:'urban', letter:'a' },
      { txt:'El protagonista que va impecable, misteriosx y con frases para todo.',   vibe:'deluxe', letter:'b' },
      { txt:'El rarito adorable que hace playlists experimentales pero con estilo.',   vibe:'artsy',  letter:'c' },
      { txt:'La fiestera oficial del grupo, la que siempre dice “¡una más!” y la lía.',vibe:'spicy',  letter:'d' },
      { txt:'La persona zen que da buenos consejos y tiene plantas por toda la casa.', vibe:'chill',  letter:'e' },
    ],
  },
  { t: '3. ¿Qué emoji te representa mejor cuando sales de fiesta?',
    opts: [
      { txt:'🎤 Cantando con tus amigxs como si fuera el Benidorm Fest.', vibe:'urban', letter:'a' },
      { txt:'✨ Brillando y posando como si te grabaran un reality.',      vibe:'deluxe',letter:'b' },
      { txt:'🎭 Creativx, diferente y con outfit temático sin motivo.',    vibe:'artsy', letter:'c' },
      { txt:'🔥 Encendidx y lista para el drama bueno.',                   vibe:'spicy', letter:'d' },
      { txt:'💤 Chill total. Mojito, sofá y stories viendo el caos ajeno.',vibe:'chill', letter:'e' },
    ],
  },
  { t: '4. Si tu vida fuera una serie, sería...',
    opts: [
      { txt:'Una sitcom con colegas, locuras y frases que se vuelven memes.', vibe:'urban', letter:'a' },
      { txt:'Una telenovela, con mucho poderío y miradas intensas a cámara lenta.', vibe:'deluxe', letter:'b' },
      { txt:'Una mezcla entre arte moderno y realities absurdos: nadie la entiende, pero gusta.', vibe:'artsy', letter:'c' },
      { txt:'Una serie explosiva de deseo, drama y afters: cada capítulo es un cliffhanger.',    vibe:'spicy', letter:'d' },
      { txt:'Una comedia romántica imperfecta, tierna y 100% tú.',                              vibe:'chill', letter:'e' },
    ],
  },
  { t: '5. Tu outfit ideal para sentirte tú al 100%:',
    opts: [
      { txt:'Chándal o vaqueros anchos, sneakers y actitud. Informal pero con estilo.', vibe:'urban', letter:'a' },
      { txt:'Total black, un buen perfume y gafas de sol incluso de noche.',            vibe:'deluxe',letter:'b' },
      { txt:'Colores, estampados y algo vintage que nadie más tiene.',                  vibe:'artsy', letter:'c' },
      { txt:'Prendas atrevidas, brillo, cuero o lentejuelas: que se te vea llegar.',    vibe:'spicy', letter:'d' },
      { txt:'Pantalón fluido, camiseta básica y chaqueta oversize. Cómodo y con rollo.',vibe:'chill', letter:'e' },
    ],
  },
  { t: '6. ¿Qué suena en tu playlist últimamente?',
    opts: [
      { txt:'Reggaeton, pop español y temazos que se cantan en el coche.',                  vibe:'urban',  letter:'a' },
      { txt:'Beyoncé, The Weeknd, Dua Lipa, Sabrina Carpenter… puro glamour y ritmo fino.', vibe:'deluxe', letter:'b' },
      { txt:'Indie suave, electrónica o esa banda que tú descubriste antes que nadie.',     vibe:'artsy',  letter:'c' },
      { txt:'Pop cañero, techno o lo que te haga sudar de placer.',                         vibe:'spicy',  letter:'d' },
      { txt:'Música tranquila, lo-fi, soul o un podcast mientras haces la cena.',           vibe:'chill',  letter:'e' },
    ],
  },
  { t: '7. Tu bio de Instagram dice algo como...',
    opts: [
      { txt:'“Siempre hay un plan (y si no, me lo invento).”', vibe:'urban',  letter:'a' },
      { txt:'“No llego tarde, llego icónicx.”',               vibe:'deluxe', letter:'b' },
      { txt:'“Modo artista: activo pero sin wifi.”',          vibe:'artsy',  letter:'c' },
      { txt:'“Demasiado fuego para seguir las normas.”',      vibe:'spicy',  letter:'d' },
      { txt:'“No tengo prisa, tengo paz (y serie pendiente).”',vibe:'chill', letter:'e' },
    ],
  },
  { t: '8. Cuando estás en modo bajón o saturadx...',
    opts: [
      { txt:'Te vas a dar una vuelta y acabas tomando algo sin planearlo.', vibe:'urban',  letter:'a' },
      { txt:'Ducha larga, outfit épico y reset instantáneo.',               vibe:'deluxe', letter:'b' },
      { txt:'Pones una BSO de Disney Channel y haces algo creativo.',       vibe:'artsy',  letter:'c' },
      { txt:'Te pegas un bailoteo, un coqueteo express y a revivir.',       vibe:'spicy',  letter:'d' },
      { txt:'Apagas el móvil, te haces algo rico y desapareces un rato.',   vibe:'chill',  letter:'e' },
    ],
  },
  { t: '9. En tu grupo de amigos no puede faltar...',
    opts: [
      { txt:'La que conoce a todo el mundo, improvisa planes y acaba reuniendo al grupo sin querer.', vibe:'urban',  letter:'a' },
      { txt:'El que llega tarde pero con lookazo y stories preparados.',                              vibe:'deluxe', letter:'b' },
      { txt:'La mente creativa con referencias que no conoces pero te hipnotiza igual.',              vibe:'artsy',  letter:'c' },
      { txt:'La que siente todo al 300 %, monta el show, llora, se ríe y te arrastra a vivir.',       vibe:'spicy',  letter:'d' },
      { txt:'La del “yo paso del ruido” que te salva del apocalipsis social..',                       vibe:'chill',  letter:'e' },
    ],
  },
  { t: '10. La energía que transmites sin darte cuenta:',
    opts: [
      { txt:'Movimiento constante, ideas locas y alma de after improvisado.', vibe:'urban',  letter:'a' },
      { txt:'Presencia. Todo el mundo se da la vuelta cuando entras.',        vibe:'deluxe', letter:'b' },
      { txt:'Curiosidad infinita, arte en vena y ese halo diferente que encanta.', vibe:'artsy', letter:'c' },
      { txt:'Deseo, intensidad y ese punto de locura que hace imposible ignorarte.', vibe:'spicy', letter:'d' },
      { txt:'Paz, equilibrio y energía de domingo al sol eterno.',            vibe:'chill',  letter:'e' },
    ],
  },
];

export const TOTAL_QUESTIONS = 10;
