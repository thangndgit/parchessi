// Import base
const bcrypt = require("bcrypt");

// Import model
const User = require("../../models/user");

// POST - /api/auth/sign-up
exports.postSignUp = async (req, res, next) => {
  try {
    // Data from request
    const reqData = req.body;

    // Data to response
    const resData = {};

    // Find user if username or email existed
    const user = await User.findOne({ $or: [{ username: reqData.username }, { email: reqData.email }] });

    // If user exist, return error
    if (user) {
      const err = {
        status: 409,
        error: "Tên đăng nhập hoặc địa chỉ email đã tồn tại",
      };
      return next(err);
    }

    // If user does not exist, hash password and create user
    const hashedPw = bcrypt.hashSync(reqData.password, 10);
    User.create({ ...reqData, password: hashedPw, isActive: false });

    // Send response
    resData.message = "Đăng ký thành công";
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// POST - /api/auth/sign-in
exports.postSignIn = async (req, res, next) => {
  try {
    // Data from request
    const reqData = req.body;

    // Data to response
    const resData = {};

    // Find user if username or email existed
    const user = await User.findOne({ $or: [{ username: reqData.username }, { email: reqData.email }] });

    // If user does not exist, return error
    if (!user) {
      const err = {
        status: 401,
        error: "Tên đăng nhập hoặc email không tồn tại",
      };
      return next(err);
    }

    // If user exist
    const isPasswordMatch = bcrypt.compareSync(reqData.password, user.password);

    // If password does not match
    if (!isPasswordMatch) {
      const err = {
        status: 401,
        error: "Mật khẩu sai",
      };
      return next(err);
    }

    // // If user is active
    // if (user.isActive) {
    //   const err = {
    //     status: 401,
    //     error: "Tài khoản đang được đăng nhập ở nơi khác",
    //   };
    //   return next(err);
    // }

    // Else update isActive state
    await User.findByIdAndUpdate(user._id, { isActive: true });

    // If password match
    req.session.user = user;
    req.session.userId = user._id;

    // Send response
    resData.message = "Đăng nhập thành công";
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// POST - /api/auth/sign-out
exports.postSignOut = async (req, res, next) => {
  try {
    // Data to response
    const resData = {};

    await User.findByIdAndUpdate(req.session.userId, { isActive: false });

    // Destroy session
    req.session.destroy();

    // Send response
    resData.message = "Đăng xuât thành công";
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// GET - /api/auth/session
exports.getSession = (req, res, next) => {
  try {
    // Create response data
    const resData = {};

    // Send response
    resData.session = req.session;
    res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};
