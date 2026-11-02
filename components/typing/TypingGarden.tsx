'use client';
import { useEffect, useRef, useState } from 'react';
import { typingLessons, assessTypingEdit, nextTypingKey, parseTypingProgress, typingAccuracy, typingStars, type LessonId, type TypingProgress } from '@/lib/typing-game';

const PROGRESS_KEY = 'khmerone-typing-stars-v1';
type Phase = 'ready' | 'playing' | 'paused' | 'round' | 'finished';
const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm,.'];
const fingers: Record<string, string> = { q:'Left little finger',a:'Left little finger',z:'Left little finger',w:'Left ring finger',s:'Left ring finger',x:'Left ring finger',e:'Left middle finger',d:'Left middle finger',c:'Left middle finger',r:'Left index finger',f:'Left index finger',v:'Left index finger',t:'Left index finger',g:'Left index finger',b:'Left index finger',y:'Right index finger',h:'Right index finger',n:'Right index finger',u:'Right index finger',j:'Right index finger',m:'Right index finger',i:'Right middle finger',k:'Right middle finger',',':'Right middle finger',o:'Right ring finger',l:'Right ring finger','.':'Right ring finger',p:'Right little finger',' ':'Either thumb' };

function Plant({ grown }: {grown:boolean}) {
  return <svg viewBox="0 0 60 76" aria-hidden="true" className={grown?'tg-plant grown':'tg-plant'}><path d="M18 55h24l-4 17H22z" fill={grown?'#d98155':'#d9d7c9'}/><path d="M15 53h30v7H15z" fill={grown?'#b8613d':'#c6c7b8'}/><path d="M30 54V25" stroke={grown?'#397a4f':'#adb8a1'} strokeWidth="4" strokeLinecap="round"/><path d="M29 43C12 43 12 28 14 27c13-1 18 8 15 16M31 35c0-15 12-21 17-19 2 13-6 20-17 19" fill={grown?'#71a765':'#c2cbb8'}/>{grown&&<><circle cx="30" cy="17" r="9" fill="#efbb54"/><circle cx="30" cy="17" r="4" fill="#96582f"/></>}</svg>;
}

