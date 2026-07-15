"use client";

import { FormEvent, useEffect, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { RadioGroup } from "@/components/RadioGroup";
import { ComprehensionFlow } from "@/components/study/ComprehensionFlow";
import { PreferenceFlow } from "@/components/study/PreferenceFlow";
import { AUDIO_SPEED_OPTIONS, STORAGE_KEY } from "@/lib/config";
import { preferenceStimuli } from "@/lib/stimuli";
import { saveResultToFirebase } from "@/lib/saveResult";
import { ParticipantProfile, SequenceGroup, StudyState } from "@/types/study";

const participant: ParticipantProfile = { participantId: "", sequenceGroup: "A", visionBackground: "", visionSelfDescribe: "", screenReader: "", screenReaderOther: "", imageDescriptionExperience: "" };
const initial: StudyState = { phase: "welcome", testMode: false, participant, selectedAudioSpeed: 1, selectedVoiceURI: "", comprehensionIndex: 0, preferenceIndex: 0, comprehensionResponses: [], workloadResponse: null, preferenceResponses: [], startedAt: new Date().toISOString() };
const sample = "A person stands near a table in the foreground. Behind the table, a window and several objects help define the room.";
const workloadLabels = ["Very low", "Low", "Moderate", "High", "Very high"];

export function StudyApp() {
  const [state, setState] = useState<StudyState>(initial);
  const updateState = (patch: Partial<StudyState>) => setState((s) => ({ ...s, ...patch }));
  useEffect(() => { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { try { setState({ ...initial, ...JSON.parse(raw) }); } catch {} } }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); window.scrollTo({ top: 0, behavior: "auto" }); }, [state]);
  const reset = () => { localStorage.removeItem(STORAGE_KEY); setState({ ...initial, startedAt: new Date().toISOString() }); };

  return <main id="main-content" className="container"><header className="site-header"><p className="eyebrow">BLV Image Description Study</p><h1>Accessible User Study Interface</h1></header>
    {state.testMode && <p className="warning" role="status">TEST MODE ACTIVE. Saved records are marked testMode: true.</p>}
    {state.phase === "welcome" && <section className="panel"><h2>Welcome</h2><p>Listen to image descriptions and answer questions about what you understood. Later, compare three descriptions of the same image.</p><div className="button-row"><AccessibleButton onClick={() => updateState({ phase: "setup", testMode: false })}>Start study</AccessibleButton><AccessibleButton variant="secondary" onClick={() => updateState({ phase: "comprehension", testMode: true, participant: { ...participant, participantId: `TEST_${Date.now()}` }, comprehensionIndex: 0, preferenceIndex: 0, comprehensionResponses: [], preferenceResponses: [], workloadResponse: null })}>Start test mode</AccessibleButton></div></section>}
    {state.phase === "setup" && <Setup state={state} updateState={updateState} />}
    {state.phase === "audio-settings" && <Audio state={state} updateState={updateState} />}
    {state.phase === "practice" && <Practice state={state} updateState={updateState} />}
    {state.phase === "comprehension" && <ComprehensionFlow key={state.comprehensionIndex} state={state} updateState={updateState} />}
    {state.phase === "workload" && <Workload state={state} updateState={updateState} />}
    {state.phase === "preference" && <PreferenceFlow key={state.preferenceIndex} state={state} updateState={updateState} />}
    {state.phase === "interview" && <Interview updateState={updateState} />}
    {state.phase === "complete" && <Complete state={state} reset={reset} />}
  </main>;
}

function Setup({ state, updateState }: { state: StudyState; updateState: (p: Partial<StudyState>) => void }) {
  const p = state.participant; const change = (x: Partial<ParticipantProfile>) => updateState({ participant: { ...p, ...x } });
  return <form className="panel" onSubmit={(e) => { e.preventDefault(); updateState({ phase: "audio-settings" }); }}><h2>Participant Setup</h2>
    <label className="field-label">Participant ID<input required value={p.participantId} onChange={(e) => change({ participantId: e.target.value })} /></label>
    <RadioGroup legend="Researcher sequence group" name="sequenceGroup" value={p.sequenceGroup} onChange={(v) => change({ sequenceGroup: v as SequenceGroup })} options={["A", "B", "C"].map((x) => ({ value: x, label: `Group ${x}` }))} required />
    <RadioGroup legend="Vision background" name="visionBackground" value={p.visionBackground} onChange={(v) => change({ visionBackground: v })} options={[{value:"blind",label:"Blind"},{value:"low-vision",label:"Low vision"},{value:"legally-blind",label:"Legally blind"},{value:"self-describe",label:"Prefer to self-describe"},{value:"prefer-not",label:"Prefer not to say"}]} required />
    <RadioGroup legend="Screen reader use" name="screenReader" value={p.screenReader} onChange={(v) => change({ screenReader: v })} options={["NVDA","JAWS","VoiceOver","TalkBack","Other","None"].map((x) => ({ value:x,label:x }))} required />
    <RadioGroup legend="Image-description experience" name="experience" value={p.imageDescriptionExperience} onChange={(v) => change({ imageDescriptionExperience:v })} options={["rarely","sometimes","often","very-often"].map((x) => ({value:x,label:x}))} required />
    <AccessibleButton type="submit">Continue to audio setup</AccessibleButton></form>;
}

