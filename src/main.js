import { AudioController } from "./audio.js";
import { MilkdropLayer } from "./milkdropLayer.js";

const fileInput = document.getElementById("audio-file");
const audioPlayer = document.getElementById("audio-player");
const btnChange = document.getElementById("btn-change-preset");
const canvas = document.getElementById("visualizer-canvas");

const audioCtrl = new AudioController();
const milkdrop = new MilkdropLayer(canvas);

let isAnimating = false;

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const { context, source } = await audioCtrl.setupAudio(file, audioPlayer);

  milkdrop.init(context, source);

  audioPlayer.play();

  if (!isAnimating) {
    isAnimating = true;
    loop();
  }
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
