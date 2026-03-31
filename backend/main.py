from fastapi import FastAPI, File, UploadFile, HTTPException
import io
from PIL import Image
import os
from dotenv import load_dotenv
import json
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="AI Nutrition Scanner API")

from ultralytics import YOLO
model_yolo = YOLO(r'models\food_model\weights\best.pt')


with open(r"data\nutrition_db.json", "r") as file:
    nutrition_db = json.load(file)

@app.get("/")
async def root():
    return {"status": "online", "message": "Nutrition Scanner API is running!"}

@app.post("/scan")
async def scan_food(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        results = model_yolo.predict(image)[0]

        top_class_index = results.probs.top1
        yolo_confidence = float(results.probs.top1conf)
        predicted_food = results.names[top_class_index]

        print(f"YOLO thinks this is: {predicted_food} ({yolo_confidence*100:.2f}%)")

        if yolo_confidence >= 0.85:
        
            macros = nutrition_db.get(predicted_food, {
                "calories": 0, 
                "carbs_g": 0,
                "sugar_g": 0, 
                "protein_g": 0, 
                "fat_g": 0
            })

            return {
                "success": True, 
                "source": "yolo", 
                "food_item": predicted_food.replace("_", " ").title(),
                "confidence": yolo_confidence,
                "nutrition": {
                    "calories": macros.get("calories", 0),
                    "carbs": macros.get("carbs_g", 0),
                    "sugar": macros.get("sugar_g", 0),
                    "protein": macros.get("protein_g", 0),
                    "fat": macros.get("fat_g", 0)
                }
            }

        else:
            prompt = """
            Analyze this image and identify the main food item.
            Provide the estimated nutritional information per 100g serving.
            Return ONLY a valid JSON object with this exact structure, do not use markdown formatting:
            {
                "food_name": "name of the food",
                "confidence": 0.0,
                "calories": 0.0,
                "carbs_g": 0.0,
                "sugar_g": 0.0,
                "protein_g": 0.0,
                "fat_g": 0.0
            }
            """
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[prompt, image],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            gemini_data = json.loads(response.text)

            if float(gemini_data.get("confidence", 0.0)) < 0.5:
                print("Failed to recognize food")
                return{
                    "success": False,
                    "message": "We failed to detect the food"
                }

            return {
                "success": True,
                "source": "gemini",
                "food_item": gemini_data.get("food_name", "Unknown Food").title(),
                "confidence": gemini_data.get("confidence", 0),
                "nutrition": {
                    "calories": gemini_data.get("calories", 0),
                    "carbs": gemini_data.get("carbs_g", 0),
                    "sugar": gemini_data.get("sugar_g", 0),
                    "protein": gemini_data.get("protein_g", 0),
                    "fat": gemini_data.get("fat_g", 0)
                }
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# uvicorn main:app --reload


# uvicorn main:app --host 0.0.0.0 --port 8000 --reload