"""
AI MODULE 6
Rule-Based Stock Price Direction Predictor

This module predicts:
- BULLISH (UP)
- BEARISH (DOWN)
- SIDEWAYS (NEUTRAL)

Based on technical indicators.
"""

def predict_direction(indicators):
    """
    indicators (dict) must contain:
    - ma_short
    - ma_long
    - rsi
    - macd
    - signal
    - volume_change
    """

    score = 0
    reasons = []

    # Rule 1: Moving Average Trend
    if indicators["ma_short"] > indicators["ma_long"]:
        score += 25
        reasons.append("Short-term MA is above long-term MA (Uptrend)")
    else:
        reasons.append("Short-term MA is below long-term MA (Downtrend)")

    # Rule 2: RSI Momentum
    if 50 <= indicators["rsi"] <= 70:
        score += 25
        reasons.append("RSI indicates healthy bullish momentum")
    elif indicators["rsi"] < 40:
        reasons.append("RSI indicates bearish momentum")
    else:
        reasons.append("RSI indicates neutral momentum")

    # Rule 3: MACD Momentum
    if indicators["macd"] > indicators["signal"]:
        score += 25
        reasons.append("MACD is above signal line (Positive momentum)")
    else:
        reasons.append("MACD is below signal line (Negative momentum)")

    # Rule 4: Volume Confirmation
    if indicators["volume_change"] > 0:
        score += 25
        reasons.append("Increasing volume confirms the trend")
    else:
        reasons.append("Decreasing volume shows weak confirmation")

    # Final Direction Decision
    if score >= 75:
        direction = "BULLISH"
    elif score <= 25:
        direction = "BEARISH"
    else:
        direction = "SIDEWAYS"

    return {
        "direction": direction,
        "confidence": score,
        "reasons": reasons
    }
