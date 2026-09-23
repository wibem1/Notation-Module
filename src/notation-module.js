// Notation Module v0.1.0 — app-independent ABC rendering/playback core.
export class NotationModule {
  constructor({paper,onStatus=()=>{}}={}){this.paper=paper;this.onStatus=onStatus;this.abc='';this.visualObj=null;this.synth=null;}
  loadABC(abc){if(typeof abc!=='string'||!abc.trim())throw new Error('ABC-Text fehlt.');this.abc=abc;return this.render();}
  getABC(){return this.abc;}
  render(){if(!window.ABCJS)throw new Error('abcjs ist nicht geladen.');const out=window.ABCJS.renderAbc(this.paper,this.abc,{responsive:'resize',add_classes:true});this.visualObj=out[0]||null;this.onStatus(this.visualObj?'Partitur gerendert.':'Keine Partitur erzeugt.');return this.visualObj;}
  async play(){if(!this.visualObj)throw new Error('Keine Partitur geladen.');this.stop();this.synth=new window.ABCJS.synth.CreateSynth();await this.synth.init({visualObj:this.visualObj});await this.synth.prime();this.synth.start();this.onStatus('Wiedergabe läuft.');}
  stop(){try{this.synth?.stop()}catch(_){}this.onStatus('Wiedergabe gestoppt.');}
  print(){window.print();}
}