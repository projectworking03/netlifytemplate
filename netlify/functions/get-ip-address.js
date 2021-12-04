const ip = require('ip')

exports.handler = async function(event, context){
    var ipadd = ip.address("private","ipv6")
    console.log(ipadd)
    return {
        statusCode: 200,
        body: JSON.stringify(ipadd)
    }
}