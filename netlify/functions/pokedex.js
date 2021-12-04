const axios = require('axios')

exports.handler = async function(event, context){
    const eventBody = JSON.parse(event.body)

    console.log(event)
    const POKE_API = 'https://pokeapi.co/api/v2/pokedex/'+ eventBody.region

    const response = await axios.get(POKE_API).then(res => res.data)
    

    return {
        statusCode: 200,
        body: JSON.stringify({
            pokemin: response.pokemon_entries
            })
    }
}