// Notation Module v0.1.22 — app-independent ABC rendering/playback core.
export class NotationModule {
  constructor({paper,onStatus=()=>{},onSelect=()=>{},scale=1}={}){this.paper=paper;this.onStatus=onStatus;this.onSelect=onSelect;this.abc='';this.visualObj=null;this.synth=null;this.audioContext=null;this.revision=0;this.scale=scale;}
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
    const voiceDefs=(this.abc.match(/^V:[^\n]+/gm)||[]).length;
    const multiStaff=voiceDefs>1;
    // Multi-staff systems need a more conservative target. This avoids an orphaned
    // single-measure final system while still letting abcjs calculate actual fit.
    const preferredMeasuresPerLine=multiStaff?3:4;
    const out=window.ABCJS.renderAbc(this.paper,this.abc,{
      add_classes:true,
      clickListener:(abcelem)=>{if(Number.isInteger(abcelem?.startChar)&&Number.isInteger(abcelem?.endChar)&&abcelem.endChar>abcelem.startChar)this.onSelect({start:abcelem.startChar,end:abcelem.endChar,element:abcelem});},
      scale:this.scale,
      staffwidth,
      wrap:{minSpacing:1.8,maxSpacing:2.7,preferredMeasuresPerLine,lastLineLimit:2}
    });
    this.visualObj=out[0]||null;
    // abcjs wrap copies the first-system voice title to generated systems.
    // Keep only the first rendered voice label; do not alter ABC or audio data.
    const voiceNames=[...(el?.querySelectorAll('.abcjs-voice-name')||[])];
    const voiceCount=Math.max(1,(this.abc.match(/^V:[^\n]+/gm)||[]).length);
    // Keep one label per declared voice in the first system; remove only labels copied by wrap.
    voiceNames.forEach((node,index)=>{if(index>=voiceCount)node.remove();});
    this.onStatus(this.visualObj?'Partitur gerendert.':'Keine Partitur erzeugt.');
    return this.visualObj;
  }
  getInstrument(){
    const match=this.abc.match(/^%%MIDI program\s+(\d+)/mi);
    if(match){const program=Number(match[1]);return NotationModule.instruments().find(x=>x.program===program)||null;}
    return null;
  }
  selectFromABC(start,end=start){
    if(!this.visualObj||!Number.isInteger(start)||!this.visualObj.engraver?.rangeHighlight)return false;
    let from=Math.max(0,start),to=Number.isInteger(end)?Math.max(from,end):from;
    // For a caret (no text selection), resolve the containing musical element first.
    // rangeHighlight itself is designed for text ranges; passing a naked caret can hit boundaries ambiguously.
    if(from===to){
      const elem=this.visualObj.getElementFromChar?.(from);
      if(!elem)return false;
      from=elem.startChar; to=elem.endChar;
    }
    this.visualObj.engraver.rangeHighlight(from,to);
    return true;
  }
  exportMIDI(){
    if(!window.ABCJS?.synth?.getMidiFile)throw new Error('MIDI-Export ist nicht verfügbar.');
    if(!this.visualObj)throw new Error('Keine Partitur geladen.');
    return window.ABCJS.synth.getMidiFile(this.visualObj,{midiOutputType:'binary',chordsOff:true});
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
    await synth.init({audioContext:this.audioContext,visualObj,options:{chordsOff:true}});
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