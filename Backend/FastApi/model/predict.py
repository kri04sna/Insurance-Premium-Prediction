import pickle
import pandas as pd

# Import the ML model
with open('model/insurance_model.pkl', "rb") as f:
    model = pickle.load(f)

def predict_output(user_input: dict):

    input_df = pd.DataFrame([user_input])

    # Predict the category
    prediction = model.predict(input_df)[0]

    # Get probabilities for all classes
    probabilities = model.predict_proba(input_df)[0]

    # Create category-probability dictionary
    class_probabilities = {
        str(cls): round(float(prob), 2)
        for cls, prob in zip(model.classes_, probabilities)
    }

    # Sort probabilities in descending order
    class_probabilities = dict(
        sorted(
            class_probabilities.items(),
            key=lambda item: item[1],
            reverse=True
        )
    )

    # Get confidence of predicted category
    confidence = class_probabilities[str(prediction)]

    return {
    "predicted_category": str(prediction),
    "confidence": confidence
}