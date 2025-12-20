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


if __name__ == "__main__":
    # ✅ IMPORTANT: run Flask on a DIFFERENT port than Node
    app.run(port=5002, debug=True)
