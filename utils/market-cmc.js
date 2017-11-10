const axios = require('axios');

async function fetchCMCTable() {
    console.log('CMC API Call: ' + new Date());
    let response = axios.get('https://api.coinmarketcap.com/v1/ticker/')
    return response;
}

module.exports = fetchCMCTable;