function Audio({ state, updateState }: { state: StudyState; updateState: (p: Partial<StudyState>) => void }) {
  return <section className="panel"><h2>Audio Setup</h2><p>Play the sample, then choose a comfortable speed. The selected speed stays fixed during the study.</p><AudioDescriptionPlayer description={sample} speed={state.selectedAudioSpeed} voiceURI="" mode="sample" label="sample description" /><RadioGroup legend="Preferred audio speed" name="audioSpeed" value={String(state.selectedAudioSpeed)} onChange={(v) => updateState({ selectedAudioSpeed:Number(v) })} options={AUDIO_SPEED_OPTIONS.map((x) => ({value:String(x),label:`${x} times speed`}))} /><AccessibleButton onClick={() => updateState({ phase:"practice" })}>Continue to practice</AccessibleButton></section>;
}

function Practice({ state, updateState }: { state: StudyState; updateState: (p: Partial<StudyState>) => void }) {
  return <section className="panel"><h2>Practice Trial</h2><AudioDescriptionPlayer description={sample} speed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} mode="practice" label="practice description" maxReplays={1} /><label className="field-label">Practice response<textarea rows={4} /></label><div className="button-row"><AccessibleButton onClick={() => updateState({phase:"comprehension",comprehensionIndex:0,comprehensionResponses:[]})}>Start real study</AccessibleButton><AccessibleButton variant="secondary" onClick={() => updateState({phase:"audio-settings"})}>Change speed</AccessibleButton></div></section>;
}

function Workload({ state, updateState }: { state: StudyState; updateState: (p: Partial<StudyState>) => void }) {
  const [mentalDemand,setMentalDemand]=useState<number|null>(null); const [effort,setEffort]=useState<number|null>(null); const [frustration,setFrustration]=useState<number|null>(null);
  const submit=(e:FormEvent)=>{e.preventDefault();updateState({workloadResponse:{participantId:state.participant.participantId,sequenceGroup:state.participant.sequenceGroup,testMode:state.testMode,selectedAudioSpeed:state.selectedAudioSpeed,selectedVoiceURI:state.selectedVoiceURI,submittedAt:new Date().toISOString(),mentalDemand,effort,frustration},phase:preferenceStimuli.length?"preference":"interview"});};
  return <form className="panel" onSubmit={submit}><h2>Overall Workload Questions</h2>{[["How mentally demanding was this task?",mentalDemand,setMentalDemand,"mental"],["How much effort did you need?",effort,setEffort,"effort"],["How frustrated did you feel?",frustration,setFrustration,"frustration"]] .map(([q,v,setter,name]) => <LikertScale key={name as string} legend={q as string} name={name as string} value={v as number|null} onChange={setter as (n:number)=>void} labels={workloadLabels} />)}<AccessibleButton type="submit">Continue</AccessibleButton></form>;
}

function Interview({ updateState }: { updateState:(p:Partial<StudyState>)=>void }) { return <section className="panel"><h2>Final Interview Questions</h2><ol className="question-list"><li>Which descriptions helped you understand the image best?</li><li>Did the order of information affect how you built the image in your mind?</li><li>Were spatial descriptions helpful, confusing, or unnecessary?</li><li>Were semantic groupings helpful, confusing, or unnecessary?</li><li>What spatial or orientation details were missing?</li><li>Did any description feel too long or hard to follow?</li><li>In real use, what kind of image description would you prefer?</li></ol><AccessibleButton onClick={()=>updateState({phase:"complete"})}>Continue to save page</AccessibleButton></section>; }

function Complete({ state, reset }: { state:StudyState; reset:()=>void }) { const [status,setStatus]=useState(""); const save=async()=>{setStatus("Saving...");try{const r=await saveResultToFirebase(state);setStatus(`Saved as ${r.documentId}.`);}catch(e){setStatus(e instanceof Error?e.message:"Save failed.");}}; return <section className="panel"><h2>Study Complete</h2><p>Participant ID: {state.participant.participantId}</p><p>Comprehension responses: {state.comprehensionResponses.length}</p><p>Preference responses: {state.preferenceResponses.length}</p><p>Mode: {state.testMode?"Test":"Study"}</p><div className="button-row"><AccessibleButton onClick={save}>Save result</AccessibleButton><AccessibleButton variant="danger" onClick={reset}>Clear session and restart</AccessibleButton></div>{status&&<p role="status">{status}</p>}</section>; }
