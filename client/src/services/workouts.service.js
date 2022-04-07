import http from "../http-common";

class WorkoutDataService {
    getAll() {
        return http.get("/workouts");
    }
    get(id) {
        return http.get(`/workouts/${id}`);
    }
}

export default new WorkoutDataService();