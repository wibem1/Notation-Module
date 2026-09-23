let currentTune=null;
const file=document.getElementById('file'),abc=document.getElementById('abc'),paper=document.getElementById('paper'),status=document.getElementById('status');
function render(){
  try{
    const out=ABCJS.renderAbc(paper,abc.value,{add_classes:true});
    const tunes=out.length;
    const notes=paper.querySelectorAll('.abcjs-note').length;
    const rests=paper.querySelectorAll('.abcjs-rest').length;
    const bars=paper.querySelectorAll('.abcjs-bar').length;
    const staves=paper.querySelectorAll('.abcjs-staff-wrapper').length;
    const selectable=out.reduce((n,t)=>n+(t?.getSelectableArray?.().filter(x=>x?.abcelem?.el_type==='note').length||0),0);
    const diag='Tunes: '+tunes+' · Noten(SVG): '+notes+' · Noten(Parser): '+selectable+' · Pausen: '+rests+' · Taktstriche: '+bars+' · Systeme: '+staves;
    if(!tunes){status.textContent='Keine Partitur erzeugt. · '+diag;return false}
    if(notes===0&&selectable===0){
      status.textContent='ABC geladen, aber keine Musik interpretiert. · '+diag;
      return false;
    }
    status.textContent='Musik erkannt. · '+diag;
    return true;
  }catch(e){status.textContent='Fehler: '+e.message;return false}
}
file.addEventListener('change',async()=>{const f=file.files&&file.files[0];if(!f)return;try{abc.value=await f.text();render()}catch(e){status.textContent='Importfehler: '+e.message}finally{file.value=''}});
document.getElementById('render').onclick=render;
document.getElementById('export').onclick=()=>{const blob=new Blob([abc.value],{type:'text/vnd.abc;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='file-io-test.abc';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
render();
document.getElementById('midi').addEventListener('click',function(e){
  try{
    if(!currentTune)throw new Error('Keine gerenderte Partitur für MIDI vorhanden.');
    const encoded=ABCJS.synth.getMidiFile(currentTune,{midiOutputType:'encoded',chordsOff:true});
    if(!encoded||typeof encoded!=='string')throw new Error('abcjs hat keine MIDI-Daten erzeugt.');
    this.href=encoded;
    this.download='file-io-test.mid';
    status.textContent='MIDI-Download gestartet.';
  }catch(err){
    e.preventDefault();
    status.textContent='MIDI-Exportfehler: '+err.message;
  }
});
