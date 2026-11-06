/** Original concept artwork, not screenshots or footage from the games. */
export default function GameArtwork({index,seed}:{index:number;seed:string}){
  if(index===0)return <svg viewBox="0 0 600 760" className="cv-art" aria-hidden="true">
    <defs><linearGradient id={`${seed}-sky`} x2="0" y2="1"><stop stopColor="#b74040"/><stop offset="1" stopColor="#281b37"/></linearGradient></defs>
    <path fill={`url(#${seed}-sky)`} d="M0 0h600v760H0z"/><circle cx="427" cy="208" r="96" fill="#f3ad70"/>
    <path d="m0 450 180-220 188 280 232-158v408H0Z" fill="#322b3a"/><path d="m0 568 260-210 210 233 130-130v299H0Z" fill="#191c25"/>
    <path d="m130 478 140-74 147 73-145 80Z" fill="#ede3bc"/><path d="M130 478v154l142 80V557Z" fill="#82785d"/><path d="M272 557v155l145-81V477Z" fill="#c9bd8d"/>
    <path d="m308 560 65-33v107l-65 36Z" fill="#ffdf96"/><path d="m308 670 65-36 67 77-46 49H206Z" fill="#dba76b"/>
    <path d="m350 660 42 20m-61 3 42 21m-62 3 42 21m-61 3 42 21" stroke="#59483d" strokeWidth="2"/>
    <path d="M188 556v65m-17-48 37 21" stroke="#302e2c" strokeWidth="3"/><circle cx="330" cy="633" r="7" fill="#232029"/><path d="M327 640v22h7v-22" fill="#232029"/>
  </svg>;
  if(index===1)return <svg viewBox="0 0 600 760" className="cv-art" aria-hidden="true">
    <path fill="#17131e" d="M0 0h600v760H0z"/>
    {Array.from({length:6},(_,i)=><path key={i} d={`M${-80+i*36} 0 ${210+i*15} 330 ${210+i*15} 480 ${-80+i*36} 760M${680-i*36} 0 ${390-i*15} 330 ${390-i*15} 480 ${680-i*36} 760`} stroke={i%2?'#983044':'#45243a'} strokeWidth="2" fill="none"/>)}
    <ellipse cx="300" cy="380" rx="142" ry="186" fill="#a92945"/><ellipse cx="300" cy="380" rx="111" ry="151" fill="#090b12"/>
    <path d="m233 405 57-162 81 163-72-36Z" fill="#e6dce2"/><path d="m290 243 9 127 72 36Z" fill="#9c90b5"/>
    <path d="m0 686 234-237 65 311H0m600-74L371 449l-72 311h301" fill="#312035"/><path d="m299 370-31 259 31 131 29-131Z" fill="#c83254"/>
    <circle cx="300" cy="211" r="5" fill="#f2ebd9"/>
  </svg>;
  return <svg viewBox="0 0 600 760" className="cv-art" aria-hidden="true">
    <path fill="#c8c3b2" d="M0 0h600v760H0z"/>
    <path d="m0 0 455 90-88 670H0Z" fill="#cd354c"/><path d="m110 80 379 23-82 543-330-91Z" fill="#22212b"/>
    <path d="m193 172 289 70-111 421-248-101Z" fill="#f1e6cc"/>
    <path d="m210 200 212 47-33 148-211-47Z" fill="#675279"/>
    <path d="M236 255q67-78 140 29-65 69-140-29Z" fill="#eee4ce"/><ellipse cx="308" cy="272" rx="22" ry="28" fill="#1e202a"/>
    <path d="m177 401 184 48m-193-13 144 37m-154-2 175 48m-184-11 110 30" stroke="#22212b" strokeWidth="8"/>
    <path d="m0 632 600-255v155L0 760Z" fill="#151921"/><path d="m37 670 188-79m104-44 188-79" stroke="#db3e56" strokeWidth="5"/>
    <path d="m448 0 152 186V0Z" fill="#8c4a68"/>
  </svg>;
}
