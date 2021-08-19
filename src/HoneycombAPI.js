const axios = require('axios').default;
module.exports = class HoneycombAPI {

    constructor(apikey) {
        this.updateKey(apikey);
    }
    updateKey(apikey) {
        this.instance = axios.create({
            baseURL: 'https://api.honeycomb.io/1/',
            timeout: 3000,
            headers: { 'X-Honeycomb-Team': apikey }
          });
    }
    async getDatasets() {
        try {
            const response = await this.instance.get('datasets');
            return response.data;
          } catch (error) {
            console.error(error);
            return [];
          } 
    
    }


}