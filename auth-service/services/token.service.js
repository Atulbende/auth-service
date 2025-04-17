import jwt from 'jsonwebtoken';
const generateAccessToken = (user) => {
    return jwt.sign({   
        userId: user.Pid,
        username: user.UserName,
        email: user.email,
        role: user.Role
    },process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'});
}
const generateRefreshToken = (user) => {
    return jwt.sign({   
        userId: user.Pid,
    },process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '2d'});
}
const generateTokens = (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
  };
const verifyToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return null;
        }
        return decoded;
    });
}
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return null;
        }
        return decoded;
    });
}
export {generateTokens,generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken};