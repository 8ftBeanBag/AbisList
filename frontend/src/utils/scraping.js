import * as cheerio from "cheerio"

export function scrapeHub(doc){
    const $ = cheerio.load(doc);
    console.log(doc)
    return [{
        number: "test"
    }]  
}