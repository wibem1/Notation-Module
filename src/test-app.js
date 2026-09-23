import {NotationModule} from './notation-module.js?v=0.1.2';
const $=id=>document.getElementById(id), status=$('status'), abc=$('abc');
const STORAGE_KEY='notation-module.test-app.abc';
const defaultABC=abc.value;
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)abc.value=saved}catch(_){}
const notation=new NotationModule({paper:'paper',onStatus:t=>status.textContent=t});
function render(){try{notation.loadABC(abc.value)}catch(e){status.textContent='Fehler: '+e.message}}
function persist(){try{localStorage.setItem(STORAGE_KEY,abc.value)}catch(_){}}
$('render').onclick=()=>{persist();render()};
abc.addEventListener('input',()=>{persist();clearTimeout(window.__renderTimer);window.__renderTimer=setTimeout(render,180)});
$('play').onclick=()=>notation.play().catch(e=>status.textContent='Wiedergabefehler: '+e.message);
$('stop').onclick=()=>notation.stop();
$('print').onclick=()=>notation.print();
$('saveABC').onclick=()=>{const blob=new Blob([notation.getABC()],{type:'text/vnd.abc;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='partitur.abc';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('resetABC').onclick=()=>{abc.value=defaultABC;try{localStorage.removeItem(STORAGE_KEY)}catch(_){}render()};
render();