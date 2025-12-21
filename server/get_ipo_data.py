import sys, json
import requests
from bs4 import BeautifulSoup

IPO_URLS = {
    "marc_technocrats": "https://ipowatch.in/marc-technocrats-ipo-date-review-price-allotment-details/",
    "wakefit": "https://ipowatch.in/wakefit-innovations-ipo/",
    "sundrex_oil": "https://ipowatch.in/sundrex-oil-ipo/",
    "tata_capital": "https://ipowatch.in/tata-capital-ipo/",
    "lg_electronics": "https://ipowatch.in/lg-electronics-ipo/",
    "stanbik_agro": "https://ipowatch.in/stanbik-agro-ipo/",
    "studs": "https://ipowatch.in/studs-ipo/",
    "tenneco": "https://ipowatch.in/tenneco-clean-air-india-ipo/",
    "bai_kakaji": "https://ipowatch.in/bai-kakaji-polymers-ipo/",
    "icici_prudential": "https://ipowatch.in/icici-prudential-amc-ipo/",
    "corona_remedies": "https://ipowatch.in/corona-remedies-ipo/",
    "riddhi_display": "https://ipowatch.in/riddhi-display-ipo/"
}

raw = sys.stdin.read().strip()
if not raw:
    print(json.dumps({"error": "No input"}))
    sys.exit()

data = json.loads(raw)
key = data.get("key")

if not key or key not in IPO_URLS:
    print(json.dumps({"error": "Invalid key"}))
    sys.exit()

url = IPO_URLS[key]

headers = {
    "User-Agent": "Mozilla/5.0"
}

page = requests.get(url, headers=headers).text
soup = BeautifulSoup(page, "html.parser")

def extract_value(label):
    """Extracts the value next to a label in IPOWatch tables."""
    td = soup.find("td", string=lambda t: t and label.lower() in t.lower())
    if td and td.find_next("td"):
        return td.find_next("td").text.strip()
    return None

result = {
    "gmp": extract_value("GMP"),
    "ipo_price": extract_value("Price"),
    "listing_gain": extract_value("listing gain"),
    "ipo_type": extract_value("IPO Type")
}

print(json.dumps(result))
