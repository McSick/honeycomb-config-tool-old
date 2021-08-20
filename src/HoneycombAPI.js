const axios = require('axios').default;
module.exports = class HoneycombAPI {

    constructor(config) {

      this.apihost = config.apihost || 'api';
      this.apikey = config.apikey || '';
      this.createInstance();
    }
    updateKey(apikey) {
      this.apikey = apikey;
      this.createInstance();
    }
    createInstance() {
      this.instance = axios.create({
        baseURL: `https://${this.apihost}.honeycomb.io/1/`,
        timeout: 3000,
        headers: { 'X-Honeycomb-Team': this.apikey }
      });
    }
    async createBoard(boardjson) {
      try {
          const response = await this.instance.post('boards', boardjson);
          return response.data;
        } catch (error) {
          console.error(error);
          return [];
        } 
  
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