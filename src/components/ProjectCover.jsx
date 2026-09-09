import './ProjectCover.css';
import { media, projectMedia } from '../data/media';
import VationoAnimation from './VationoAnimation';

function Retrieval() {
  return <>
    <rect width="480" height="286" fill="#172536" />
    <text x="26" y="32" fill="#e7eef7" fontSize="15" fontWeight="650">ResearchQ</text>
    <text x="454" y="31" textAnchor="end" fill="#91a6be" fontSize="10">DOCUMENT WORKSPACE</text>
    <rect x="22" y="51" width="167" height="210" rx="7" fill="#f7f9fc" />
    <text x="36" y="73" fill="#5c718c" fontSize="10">SOURCE / 01</text>
    <text x="36" y="96" fill="#273e58" fontSize="13" fontWeight="600">Retrieval-augmented</text><text x="36" y="113" fill="#273e58" fontSize="13" fontWeight="600">generation</text>
    <path d="M36 135h138M36 143h130M36 151h135M36 209h136M36 217h121M36 225h133M36 233h103" stroke="#ced6e0" strokeWidth="3" />
    <rect className="cover-highlight" x="30" y="162" width="151" height="35" rx="3" fill="#d5e9fa" />
    <text x="36" y="176" fill="#386794" fontSize="10">Retrieve relevant passages</text><text x="36" y="190" fill="#386794" fontSize="10">to ground the response.</text>
    <path className="cover-flow" d="M189 178h15v-53h18" stroke="#70bae7" strokeWidth="2" fill="none" strokeDasharray="4 4" />
    <rect x="222" y="60" width="234" height="49" rx="7" fill="#283b51" stroke="#415773" />
    <text x="236" y="79" fill="#8ea5c0" fontSize="9">QUESTION</text><text x="236" y="98" fill="#ecf4ff" fontSize="12">How is context retrieved?</text>
    <rect x="222" y="123" width="234" height="114" rx="7" fill="#213348" />
    <text x="236" y="146" fill="#8fbedd" fontSize="10">GROUNDED RESPONSE</text>
    <g className="cover-answer" fill="#d4e2ef" fontSize="12"><text x="236" y="171">Relevant document sections are</text><text x="236" y="189">retrieved, ranked, and assembled</text><text x="236" y="207">into the model’s context.</text></g>
    <rect x="236" y="219" width="56" height="18" rx="4" fill="#345670" /><text x="244" y="232" fill="#b5dafa" fontSize="10">[1] Source</text>
  </>;
}

function Clinical() {
  return <>
    <rect width="480" height="286" fill="#e7efec" />
    <text x="24" y="30" fill="#254b43" fontSize="13" fontWeight="600">Sepsis · Model explanations</text>
    <rect x="22" y="49" width="436" height="212" rx="8" fill="#fbfdfc" stroke="#cedbd5" />
    <text x="38" y="73" fill="#7c8f87" fontSize="10">ILLUSTRATIVE PATIENT TRAJECTORY</text>
    <g stroke="#e8eeeb"><path d="M39 98h235M39 130h235M39 162h235M39 194h235M69 86v112M129 86v112M189 86v112M249 86v112" /></g>
    <path d="M39 183C69 181 72 187 102 172S135 167 158 150 184 158 209 127 238 133 274 95" fill="none" stroke="#267761" strokeWidth="3" pathLength="1" className="cover-draw" />
    <path d="M213 89v108" stroke="#a5bdb1" strokeDasharray="3 4" /><text x="38" y="218" fill="#859b91" fontSize="10">Observation window →</text>
    <path d="M294 85v145" stroke="#e3ebe6" />
    <text x="311" y="95" fill="#516f62" fontSize="11" fontWeight="600">Contributions</text>
    <text x="311" y="120" fill="#6e8278" fontSize="10">Heart rate</text><rect x="311" y="129" width="112" height="7" rx="3" fill="#e9efe9" /><rect className="cover-bar" x="311" y="129" width="92" height="7" rx="3" fill="#7cad98" />
    <text x="311" y="157" fill="#6e8278" fontSize="10">Temperature</text><rect x="311" y="166" width="112" height="7" rx="3" fill="#e9efe9" /><rect className="cover-bar" x="311" y="166" width="66" height="7" rx="3" fill="#adc7b7" />
    <text x="311" y="194" fill="#6e8278" fontSize="10">Oxygen saturation</text><rect x="311" y="203" width="112" height="7" rx="3" fill="#e9efe9" /><rect className="cover-bar" x="311" y="203" width="42" height="7" rx="3" fill="#d2aa7c" />
    <text x="38" y="246" fill="#8d9c93" fontSize="9">MIMIC-IV / GAM · Synthetic values, not clinical output</text>
  </>;
}

