# How to Run theWeb App

Follow these steps once you have successfully run the **Ensemble & Export** cell in your notebook (which creates `model_bundle.joblib`).

### 1. Start the Backend (FastAPI)
Open a new terminal and run:
```powershell
# Install requirements if haven't
py -m pip install fastapi uvicorn pydantic joblib pandas numpy

# Run the API
cd "d:/4th year/machine/project/api"
py main.py
```
*The backend should be running at http://localhost:8000*

### 2. Start the Frontend (Next.js)
Open another terminal and run:
```powershell
cd "d:/4th year/machine/project/frontend"
npm run dev
```
*The web app will be available at http://localhost:3000*

### 3. Usage & Demonstration
- Go to `http://localhost:3000` in your browser.
- You will see the **"Neural Marketing Engine"** with futuristic animations.
- Input data for a new lead and click **"Generate Prediction"**.
- The app will communicate with your notebook-trained model and display the result with custom animations and probability charts.

### 4. For Your Final Project Report
Take screenshots or a video of the UI in action. This satisfies the **"Model Deployment (Bonus 1)"** requirement for extra credit!
