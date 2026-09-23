// Notation Module v0.1.2 — app-independent ABC rendering/playback core.
export class NotationModule {
  constructor({paper,onStatus=()=>{}}={}){this.paper=paper;this.onStatus=onStatus;this.abc='';this.visualObj=null;this.synth=null;this.audioContext=null;this.revision=0;}
  loadABC(abc){if(typeof abc!=='string'||!abc.trim())throw new Error('ABC-Text fehlt.');this.stop(false);this.synth=null;this.abc=abc;this.revision++;return this.render();}
  getABC(){return this.abc;}
  render(){if(!window.ABCJS)throw new Error('abcjs ist nicht geladen.');const out=window.ABCJS.renderAbc(this.paper,this.abc,{responsive:'resize',add_classes:true});this.visualObj=out[0]||null;this.onStatus(this.visualObj?'Partitur gerendert.':'Keine Partitur erzeugt.');return this.visualObj;}
  async play(){
    if(!this.visualObj)throw new Error('Keine Partitur geladen.');
    this.stop(false);
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)throw new Error('AudioContext wird von diesem Browser nicht unterstützt.');
    if(!this.audioContext||this.audioContext.state==='closed')this.audioContext=new AudioContext();
    if(this.audioContext.state!=='running')await this.audioContext.resume();
    const revision=this.revision, visualObj=this.visualObj;
    const synth=new window.ABCJS.synth.CreateSynth();
    this.synth=synth;
    await synth.init({audioContext:this.audioContext,visualObj});
    if(revision!==this.revision||synth!==this.synth)return;
    const primed=await synth.prime();
    if(revision!==this.revision||synth!==this.synth)return;
    if(primed?.status!=='running'&&this.audioContext.state!=='running')await this.audioContext.resume();
    if(revision!==this.revision||synth!==this.synth)return;
    synth.start();
    this.onStatus('Wiedergabe läuft.');
  }
  stop(report=true){try{this.synth?.stop()}catch(_){}if(report)this.onStatus('Wiedergabe gestoppt.');}
  print(){window.print();}
}