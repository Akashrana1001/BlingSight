# SightGuide - AI-Powered Visual Assistant for the Blind

SightGuide is a MERN stack web application designed to assist visually impaired users by detecting objects in real-time, providing voice feedback, and managing emergency contacts.

## Features

- **Real-Time Object Detection**: Uses TensorFlow.js (coco-ssd) to identify objects via camera.
- **Voice Output**: Speaks detected objects and warnings.
- **Danger Detection**: Alerts users of dangerous objects (cars, knives, etc.) with speech and vibration.
- **Voice Commands**: Control the app using voice ("Identify", "Help", "History").
- **Guardian Dashboard**: Manage emergency contacts and view detection history.
- **Accessibility**: High contrast UI (Black/Yellow), large buttons, screen reader friendly.

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS, TensorFlow.js, Web Speech API.
- **Backend**: Node.js, Express, MongoDB, JWT Authentication.

## Prerequisites

- Node.js (v16+)
- MongoDB (running locally or URI)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sightguide
```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   Copy `.env.example` to `.env` and update values.
   ```bash
   cp .env.example .env
   ```

   **Required Variables:**
   - `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/sightguide`).
   - `JWT_SECRET`: A secret key for authentication.
   - `PORT`: 5000 (default).

4. Seed the Database:
   This creates a demo user and sample data.
   ```bash
   npm run seed
   ```
   **Demo Credentials:**
   - Email: `demo@sightguide.com`
   - Password: `password123`

5. Start the Server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```

   **Required Variables:**
   - `VITE_API_URL`: URL of the backend API (e.g., `http://localhost:5000/api`).

4. Start the Client:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

## Usage Guide

1. **Login**: Use `demo@sightguide.com` / `password123`.
2. **Camera Permission**: Allow camera access when prompted.
3. **Microphone Permission**: Allow microphone access for voice commands.
4. **Navigation**: Use the bottom bar to switch between Camera, Contacts, and History.

### Voice Commands

Click the "Microphone" button or just speak if continuous listening is enabled (implementation specific).

- **"Identify"**: Reads out currently detected objects.
- **"Help"**: Reads instructions.
- **"History"**: Reads the last 3 detected objects.

### Danger Alerts

If a dangerous object (e.g., "car", "knife") is detected, the app will:
- Speak "Warning! [Object] detected".
- Vibrate the device (on supported mobile devices).

## Troubleshooting

- **Camera not working**: Ensure you are on HTTPS or localhost. Browsers block camera on insecure HTTP.
- **Voice not working**: Ensure volume is up and permissions are granted.
- **Database error**: Ensure MongoDB is running.
