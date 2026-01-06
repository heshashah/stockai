from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import yfinance as yf

# Allow importing from current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_direction_rules import predict_direction
from indicator_utils import calculate_indicators

app = Flask(__name__)
CORS(app)

# -------------------------------
# HEALTH CHECK (Browser)
# -------------------------------
@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "Stock Direction API running",
        "port": 5006
    })


# --------------------------------------------------
# MAIN API: REAL STOCK → INDICATORS → AI PREDICTION
# --------------------------------------------------
@app.route("/api/stock-direction", methods=["POST"])
def stock_direction():
    data = request.json or {}
    symbol = data.get("symbol", "^BSESN")

    try:
        stock = yf.download(symbol, period="3mo", interval="1d", progress=False)

        if stock.empty:
            return jsonify({"error": f"No data for symbol: {symbol}"}), 400

        indicators = calculate_indicators(stock)
        prediction = predict_direction(indicators)

        return jsonify({
            "symbol": symbol,
            "indicators": indicators,
            "prediction": prediction
        })

    except Exception as e:
        # 🔥 THIS IS WHY YOU WERE SEEING 500
        return jsonify({
            "error": "Indicator calculation failed",
            "details": str(e)
        }), 400

# --------------------------------------------------
# TEST ROUTE (Browser / GET – Optional but Useful)
# --------------------------------------------------
@app.route("/api/stock-direction-test", methods=["GET"])
def stock_direction_test():
    indicators = {
        "ma_short": float(request.args.get("ma_short", 105)),
        "ma_long": float(request.args.get("ma_long", 100)),
        "rsi": float(request.args.get("rsi", 62)),
        "macd": float(request.args.get("macd", 1.2)),
        "signal": float(request.args.get("signal", 0.8)),
        "volume_change": float(request.args.get("volume_change", 3.5))
    }

    result = predict_direction(indicators)
    return jsonify(result)


if __name__ == "__main__":
    app.run(port=5006)
