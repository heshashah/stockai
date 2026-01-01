from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# -----------------------------
# 1. STOCK LIST TO ANALYZE
# -----------------------------
STOCKS = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ITC.NS",
    "SBIN.NS", "AXISBANK.NS", "WIPRO.NS", "KOTAKBANK.NS", "BHARTIARTL.NS"
]


# -----------------------------
# 2. TRAIN SIMPLE ML MODEL
# -----------------------------
def train_model():
    model = RandomForestClassifier()

    # Dummy training data
    X = [
        [0.1, 0.05],
        [0.2, 0.1],
        [0.05, -0.02],
        [-0.1, -0.05],
        [0.15, 0.07]
    ]
    y = [1, 1, 0, 0, 1]  # 1 = BUY, 0 = AVOID

    model.fit(X, y)
    return model


model = train_model()


# -----------------------------
# 3. FEATURE ENGINEERING (FULLY FIXED)
# -----------------------------
def extract_features(stock):
    data = yf.download(stock, period="5d", interval="1d")

    if data.empty:
        return None

    # Try to get the Close values safely
    try:
        close_values = data["Close"].values.tolist()
    except Exception:
        return None

    # Flatten list of lists → list of floats
    close_prices = []
    for item in close_values:
        if isinstance(item, list):
            close_prices.append(float(item[0]))
        else:
            close_prices.append(float(item))

    # Need at least 3 prices
    if len(close_prices) < 3:
        return None

    prev = close_prices[-2]
    last = close_prices[-1]

    # Feature 1: Daily return
    if prev == 0:
        daily_return = 0
    else:
        daily_return = (last - prev) / prev

    # Feature 2: Volatility of last 3 days
    if last == 0:
        volatility = 0
    else:
        volatility = float(np.std(close_prices[-3:])) / float(last)

    return [daily_return, volatility]


# -----------------------------
# 4. AI PICKS ENDPOINT
# -----------------------------
@app.route("/api/aipicks")
def ai_picks():
    results = []

    for stock in STOCKS:
        features = extract_features(stock)

        if features is None:
            continue

        prediction = model.predict([features])[0]
        score = model.predict_proba([features])[0][1]

        results.append({
            "symbol": stock.replace(".NS", ""),
            "score": round(float(score), 3),
            "decision": "BUY" if prediction == 1 else "AVOID"
        })

    # Sort by score
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return jsonify(results[:5])


# -----------------------------
# 5. START FLASK SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(port=5004)
