import http from "../http-common";

class RideDataService {
    get(id) {
        return http.get(`/rides/${id}`);
    }
}

export default new RideDataService();