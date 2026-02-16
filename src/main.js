import { AudioController } from "./audio.js";
import { MilkdropLayer } from "./milkdropLayer.js";
import { Recorder } from "./recorder.js";

const fileInput = document.getElementById("audio-file");
const canvas = document.getElementById("visualizer-canvas");
const titleElement = document.querySelector("h2");

const btnPlayPause = document.getElementById("btn-play-pause");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");
const progressBar = document.getElementById("progress-bar");
const progressThumb = document.getElementById("progress-thumb");
const progressContainer = document.getElementById("progress-container");
const timeCurrentEl = document.getElementById("time-current");
const timeTotalEl = document.getElementById("time-total");

const saveModal = document.getElementById("save-modal");
const btnSave = document.getElementById("btn-save");
const btnDiscard = document.getElementById("btn-discard");
const btnChange = document.getElementById("btn-change-preset");

const audioCtrl = new AudioController();
const milkdrop = new MilkdropLayer(canvas);
const recorder = new Recorder();

let isAnimating = false;
let isLoading = false;
let audioContextRef = null;
let currentSourceNode = null;

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || isLoading) return;

  isLoading = true;
  updateStatus("DECODING AUDIO...");
  btnPlayPause.disabled = true;

  try {
    audioCtrl.stop();

    // Carrega Áudio
    const { context, duration } = await audioCtrl.setupAudio(file);
    audioContextRef = context;

    timeTotalEl.innerText = formatTime(duration);
    timeCurrentEl.innerText = "00:00";
    progressBar.style.width = "0%";
    progressThumb.style.left = "0%";

    const dummySource = context.createOscillator();
    milkdrop.init(context, dummySource);

    updateStatus("COMPILING SHADERS...");
    milkdrop.render();

    setTimeout(() => {
      startPlayback();
      btnPlayPause.disabled = false;
    }, 3000);
  } catch (error) {
    console.error("Erro:", error);
    updateStatus("ERROR ❌");
    isLoading = false;
  }
});

function startPlayback() {
  updateStatus("PLAYING ▶");

  const result = audioCtrl.play();
  if (result) handlePlayState(result.source);

  updatePlayButtonUI(true);
  isLoading = false;
}

function handlePlayState(source) {
  currentSourceNode = source;

  milkdrop.visualizer.connectAudio(source);

  if (!recorder.isRecording) {
    recorder.start(canvas, audioContextRef, source);
  }

  if (!isAnimating) {
    isAnimating = true;
    loop();
  }

  source.onended = () => {
    if (audioCtrl.getCurrentTime() >= audioCtrl.duration - 0.5) {
      console.log("Fim da música.");

      updatePlayButtonUI(false);
      progressBar.style.width = "0%";
      progressThumb.style.left = "0%";
      timeCurrentEl.innerText = "00:00";

      audioCtrl.stop();

      finishRecording();
    }
  };
}

btnPlayPause.addEventListener("click", () => {
  if (audioCtrl.isPlaying) {
    audioCtrl.pause();
    updatePlayButtonUI(false);
    updateStatus("PAUSED ⏸");
  } else {
    const result = audioCtrl.play();
    if (result) handlePlayState(result.source);
    updatePlayButtonUI(true);
    updateStatus("PLAYING ▶");
  }
});

progressContainer.addEventListener("click", (e) => {
  if (!audioCtrl.duration) return;

  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  const newTime = pos * audioCtrl.duration;

  const result = audioCtrl.seek(newTime);

  if (result) {
    handlePlayState(result.source);
    updatePlayButtonUI(true);
  }

  updateProgressBarUI();
});

function loop() {
  requestAnimationFrame(loop);

  milkdrop.render();

  if (audioCtrl.isPlaying) {
    updateProgressBarUI();
  }
}

function updateProgressBarUI() {
  let current = audioCtrl.getCurrentTime();
  const total = audioCtrl.duration;

  if (total > 0) {
    if (current > total) current = total;

    const pct = (current / total) * 100;

    const safePct = Math.min(pct, 100);

    progressBar.style.width = `${safePct}%`;
    progressThumb.style.left = `${safePct}%`;
    timeCurrentEl.innerText = formatTime(current);
  }
}

function updatePlayButtonUI(isPlaying) {
  if (isPlaying) {
    iconPlay.classList.add("hidden");
    iconPause.classList.remove("hidden");
  } else {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

async function finishRecording() {
  updateStatus("PROCESSING VIDEO...");
  await recorder.stop();
  if (saveModal) saveModal.classList.remove("hidden");
  updateStatus("FINISHED");
}

function updateStatus(msg) {
  if (titleElement) {
    if (!titleElement.dataset.original)
      titleElement.dataset.original = titleElement.innerText;
    titleElement.innerText = msg;
    if (!msg.includes("DECODING") && !msg.includes("COMPILING")) {
      setTimeout(() => {
        titleElement.innerText =
          titleElement.dataset.original || "MILKDROP MODE";
      }, 3000);
    }
  }
}

btnSave.addEventListener("click", () => {
  recorder.save();
  closeModal();
});
btnDiscard.addEventListener("click", () => {
  recorder.discard();
  closeModal();
});
function closeModal() {
  if (saveModal) saveModal.classList.add("hidden");
}
btnChange.addEventListener("click", () => milkdrop.loadRandomPreset());
window.addEventListener("resize", () => milkdrop.resize());
