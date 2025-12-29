import requests
from bs4 import BeautifulSoup
import json

def scrape_moneycontrol():
    url = "https://www.moneycontrol.com/news/tags/ipo.html"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")

    headlines = []
    for div in soup.select(".clearfix a"):
        text = div.get_text(strip=True)
        if text and len(headlines) < 5:
            headlines.append(text)

    return headlines

def scrape_et():
    url = "https://economictimes.indiatimes.com/ipo"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")

    headlines = []
    for h3 in soup.find_all("h3"):
        text = h3.get_text(strip=True)
        if "IPO" in text and len(headlines) < 5:
            headlines.append(text)

    return headlines

def get_combined_news():
    news = []
    news.extend(scrape_moneycontrol())
    news.extend(scrape_et())
    return list(set(news))  # remove duplicates

if __name__ == "__main__":
    print(json.dumps({"headlines": get_combined_news()}))
