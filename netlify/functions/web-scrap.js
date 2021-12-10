const axios = require("axios");

exports.handler = async function (event, context) {
  // Form the URL
  const movieTitle = event.queryStringParameters.title;
  const url = `https://www.bing.com/search?q=${encodeURI(
    movieTitle + " movie"
  )}`;

  // Fetch the HTML
  const html = await fetchHtml(url);

  // Extract the ratings and streaming platforms
  const ratings = getRatings(html);
  const avgRating = calculateAvgRating(ratings)
  const streamingPlatforms = getStreamingPlatforms(html);

  // Build the response
  const response = {
    ratings,
    streamingPlatforms,
    avgRating
  };

  // Send the response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      data: response,
    }),
  };
};

const calculateAvgRating = (ratings) =>
{
  var totalRating = 0.0
  var totalProvider = 0.0
  ratings.forEach(element => {
    console.log(element)
    var s = element.value 
    console.log("CQ DEC: " + s.indexOf(".") + " " + s.indexOf("/"))

    if(s.indexOf("/") != -1)
    {
      try
      {
      const rate = parseFloat(s.substring( 0, s.indexOf("/")))
      const outOff =  parseFloat(s.substring(s.indexOf("/") + 1))
      console.log("Rate: " + rate)
      console.log("OutOff: " + outOff)
      console.log("RATE: " + (rate * outOff))
      if(rate == NaN)
        throw new Error("Rate was NaN")
      if(outOff == NaN)
        throw new Error("outOff was NaN")
      totalRating += rate * outOff
      totalProvider++
      }catch(err){console.log("Err in decimal: " + err)}
    }
    else 
    {
      try
      {
        const rate = parseFloat(s)
        //console.log("Rate: " + rate)
        if(rate > 0 && rate < 100)
        {
          console.log("Rate: " + rate)
          totalRating += rate
          totalProvider++
        }
      }catch(err){console.log("Err in int: " + err)}
    }    
  });
  console.log("TR: " + totalRating)
  console.log("TP: " + totalProvider)
  console.log("AVG: " + Math.round(totalRating/totalProvider))
  return Math.round(totalRating/totalProvider)
}


// Fetches th HTML given a URL
const fetchHtml = async (url) => {
  const html = await axios({
    method: "get",
    url: url,
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    },
  }).then((res) => JSON.stringify(res.data));

  return html;
};

const getRatings = (html) => {
  const ratingValues = getRatingValues(html);
  const ratingProviders = getRatingProviders(html);

  let ratings = [];
  for (let i = 0; i < ratingValues.length; i++) {
    const ratingProvider = ratingProviders[i];
    const ratingValue = ratingValues[i];
    ratings.push({ provider: ratingProvider, value: ratingValue });
  }

  return ratings;
};

// Get the rating values
const getRatingValues = (html) => {
  const ratingRegex = /<div class=\\"l_ecrd_ratings_prim\\">(\w.+?)</g;

  let ratingValues = [];
  while (true) {
    // Extract all rating values matching the above regular expression
    const match = ratingRegex.exec(html);
    if (match === null) break;
    ratingValues.push(match[1]);
  }

  return ratingValues;
};

// Get the rating providers
const getRatingProviders = (html) => {
  const providerRegex = /<div class=\\"l_ecrd_txt_qfttl\\">(\w.+?)</g;

  let ratingProviders = [];
  while (true) {
    const match = providerRegex.exec(html);
    if (match === null) break;
    ratingProviders.push(match[1]);
  }

  return ratingProviders;
};

// Get the streaming platforms
const getStreamingPlatforms = (html) => {
  const watchProviderRegex =
    /<a class=\\"b_action b_accentColor actWebAction\\" (\w.+?)>(\w.+?)</g;
  const watchUrlRegex = /href=\\"(\w.+?)\\"/g;
  const providerNameRegex = />(\w.+?)</;

  let streamingPlatforms = [];
  while (true) {
    const match = watchProviderRegex.exec(html);
    if (match === null) break;

    const matchUrl = watchUrlRegex.exec(match);
    if (matchUrl === null) break;

    const providerName = providerNameRegex.exec(match);
    streamingPlatforms.push({
      provider: providerName[1],
      url: matchUrl[1],
    });
  }

  return streamingPlatforms;
};
