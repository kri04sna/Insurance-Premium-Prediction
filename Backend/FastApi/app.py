from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from Schema.User_input import UserInput
from model.predict import predict_output

app = FastAPI()
# Configure CORS (Cross-Origin Resource Sharing)
# This allows the React frontend running on localhost:5173
# to send HTTP requests to the FastAPI backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Human Readable
@app.get('/')
def home():
     return {'message': 'Insurance Premium Prediction Api'}

#machine readable
@app.get('/health')
def health_check():
    return {
        'status' : 'OK'
    }


@app.post('/predict')
def predict_premium(data: UserInput):

    user_input = {
        'smoker': data.smoker,
        'age': data.age,
        'bmi': data.bmi,
        'income_lpa': data.income_lpa
     }

    try:
        result = predict_output(user_input)

        return JSONResponse(
            status_code=200,
            content={"response": result}
        )
    except Exception as e:
            return JSONResponse(status_code=500, content=str(e))