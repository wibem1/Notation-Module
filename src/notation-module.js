// Notation Module v0.1.8 — app-independent ABC rendering/playback core.
export class NotationModule {
  constructor({paper,onStatus=()=>{},scale=1}={}){this.paper=paper;this.onStatus=onStatus;this.abc='';this.visualObj=null;this.synth=null;this.audioContext=null;this.revision=0;this.scale=scale;}
  loadABC(abc){if(typeof abc!=='string'||!abc.trim())throw new Error('ABC-Text fehlt.');this.stop(false);this.synth=null;this.abc=abc;this.revision++;return this.render();}
  getABC(){return this.abc;}
  getScale(){return this.scale;}
  setScale(scale){const value=Math.max(0.6,Math.min(1.6,Number(scale)||1));this.scale=Math.round(value*10)/10;if(this.abc)this.render();return this.scale;}
  render(){
    if(!window.ABCJS)throw new Error('abcjs ist nicht geladen.');
    const el=typeof this.paper==='string'?document.getElementById(this.paper):this.paper;
    const panel=el?.closest('.scorePanel');
    const available=Math.max(320,Math.floor((panel?.clientWidth||el?.clientWidth||800)-30));
    // abcjs scale is an engraving scale, not CSS/browser zoom. Keep the final page width fixed:
    // the unscaled staff width shrinks as notation size grows, so abcjs must reflow the measures.
    const horizontalPadding=70;
    const staffwidth=Math.max(220,Math.floor((available-horizontalPadding)/this.scale));
    const out=window.ABCJS.renderAbc(this.paper,this.abc,{
      add_classes:true,
      scale:this.scale,
      staffwidth,
      wrap:{minSpacing:1.8,maxSpacing:2.7,preferredMeasuresPerLine:4,lastLineLimit:2}
    });
    this.visualObj=out[0]||null;
    this.onStatus(this.visualObj?'Partitur gerendert.':'Keine Partitur erzeugt.');
    return this.visualObj;
  }
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