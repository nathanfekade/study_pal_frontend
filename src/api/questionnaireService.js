import axios from "axios";

export default{

    getallquestionairre(){
        return axios.get('/questionairre/')
    },

    getquestionairre(id){
        return axios.get(`/questionairre/${id}`)
    },

    generateQuestionairre(formData) {
        return axios.post('/questionairre/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}


