import http from "../../http-common";

const auth = {
    login(data) {
        return http.post(`/login`, data);
    },

    logout() {
        return http.delete(`/logout`);
    }
}
export default auth;
