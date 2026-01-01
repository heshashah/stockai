from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)

# ✅ Allow React frontend (localhost:3000) to access this API
CORS(app)

@app.route("/api/sensex", methods=["GET"])
def sensex():
    try:
        # ✅ Map frontend range to Yahoo Finance params
        range_map = {
            "1D": ("1d", "5m"),
            "1W": ("5d", "30m"),
            "1M": ("1mo", "1d")
        }

        r = request.args.get("range", "1D")

        # ✅ Safety check
        if r not in range_map:
            return jsonify({"error": "Invalid range"}), 400

        yf_range, interval = range_map[r]

        url = f"https://query1.finance.yahoo.com/v8/finance/chart/^BSESN?range={yf_range}&interval={interval}"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        res = requests.get(url, headers=headers)

        # ✅ If Yahoo blocks or fails
        if res.status_code != 200:
            return jsonify({"error": "Failed to fetch Yahoo Finance data"}), 500

        data = res.json()

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/nifty", methods=["GET"])
def nifty():
    try:
        range_map = {
            "1D": ("1d", "5m"),
            "1W": ("5d", "30m"),
            "1M": ("1mo", "1d")
        }

        r = request.args.get("range", "1D")

        if r not in range_map:
            return jsonify({"error": "Invalid range"}), 400

        yf_range, interval = range_map[r]

        url = f"https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?range={yf_range}&interval={interval}"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        res = requests.get(url, headers=headers)

        if res.status_code != 200:
            return jsonify({"error": "Failed to fetch Yahoo Finance data"}), 500

        data = res.json()

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/sector-performance")
def sector_performance():
    url = "https://yahoo-finance15.p.rapidapi.com/api/yahoo/sectors"

    headers = {
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch real sector data"}), 500

        data = response.json()

        # Extract sector performance %
        sectors = data["body"]

        # Structure clean data for frontend
        formatted = [
            {
                "sector": s["sector"],
                "performance": float(s["performance"].replace("%", ""))  
            }
            for s in sectors
        ]

        return jsonify(formatted)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # ✅ IMPORTANT: run Flask on a DIFFERENT port than Node
    app.run(port=5002, debug=True)
