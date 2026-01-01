import yfinance as yf
import pandas as pd
import numpy as np

def normalize_columns(df):
    # If yfinance returns multi-index columns, flatten them
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = ['_'.join(col).strip() for col in df.columns.values]
    
    # Normalize common Yahoo column names
    for col in ["Close", "close", "Adj Close", "Close_"]:
        candidates = [c for c in df.columns if col.lower() in c.lower()]
        if candidates:
            df["Close"] = df[candidates[0]]
            break

    for col in ["Open", "open"]:
        candidates = [c for c in df.columns if col.lower() in c.lower()]
        if candidates:
            df["Open"] = df[candidates[0]]
            break

    for col in ["High", "high"]:
        candidates = [c for c in df.columns if col.lower() in c.lower()]
        if candidates:
            df["High"] = df[candidates[0]]
            break

    for col in ["Low", "low"]:
        candidates = [c for c in df.columns if col.lower() in c.lower()]
        if candidates:
            df["Low"] = df[candidates[0]]
            break

    for col in ["Volume", "volume"]:
        candidates = [c for c in df.columns if col.lower() in c.lower()]
        if candidates:
            df["Volume"] = df[candidates[0]]
            break
    
    return df


# -------------------------
# FETCH HISTORICAL DATA
# -------------------------
def fetch_stock_history(symbol, period="1y"):
    df = yf.download(symbol, period=period, interval="1d")

    if df.empty:
        return None

    df = normalize_columns(df)     # NEW LINE
    df.reset_index(inplace=True)
    df.dropna(inplace=True)
    return df


# -------------------------
# TECHNICAL INDICATORS
# -------------------------
def add_indicators(df):
    df["SMA20"] = df["Close"].rolling(20).mean()
    df["SMA50"] = df["Close"].rolling(50).mean()

    df["EMA20"] = df["Close"].ewm(span=20).mean()
    df["EMA50"] = df["Close"].ewm(span=50).mean()

    df["RSI"] = compute_rsi(df["Close"], 14)

    df["MACD"], df["Signal"] = compute_macd(df["Close"])
    df["MACD_Hist"] = df["MACD"] - df["Signal"]

    df["ATR"] = compute_atr(df)

    df["Volatility"] = df["Close"].pct_change().rolling(10).std()

    df["Momentum"] = df["Close"].pct_change(10)

    df["Change%"] = df["Close"].pct_change()

    df.dropna(inplace=True)
    return df


# -------------------------
# RSI
# -------------------------
def compute_rsi(series, period=14):
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -1 * delta.clip(upper=0)

    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi


# -------------------------
# MACD
# -------------------------
def compute_macd(series):
    ema12 = series.ewm(span=12).mean()
    ema26 = series.ewm(span=26).mean()

    macd = ema12 - ema26
    signal = macd.ewm(span=9).mean()

    return macd, signal


# -------------------------
# ATR
# -------------------------
def compute_atr(df, period=14):
    df["HL"] = df["High"] - df["Low"]
    df["HC"] = abs(df["High"] - df["Close"].shift())
    df["LC"] = abs(df["Low"] - df["Close"].shift())

    tr = df[["HL", "HC", "LC"]].max(axis=1)
    atr = tr.rolling(period).mean()
    return atr
