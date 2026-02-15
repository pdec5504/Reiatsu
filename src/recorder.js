export class Recorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.streamDestination = null;
  }

  start(canvas, audioContext, audioSource) {
    if (this.isRecording) return;

    console.log("Recorder: Iniciando captura...");
    this.recordedChunks = [];

    const videoStream = canvas.captureStream(60);

    this.streamDestination = audioContext.createMediaStreamDestination();

    audioSource.connect(this.streamDestination);

    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...this.streamDestination.stream.getAudioTracks(),
    ]);

    const options = { mimeType: "video/webm;codecs=vp9,opus" };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.warn("VP9 não suportado, tentando padrão...");
      delete options.mimeType;
    }

    try {
      this.mediaRecorder = new MediaRecorder(combinedStream, options);
    } catch (e) {
      console.error("Erro ao criar MediaRecorder:", e);
      return;
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
    this.isRecording = true;

    const recIndicator = document.getElementById("rec-indicator");
    if (recIndicator) recIndicator.classList.remove("hidden");
  }

  stop() {
    return new Promise((resolve) => {
      if (!this.isRecording || !this.mediaRecorder) {
        resolve();
        return;
      }

      this.mediaRecorder.onstop = () => {
        console.log("Recorder: Gravação finalizada.");
        this.isRecording = false;
        this.cleanup();
        resolve();
      };

      this.mediaRecorder.stop();

      const recIndicator = document.getElementById("rec-indicator");
      if (recIndicator) recIndicator.classList.add("hidden");
    });
  }

  save() {
    if (this.recordedChunks.length === 0) {
      console.warn("Nada gravado para salvar.");
      return;
    }

    const blob = new Blob(this.recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    a.download = `milkdrop-replay-${timestamp}.webm`;

    a.click();
    window.URL.revokeObjectURL(url);
  }

  discard() {
    this.recordedChunks = [];
    console.log("Recorder: Gravação descartada.");
  }

  cleanup() {
    if (this.streamDestination) {
      this.streamDestination = null;
    }
  }
}
