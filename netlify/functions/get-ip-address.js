const ip = require('ip')

exports.handler = async function(event, context){
    var ipadd = ip.address("private","ipv6")
    console.log(ipadd)
    return {
        statusCode: 200,
        body: JSON.stringify({
            add1: ip.address("private","ipv6"),
            add2: ip.address("private","ipv4"),
            add3: ip.address("public","ipv6"),
            add4: ip.address("public","ipv4")
        })
    }
}