const axios = require('axios')

exports.handler = async function(){
    const POKE_API = 'https://pokeapi.co/api/v2/pokedex/kanto'

    const response = await axios.get(POKE_API).then(res => res.data)
    

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}