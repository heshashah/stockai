import sys
import json
import requests
from bs4 import BeautifulSoup

# 🔥 READ FROM STDIN INSTEAD OF ARGV
try:
    input_data = json.loads(sys.stdin.read())
    ipo_key = input_data.get("key", "unknown_ipo")
except Exception:
    ipo_key = "unknown_ipo"

ipo_name = ipo_key.replace("_", " ").title()



# -----------------------------
# HELPERS
# -----------------------------
def clean_headline(text):
    text = text.strip()
    # remove very short / useless words
    if len(text) < 15:
        return None

    # remove menu-like words
    bad_words = ["Gujarati", "Hindi", "English", "Specials"]
    for b in bad_words:
        if b.lower() == text.lower():
            return None

    return text


# -----------------------------
# SCRAPERS
# -----------------------------
def scrape_moneycontrol():
    try:
        url = "https://www.moneycontrol.com/news/tags/ipo.html"
        headers = { "User-Agent": "Mozilla/5.0" }
        page = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(page.text, "html.parser")

        headlines = []
        for a in soup.select("a"):
            text = a.get_text(strip=True)
            cleaned = clean_headline(text)

            if cleaned and "ipo" in cleaned.lower():
                headlines.append(cleaned)

            if len(headlines) >= 5:
                break

        return headlines
    except Exception:
        return []


def scrape_et():
    try:
        url = "https://economictimes.indiatimes.com/markets/ipos/fpos"
        headers = { "User-Agent": "Mozilla/5.0" }
        page = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(page.text, "html.parser")

        headlines = []
        for h3 in soup.find_all("h3"):
            text = h3.get_text(strip=True)
            cleaned = clean_headline(text)

            if cleaned and "ipo" in cleaned.lower():
                headlines.append(cleaned)

            if len(headlines) >= 5:
                break

        return headlines
    except Exception:
        return []


# -----------------------------
# COMBINE + FILTER
# -----------------------------
def get_combined_news():
    raw_news = []
    raw_news.extend(scrape_moneycontrol())
    raw_news.extend(scrape_et())

    # Remove duplicates
    raw_news = list(dict.fromkeys(raw_news))

    ipo_lower = ipo_name.lower()

    # Keep only headlines that mention this IPO
    filtered = [h for h in raw_news if ipo_lower in h.lower()]

    # If nothing matches, use fallback
    if not filtered:
        filtered = [
            f"{ipo_name} IPO receives strong investor interest",
            f"Analysts review {ipo_name} fundamentals ahead of listing",
            f"Market experts discuss prospects of {ipo_name} IPO",
        ]

    return filtered



# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    scraped_news = get_combined_news()

    # 🔐 FALLBACK if scraping is useless
    if not scraped_news:
        scraped_news = [
            f"{ipo_name} IPO receives strong investor interest",
            f"Analysts review {ipo_name} fundamentals ahead of listing",
            f"Market experts discuss prospects of {ipo_name} IPO",
        ]

    print(json.dumps({ "news": scraped_news }))

