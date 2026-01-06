import pandas as pd
import numpy as np

def calculate_indicators(df):
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if len(df) < 30:
        raise ValueError("Not enough historical data")

    close = df["Close"].astype(float)
    volume = df["Volume"].astype(float)

    # Moving Averages
    ma_short = close.rolling(5).mean().iloc[-1]
    ma_long = close.rolling(20).mean().iloc[-1]

    # RSI
    delta = close.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)

    avg_gain = gain.rolling(14).mean().iloc[-1]
    avg_loss = loss.rolling(14).mean().iloc[-1]

    if avg_loss == 0 or np.isnan(avg_loss):
        rsi = 100.0
    else:
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

    # MACD
    ema_12 = close.ewm(span=12, adjust=False).mean()
    ema_26 = close.ewm(span=26, adjust=False).mean()
    macd = (ema_12 - ema_26).iloc[-1]
    signal = (ema_12 - ema_26).ewm(span=9, adjust=False).mean().iloc[-1]

    # Volume Change %
    volume_change = (
        (volume.iloc[-1] - volume.iloc[-2]) / volume.iloc[-2]
    ) * 100

    indicators = {
        "ma_short": ma_short,
        "ma_long": ma_long,
        "rsi": rsi,
        "macd": macd,
        "signal": signal,
        "volume_change": volume_change
    }

    for k, v in indicators.items():
        if v is None or np.isnan(v) or np.isinf(v):
            raise ValueError(f"Invalid indicator value: {k}")

    return {k: round(float(v), 2) for k, v in indicators.items()}
