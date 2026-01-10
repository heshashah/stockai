from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

DATA_FILE = "accuracy_log.json"

# -------------------------
# UTILS
# -------------------------
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(d):
    with open(DATA_FILE, "w") as f:
        json.dump(d, f, indent=2)

# -------------------------
# LOG PREDICTION
# -------------------------
# call this AFTER prediction is made
@app.route("/api/log-prediction", methods=["POST"])
def log_prediction():
    body = request.json

    # 🔥 SIMULATE ACTUAL DIRECTION (demo mode)
    possible = ["BULLISH", "BEARISH", "SIDEWAYS"]
    actual = random.choice(possible)

    # horizon: 1D, 1W, 1M (default = 1D)
    horizon = body.get("horizon", "1D")

    log = load_data()
    log.append({
        "symbol": body["symbol"],
        "predicted": body["predicted"],
        "actual": actual,   # simulated
        "horizon": horizon,
        "date": datetime.now().strftime("%Y-%m")
    })
    save_data(log)

    return jsonify({
        "status": "logged",
        "symbol": body["symbol"],
        "predicted": body["predicted"],
        "actual": actual,
        "horizon": horizon
    })

# -------------------------
# OVERALL ACCURACY (MONTH)
# -------------------------
@app.route("/api/accuracy-this-month", methods=["GET"])
def accuracy_this_month():
    data = load_data()
    month = datetime.now().strftime("%Y-%m")

    month_data = [d for d in data if d["date"] == month and d.get("actual")]

    if not month_data:
        return jsonify({"accuracy": None, "total": 0})

    correct = sum(1 for d in month_data if d["predicted"] == d["actual"])
    acc = round((correct / len(month_data)) * 100, 2)

    return jsonify({
        "accuracy": acc,
        "total": len(month_data)
    })

# -------------------------
# ACCURACY BY HORIZON
# -------------------------
@app.route("/api/accuracy-by-horizon", methods=["GET"])
def accuracy_by_horizon():
    data = load_data()
    month = datetime.now().strftime("%Y-%m")

    horizons = ["1D", "1W", "1M"]
    result = {}

    for h in horizons:
        h_data = [
            d for d in data
            if d["date"] == month and d.get("actual") and d.get("horizon") == h
        ]

        if not h_data:
            result[h] = None
            continue

        correct = sum(1 for d in h_data if d["predicted"] == d["actual"])
        acc = round((correct / len(h_data)) * 100, 2)

        result[h] = acc

    return jsonify(result)

# -------------------------
# RUN
# -------------------------
if __name__ == "__main__":
    app.run(port=5008)
