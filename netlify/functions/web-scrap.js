const puppeteer = require("puppeteer")

exports.handler = async function(event, context){
    var url = "https://api.allorigins.win/get?url=https://www.google.com/search?q=Venom:%20Let%20There%20Be%20Carnage"
    url = "https://www.bing.com/search?q=venom"
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(url)

    const names = await page.evaluate(()=>{
       return Array.from(document.querySelectorAll(".l_ecrd_ratings_prim")).map(x => x.textContent) 
    })
    const ratings = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll(".l_ecrd_txt_qfttl")).map(x => x.textContent) 
     })
    browser.close()
    return {
        statusCode: 200,
        body: JSON.stringify({
            names:names,
            rating:ratings})
    }
}