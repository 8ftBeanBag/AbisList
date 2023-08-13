from bs4 import BeautifulSoup
from urllib.request import urlopen
from selenium import webdriver

def scrape():
    url = "https://www.omshub.org/"

    options = webdriver.FirefoxOptions()
    options.add_argument('--headless')
    browser = webdriver.Firefox(options=options)
    browser.get(url)
    html = browser.page_source
    soup = BeautifulSoup(html, features="html.parser")
    with open('output.html', 'w') as file:
        file.write(str(soup))
    browser.quit()
    return soup.get_text()