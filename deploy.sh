python ./backend/scrape_hub.py
python ./backend/scrape_planner.py

cd frontend
npm run build
surge ./dist abislist.xyz