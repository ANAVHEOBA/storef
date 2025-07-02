# StreamFlow: A Low-Latency Live Streaming Platform

**StreamFlow** is a modern, feature-rich video platform built with Angular, designed to demonstrate the power of decentralized content delivery for low-latency applications. This project is a submission for the **"Build a low latency application using PDP and FilCDN"** hackathon.

It showcases a complete, end-to-end video workflow, supporting both **live streaming** and traditional **Video on Demand (VOD)** uploads, with all video content fetched from Filecoin deals via FilCDN.

---

## Core Features

The application provides a complete, production-ready user experience for both content creators and viewers.

### For Viewers
- **Instant VOD Playback:** Browse a gallery of existing videos that start playing instantly, powered by FilCDN.
- **Live Stream Viewing:** The video player is capable of playing HLS (`.m3u8`) live streams as they are being broadcast.
- **Advanced Interactive Player:**
  - **Like/Unlike Videos:** Engage with content through a simple like system.
  - **Dynamic Commenting System:** A full-featured comments section allows users to add, edit, and delete their own comments in real-time.

### For Creators
- **Secure Authentication:** Full user registration and login system.
- **Creator Dashboard:** A central hub for authenticated users to manage their content, including:
  - **My Videos Page:** A personalized gallery showing only the videos uploaded or streamed by the current user.
- **Two-Path Content Ingestion:** Creators have two distinct ways to get their content onto the platform.
  1. **File-Based VOD Upload:**
     - A dedicated upload page with client-side validation for file type and size.
     - Shows upload progress and status updates as the video is processed by the backend.
  2. **End-to-End Live Streaming:**
     - **Go Live:** A dedicated streaming page allows creators to start their camera and begin broadcasting with a single click.
     - **Real-Time Chunking:** The application uses the browser's `MediaRecorder` API to automatically capture, chunk, and upload the live stream in real-time.
     - **Automatic VOD Creation:** When the stream is stopped, the backend finalizes the video, which becomes immediately available as a permanent VOD.

---

## Fulfilling the Hackathon Challenge

This project directly addresses the core requirements of the hackathon:

- **✅ Low-Latency Application:** Live streaming is a premier example of a low-latency use case. The application demonstrates that the PDP and FilCDN stack is robust enough to handle real-time data delivery for HLS playback.
- **✅ End-to-End Demo:** The workflow is complete. A user can register, log in, upload a pre-recorded video, or start a live stream. Other users can watch the content, and it's all served via FilCDN. This provides a compelling, full-circle demonstration.
- **✅ Required Technologies:** The entire video content lifecycle—from VOD uploads and live stream chunks to permanent VODs—is designed to be served from Filecoin deals through the FilCDN.

---

## Project Structure

The codebase is organized following modern Angular best practices, emphasizing separation of concerns.

- `src/app/features`: Contains the "smart" components that represent different pages or major UI sections (e.g., `live`, `video-player`, `upload`, `dashboard`).
- `src/app/shared`: Contains "dumb" reusable components and services used across multiple features (e.g., `sidebar`).
- `src/lib`: Contains all the API service integrations, cleanly separated by resource. Each folder contains an `api.ts` for the service logic and a `types.ts` for the data models. This includes dedicated services for:
    - `stream`: Handles starting, chunking, and stopping live streams.
    - `upload`: Manages file-based VOD uploads and status checks.
    - `video`: Fetches video gallery and metadata.
    - `myvideo`: Fetches videos for the logged-in user.
    - `comment`: Handles CRUD operations for comments.
    - `like`: Manages liking/unliking videos.
    - `login`, `register`, `profile`: Manages all aspects of user authentication and profiles.

---

## Getting Started

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

### Prerequisites
- Node.js and npm
- Angular CLI: `npm install -g @angular/cli`
- A running instance of the corresponding backend server.

### Development Server

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   ng serve
   ```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
