# 🚀 StreamSphere: A Low-Latency Video Streaming Platform on Filecoin

StreamSphere is a feature-rich video streaming application built to demonstrate the power and speed of Filecoin's storage network combined with FilCDN for low-latency content delivery. This project provides a full end-to-end experience, from video upload and live streaming to on-demand playback with social engagement features.

**Hackathon:** ⚡️ Build a low latency application using PDP and FilCDN

**Live Demo:** `[Link to your live Angular application]`

## ✨ Features

StreamSphere is more than just a tech demo; it's a complete platform with features that showcase a real-world use case for decentralized storage.

#### Core Video Features
- **🎬 On-Demand Video Upload:** Seamlessly upload video files that are processed, stored on Filecoin, and served via FilCDN.
- **⚡️ Multi-Quality Transcoding:** Videos are available in multiple resolutions (1080p, 720p, 480p) for adaptive streaming based on user bandwidth.
- **🖼️ Automatic Thumbnail Generation:** Thumbnails are automatically generated for a better user experience in video galleries.
- **🔐 Public & Private Videos:** Users can control the visibility of their uploaded content.
- **갤러리 Public Gallery:** A main gallery to browse all public videos on the platform.

#### Live Streaming
- **🔴 Go Live:** Users can start a live stream, with video chunks being uploaded in real-time.
- **📺 Live Playback:** Viewers can watch live streams with low latency.
- **📼 VOD Conversion:** Once a live stream ends, it's automatically converted into a permanent Video-on-Demand (VOD) asset.

#### Social & Engagement
- **❤️ Likes:** Users can like and unlike videos, with real-time count updates.
- **💬 Comments:** A full commenting system allowing users to add and edit their comments on videos.

## ✅ How It Meets the Challenge

This project was architected specifically to meet the core requirements of the hackathon.

1.  **PDP Storage Deal with CDN Enabled:**
    The backend leverages a dedicated service (`src/services/synapse.service.ts`) to handle all file uploads. This service is responsible for creating Perpetual Data Pledge (PDP) deals on the Filecoin network for every video and stream chunk, ensuring data persistence and availability.

2.  **FilCDN Integration:**
    Every piece of content, from the original video files to the HLS stream manifests (`.m3u8`), is served through FilCDN. The application retrieves and uses FilCDN URLs (e.g., `https://*.filcdn.io/...`) for all media playback, demonstrating a seamless and efficient integration for low-latency fetching.

3.  **End-to-End Demo:**
    The platform provides a complete, demonstrable workflow: a user can register, log in, upload a video or start a stream, and that content is immediately available for viewing in the gallery, fetched directly from FilCDN.

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Decentralized Storage:** Filecoin
- **CDN:** FilCDN (via Synapse)
- **Video Processing:** FFmpeg
- **Authentication:** JWT (JSON Web Tokens)

## API Documentation

The backend exposes a RESTful API for all platform functionalities.

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user. |
| `POST` | `/login` | Log in and receive a JWT. |

### Video Management (`/api/videos`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/process` | Upload and process a new video. |
| `GET` | `/gallery` | Get a paginated list of public videos. |
| `GET` | `/my-videos` | Get all videos for the authenticated user. |
| `GET` | `/:videoId` | Get details for a single video. |
| `PATCH` | `/:videoId/metadata` | Update video title, description, etc. |
| `DELETE` | `/:videoId` | Delete a video. |
| `GET`| `/:videoId/quality` | Get a specific video quality stream. |

### Likes & Comments (`/api/videos`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/:videoId/like` | Toggle (like/unlike) a video. |
| `GET` | `/:videoId/likes` | Get the like count for a video. |
| `POST` | `/:videoId/comments` | Add a comment to a video. |
| `GET` | `/:videoId/comments` | Get all comments for a video. |
| `PUT` | `/comments/:commentId` | Edit a specific comment. |

### Live Streaming (`/api/streams`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/start` | Start a new live stream session. |
| `POST` | `/:streamId/upload` | Upload a video chunk to the stream. |
| `POST` | `/:streamId/stop` | Stop the stream and finalize the VOD. |
| `GET` | `/:streamId/live.m3u8`| Get the live HLS manifest for playback. |

## ⚙️ Local Setup

To run the backend service locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ANAVHEOBA/storef
    cd storef
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example `.env.example` file to a new `.env` file and fill in the required values (e.g., Database connection string, JWT secret, Synapse API Key).
    ```bash
    cp .env.example .env
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5000`.



https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba