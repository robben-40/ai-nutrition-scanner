An AI-powered, full-stack mobile application that allows users to track their daily macros simply by taking a picture of their food. 

Built with React Native, FastAPI, YOLOv8, and Google Gemini, **nutri** seamlessly bridges the gap between advanced edge-AI object detection and a sleek, consumer-ready mobile interface.

---

## Features

* **Smart Camera Integration:** Custom built camera interface using `expo-camera` with gallery upload support.
* **Dual-AI Analysis Pipeline:** * Uses a locally hosted **YOLOv8** model for rapid object detection and confidence scoring.
  * Falls back to **Google Gemini 2.5 Flash** for complex nutritional estimation and precise macro breakdowns.
* **Dynamic Portion Scaling:** Instantly recalculates calories, protein, carbs, fat, and sugar based on custom gram inputs.
* **Daily Dashboard:** Tracks daily caloric intake against customizable goals with a visual progress bar and macro grid.
* **Chronological History:** Automatically groups saved meals by date (Today, Yesterday, etc.) using local `AsyncStorage`.
* **Design System:** A fully custom, centralized styling engine with a premium black, white, and neon-accent color palette.

---

## Tech Stack

### **Frontend (Mobile App)**
* **Framework:** React Native / Expo
* **Navigation:** React Navigation (Bottom Tabs & Native Stack)
* **Storage:** `@react-native-async-storage/async-storage`
* **Hardware:** `expo-camera`, `expo-image-picker`

### **Backend (AI API)**
* **Server:** Python / FastAPI / Uvicorn
* **Computer Vision:** Ultralytics YOLOv8
* **Large Language Model:** Google GenAI SDK (Gemini 2.5 Flash)
* **Concurrency:** `asyncio` (for strict API timeouts and thread management)

---

## Architecture & Data Flow

1. **Capture:** The user takes a photo on the React Native client.
2. **Transmission:** The image is sent via a `multipart/form-data` POST request to the local FastAPI server.
3. **Detection (YOLO):** The server first runs the image through YOLOv8. If recognized, it returns the food class and confidence score.
4. **Estimation (Gemini):** If YOLO fails, the image is passed to Gemini with a strict prompt to return a structured JSON string containing the estimated macros.
5. **Rendering:** The client receives the JSON payload and dynamically renders the interactive Result Screen.
6. **Persistence:** When logged, the data is saved to the device's local SQLite/Dictionary storage via AsyncStorage.
