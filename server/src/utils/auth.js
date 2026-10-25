import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = ({ userId }) => {
  const accessToken = jwt.sign({ userId }, config.ACCESS_TOKEN, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, config.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};
