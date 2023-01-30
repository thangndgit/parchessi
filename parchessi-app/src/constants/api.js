const api = {};

const host = "http://localhost:5000/api";

api.auth = {
  postSignUp: () => host + "/auth/sign-up",
  postSignIn: () => host + "/auth/sign-in",
  postSignOut: () => host + "/auth/sign-out",
  getSession: () => host + "/auth/session",
};

api.room = {
  create: () => host + "/rooms",
  get: (query = "") => host + "/rooms" + query,
  getById: (roomId) => host + "/rooms/" + roomId,
  updateById: (roomId) => host + "/rooms/" + roomId,
  deleteById: (roomId) => host + "/rooms/" + roomId,
};

export default api;
