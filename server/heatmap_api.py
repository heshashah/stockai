from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import sys, os

# Allow importing local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_direction_rules import predict_direction
from indicator_utils import calculate_indicators

app = Flask(__name__)
CORS(app)

# -------------------------------
# STOCK GROUPS (for dynamic heatmap)
# -------------------------------
PEER_MAP = {
    "AAPL": ["MSFT", "GOOGL", "AMZN", "META"],
    "MSFT": ["AAPL", "GOOGL", "AMZN", "META"],
    "GOOGL": ["AAPL", "MSFT", "AMZN", "META"],
    "AMZN": ["AAPL", "MSFT", "GOOGL", "META"],

    "TCS.NS": ["INFY.NS", "WIPRO.NS", "HCLTECH.NS"],
    "INFY.NS": ["TCS.NS", "WIPRO.NS", "HCLTECH.NS"],
    "WIPRO.NS": ["TCS.NS", "INFY.NS", "HCLTECH.NS"],
}

SECTOR_MAP = {
    "AAPL": "Technology",
    "MSFT": "Technology",
    "GOOGL": "Technology",
    "AMZN": "Technology",
    "META": "Technology",

    "TCS.NS": "IT",
    "INFY.NS": "IT",
    "WIPRO.NS": "IT",
    "HCLTECH.NS": "IT",
}

# -------------------------------
# HELPER: get AI prediction
# -------------------------------
def get_prediction(symbol):
    try:
        stock = yf.download(symbol, period="3mo", interval="1d", progress=False)

        if stock.empty:
            return None

        indicators = calculate_indicators(stock)
        pred = predict_direction(indicators)

        return pred["direction"]

    except Exception as e:
        print(f"Prediction failed for {symbol}: {e}")
        return None


# --------------------------------------------------
# DYNAMIC HEATMAP API  ✅ accepts `symbol`
# --------------------------------------------------
@app.route("/api/market-heatmap", methods=["GET"])
def market_heatmap():
    # 🔥 this is where MarketHeatmap passes the selected stock
    symbol = request.args.get("symbol", "AAPL")

    peers = PEER_MAP.get(symbol, [])
    sector = SECTOR_MAP.get(symbol, "General")

    result = {
        "selected": symbol,
        "sector": sector,
        "heatmap": {}
    }

    # Always include selected stock + peers
    symbols = [symbol] + peers

    for s in symbols:
        direction = get_prediction(s)
        if direction:
            result["heatmap"][s] = direction

    return jsonify(result)


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(port=5007, debug=True)
