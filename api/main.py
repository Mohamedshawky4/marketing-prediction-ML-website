from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and metadata
model_bundle = None

def load_model():
    global model_bundle
    try:
        model_path = os.path.join(os.path.dirname(__file__), "..", "model_bundle.joblib")
        if not os.path.exists(model_path):
            # Fallback for different directory structures
            model_path = "best_model_bundle.joblib"
        model_bundle = joblib.load(model_path)
        print("Model bundle loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.on_event("startup")
async def startup_event():
    load_model()

class PredictionRequest(BaseModel):
    # Core numerical features
    age: int
    balance: float
    day: int
    duration: int
    campaign: int
    pdays: int
    previous: int
    # Categorical features (strings)
    job: str
    marital: str
    education: str
    default: str
    housing: str
    loan: str
    contact: str
    month: str
    poutcome: str

@app.post("/predict")
async def predict(req: PredictionRequest):
    if model_bundle is None:
        load_model()
        if model_bundle is None:
            raise HTTPException(status_code=500, detail="Model not loaded. Please run the notebook cells first.")
    
    try:
        # 1. Create a dictionary from request
        data = req.dict()
        df = pd.DataFrame([data])
        
        # 2. Mirror Notebook Logic: Preprocessing & Engineering
        # Binary
        for col in ['default', 'housing', 'loan']:
            df[col] = (df[col].str.lower() == 'yes').astype(int)
            
        # Ordinal
        edu_map = {'unknown':0, 'primary':1, 'secondary':2, 'tertiary':3}
        df['education'] = df['education'].str.lower().map(edu_map).fillna(0)
        
        # Engineering
        df['never_contacted'] = (df['pdays'] == -1).astype(int)
        # Note: log transformation needs the minimum balance from training, we'll use a safe constant
        # In a real app, we'd store the training min_balance in metadata
        train_min_balance = -6847 # Based on bank.csv EDA
        df['balance_log'] = np.log1p(df['balance'] - train_min_balance + 1)
        df['duration_log'] = np.log1p(df['duration'])
        df['success_potential'] = (df['poutcome'].str.lower() == 'success').astype(int) * df['duration']
        
        seasons = {'jan':'Winter','feb':'Winter','mar':'Spring','apr':'Spring','may':'Spring',
                   'jun':'Summer','jul':'Summer','aug':'Summer','sep':'Autumn','oct':'Autumn',
                   'nov':'Autumn','dec':'Winter'}
        df['season'] = df['month'].str.lower().map(seasons).fillna('Spring')
        
        # 3. Create Feature Vector (One-Hot Encoding)
        # We need to align with exactly the same columns as the model
        nominal_cols = ['job', 'marital', 'contact', 'poutcome', 'season']
        # We drop 'month' as it's not in the feature list
        df_encoded = pd.get_dummies(df.drop('month', axis=1), columns=nominal_cols)
        
        # Ensure all columns from training are present
        final_cols = model_bundle['features']
        for col in final_cols:
            if col not in df_encoded.columns:
                df_encoded[col] = 0
        
        # Reorder columns to match training
        df_vector = df_encoded[final_cols]
        
        # 4. Scale
        X_scaled = model_bundle['scaler'].transform(df_vector)
        
        # 5. Predict
        probs = model_bundle['model'].predict_proba(X_scaled)[0]
        prediction = int(model_bundle['model'].predict(X_scaled)[0])
        confidence = float(max(probs))
        
        return {
            "prediction": "Yes" if prediction == 1 else "No",
            "confidence": confidence,
            "probabilities": {
                "No": float(probs[0]),
                "Yes": float(probs[1])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
