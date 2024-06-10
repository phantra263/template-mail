import http from "../../http-common";

const mailSrv = {
    getMailName(params) {
        return http.get(`/list-mails-user`, { params });
    },
    getListMail(params) {
        return http.get(`/view-mail-name`, { params });
    },
    getMailDetail(params) {
        return http.get(`/view-mail-detail`, { params });
    },
    createMail(params) {
        return http.post(`/create-new-mail?mailname=${params}`);
    },
    searchMail(params) {
        return http.get(`/search?q=${params}`);
    },

}

export default mailSrv;