function ResearchPaper() {
  return <>
    <rect width="480" height="286" fill="#e8e4dd" />
    <rect x="100" y="25" width="292" height="278" fill="#cfc9bf" transform="rotate(5 246 164)" />
    <rect x="84" y="15" width="292" height="288" fill="#fffdf8" stroke="#d5cec1" />
    <text x="108" y="42" fill="#99897a" fontSize="9" letterSpacing="2">RESEARCH NOTE / 2026</text>
    <g fill="#333c38" fontFamily="Georgia, serif" fontSize="22"><text x="108" y="79">Interpretable learning</text><text x="108" y="105">for early sepsis detection</text></g>
    <text x="108" y="132" fill="#8a8277" fontSize="10">Jongho Park · MIMIC-IV · GAM</text>
    <path d="M108 147h242" stroke="#ccc5b8" />
    <text x="108" y="171" fill="#615f55" fontSize="10" fontWeight="600">MODEL STRUCTURE</text>
    <text x="108" y="200" fill="#557263" fontFamily="Georgia, serif" fontSize="21">g(E[y]) = β₀ + Σ fᵢ(xᵢ)</text>
    <path d="M108 222h112M108 230h105M108 238h111M108 246h92M237 222h112M237 230h99M237 238h111M237 246h98" stroke="#d8d2c7" strokeWidth="2" />
    <text x="108" y="275" fill="#9c9488" fontSize="8">METHOD OVERVIEW · NOT A PUBLICATION COVER</text>
  </>;
}

function Chunking() {
  return <>
    <rect width="480" height="286" fill="#edf1f9" />
    <text x="25" y="32" fill="#5f7290" fontSize="10" letterSpacing="1">RETRIEVAL ENGINEERING / 01</text>
    <text x="25" y="63" fill="#233c66" fontSize="21" fontWeight="600">Keep the document’s structure.</text>
    <g fill="none" stroke="#9cb0cf" strokeWidth="1.4"><path d="M240 117v20H110v24M240 137h130v24M110 189v22H59v23M110 211h52v23M370 189v22h-51v23M370 211h51v23" /></g>
    <path className="cover-flow" d="M240 117v20H110v52 22H59v23" fill="none" stroke="#346ac3" strokeWidth="2" strokeDasharray="5 8" />
    <rect x="174" y="87" width="132" height="30" rx="5" fill="#2a4f88" /><text x="240" y="107" textAnchor="middle" fill="#fff" fontSize="12">Document</text>
    {[110,370].map((x,i)=><g key={x}><rect x={x-61} y="159" width="122" height="31" rx="5" fill="#fff" stroke="#b1c2dc"/><text x={x} y="180" textAnchor="middle" fill="#587399" fontSize="11">Section {i+1}</text></g>)}
    {[59,162,319,421].map((x,i)=><g key={x}><rect x={x-34} y="232" width="68" height="27" rx="4" fill={i===0?'#c7dafa':'#dce5f4'} /><text x={x} y="250" textAnchor="middle" fill="#557198" fontSize="10">Chunk {i+1}</text></g>)}
  </>;
}

function Additive() {
  return <>
    <rect width="480" height="286" fill="#f4e9da" />
    <text x="26" y="32" fill="#927455" fontSize="10" letterSpacing="1">MODEL INTERPRETABILITY / 02</text>
    <text x="26" y="67" fill="#674d35" fontFamily="Georgia, serif" fontSize="28">A model you can read.</text>
    <g fill="none" stroke="#d9c8b3"><path d="M32 113v92h110M184 113v92h110M336 113v92h110" /></g>
    <g fill="none" stroke="#a0794a" strokeWidth="3" pathLength="1"><path className="cover-draw" pathLength="1" d="M39 184Q90 213 137 127"/><path className="cover-draw" pathLength="1" d="M191 153Q233 99 288 186"/><path className="cover-draw" pathLength="1" d="M343 186C381 186 373 137 440 130"/></g>
    <g fill="#927455" fontFamily="Georgia, serif" fontSize="21"><text x="154" y="166">+</text><text x="306" y="166">+</text></g>
    <g fill="#907b65" fontSize="10"><text x="40" y="226">f(heart rate)</text><text x="192" y="226">f(temperature)</text><text x="344" y="226">f(oxygen)</text></g>
    <text x="26" y="269" fill="#a49480" fontSize="9">Illustrative basis functions · Not fitted clinical results</text>
  </>;
}

