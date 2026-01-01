import json
import numpy as np
from flask import Flask, jsonify
from flask_cors import CORS

# Import modules you created
from ai_data_pipeline import fetch_stock_history, add_indicators
from ai_labeler import generate_labels
from ai_rf_model import train_rf_model
from ai_lstm_model import prepare_lstm_sequences, train_lstm
from ai_hybrid_predictor import hybrid_predict

import yfinance as yf

app = Flask(__name__)
CORS(app)

# -----------------------------------------------------------
# 1. FETCH NIFTY 50 SYMBOLS
# -----------------------------------------------------------
def get_nifty50():
    return [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
        "SBIN.NS", "ITC.NS", "LT.NS", "KOTAKBANK.NS", "HINDUNILVR.NS",
        "BHARTIARTL.NS", "HCLTECH.NS", "ASIANPAINT.NS", "AXISBANK.NS",
        "MARUTI.NS", "ULTRACEMCO.NS", "SUNPHARMA.NS", "TITAN.NS",
        "M&M.NS", "TECHM.NS", "NESTLEIND.NS", "TATAMOTORS.NS",
        "ADANIPORTS.NS", "POWERGRID.NS", "JSWSTEEL.NS", "WIPRO.NS",
        "TATACONSUM.NS", "COALINDIA.NS", "ONGC.NS", "GRASIM.NS",
        "BPCL.NS", "SHREECEM.NS", "BRITANNIA.NS", "DRREDDY.NS",
        "EICHERMOT.NS", "HDFCLIFE.NS", "DIVISLAB.NS", "HEROMOTOCO.NS",
        "HINDALCO.NS", "UPL.NS", "BAJAJ-AUTO.NS", "BAJFINANCE.NS",
        "BAJAJFINSV.NS", "INDUSINDBK.NS", "CIPLA.NS", "SBILIFE.NS",
        "ADANIENT.NS", "APOLLOHOSP.NS"
    ]

# -----------------------------------------------------------
# 2. TRAIN HYBRID AI MODELS (RandomForest + LSTM)
# -----------------------------------------------------------
def train_hybrid_models():
    symbols = get_nifty50()
    all_predictions = []

    print("\n🔄 TRAINING HYBRID AI MODEL…\n")

    for symbol in symbols[:10]:  # top 10 for speed
        print(f"⏳ Loading {symbol}...")

        df = fetch_stock_history(symbol, period="1y")
        if df is None:
            continue

        df = add_indicators(df)
        df = generate_labels(df)

        feature_cols = [
            "SMA20", "SMA50", "EMA20", "EMA50", "RSI",
            "MACD", "Signal", "MACD_Hist", "ATR",
            "Volatility", "Momentum", "Change%"
        ]

        if df.shape[0] < 200:
            continue

        # Train RandomForest
        rf_model = train_rf_model(df, feature_cols)

        # Prepare LSTM sequences
        X_seq, y_seq = prepare_lstm_sequences(df)
        if len(X_seq) < 100:
            continue

        lstm_model = train_lstm(X_seq, y_seq)

        last_features = df[feature_cols].iloc[-1].tolist()
        last_sequence = X_seq[-1]

        # Hybrid prediction
        result = hybrid_predict(rf_model, lstm_model, last_features, last_sequence)

        # JSON-safe conversion 🔧
        clean_result = {
            "symbol": str(symbol.replace(".NS", "")),
            "rf_decision": int(result["rf_decision"]),
            "lstm_decision": int(result["lstm_decision"]),
            "final_decision": str(result["final_decision"]),
            "final_score": float(result["final_score"])
        }

        all_predictions.append(clean_result)

    # Sort predictions
    all_predictions = sorted(all_predictions, key=lambda x: x["final_score"], reverse=True)

    return all_predictions[:5]

# -----------------------------------------------------------
# 3. API ENDPOINT FOR HYBRID AI PICKS
# -----------------------------------------------------------
@app.route("/api/aipicks_hybrid")
def api_hybrid_picks():
    try:
        picks = train_hybrid_models()
        return jsonify(picks)
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------
# 4. RUN THE SERVER
# -----------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Hybrid AI Engine Running on port 5005...")
    app.run(port=5005)
