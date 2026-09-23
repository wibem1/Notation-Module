const file=document.getElementById('file'),abc=document.getElementById('abc'),paper=document.getElementById('paper'),status=document.getElementById('status');
function render(){
  try{
    const out=ABCJS.renderAbc(paper,abc.value,{add_classes:true});
    const tune=out[0];
    if(!tune){status.textContent='Keine Partitur erzeugt.';return false}
    const noteCount=paper.querySelectorAll('.abcjs-note').length;
    const restCount=paper.querySelectorAll('.abcjs-rest').length;
    if(noteCount+restCount===0){
      status.textContent='ABC-Datei geladen, aber abcjs konnte keine Musiknoten oder Pausen daraus erzeugen.';
      return false;
    }
    status.textContent='Notenbild erzeugt: '+noteCount+' Noten, '+restCount+' Pausen.';
    return true;
  }catch(e){status.textContent='Fehler: '+e.message;return false}
}
file.addEventListener('change',async()=>{const f=file.files&&file.files[0];if(!f)return;try{abc.value=await f.text();render()}catch(e){status.textContent='Importfehler: '+e.message}finally{file.value=''}});
document.getElementById('render').onclick=render;
document.getElementById('export').onclick=()=>{const blob=new Blob([abc.value],{type:'text/vnd.abc;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='file-io-test.abc';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
render();