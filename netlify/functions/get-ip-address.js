const ip = require('ip')

exports.handler = async function(event, context){
    console.log(ip.address());
    return {
        statusCode: 200,
        body: JSON.stringify(ip.address)
    }
}