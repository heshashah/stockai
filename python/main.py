from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/sensex")
def sensex():
    return {"sensex": 72640}

@app.get("/gainers-losers")
def gl():
    return {"gainers": [], "losers": []}

@app.get("/sector")
def sector():
    return {"sector": "IT"}

@app.get("/heatmap")
def heatmap():
    return {"heatmap": []}

@app.get("/direction")
def direction():
    return {"direction": "UP"}

@app.get("/accuracy")
def accuracy():
    return {"accuracy": "78%"}
