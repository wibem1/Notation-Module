// Notation Module v0.1.12 — app-independent ABC rendering/playback core.
export class NotationModule {
  constructor({paper,onStatus=()=>{},scale=1}={}){this.paper=paper;this.onStatus=onStatus;this.abc='';this.visualObj=null;this.synth=null;this.audioContext=null;this.revision=0;this.scale=scale;}
  loadABC(abc){if(typeof abc!=='string'||!abc.trim())throw new Error('ABC-Text fehlt.');this.stop(false);this.synth=null;this.abc=abc;this.revision++;return this.render();}
  getABC(){return this.abc;}
  static instruments(){
    return [
      {id:'piano',label:'Klavier',program:0},
      {id:'violin',label:'Violine',program:40},
      {id:'viola',label:'Viola',program:41},
      {id:'cello',label:'Violoncello',program:42},
      {id:'contrabass',label:'Kontrabass',program:43},
      {id:'flute',label:'Flöte',program:73},
      {id:'oboe',label:'Oboe',program:68},
      {id:'clarinet',label:'Klarinette',program:71},
      {id:'bassoon',label:'Fagott',program:70},
      {id:'trumpet',label:'Trompete',program:56},
      {id:'horn',label:'Horn',program:60}
    ];
  }
  setInstrument(id){
    const instrument=NotationModule.instruments().find(x=>x.id===id);
    if(!instrument)throw new Error('Unbekanntes Instrument.');
    const lines=this.abc.split('\n').filter(line=>!/^%%MIDI program\s+/i.test(line));
    const v=lines.findIndex(line=>/^V:1(?:\s|$)/.test(line));
    if(v<0)throw new Error('Stimme V:1 fehlt.');
    lines[v]=lines[v].replace(/\s+(?:name|nm|subname|snm)="[^"]*"/gi,'')+` name="${instrument.label}"`;
    lines.splice(v,0,`%%MIDI program ${instrument.program}`);
    this.loadABC(lines.join('\n'));
    return instrument;
  }
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
    // abcjs wrap copies the first-system voice title to generated systems.
    // Keep only the first rendered voice label; do not alter ABC or audio data.
    const voiceNames=el?.querySelectorAll('.abcjs-voice-name')||[];
    voiceNames.forEach((node,index)=>{if(index>0)node.remove();});
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