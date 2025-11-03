export type StatBlock = { energia:string; estilo:string; plan:string; social:string; actitud:string };
export type ResultCard = {
  id: string;
  type: 'single'|'dual';
  key: string;
  title: string;
  tagline: string;
  bio: string;
  legend: string;           // Rare/Legendary badge text
  colors: string[];         // [from, to] gradient
  video: { src: string; poster?: string };
  stats: StatBlock;
};

/** Paleta:
 *  Singles → degradado propio (principal → tono claro/complementario)
 *  Duals   → mix directo entre las dos vibes (en orden de la key)
 *
 *  Vibes base:
 *  --spicy:#FF441A; --deluxe:#00D4FF; --deluxe2:#B6FFF8; --urban:#FF2F9C; --chill:#C9FFE9; --artsy:#E4FF00;
 *
 *  Singles tonos secundarios propuestos:
 *  URBAN → #FFA9D6
 *  DELUXE → var(--deluxe2)
 *  ARTSY → #FFFF85
 *  SPICY → #FF8B4C
 *  CHILL → #E6FFF4
 */

export const RESULTS: Record<string, ResultCard> = {
  /* ============================ SINGLES (5) ============================ */
  urban: {
    id:'#01/25 – URBAN', type:'single', key:'urban',
    title:'Ciudad a tope. Tú marcas el ritmo.',
    tagline:'Asfalto, neón y barra libre de flow.',
    bio:'Nada te frena: del metro al after sin perder la señal. Sport chic, playlists que revientan y agenda que no perdona. Calles tuyas, reglas tuyas.',
    legend:'PURE VIBE ✦ Rare',
    colors:['var(--urban)', '#FFA9D6'],
    video:{ src:'/assets/vibes/singles/urban.mp4', poster:'/assets/vibes/singles/urban.jpg' },
    stats:{ energia:'Rápida, callejera', estilo:'Sport chic con brillo', plan:'Rooftop + after kebab', social:'Conecta con todo el mundo', actitud:'Sin filtro (con flow)' }
  },

  deluxe: {
    id:'#02/25 – DELUXE', type:'single', key:'deluxe',
    title:'No caminas, flotas.',
    tagline:'El silencio… pero con joyas.',
    bio:'No te hace falta subir el volumen: el mundo ya te escucha. Brillo líquido, timing perfecto y perfume caro. La diva del algoritmo, sin despeinarte.',
    legend:'PURE VIBE ✦ Rare',
    colors:['var(--deluxe)', 'var(--deluxe2)'],
    video:{ src:'/assets/vibes/singles/deluxe.mp4', poster:'/assets/vibes/singles/deluxe.jpg' },
    stats:{ energia:'Precisa, elegante', estilo:'Cromado impecable', plan:'Cena íntima + 10k likes', social:'Observadora, magnética', actitud:'Serenidad de reina' }
  },

  artsy: {
    id:'#03/25 – ARTSY', type:'single', key:'artsy',
    title:'Obra viva en movimiento.',
    tagline:'Ideas grandes, manchas bonitas.',
    bio:'Tu vida es un taller abierto: vernissages, fanzines y cafés eternos. Curiosidad feroz y mirada que convierte lo cotidiano en culto.',
    legend:'PURE VIBE ✦ Rare',
    colors:['var(--artsy)', '#FFFF85'],
    video:{ src:'/assets/vibes/singles/artsy.mp4', poster:'/assets/vibes/singles/artsy.jpg' },
    stats:{ energia:'Inquieta, curiosa', estilo:'Atelier glam', plan:'Vernissage + after casero', social:'Círculo ecléctico', actitud:'Manifiesto en tacones' }
  },

  spicy: {
    id:'#04/25 – SPICY', type:'single', key:'spicy',
    title:'Eres tendencia… y tentación.',
    tagline:'Picante con mucha risa.',
    bio:'Llegas y sube la temperatura. Flirteo de alto voltaje, late night y perreo fino. Traviesa, directa y peligrosamente adorable.',
    legend:'PURE VIBE ✦ Rare',
    colors:['var(--spicy)', '#FF8B4C'],
    video:{ src:'/assets/vibes/singles/spicy.mp4', poster:'/assets/vibes/singles/spicy.jpg' },
    stats:{ energia:'Explosiva, juguetona', estilo:'Latex & risas', plan:'Perreo + ramen', social:'Carismática, picante', actitud:'Atrevida sin perdón' }
  },

  chill: {
    id:'#05/25 – CHILL', type:'single', key:'chill',
    title:'Tu calma manda.',
    tagline:'Paz premium, drama cero.',
    bio:'Manta, peli y vela cara… pero con timing social perfecto. Energía templada, enfoque claro y límites muy sanos.',
    legend:'PURE VIBE ✦ Rare',
    colors:['var(--chill)', '#E6FFF4'],
    video:{ src:'/assets/vibes/singles/chill.mp4', poster:'/assets/vibes/singles/chill.jpg' },
    stats:{ energia:'Serena, constante', estilo:'Soft comfy', plan:'Tardeo + peli', social:'Cercana, cuidadora', actitud:'Zen con límites' }
  },

  /* ============================ DUALS (20, alfabéticas) ============================ */
  artsy_chill: {
    id:'#06/25 – ARTSYxCHILL', type:'dual', key:'artsy_chill',
    title:'Taller zen.',
    tagline:'Ideas lentas, belleza larga.',
    bio:'Secas la pintura mirando las nubes. Silencio que inspira, resultado que conquista.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--artsy)', 'var(--chill)'],
    video:{ src:'/assets/vibes/duals/artsy_chill.mp4', poster:'/assets/vibes/duals/artsy_chill.jpg' },
    stats:{ energia:'Curiosa serena', estilo:'Soft atelier', plan:'Té + collage', social:'Círculo amable', actitud:'Paciencia brillante' }
  },

  artsy_deluxe: {
    id:'#07/25 – ARTSYxDELUXE', type:'dual', key:'artsy_deluxe',
    title:'Barroco con tarjeta black.',
    tagline:'Obra única, factura perfecta.',
    bio:'Pintas fuera de línea, firmas dentro del margen. Belleza con intención.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--artsy)', 'var(--deluxe)'],
    video:{ src:'/assets/vibes/duals/artsy_deluxe.mp4', poster:'/assets/vibes/duals/artsy_deluxe.jpg' },
    stats:{ energia:'Creativa pulida', estilo:'Arte couture', plan:'Subasta + speakeasy', social:'Red exquisita', actitud:'Experta, juguetona' }
  },

  artsy_spicy: {
    id:'#08/25 – ARTSYxSPICY', type:'dual', key:'artsy_spicy',
    title:'Performance que besa.',
    tagline:'Muse y musa en la misma piel.',
    bio:'Tu obra hace sudar y tu risa firma en neón. Estética intensa, deseo conceptual.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--artsy)', 'var(--spicy)'],
    video:{ src:'/assets/vibes/duals/artsy_spicy.mp4', poster:'/assets/vibes/duals/artsy_spicy.jpg' },
    stats:{ energia:'Creativa ardiente', estilo:'Pop fetiche', plan:'Opening + pista', social:'Tribu artística', actitud:'Provocación inteligente' }
  },

  artsy_urban: {
    id:'#09/25 – ARTSYxURBAN', type:'dual', key:'artsy_urban',
    title:'Atelier en la acera.',
    tagline:'Idea fresca, delivery express.',
    bio:'El boceto nace en un paso de cebra y termina en un fanzine coleccionable. Cultura pop con tesis propia.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--artsy)', 'var(--urban)'],
    video:{ src:'/assets/vibes/duals/artsy_urban.mp4', poster:'/assets/vibes/duals/artsy_urban.jpg' },
    stats:{ energia:'Impulso creativo', estilo:'Arte street', plan:'Taller + jam', social:'Red abierta', actitud:'Manifiesto práctico' }
  },

  chill_artsy: {
    id:'#10/25 – CHILLxARTSY', type:'dual', key:'chill_artsy',
    title:'Silencio que compone.',
    tagline:'Respirar también es crear.',
    bio:'Tu calma ordena el caos creativo. Pocas piezas, mucho sentido.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--chill)', 'var(--artsy)'],
    video:{ src:'/assets/vibes/duals/chill_artsy.mp4', poster:'/assets/vibes/duals/chill_artsy.jpg' },
    stats:{ energia:'Serena curiosa', estilo:'Pulcro artístico', plan:'Paseo + sketch', social:'Cálida selectiva', actitud:'Atenta, sutil' }
  },

  chill_deluxe: {
    id:'#11/25 – CHILLxDELUXE', type:'dual', key:'chill_deluxe',
    title:'Minimalismo de alto brillo.',
    tagline:'Soft pero carísimo.',
    bio:'Paz con hilo de seda. Pocas cosas, todas perfectas.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--chill)', 'var(--deluxe)'],
    video:{ src:'/assets/vibes/duals/chill_deluxe.mp4', poster:'/assets/vibes/duals/chill_deluxe.jpg' },
    stats:{ energia:'Constante pulida', estilo:'Calma premium', plan:'Domingo gourmet', social:'Círculo íntimo', actitud:'Sobriedad deluxe' }
  },

  chill_spicy: {
    id:'#12/25 – CHILLxSPICY', type:'dual', key:'chill_spicy',
    title:'Spa con chispa.',
    tagline:'Relajación que sube la temperatura.',
    bio:'Escoges el momento exacto para el caos bonito. Tus velas huelen a fiesta.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--chill)', 'var(--spicy)'],
    video:{ src:'/assets/vibes/duals/chill_spicy.mp4', poster:'/assets/vibes/duals/chill_spicy.jpg' },
    stats:{ energia:'Serena y juguetona', estilo:'Soft brillante', plan:'Peli + baile en salón', social:'Cálida magnética', actitud:'Tranquila traviesa' }
  },

  chill_urban: {
    id:'#13/25 – CHILLxURBAN', type:'dual', key:'chill_urban',
    title:'Soft pero con colmillo.',
    tagline:'Calma estratégica en el ruido.',
    bio:'Tu paz no es quieta: es puntería. Encuentras el hueco exacto para brillar sin gritar.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--chill)', 'var(--urban)'],
    video:{ src:'/assets/vibes/duals/chill_urban.mp4', poster:'/assets/vibes/duals/chill_urban.jpg' },
    stats:{ energia:'Serena con beat', estilo:'Clean street', plan:'Tardeo + skyline', social:'Empática directa', actitud:'Tranquila, afilada' }
  },

  deluxe_artsy: {
    id:'#14/25 – DELUXExARTSY', type:'dual', key:'deluxe_artsy',
    title:'Museo privado en tu bolso.',
    tagline:'Alta costura, alta cultura.',
    bio:'Champán con manifiesto. Tus referencias son finas y tu espejo, aún más.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--deluxe)', 'var(--artsy)'],
    video:{ src:'/assets/vibes/duals/deluxe_artsy.mp4', poster:'/assets/vibes/duals/deluxe_artsy.jpg' },
    stats:{ energia:'Precisa e inquieta', estilo:'Galería de lujo', plan:'Expo VIP + cena', social:'Selectiva culta', actitud:'Elegancia curiosa' }
  },

  deluxe_chill: {
    id:'#15/25 – DELUXExCHILL', type:'dual', key:'deluxe_chill',
    title:'Silencio de terciopelo.',
    tagline:'Lujo que respira.',
    bio:'Brillar sin prisa, elegir sin ruido. Tu cama parece un hotel y tu agenda, un spa.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--deluxe)', 'var(--chill)'],
    video:{ src:'/assets/vibes/duals/deluxe_chill.mp4', poster:'/assets/vibes/duals/deluxe_chill.jpg' },
    stats:{ energia:'Elegancia serena', estilo:'Cromado soft', plan:'Cena íntima en casa', social:'Cálida selectiva', actitud:'Autoridad tranquila' }
  },

  deluxe_spicy: {
    id:'#16/25 – DELUXExSPICY', type:'dual', key:'deluxe_spicy',
    title:'Alta joyería en modo traviesa.',
    tagline:'Perfume caro, plan peligroso.',
    bio:'Brillas sin pedir permiso y provocas con clase. La chispa viene en estuche.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--deluxe)', 'var(--spicy)'],
    video:{ src:'/assets/vibes/duals/deluxe_spicy.mp4', poster:'/assets/vibes/duals/deluxe_spicy.jpg' },
    stats:{ energia:'Elegante ardiente', estilo:'Glam picante', plan:'Cena secreta + club', social:'Atractivo letal', actitud:'Coqueta estratégica' }
  },

  deluxe_urban: {
    id:'#17/25 – DELUXExURBAN', type:'dual', key:'deluxe_urban',
    title:'Lujo con latido de calle.',
    tagline:'Etiqueta flexible, brillo indomable.',
    bio:'Corte impecable que sabe mancharse. Champán en vaso rojo y cadena que vale un contrato.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--deluxe)', 'var(--urban)'],
    video:{ src:'/assets/vibes/duals/deluxe_urban.mp4', poster:'/assets/vibes/duals/deluxe_urban.jpg' },
    stats:{ energia:'Precisa con punch', estilo:'Gala street', plan:'Premiere + after club', social:'Conexiones clave', actitud:'Clase con garra' }
  },

  spicy_artsy: {
    id:'#18/25 – SPICYxARTSY', type:'dual', key:'spicy_artsy',
    title:'Coqueteo conceptual.',
    tagline:'Teorías calientes, looks icónicos.',
    bio:'Flirteas con el caos estético y te queda precioso. Crítica y glitter.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--spicy)', 'var(--artsy)'],
    video:{ src:'/assets/vibes/duals/spicy_artsy.mp4', poster:'/assets/vibes/duals/spicy_artsy.jpg' },
    stats:{ energia:'Chispa creativa', estilo:'Arte sexy', plan:'Karaoke post-galería', social:'Magnética ecléctica', actitud:'Ironía afilada' }
  },

  spicy_chill: {
    id:'#19/25 – SPICYxCHILL', type:'dual', key:'spicy_chill',
    title:'La calma que prende fuego.',
    tagline:'Entre el placer y la paz.',
    bio:'Eres la copa que empieza tranquila y acaba confesando secretos. Fuego templado, drama con incienso; after y spa en el mismo cuerpo.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--spicy)', 'var(--chill)'],
    video:{ src:'/assets/vibes/duals/spicy_chill.mp4', poster:'/assets/vibes/duals/spicy_chill.jpg' },
    stats:{ energia:'Ardiente pero zen', estilo:'Relajada con brillo', plan:'After suave + brunch', social:'Intensa y acogedora', actitud:'Paz provocadora' }
  },

  spicy_deluxe: {
    id:'#20/25 – SPICYxDELUXE', type:'dual', key:'spicy_deluxe',
    title:'Peligro en seda.',
    tagline:'Caricia y mordisco.',
    bio:'Risa, guiño y golpe de efecto. Un “wow” que huele a nicho.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--spicy)', 'var(--deluxe)'],
    video:{ src:'/assets/vibes/duals/spicy_deluxe.mp4', poster:'/assets/vibes/duals/spicy_deluxe.jpg' },
    stats:{ energia:'Chispa precisa', estilo:'Sexy pulido', plan:'Precopeo + suite', social:'Imán selecto', actitud:'Atrevimiento fino' }
  },

  spicy_urban: {
    id:'#21/25 – SPICYxURBAN', type:'dual', key:'spicy_urban',
    title:'Chispa de esquina.',
    tagline:'Picante con sneakers.',
    bio:'Beso robado, selfie borrosa y story viral. La calle te quiere y tú te la comes.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--spicy)', 'var(--urban)'],
    video:{ src:'/assets/vibes/duals/spicy_urban.mp4', poster:'/assets/vibes/duals/spicy_urban.jpg' },
    stats:{ energia:'Fuego en sprint', estilo:'Glow callejero', plan:'Tapeo + pista', social:'Tribu leal', actitud:'Sin vergüenza, con swing' }
  },

  urban_artsy: {
    id:'#22/25 – URBANxARTSY', type:'dual', key:'urban_artsy',
    title:'Grafiti de autor.',
    tagline:'Barrios creativos, museos nocturnos.',
    bio:'Skate en la plaza, collage en el estudio. Tu mapa es una libreta llena de ideas con pegatinas.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--urban)', 'var(--artsy)'],
    video:{ src:'/assets/vibes/duals/urban_artsy.mp4', poster:'/assets/vibes/duals/urban_artsy.jpg' },
    stats:{ energia:'Curiosa y veloz', estilo:'DIY pulido', plan:'Expo + open mic', social:'Tribu variada', actitud:'Probar, mezclar, repetir' }
  },

  urban_chill: {
    id:'#23/25 – URBANxCHILL', type:'dual', key:'urban_chill',
    title:'Modo avión con vistas a la ciudad.',
    tagline:'Ritmo cuando toca, pausa cuando conviene.',
    bio:'Sabes decir que sí y también decir “otro día”. Balance perfecto: hoodie planchado, sofá con agenda.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--urban)', 'var(--chill)'],
    video:{ src:'/assets/vibes/duals/urban_chill.mp4', poster:'/assets/vibes/duals/urban_chill.jpg' },
    stats:{ energia:'Cadencia estable', estilo:'Minimal comfy', plan:'Paseo + ramen', social:'Cercana y clara', actitud:'Límites sanos' }
  },

  urban_deluxe: {
    id:'#24/25 – URBANxDELUXE', type:'dual', key:'urban_deluxe',
    title:'Asfalto con diamantes.',
    tagline:'Ritmo callejero, acabado de lujo.',
    bio:'Naces en la esquina y posas en el front row. Hoodie con joyas, sneakers con agenda VIP. Crudo y pulido a la vez.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--urban)', 'var(--deluxe)'],
    video:{ src:'/assets/vibes/duals/urban_deluxe.mp4', poster:'/assets/vibes/duals/urban_deluxe.jpg' },
    stats:{ energia:'Impulso premium', estilo:'Street couture', plan:'Rooftop + cena fina', social:'Popular con filtro', actitud:'Ambición elegante' }
  },

  urban_spicy: {
    id:'#25/25 – URBANxSPICY', type:'dual', key:'urban_spicy',
    title:'Perreo en chándal de edición limitada.',
    tagline:'Barrio caliente, ritmo pegado.',
    bio:'Del balcón al backstage sin perder la chispa. Tu DM echa humo y tu outfit, también.',
    legend:'FUSION VIBE ✦ Legendary Mix',
    colors:['var(--urban)', 'var(--spicy)'],
    video:{ src:'/assets/vibes/duals/urban_spicy.mp4', poster:'/assets/vibes/duals/urban_spicy.jpg' },
    stats:{ energia:'Explosiva y ágil', estilo:'Sport sexy', plan:'Block party + club', social:'Magnética total', actitud:'Descaro con método' }
  },
};
