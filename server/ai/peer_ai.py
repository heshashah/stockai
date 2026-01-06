import json
import sys

def score_company(c):
    # if c is string, convert to dict
    if isinstance(c, str):
        try:
            c = json.loads(c)
        except:
            return {"error": "Invalid company format"}

    score = 0

    pe = float(c.get("pe", 0))
    pg = float(c.get("profit_growth", 0))
    sg = float(c.get("sales_growth", 0))
    roce = float(c.get("roce", 0))

    # Valuation
    if pe > 0 and pe < 20:
        score += 20
    elif pe < 30:
        score += 10

    # Profit Growth
    if pg > 50:
        score += 25
    elif pg > 20:
        score += 15

    # Sales Growth
    if sg > 30:
        score += 20
    elif sg > 15:
        score += 10

    # ROCE
    if roce > 20:
        score += 20
    elif roce > 10:
        score += 10

    c["ai_score"] = score
    c["ai_rating"] = label(score)
    return c


def label(score):
    if score >= 70:
        return "Strong Buy"
    elif score >= 50:
        return "Good"
    elif score >= 35:
        return "Average"
    else:
        return "Risky"


def main():
    try:
        raw = sys.stdin.read()

        if not raw:
            print("[]")
            return

        data = json.loads(raw)

        # if single object, wrap in list
        if isinstance(data, dict):
            data = [data]

        result = []
        for c in data:
            result.append(score_company(c))

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "error": "Python AI crashed",
            "message": str(e)
        }))


if __name__ == "__main__":
    main()
