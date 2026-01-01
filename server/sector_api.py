from flask import Flask, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)

# ✅ FIXED CORS – React & Safari can now access Python API
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# NSE Sector → Stocks mapping
SECTORS = {
    "IT": ["TCS.NS", "INFY.NS", "WIPRO.NS"],
    "BANK": ["HDFCBANK.NS", "ICICIBANK.NS", "KOTAKBANK.NS"],
    "AUTO": ["TATAMOTORS.NS", "HEROMOTOCO.NS", "BAJAJ-AUTO.NS"],
    "FMCG": ["HINDUNILVR.NS", "ITC.NS", "BRITANNIA.NS"],
    "PHARMA": ["SUNPHARMA.NS", "CIPLA.NS", "DRREDDY.NS"]
}

@app.route("/sector")
def sector_data():
    try:
        output = []

        for sector, stocks in SECTORS.items():
            changes = []  # stores % change for each stock

            for symbol in stocks:
                try:
                    stock = yf.Ticker(symbol)
                    hist = stock.history(period="1d")

                    # Skip if no data
                    if hist.empty:
                        print(f"Skipping {symbol} – no data")
                        continue

                    open_price = hist["Open"].iloc[0]
                    close_price = hist["Close"].iloc[0]

                    change = ((close_price - open_price) / open_price) * 100
                    changes.append(change)

                except Exception as e:
                    print(f"Error fetching {symbol}: {e}")
                    continue

            # Calculate average sector performance
            avg_change = sum(changes) / len(changes) if changes else 0

            output.append({
                "sector": sector,
                "performance": round(avg_change, 2)
            })

        return jsonify(output)

    except Exception as e:
        print("Sector API Error:", e)
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(port=5003)
