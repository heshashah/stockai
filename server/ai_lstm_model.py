import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def prepare_lstm_sequences(df, sequence_length=60):
    data = df["Close"].values

    X, y = [], []
    for i in range(len(data) - sequence_length - 1):
        X.append(data[i:i+sequence_length])
        y.append(df["Label"].iloc[i + sequence_length])

    return np.array(X), np.array(y)

def train_lstm(X, y):
    X = X.reshape((X.shape[0], X.shape[1], 1))

    model = Sequential([
        LSTM(64, return_sequences=False),
        Dense(32, activation="relu"),
        Dense(3, activation="softmax")  # BUY / HOLD / SELL
    ])

    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(X, y, epochs=3, batch_size=32, verbose=1)

    return model
