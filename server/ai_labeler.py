import numpy as np

# Generate hybrid trading labels
def generate_labels(df):
    df["Future_Close"] = df["Close"].shift(-1)
    df["Future_Return"] = (df["Future_Close"] - df["Close"]) / df["Close"]

    conditions = [
        df["Future_Return"] > 0.005,     # BUY
        df["Future_Return"] < -0.003     # SELL
    ]
    choices = [1, -1]  # BUY, SELL

    df["Label"] = np.select(conditions, choices, default=0)  # HOLD

    df.dropna(inplace=True)
    return df
