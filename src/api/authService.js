import axios from "axios";
// const API_URL = 'https://nathanfekade.pythonanywhere.com'

export default {
    
    login(credentials) {
        return axios.post('/api-token-auth/', credentials);
    },

    signup(userData) {
        return axios.post('/signup/', userData);
    }
};




