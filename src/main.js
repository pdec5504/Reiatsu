import { AudioController } from "./audio.js";
import { MilkdropLayer } from "./milkdropLayer.js";
import { Recorder } from "./recorder.js";

const fileInput = document.getElementById("audio-file");
const audioPlayer = document.getElementById("audio-player");
const btnChange = document.getElementById("btn-change-preset");
const canvas = document.getElementById("visualizer-canvas");

const saveModal = document.getElementById("save-modal");
const btnSave = document.getElementById("btn-save");
const btnDiscard = document.getElementById("btn-discard");

const audioCtrl = new AudioController();
const milkdrop = new MilkdropLayer(canvas);
const recorder = new Recorder();

let isAnimating = false;
let audioContextRef = null;
let audioSourceRef = null;

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const { context, source } = await audioCtrl.setupAudio(file, audioPlayer);
  audioContextRef = context;
  audioSourceRef = source;

  milkdrop.init(context, source);

  try {
    await audioPlayer.play();
  } catch (e) {}

  if (!isAnimating) {
    isAnimating = true;
    loop();
  }
});

audioPlayer.addEventListener("play", () => {
  if (audioContextRef && audioSourceRef && !recorder.isRecording) {
    recorder.start(canvas, audioContextRef, audioSourceRef);
  }
});

audioPlayer.addEventListener("ended", async () => {
  console.log("Música acabou. Processando gravação...");

  await recorder.stop();

  saveModal.classList.remove("hidden");
});

btnSave.addEventListener("click", () => {
  recorder.save();
  saveModal.classList.add("hidden");
});

btnDiscard.addEventListener("click", () => {
  recorder.discard();
  saveModal.classList.add("hidden");
});

btnChange.addEventListener("click", () => {
  milkdrop.loadRandomPreset();
});

window.addEventListener("resize", () => {
  milkdrop.resize();
});

function loop() {
  requestAnimationFrame(loop);
  milkdrop.render();
}
