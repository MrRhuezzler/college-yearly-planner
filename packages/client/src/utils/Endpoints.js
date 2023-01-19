export const BACKEND_URL = "http://localhost:5000";

export const API_URL = BACKEND_URL + "";
const CALENDAR_ENDPOINT = API_URL + "/calendar";
export const CALENDAR_ALL_CREATE = CALENDAR_ENDPOINT + "/";
export const CALENDAR_ONE_UPDATE_DELETE = CALENDAR_ENDPOINT + "/:year";
const PLANNER_ENDPOINT = CALENDAR_ENDPOINT + "/:year/planner";
export const PLANNER_ALL_CREATE = PLANNER_ENDPOINT + "/";
export const PLANNER_ONE_UPDATE_DELETE = PLANNER_ENDPOINT + "/:id";
