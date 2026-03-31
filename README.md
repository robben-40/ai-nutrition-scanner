## **NutriScan**
An AI-powered, full-stack mobile application that allows users to track their daily macros simply by taking a picture of their food. 

<img width="290" height="978" alt="IMG_1654" src="https://github.com/user-attachments/assets/e8d65cda-eaff-46b2-8acf-073e3f6836f8" /><img width="290" height="978" alt="IMG_1717" src="https://github.com/user-attachments/assets/2bc36676-b814-4372-bbb0-573a26288e51" /><img width="290" height="978" alt="IMG_1718" src="https://github.com/user-attachments/assets/dfb8076e-e301-4431-b2f9-fec3ae7e6117" />
<img width="290" height="978" alt="IMG_1658" src="https://github.com/user-attachments/assets/fe71b1ea-0c05-40df-a160-c99cf80f90fe" />




Built with React Native, FastAPI, YOLOv8, and Google Gemini


## Features
* **Smart Camera Integration:** Custom built camera interface with gallery upload support.
* **Dual-AI Analysis Pipeline:**
  * Uses a locally hosted YOLOv8 model for rapid object detection and confidence scoring.
  * Falls back to Google Gemini 2.5 Flash for complex nutritional estimation and precise macro breakdowns.
* **Dynamic Portion Scaling:** Instantly recalculates calories, protein, carbs, fat, and sugar based on custom gram inputs.
* **Daily Dashboard:** Tracks daily caloric intake against customizable goals with a visual progress bar and macro grid.
* **Chronological History:** Automatically groups saved meals by date (Today, Yesterday, etc.) using local storage.


## Tech Stack
### **Frontend (Mobile App)**
* **Framework:** React Native / Expo

### **Backend (AI API)**
* **Server:** Python / FastAPI / Uvicorn
* **Computer Vision:** Ultralytics YOLOv8
* **Large Language Model:** Google GenAI SDK (Gemini 2.5 Flash)


## How it works
1. **Capture:** The user takes a photo on the React Native client.
2. **Transmission:** The image is sent via a POST request to the local FastAPI server.
3. **Detection (YOLO):** The server first runs the image through YOLOv8. If recognized, it returns the food class and confidence score.
4. **Estimation (Gemini):** If YOLO fails, the image is passed to Gemini with a strict prompt to return a structured JSON string containing the estimated macros.
5. **Rendering:** The client receives the JSON payload and dynamically renders the interactive Result Screen.
6. **Persistence:** When logged, the data is saved to the device's local SQLite/Dictionary storage via AsyncStorage.