export function TypingGarden() {
  const [lessonId,setLessonId]=useState<LessonId>('keys');
  const [phase,setPhase]=useState<Phase>('ready');
  const [round,setRound]=useState(0),[value,setValue]=useState('');
  const [attempts,setAttempts]=useState(0),[mistakes,setMistakes]=useState(0);
  const [notice,setNotice]=useState('');
  const [progress,setProgress]=useState<TypingProgress>({});
  const [storageNote,setStorageNote]=useState('');
  const [khmer,setKhmer]=useState(false),[hints,setHints]=useState(true);
  const input=useRef<HTMLInputElement>(null),nextButton=useRef<HTMLButtonElement>(null),resumeButton=useRef<HTMLButtonElement>(null);
  const lesson=typingLessons.find(item=>item.id===lessonId)!;
  const target=lesson.prompts[round] as string;
  const expected=nextTypingKey(value,target);
  const capital=/^[A-Z]$/.test(expected);
  const completed=phase==='finished'?lesson.prompts.length:round+(phase==='round'?1:0);
  const accuracy=typingAccuracy(attempts,mistakes);
  const wrong=value.length>0&&!target.startsWith(value);
  const active=phase==='playing'||phase==='paused'||phase==='round';
  const say=(en:string,km:string)=>khmer?km:en;

  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Read device-only stars after hydration.
    try{setProgress(parseTypingProgress(localStorage.getItem(PROGRESS_KEY)));}catch{setStorageNote('Stars cannot be saved in this browser. You can still play.');}
  },[]);
  useEffect(()=>{
    if(phase==='playing')input.current?.focus();
    else if(phase==='round')nextButton.current?.focus();
    else if(phase==='paused')resumeButton.current?.focus();
  },[phase,round]);
  useEffect(()=>{
    if(phase!=='playing')return;
    const pause=()=>setPhase('paused');
    const visibility=()=>{if(document.hidden)pause();};
    window.addEventListener('blur',pause);document.addEventListener('visibilitychange',visibility);
    return()=>{window.removeEventListener('blur',pause);document.removeEventListener('visibilitychange',visibility);};
  },[phase]);

  function start(id:LessonId=lessonId){setLessonId(id);setRound(0);setValue('');setAttempts(0);setMistakes(0);setNotice('');setPhase('playing');window.dispatchEvent(new Event('khmerone:narration-start'));}
  function choose(id:LessonId){setLessonId(id);setPhase('ready');setRound(0);setValue('');setAttempts(0);setMistakes(0);setNotice('');}
  function update(next:string){
    if(phase!=='playing')return;
    const edit=assessTypingEdit(value,next,target);
    if(edit.issue){setNotice(edit.issue==='english'?say('Switch your keyboard to English (ABC).','សូមប្ដូរក្ដារចុចទៅភាសាអង់គ្លេស (ABC)។'):edit.issue==='paste'?say('Type one key at a time. You can do it!','វាយម្ដងមួយគ្រាប់ចុច។ អ្នកអាចធ្វើបាន!'):say('Use Backspace to fix the highlighted letter.','ប្រើ Backspace ដើម្បីកែអក្សរ។'));return;}
    setValue(edit.value);setAttempts(a=>a+edit.attempts);setMistakes(m=>m+edit.mistakes);setNotice('');
    if(edit.value===target){setPhase('round');setNotice(say('You grew a plant! Nice work.','អ្នកបានដាំរុក្ខជាតិមួយ! ល្អណាស់។'));}
  }
  function next(){
    if(round+1<lesson.prompts.length){setRound(r=>r+1);setValue('');setNotice('');setPhase('playing');return;}
    const stars=typingStars(accuracy),saved={...progress,[lessonId]:Math.max(progress[lessonId]||0,stars)};
    setProgress(saved);setPhase('finished');setNotice('');
    try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(saved));}catch{setStorageNote('Your garden is complete, but this browser could not save the stars.');}
  }
  const hint=expected==='Backspace'?say('Press Backspace to fix the mistake.','ចុច Backspace ដើម្បីកែកំហុស។'):expected===' '?say('Press the long Space bar.','ចុចគ្រាប់ចុច Space វែង។'):capital?say(`Hold Shift and press ${expected}.`,`ចុច Shift ឱ្យជាប់ ហើយចុច ${expected}។`):expected?say(`Find ${expected.toUpperCase()} on your keyboard.`,`រកអក្សរ ${expected.toUpperCase()} លើក្ដារចុច។`):'';

  return <main className="tg-page">
    <header className="tg-header"><a className="tg-back" href="/">← Khmer One</a><button className="tg-language" aria-pressed={khmer} onClick={()=>setKhmer(k=>!k)}>{khmer?'English instructions':'ការណែនាំជាខ្មែរ'}</button></header>
    <section className="tg-intro"><div><p className="tg-eyebrow">LITTLE KEYS. BIG DISCOVERIES.</p><h1>Keyboard <em>Garden</em><span lang="km">រៀនវាយអក្សរអង់គ្លេស</span></h1><p>{say('Grow a little garden, one word at a time. A gentle English typing game for curious beginners.','ដាំសួនតូចមួយ ដោយវាយម្ដងមួយពាក្យ។ ល្បែងរៀនវាយអក្សរអង់គ្លេសសម្រាប់អ្នកចាប់ផ្ដើម។')}</p></div><div className="tg-intro-art" aria-hidden="true"><span className="tg-sun"/><Plant grown/><span className="tg-art-tag">F + J = your starting place</span></div></section>
    <div className="tg-layout"><aside className="tg-lessons" aria-label="Choose a typing lesson"><h2>{say('Your growing path','ផ្លូវសិក្សារបស់អ្នក')}</h2>{typingLessons.map(item=><button key={item.id} className={item.id===lessonId?'is-selected':''} aria-pressed={item.id===lessonId} disabled={active} onClick={()=>choose(item.id)}><span className="tg-level-number">{item.number}</span><span><strong>{khmer?item.km:item.title}</strong><small>{item.prompts.length} {say('little challenges','លំហាត់តូចៗ')}</small><span className="tg-saved-stars" aria-label={`${progress[item.id]||0} of 3 stars saved`}>{[1,2,3].map(n=><span key={n} className={(progress[item.id]||0)>=n?'earned':''}>★</span>)}</span></span></button>)}<p className="tg-device-note">{say('A computer keyboard is best for practice. On a phone or tablet, tap the typing box to use your keyboard.','ការហាត់លើក្ដារចុចកុំព្យូទ័រល្អបំផុត។ លើទូរសព្ទ ឬថេប្លេត ចុចប្រអប់វាយអក្សរដើម្បីបើកក្ដារចុច។')}</p><p className="tg-privacy">{say('No account. No names. Stars stay on this device.','មិនត្រូវការគណនី ឬឈ្មោះ។ ផ្កាយរក្សាទុកលើឧបករណ៍នេះ។')}</p>{storageNote&&<p role="status">{storageNote}</p>}</aside>
    <section className="tg-play" aria-label="Typing practice"><div className="tg-play-top"><span className="tg-pill">{say('NO TIMER · NO RUSH','គ្មានកំណត់ពេល · កុំប្រញាប់')}</span><span>{String(completed).padStart(2,'0')} / {lesson.prompts.length} {say('grown','ដើម')}</span></div>
    <div className="tg-garden" aria-label={`${completed} of ${lesson.prompts.length} plants grown`}>{lesson.prompts.map((_,i)=><Plant key={i} grown={i<completed}/>)}</div>
    {phase==='ready'?<div className="tg-welcome"><p className="tg-eyebrow">LEVEL {lesson.number}</p><h2>{khmer?lesson.km:lesson.title}</h2><p>{lesson.description}</p><div className="tg-how"><span>1</span><p>{say('Look at the letter or word.','មើលអក្សរ ឬពាក្យ។')}</p><span>2</span><p>{say('Type it in the box. The glowing key is a hint.','វាយក្នុងប្រអប់។ គ្រាប់ចុចភ្លឺជាជំនួយ។')}</p><span>3</span><p>{say('Use Backspace to fix mistakes. Each challenge grows a plant!','ប្រើ Backspace ដើម្បីកែកំហុស។ លំហាត់នីមួយៗធ្វើឱ្យរុក្ខជាតិលូតលាស់!')}</p></div><button className="tg-primary" onClick={()=>start()}>{say('Let’s grow!','ចាប់ផ្ដើម!')} →</button><p className="tg-small">{say('Place your index fingers on F and J. Feel the little bumps.','ដាក់ម្រាមដៃចង្អុលលើ F និង J។ ស្ទាបរកពកតូចៗ។')}</p></div>:
    phase==='finished'?<div className="tg-finish" aria-live="polite"><div className="tg-big-stars" aria-label={`${typingStars(accuracy)} stars earned`}>{[1,2,3].map(n=><span className={n<=typingStars(accuracy)?'earned':''} key={n}>★</span>)}</div><h2>{say('Look what you grew!','មើលអ្វីដែលអ្នកបានដាំ!')}</h2><p>{say('A whole garden of practice. Every try helps your fingers learn.','សួនមួយពេញដោយការហាត់។ ការព្យាយាមរាល់ដងជួយម្រាមដៃអ្នករៀន។')}</p><div className="tg-results"><div><strong>{lesson.prompts.length}</strong><span>{say('challenges completed','លំហាត់បានបញ្ចប់')}</span></div><div><strong>{accuracy}%</strong><span>{say('accuracy','ភាពត្រឹមត្រូវ')}</span></div></div><p className="tg-small">{say('3 stars: 95% accuracy · 2 stars: 80% · 1 star: finishing. Corrected mistakes still count, and your best stars stay saved.','ផ្កាយ ៣៖ ត្រឹមត្រូវ ៩៥% · ផ្កាយ ២៖ ៨០% · ផ្កាយ ១៖ បញ្ចប់។ កំហុសដែលបានកែនៅតែត្រូវបានរាប់។')}</p><div className="tg-actions"><button className="tg-primary" onClick={()=>start()}>{say('Grow again','ហាត់ម្ដងទៀត')}</button>{lessonId!=='sentences'&&<button onClick={()=>choose(typingLessons[typingLessons.findIndex(l=>l.id===lessonId)+1].id)}>{say('Next lesson','មេរៀនបន្ទាប់')} →</button>}</div></div>:
    <div className="tg-challenge"><p className="tg-eyebrow">{say('TYPE THIS','វាយអក្សរនេះ')}</p><div className="tg-target"><span className="tg-sr-only" id="tg-target-text">Type: {target}</span><span className="tg-target-visual" aria-hidden="true">{Array.from(target).map((char,i)=><span key={i} className={i<value.length?(char===value[i]?'is-correct':'is-wrong'):i===value.length?'is-next':''}>{char===' '?<span className="tg-space">␣</span>:char}</span>)}</span></div><label className="tg-input-label" htmlFor="tg-input">{say('Your typing','អក្សររបស់អ្នក')}</label><input id="tg-input" ref={input} className={wrong?'tg-input has-error':'tg-input'} value={value} onChange={e=>update(e.target.value)} disabled={phase!=='playing'} aria-invalid={wrong} aria-describedby="tg-target-text tg-hint tg-message" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="text" lang="en" onPaste={e=>{e.preventDefault();setNotice(say('Try typing it yourself, one key at a time.','សាកវាយដោយខ្លួនឯង ម្ដងមួយគ្រាប់ចុច។'));}} onDrop={e=>e.preventDefault()} onKeyDown={e=>{if(e.repeat)e.preventDefault();if(e.key==='Escape'){e.preventDefault();setPhase('paused');}}} onBlur={()=>{if(phase==='playing')setPhase('paused');}}/>
    <p className="tg-hint" id="tg-hint">{phase==='playing'?(wrong?hint:hints?hint:say('Take your time. Check each letter.','កុំប្រញាប់។ ពិនិត្យអក្សរនីមួយៗ។')):phase==='paused'?say('Practice paused. Your word is safe.','បានផ្អាកការហាត់។ ពាក្យរបស់អ្នកនៅដដែល។'):say('Perfect match! Ready for the next one?','ត្រូវហើយ! ត្រៀមសម្រាប់ពាក្យបន្ទាប់ហើយឬនៅ?')}</p><p id="tg-message" className="tg-message" role="status">{notice}</p>
    {phase==='round'?<button ref={nextButton} className="tg-primary" onClick={next}>{round+1===lesson.prompts.length?say('See my garden','មើលសួនរបស់ខ្ញុំ'):say('Next challenge','លំហាត់បន្ទាប់')} →</button>:phase==='paused'?<button ref={resumeButton} className="tg-primary" onClick={()=>setPhase('playing')}>{say('Keep growing','បន្តការហាត់')} →</button>:<p className="tg-small">{say('Need a break? Press Esc or tap outside the typing box.','ចង់សម្រាក? ចុច Esc ឬចុចក្រៅប្រអប់វាយអក្សរ។')}</p>}
    {hints&&<div className="tg-keyboard" aria-label="English QWERTY keyboard guide"><p>{say('Your keyboard map','ផែនទីក្ដារចុចរបស់អ្នក')}</p>{rows.map((row,i)=><div className="tg-key-row" key={row}>{i===2&&<span className={`tg-key tg-wide ${capital?'lit':''}`}>Shift</span>}{row.split('').map(key=><span key={key} className={`tg-key ${phase==='playing'&&expected.toLowerCase()===key?'lit':''} ${key==='f'||key==='j'?'home-key':''}`}>{key.toUpperCase()}</span>)}{i===0&&<span className={`tg-key tg-wide ${expected==='Backspace'?'lit':''}`}>⌫</span>}</div>)}<div className="tg-key-row"><span className={`tg-key tg-spacebar ${expected===' '?'lit':''}`}>Space</span></div><p className="tg-finger">{capital?'Shift + ':''}{fingers[expected.toLowerCase()]||'Use Backspace to correct a letter.'}</p></div>}
    <div className="tg-actions"><button onClick={()=>{setHints(h=>!h);if(phase==='playing')setPhase('paused');}} aria-pressed={hints}>{hints?say('Hide key hints','លាក់ជំនួយក្ដារចុច'):say('Show key hints','បង្ហាញជំនួយក្ដារចុច')}</button><button onClick={()=>choose(lessonId)}>{say('Choose a lesson','ជ្រើសមេរៀន')}</button></div></div>}
    </section></div><footer className="tg-footer">{say('Small steps count. Stretch your hands, sit comfortably, and celebrate trying.','ការហាត់បន្តិចម្ដងៗមានតម្លៃ។ លាតដៃ អង្គុយឱ្យស្រួល ហើយអបអរការព្យាយាម។')}</footer>
  </main>;
}
