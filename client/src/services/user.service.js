import http from "../http-common";

class UserDataService {
    getAuthenticatedUser() {
        return http.get("/user");
    }
    get(id) {
        return http.get(`/user/${id}`);
    }
}

export default new UserDataService();