function Spatial() {
  const clusters = Array.from({length:42},(_,i)=>({x:145+Math.sin(i*2.4)*Math.sqrt(i)*8,y:129+Math.cos(i*1.7)*Math.sqrt(i)*6}));
  return <>
    <rect width="480" height="286" fill="#1b2d33" />
    <g stroke="#344850" strokeWidth="9" fill="none"><path d="M-20 87 499 207M72-20l89 338M284-20 170 319M445-20 328 312M-20 222 500 70" /></g>
    <g stroke="#526169" strokeWidth=".7" fill="none"><path d="M-20 87 499 207M72-20l89 338M284-20 170 319M445-20 328 312M-20 222 500 70" /></g>
    <circle cx="145" cy="129" r="66" fill="#6dbaa415" stroke="#7db3a2" strokeDasharray="3 5" /><ellipse cx="336" cy="187" rx="55" ry="44" fill="#a7b9db10" stroke="#93a7c4" strokeDasharray="3 5" />
    {clusters.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.8" fill="#9acbbb" />)}
    {clusters.slice(0,26).map((p,i)=><circle key={i} cx={p.x+191} cy={p.y+58} r="2.6" fill="#a6b9d7" />)}
    <g className="cover-noise" fill="#c99778">{Array.from({length:16},(_,i)=><circle key={i} cx={24+(i*79)%430} cy={65+(i*43)%195} r="2" />)}</g>
    <rect x="0" y="0" width="480" height="46" fill="#17282ee6" /><text x="24" y="29" fill="#c6d6d9" fontSize="13" fontWeight="550">Spatial clustering / BigQuery</text>
    <rect x="20" y="243" width="254" height="25" rx="4" fill="#17282ee8" /><circle cx="33" cy="256" r="3" fill="#9acbbb" /><text x="42" y="260" fill="#b4c6ca" fontSize="9">Cluster A</text><circle cx="113" cy="256" r="3" fill="#a6b9d7" /><text x="122" y="260" fill="#b4c6ca" fontSize="9">Cluster B</text><circle cx="194" cy="256" r="3" fill="#c99778" /><text x="203" y="260" fill="#b4c6ca" fontSize="9">Noise</text>
  </>;
}

function DinoQ() {
  return <>
    <rect width="480" height="286" fill="#f0f3f7" />
    <text x="25" y="31" fill="#647180" fontSize="10" letterSpacing="1">TABULAR Q-LEARNING / LIVE</text>
    <text x="25" y="66" fill="#202832" fontSize="22" fontWeight="650">Learn by acting.</text>
    <g transform="translate(26 92)">
      <rect width="428" height="112" rx="8" fill="#fff" stroke="#d7dee6" />
      <path d="M18 87h392" stroke="#abb5c0" />
      <path d="M135 87l13-31 13 31M281 87l13-31 13 31" fill="#17191c" />
      <g transform="translate(347 50)" fill="#17191c">
        <rect x="0" y="12" width="32" height="28"/><rect x="18" y="0" width="35" height="25"/><rect x="47" y="7" width="12" height="7"/>
        <rect x="4" y="36" width="9" height="20"/><rect x="25" y="36" width="9" height="20"/><rect x="26" y="7" width="5" height="5" fill="#fff"/>
      </g>
      <path d="M383 82l14-11 14 11-6 6h-16Z" fill="#924038" /><path d="M389 87l-8 8" stroke="#d6aa72" strokeWidth="4" />
    </g>
    <g transform="translate(26 227)" fontSize="12">
      <text fill="#5b6876">Q(s, ·)</text>
      <rect x="61" y="-16" width="92" height="25" rx="5" fill="#e5edf7"/><text x="72" y="1" fill="#34506f">Forward +0.42</text>
      <rect x="161" y="-16" width="76" height="25" rx="5" fill="#eef0f3"/><text x="172" y="1" fill="#596675">Turn −0.08</text>
      <rect x="245" y="-16" width="84" height="25" rx="5" fill="#e6f0ea"/><text x="256" y="1" fill="#35664f">Jump +0.61</text>
    </g>
    <text x="26" y="269" fill="#8a949f" fontSize="9">Observe → choose → act → reward → update</text>
  </>;
}

const scenes = {
  researchq: [Retrieval, 'Retrieval workflow', 'Hover to trace'],
  sepsis: [Clinical, 'Model explanation', 'Hover to trace'],
  'sepsis-research': [ResearchPaper, 'Research notes', 'Method overview'],
  'writing-rag': [Chunking, 'Hierarchical chunking', 'Hover to trace'],
  'writing-ml': [Additive, 'Additive modelling', 'Hover to trace'],
  'writing-data': [Spatial, 'Spatial clustering', 'Hover to filter'],
  'writing-dino-q-learning': [DinoQ, 'Q-learning loop', 'Read the model notes'],
};

export default function ProjectCover({ id }) {
  if (id === 'vationo') return <div className="project-cover cover-vationo"><VationoAnimation /></div>;
  const actual = media[projectMedia[id]?.[0]];
  if (actual) return <div className={`project-cover cover-${id}`}>
    <img className="project-cover-photo" src={`${import.meta.env.BASE_URL}${actual.src}`} width={actual.width} height={actual.height} alt={actual.alt} loading="lazy" decoding="async" />
    <div className="project-cover-caption"><span>{id === 'researchq' ? 'Service capture' : 'Report excerpt'}</span><span>{id === 'researchq' ? 'ResearchQ' : 'COMP90089'}</span></div>
  </div>;
  const [Scene, label, hint] = scenes[id];
  return <div className={`project-cover cover-${id}`}>
    <svg className="project-cover-scene" viewBox="0 0 480 286" aria-hidden="true"><Scene /></svg>
    <div className="project-cover-caption"><span>{label} · Illustration</span><span className="project-cover-hint">{hint}</span></div>
  </div>;
}
