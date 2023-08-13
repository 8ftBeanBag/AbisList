import os
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd
import json as JSON
filepath = "../OMSHub.csv"
outpath = "../frontend/public/data/"
def download_csv(download_path):
    url = "https://www.omshub.org/"

    options = webdriver.FirefoxOptions()
    options.add_argument('--headless')
    options.set_preference("browser.download.folderList", 2)
    options.set_preference("browser.download.manager.showWhenStarting", False)
    options.set_preference('browser.download.dir', download_path)
    options.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/x-gzip")
    browser = webdriver.Firefox(options=options)
    browser.get(url)
    export_btn = browser.find_element(By.CSS_SELECTOR, "[aria-label='Export']")
    export_btn.click()
    popover = browser.find_element(By.CSS_SELECTOR, ".MuiPopper-root")
    popover.click()
    return "success!" if os.path.exists(filepath) else "Failure :("


def parse_hub_csv():
    json = {}
    df = pd.read_csv(filepath, names=["course", "number", "difficulty", "workload", "rating", "reviews_num"])
    rows = df.iterrows()
    next(rows)
    for row in rows:
        json[row[1]["course"]] = {
            "name": str(row[1]["course"]),
            "number": str(row[1]["number"]),
            "difficulty": str(row[1]["difficulty"]),
            "workload": str(row[1]["workload"]),
            "rating": str(row[1]["rating"]), 
        }
    with open(outpath+'hub.json', 'w') as file:
        file.write(JSON.dumps(json))

if __name__ == '__main__':
    # download_csv(sys.argv[1])
    parse_hub_csv()