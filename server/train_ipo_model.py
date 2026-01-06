import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
import pickle

# Load your dataset
df = pd.read_csv("ipo_training_data.csv")

# Features to train on
features = [
    "ipo_price", "lot_size", "total_shares", "issue_size",
    "qib_subscription", "retail_subscription", "hni_subscription",
    "sentiment_score", "sector_growth_30d", "sector_volatility"
]

X = df[features]
y = df["listing_price"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train Model
model = RandomForestRegressor(n_estimators=300)
model.fit(X_train, y_train)

preds = model.predict(X_test)

# Evaluation
print("MAE:", mean_absolute_error(y_test, preds))

# Save Model
pickle.dump(model, open("ipo_prediction_model.pkl", "wb"))
print("Model Saved!")