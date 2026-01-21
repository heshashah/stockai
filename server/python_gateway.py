from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import sys

app = Flask(__name__)
CORS(app)

# ------------------------------------------------
# HEALTH CHECK
# ------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return {"status": "Python Gateway running"}

# ------------------------------------------------
# GENERIC RUNNER FUNCTION
# ------------------------------------------------
def run_script(script_name, args=[]):
    try:
        command = [sys.executable, script_name] + args

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode != 0:
            return {"error": result.stderr}

        return {"output": result.stdout}

    except Exception as e:
        return {"error": str(e)}

# ------------------------------------------------
# ROUTES
# ------------------------------------------------

@app.route("/sensex")
def sensex():
    return jsonify(run_script("sensex_api.py"))

@app.route("/sector")
def sector():
    return jsonify(run_script("sector_api.py"))

@app.route("/gainers-losers")
def gainers():
    return jsonify(run_script("gainers_losers_api.py"))

@app.route("/heatmap")
def heatmap():
    return jsonify(run_script("heatmap_api.py"))

@app.route("/accuracy")
def accuracy():
    return jsonify(run_script("accuracy_tracker.py"))

@app.route("/ai-predict")
def predict():
    stock = request.args.get("symbol", "RELIANCE")
    return jsonify(run_script("ai_engine.py", [stock]))

# ------------------------------------------------
if __name__ == "__main__":
    app.run(port=7000)
