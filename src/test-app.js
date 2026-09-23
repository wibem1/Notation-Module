import {NotationModule} from './notation-module.js?v=0.1.22';
const $=id=>document.getElementById(id), status=$('status'), abc=$('abc');
const ABC_STORAGE_KEY='notation-module.test-app.abc';
const SCALE_STORAGE_KEY='notation-module.test-app.scale';
const defaultABC=abc.value;
try{const saved=localStorage.getItem(ABC_STORAGE_KEY);if(saved)abc.value=saved}catch(_){}
let initialScale=1;
try{const savedScale=Number(localStorage.getItem(SCALE_STORAGE_KEY));if(savedScale>=0.6&&savedScale<=1.6)initialScale=savedScale}catch(_){}
const notation=new NotationModule({
  paper:'paper',
  scale:initialScale,
  onStatus:t=>status.textContent=t,
  onSelect:({start,end})=>{
    abc.focus({preventScroll:true});
    abc.setSelectionRange(start,end);
    const before=abc.value.slice(0,start);
    const line=Math.max(0,before.split('\n').length-1);
    const lineHeight=parseFloat(getComputedStyle(abc).lineHeight)||22;
    abc.scrollTop=Math.max(0,line*lineHeight-abc.clientHeight/2);
    status.textContent='ABC-Stelle zur gewählten Note markiert.';
  }
});
const instrumentSelect=$('instrument');
NotationModule.instruments().forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=item.label;instrumentSelect.appendChild(option)});
instrumentSelect.value='violin';
function render(){try{notation.loadABC(abc.value);const current=notation.getInstrument();if(current)instrumentSelect.value=current.id}catch(e){status.textContent='Fehler: '+e.message}}
function persist(){try{localStorage.setItem(ABC_STORAGE_KEY,abc.value)}catch(_){}}
function showScale(){ $('scaleValue').textContent=Math.round(notation.getScale()*100)+' %'; }
function changeScale(delta){const scale=notation.setScale(notation.getScale()+delta);try{localStorage.setItem(SCALE_STORAGE_KEY,String(scale))}catch(_){}showScale();}
function selectScoreFromEditor(){
  const start=abc.selectionStart,end=abc.selectionEnd;
  if(notation.selectFromABC(start,end))status.textContent='Note zur ABC-Auswahl markiert.';
}
abc.addEventListener('input',()=>{persist();clearTimeout(window.__renderTimer);window.__renderTimer=setTimeout(render,180)});
abc.addEventListener('select',selectScoreFromEditor);
abc.addEventListener('keyup',selectScoreFromEditor);
abc.addEventListener('click',selectScoreFromEditor);
instrumentSelect.onchange=()=>{try{const item=notation.setInstrument(instrumentSelect.value);abc.value=notation.getABC();persist();status.textContent=item.label+' gewählt.'}catch(e){status.textContent='Instrumentenfehler: '+e.message}};
$('scaleDown').onclick=()=>changeScale(-0.1);
$('scaleUp').onclick=()=>changeScale(0.1);
$('play').onclick=()=>notation.play().catch(e=>status.textContent='Wiedergabefehler: '+e.message);
$('stop').onclick=()=>notation.stop();
$('print').onclick=()=>notation.print();
function downloadBlob(blob,name){const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000)}
$('loadABC').onclick=()=>$('abcFile').click();
$('abcFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{abc.value=await file.text();persist();render();status.textContent='ABC-Datei importiert.'}catch(err){status.textContent='Importfehler: '+err.message}finally{e.target.value=''}};
$('saveABC').onclick=()=>downloadBlob(new Blob([notation.getABC()],{type:'text/vnd.abc;charset=utf-8'}),'partitur.abc');
$('saveMIDI').onclick=()=>{try{const midi=notation.exportMIDI();downloadBlob(midi,'partitur.mid');status.textContent='MIDI-Datei erzeugt.'}catch(err){status.textContent='MIDI-Exportfehler: '+err.message}};
$('resetABC').onclick=()=>{abc.value=defaultABC;try{localStorage.removeItem(ABC_STORAGE_KEY)}catch(_){}render()};
showScale();
render();