# Reiatsu Visualizer 霊圧

> **A modern audio visualizer heavily inspired by the legendary Winamp and its Milkdrop engine.**


**Reiatsu** (Japanese for "Spiritual Pressure", a reference to the anime *Bleach*) is a cross-platform application that brings the nostalgia of early 2000s music visualization into the modern era. Built with web technologies, it runs seamlessly in the browser, as a Docker container, or as a native desktop application.

##  Features

* **Milkdrop-Style Visuals:** Experience complex, mathematical, and psychedelic rendering that reacts to your music in real-time using Butterchurn.
* **Retro Inspiration:** A tribute to the golden age of media players like Winamp.
* **High-Fidelity Audio Engine:** Pre-loads and decodes audio for stutter-free playback and visualization.
* **Video Recording:** Record your visualizer sessions directly to `.webm` video files to share on social media.
* **Cross-Platform:**
    *  **Web:** Runs in any modern browser.
    *  **Desktop:** Native executable for Windows (via Electron).
    *  **Docker:** Containerized for easy deployment.

##  Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (Version 18 or higher)
* npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pdec5504/Reiatsu.git
    cd reiatsu
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

###  Development Mode (Web)

To run the application in your browser with hot-reloading:

```bash
npm run dev
```

open `http://localhost:5173` to view it

## Building for Desktop (Windows)

Reiatsu uses **Electron** to run as a native desktop app.

To generate the standalone `.exe` installer:

```bash
npm run electron:make
```

## Running with Docker

You can run the application in an isolated container using Docker and Nginx.

Build and Run:

```bash
docker-compose up --build
```

Open `http://localhost:8080` in your browser

## How to use

* Load Audio: Click the file input to select an MP3 or WAV file from your computer.

* Wait for Optimization: The app will decode the audio and compile the shaders (wait for the "PLAYING" status).

* Control: Use the Play/Pause button and the progress bar to control the music.

* Change Visuals: Click "Change Preset" (if available) to cycle through different visual styles.

* Record: The app automatically records the session. When the song ends, you can choose to Save the video file.

## Technologies Used

* Vite: Frontend tooling and bundler.

* Butterchurn: The JavaScript implementation of the Milkdrop visualizer engine.

* Electron: For building the desktop application.

* Docker: For containerization.

* Web Audio API: For audio processing and analysis.
