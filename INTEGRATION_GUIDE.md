# Notebook Integration Guide

To reach the 90% accuracy target and enable the web UI, follow these steps in your `.ipynb` notebook:

### 1. Replace Preprocessing (X and y definition onwards)
Replace any existing code that defines `X`, `y`, `X_train`, `X_test`, `scaler`, or uses `SMOTE` with the **Cell 1** code provided in the implementation plan. 
**Why?** This cell adds advanced features (like `success_potential` and `season`) and implements the required 3-way split (Train/Val/Test) to prevent data leakage.

### 2. Replace Modeling (Model Training onwards)
Replace all cells where you define and fit `KNN`, `LogisticRegression`, `DecisionTree`, or `RandomForest` with the **Cell 2** code.
**Why?** This cell uses a **Voting Ensemble** of your best models, which is the key to hitting that 90% accuracy mark stably. It also creates the `model_bundle.joblib` file needed for the web UI.

### 3. Check for File Conflicts
Ensure `bank.csv` is in the same folder as your notebook before running the new cells.

---

Once you run these cells and see "Model Ready! Accuracy: 0.90xx", you can proceed to the web UI part!
