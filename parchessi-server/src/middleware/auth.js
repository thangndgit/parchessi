const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      const err = {
        status: 401,
        error: "Không có quyền truy cập",
      };
      return next(err);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = auth;
