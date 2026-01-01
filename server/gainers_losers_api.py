from flask import Flask, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)

# ✅ FIX CORS for React/Safari (important!)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# List of major NSE stocks
STOCKS = [
    "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "TCS.NS", "INFY.NS",
    "WIPRO.NS", "HINDUNILVR.NS", "ITC.NS", "KOTAKBANK.NS", "SBIN.NS",
    "TATAMOTORS.NS", "MARUTI.NS", "AXISBANK.NS", "BAJAJFINSV.NS",
    "SUNPHARMA.NS", "CIPLA.NS", "ULTRACEMCO.NS", "ASIANPAINT.NS",
    "ADANIENT.NS", "ADANIPORTS.NS"
]

@app.route("/gainers-losers")
def gainers_losers():
    try:
        results = []

        for symbol in STOCKS:
            try:
                stock = yf.Ticker(symbol)
                hist = stock.history(period="1d")

                # Skip tickers with no data
                if hist.empty:
                    print(f"Skipping {symbol} — No data")
                    continue

                open_price = hist["Open"].iloc[0]   # ✓ FIXED warning
                close_price = hist["Close"].iloc[0]

                change = ((close_price - open_price) / open_price) * 100

                results.append({
                    "symbol": symbol.replace(".NS", ""),
                    "change": round(change, 2)
                })

            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                continue

        if not results:
            return jsonify({"error": "No stock data available"})

        # Sort from highest to lowest % change
        sorted_results = sorted(results, key=lambda x: x["change"], reverse=True)

        top_gainers = sorted_results[:5]
        top_losers = sorted_results[-5:]

        return jsonify({
            "gainers": top_gainers,
            "losers": top_losers
        })

    except Exception as e:
        print("Server Error:", e)
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(port=5004)
