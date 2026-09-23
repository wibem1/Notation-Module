import {NotationModule} from './notation-module.js?v=0.1.11';
const $=id=>document.getElementById(id), status=$('status'), abc=$('abc');
const ABC_STORAGE_KEY='notation-module.test-app.abc';
const SCALE_STORAGE_KEY='notation-module.test-app.scale';
const defaultABC=abc.value;
try{const saved=localStorage.getItem(ABC_STORAGE_KEY);if(saved)abc.value=saved}catch(_){}
let initialScale=1;
try{const savedScale=Number(localStorage.getItem(SCALE_STORAGE_KEY));if(savedScale>=0.6&&savedScale<=1.6)initialScale=savedScale}catch(_){}
const notation=new NotationModule({paper:'paper',scale:initialScale,onStatus:t=>status.textContent=t});
const instrumentSelect=$('instrument');
NotationModule.instruments().forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=item.label;instrumentSelect.appendChild(option)});
instrumentSelect.value='violin';
function render(){try{notation.loadABC(abc.value)}catch(e){status.textContent='Fehler: '+e.message}}
function persist(){try{localStorage.setItem(ABC_STORAGE_KEY,abc.value)}catch(_){}}
function showScale(){ $('scaleValue').textContent=Math.round(notation.getScale()*100)+' %'; }
function changeScale(delta){const scale=notation.setScale(notation.getScale()+delta);try{localStorage.setItem(SCALE_STORAGE_KEY,String(scale))}catch(_){}showScale();}
$('render').onclick=()=>{persist();render()};
abc.addEventListener('input',()=>{persist();clearTimeout(window.__renderTimer);window.__renderTimer=setTimeout(render,180)});
instrumentSelect.onchange=()=>{try{const item=notation.setInstrument(instrumentSelect.value);abc.value=notation.getABC();persist();status.textContent=item.label+' gewählt.'}catch(e){status.textContent='Instrumentenfehler: '+e.message}};
$('scaleDown').onclick=()=>changeScale(-0.1);
$('scaleUp').onclick=()=>changeScale(0.1);
$('play').onclick=()=>notation.play().catch(e=>status.textContent='Wiedergabefehler: '+e.message);
$('stop').onclick=()=>notation.stop();
$('print').onclick=()=>notation.print();
$('saveABC').onclick=()=>{const blob=new Blob([notation.getABC()],{type:'text/vnd.abc;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='partitur.abc';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('resetABC').onclick=()=>{abc.value=defaultABC;try{localStorage.removeItem(ABC_STORAGE_KEY)}catch(_){}render()};
showScale();
render();