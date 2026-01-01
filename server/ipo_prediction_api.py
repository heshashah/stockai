from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# ----------------------------------
# 🔥 FUNCTION 1: SCRAPE UPCOMING IPO
# ----------------------------------
def scrape_upcoming_ipos():
    url = "https://www.chittorgarh.com/ipo/upcoming-ipo-list/2/"

    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "lxml")

    rows = soup.select("table.table tbody tr")

    ipo_list = []

    for r in rows:
        cols = r.find_all("td")
        if len(cols) < 7:
            continue
        
        ipo = {
            "name": cols[0].text.strip(),
            "open_date": cols[1].text.strip(),
            "close_date": cols[2].text.strip(),
            "price_band": cols[3].text.strip(),
            "issue_size": cols[4].text.strip(),
            "lot_size": cols[5].text.strip(),
        }

        ipo_list.append(ipo)

    return ipo_list



# -------------------------------------
# 🔥 FUNCTION 2: SCRAPE GMP (Grey Market)
# -------------------------------------
def scrape_gmp(ipo_name):
    url = "https://www.chittorgarh.com/report/latest-grey-market-premium-gmp/44/"

    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "lxml")

    rows = soup.select("table.table tbody tr")

    for r in rows:
        cols = r.find_all("td")
        if len(cols) < 5:
            continue

        name = cols[0].text.strip().lower()
        gmp_value = cols[2].text.strip().replace("₹", "").replace(",", "").strip()

        if ipo_name.lower() in name:
            try:
                return float(gmp_value)
            except:
                return 0

    return 0  # No GMP found



# ------------------------------------------------------
# 🔥 FUNCTION 3: IPO LISTING PRICE PREDICTION ALGORITHM
# ------------------------------------------------------
def predict_listing_price(upper_price, gmp):
    predicted_price = upper_price + gmp
    gain_percent = (gmp / upper_price) * 100
    return round(predicted_price, 2), round(gain_percent, 2)



# -----------------------------------
# 🔥 MAIN API ENDPOINT (React Calls)
# -----------------------------------
@app.route("/ipo-predictions")
def ipo_predictions():

    try:
        upcoming_ipos = scrape_upcoming_ipos()
        final_output = []

        for ipo in upcoming_ipos:
            price_band = ipo["price_band"].replace("₹", "").replace(" ", "")
            
            # price band like "100-120"
            try:
                lower, upper = price_band.split("-")
                upper_price = float(upper)
            except:
                upper_price = None

            gmp = scrape_gmp(ipo["name"])

            if upper_price:
                predicted_price, gain_percent = predict_listing_price(upper_price, gmp)
            else:
                predicted_price, gain_percent = None, None

            final_output.append({
                "name": ipo["name"],
                "open_date": ipo["open_date"],
                "close_date": ipo["close_date"],
                "price_band": ipo["price_band"],
                "lot_size": ipo["lot_size"],
                "gmp": gmp,
                "predicted_listing_price": predicted_price,
                "expected_gain_percent": gain_percent
            })

        return jsonify(final_output)

    except Exception as e:
        return jsonify({"error": str(e)})



if __name__ == "__main__":
    app.run(port=5006)
