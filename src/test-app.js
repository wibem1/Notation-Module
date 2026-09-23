import {NotationModule} from './notation-module.js';
const $=id=>document.getElementById(id), status=$('status');
const notation=new NotationModule({paper:'paper',onStatus:t=>status.textContent=t});
function render(){try{notation.loadABC($('abc').value)}catch(e){status.textContent='Fehler: '+e.message}}
$('render').onclick=render;
$('abc').addEventListener('input',()=>{clearTimeout(window.__renderTimer);window.__renderTimer=setTimeout(render,180)});
$('play').onclick=()=>notation.play().catch(e=>status.textContent='Wiedergabefehler: '+e.message);
$('stop').onclick=()=>notation.stop();
$('print').onclick=()=>notation.print();
$('saveABC').onclick=()=>{const blob=new Blob([notation.getABC()],{type:'text/vnd.abc;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='partitur.abc';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
render();