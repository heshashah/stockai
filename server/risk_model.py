import numpy as np
import pandas as pd
import json
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

def train_models():
    X = np.random.rand(100, 4)
    y = np.random.randint(0, 2, 100)

    log_reg = LogisticRegression()
    log_reg.fit(X, y)

    rf = RandomForestClassifier()
    rf.fit(X, y)

    with open("ipo_classifier.pkl", "wb") as f:
        pickle.dump({"logistic": log_reg, "rf": rf}, f)

# train_models()  # run ONCE manually

def compute_volatility(price_list):
    prices = pd.Series(price_list)
    returns = prices.pct_change().dropna()
    return float(returns.std())

def load():
    with open("ipo_classifier.pkl", "rb") as f:
        return pickle.load(f)

def calculate_risk(data):
    models = load()

    X = np.array([[data["sentiment"], data["financial_ratio"],
                   data["subscription"], data["peer_strength"]]])

    lr = models["logistic"].predict_proba(X)[0][1]
    rf = models["rf"].predict_proba(X)[0][1]
    vol = compute_volatility(data["prices"])

    final_score = (lr + rf + vol) / 3

    return {
        "risk_score": round(final_score, 2),
        "volatility": round(vol, 3),
        "logistic": float(lr),
        "random_forest": float(rf)
    }
