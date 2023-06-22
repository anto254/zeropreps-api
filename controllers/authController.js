const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const trimmedUserName = userName.trim().toLowerCase();


  const foundUser = await User.findOne({ userName: trimmedUserName }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.userName,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.userName },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
   await foundUser.save();

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  const roles = foundUser.roles;
  const user_Id = foundUser._id;
  res.json({ accessToken, roles, user_Id, userName });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
  const {userId} = req.params;

  if (!userId) return res.status(401).json({ message: "Unauthorizedg" });

  const foundUser = await User.findOne({_id: userId }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }


  const refreshToken = foundUser.refreshToken;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const userName1 = decoded.username;

      if (foundUser.userName === userName1) {
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.userName,
              roles: foundUser.roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        const roles = foundUser.roles;
        const userName = foundUser.userName;
        const user_Id = foundUser._id;
        res.json({ accessToken, roles, userName, user_Id });
      } else return res.status(401).json({ message: "Unauthorized" });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
