import Axios from 'axios';

const AXIOS_CONFIG = {
	baseURL: process.env.VUE_APP_APIJSON,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
};

const axios = Axios.create(AXIOS_CONFIG);
const {request, response} = axios.interceptors;

/**
 * 给axios添加拦截器
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
request.use(config => {
    return config
});

response.use(response => {
	let {status, data} = response,
		{msg, code} = data;

	if(status != 200 || code != 200) return Promise.reject(msg)
		
	return data
}, error => {
	console.log('axios error: ', error);
	return error
})

export default axios