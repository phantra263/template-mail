import axios from 'axios';
import Cookie from 'js-cookie';

const baseURL = 'https://mail.mmo-job.com/mail-web-api';

// Create an Axios instance
const http = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json",
    }
});

// Add a request interceptor to include the latest token in every request
http.interceptors.request.use(
    config => {
        const access_token = Cookie.get('access_token');
        if (access_token) {
            config.headers['Authorization'] = access_token;
        } else {
            console.log('No access token found');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

let refresh = false;

// Add a response interceptor to handle token refresh logic
http.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        const refresh_token = Cookie.get('refresh_token');

        if (error.response && error.response.status === 401 && refresh_token && !refresh) {
            refresh = true;
            try {
                const response = await axios.post(`${baseURL}/refresh?refresh_token=${refresh_token}`);
                if (response.status === 200) {
                    const { access_token } = response.data.data;

                    // Update the cookies with the new tokens
                    Cookie.set('access_token', `Bearer ${access_token}`);

                    // Update the Axios headers with the new access token
                    http.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

                    // Retry the original request with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                    window.location.reload();
                    return http(originalRequest);
                }
            } catch (refreshError) {
                console.error('Failed to refresh token', refreshError);
                Cookie.remove('access_token');
                Cookie.remove('refresh_token');
                window.location.reload();
                // Optionally handle token refresh failure, e.g., log out the user
            } finally {
                refresh = false;
            }
        }

        return Promise.reject(error);
    }
);

export default http;
