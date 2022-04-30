import axios from 'axios'

const httpClient = axios.create(
    {
        baseURL: "http://localhost:8080"
    }
)

class ApiService {
    
    constructor(apiurl) {
        this.apiurl = apiurl;
    }

    post(url, objeto) {
        return httpClient.post(`${this.apiurl}${url}`, objeto);
    }

    put(url, objeto) {
        return httpClient.put(`${this.apiurl}${url}`, objeto);
    }

    delete(url) {
        return httpClient.delete(`${this.apiurl}${url}`);
    }

    get(url) {
        return httpClient.get(`${this.apiurl}${url}`);
    }
}

export default ApiService;