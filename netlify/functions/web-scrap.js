const axios = require("axios")


exports.handler = async function(event, context){
    //var url = "https://api.allorigins.win/get?url=https://www.google.com/search?q=Venom:%20Let%20There%20Be%20Carnage"
    const url = "https://www.bing.com/search?q=venom"
    //var file = fs.createWriteStream('./web.html');
    const a = await axios({
        method:'get',
        url:url,
        headers:{
            Accept: 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
        }
    })
    resp = a.data
    // await request({
    //                 method:'get',
    //                 url:url,
    //                 headers:{
    //                     Accept: 'application/json, text/plain, */*',
    //                     'User-Agent': 'Chrome/79.0.3945.99'
    //                 }
    //             },function(error, response, body){
    //                 resp = body
    //                 //console.log(body)
    //             }).pipe(file)
    
    try
    {   
        var str = JSON.stringify(resp)
        const rating_reg = /<div class=\\"l_ecrd_ratings_prim\\">(\w.+?)</g
        var ratings = [];
        while (true) {
            const match = rating_reg.exec(str);
            if (match === null) break;
            // Add capture of group 1 to `matches`
            //console.log("MATCH:",match)
            ratings.push(match[1]);
        } 
        console.log(ratings)
        const prov_reg = /<div class=\\"l_ecrd_txt_qfttl\\">(\w.+?)</g
        var rating_providers = [];
        while (true) {
            const match = prov_reg.exec(str);
            if (match === null) break;
            // Add capture of group 1 to `matches`
            //console.log("MATCH:",match)
            rating_providers.push(match[1]);
        } 
        console.log(rating_providers)
        const watch_provider_reg = /<a class=\\"b_action b_accentColor actWebAction\\" (\w.+?)>(\w.+?)</g
        const watch_url_reg = /href=\\"(\w.+?)\\"/g        
        const pov_name_reg = />(\w.+?)</
        var watch_list = [];
        while (true) {
            const match = watch_provider_reg.exec(str);
            if (match === null) break;
            // Add capture of group 1 to `matches`
            //console.log("MATCH:",match)
            else
            {
                const match_url = watch_url_reg.exec(match);
                if(match_url === null)  break;
                console.log(match_url.input)
                const pov_name = pov_name_reg.exec(match)
                watch_list.push({
                    provider: pov_name[1],
                    url:match_url[1]
                });
            }
        } 
        console.log(watch_list)
        
        const rating_with_prov = []

        for(var i = 0; i < ratings.length; i++)
        {
            rating_with_prov.push({
                provider:rating_providers[i],
                rating:ratings[i]
            })
        }

        resp = {
            ratings : rating_with_prov,
            watch_list: watch_list
        }
    }
    catch(err)
    {
        resp = 'Error'
        console.log("ERR:",err)
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data:resp})
    }
}






















// const puppeteer = require("puppeteer")

// exports.handler = async function(event, context){
//     var url = "https://api.allorigins.win/get?url=https://www.google.com/search?q=Venom:%20Let%20There%20Be%20Carnage"
//     url = "https://www.bing.com/search?q=venom"
    




    // const browser = await puppeteer.launch()
    // const page = await browser.newPage();
    // await page.goto(url)

    // const names = await page.evaluate(()=>{
    //    return Array.from(document.querySelectorAll(".l_ecrd_ratings_prim")).map(x => x.textContent) 
    // })
    // const ratings = await page.evaluate(()=>{
    //     return Array.from(document.querySelectorAll(".l_ecrd_txt_qfttl")).map(x => x.textContent) 
    //  })
    // browser.close()
//     return {
//         statusCode: 200,
//         body: JSON.stringify({
//             names:names,
//             rating:ratings})
//     }
// }