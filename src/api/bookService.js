import axios from "axios";

export default {
    uploadBook(formData) {
        return axios.post('/book/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};



