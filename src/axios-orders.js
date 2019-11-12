import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-c96a7.firebaseio.com/'
});

export default instance;