import yfinance as yf
import sys, json

def get_market_data(company_name):
    # Smart guess: take first word (e.g. "TATA")
    ticker_guess = company_name.split()[0]
    
    # try searching on Yahoo Finance
    search = yf.Ticker(ticker_guess + ".NS")  # NSE
    info = search.info

    return {
        "market_price": info.get("currentPrice"),
        "market_cap": info.get("marketCap"),
        "last_quarter_revenue": info.get("totalRevenue"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
    }

input_data = json.loads(sys.stdin.read())
company = input_data["name"]

result = get_market_data(company)
print(json.dumps(result))
