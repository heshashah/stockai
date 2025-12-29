import sys, json
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob

def analyze_sentiment(news_list):
    analyzer = SentimentIntensityAnalyzer()
    total_score = 0
    results = []

    for headline in news_list:
        vader_score = analyzer.polarity_scores(headline)["compound"]
        textblob_score = TextBlob(headline).sentiment.polarity

        final_score = (vader_score + textblob_score) / 2
        results.append({"headline": headline, "score": final_score})
        total_score += final_score

    avg_score = total_score / len(news_list)

    sentiment_label = "Positive" if avg_score > 0.2 else (
                       "Negative" if avg_score < -0.2 else "Neutral")

    return {
        "overall_score": round(avg_score, 3),
        "sentiment": sentiment_label,
        "details": results
    }

if __name__ == "__main__":
    raw = sys.stdin.read().strip()

    if not raw:
        print(json.dumps({"error": "NO_INPUT"}))
        sys.exit(0)

    try:
        data = json.loads(raw)
    except Exception as e:
        print(json.dumps({"error": "JSON_DECODE_FAILED", "raw": raw}))
        sys.exit(0)

    try:
        response = analyze_sentiment(data["news"])
        print(json.dumps(response))
    except Exception as e:
        print(json.dumps({"error": "PYTHON_CRASH", "message": str(e)}))

