const authService = require('../services/authService');


const register = async (req, res,next) => {
    const { username, email, password,is_notification } = req.body;

    try {
        const newUser = await authService.register(username, email, password,is_notification);
        res.status(200).json(newUser);
    } catch (error) {
        next(error)
    }
};
const login = async (req, res,next) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password);
        res.status(200).json( token );
    } catch (error) {
        next(error)
    }
};
const logout = async(req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'
    try {
       const resp = await authService.logout(token)
       res.status(200).json(resp)
    } catch (error) {
        next(error)
    }
}
const verifyEmail = async (req, res ,next) => {
    const { token } = req.query;

    try {
        const user = await authService.verifyEmail(token);
        res.status(200).json({ message: 'Email verified successfully', user });
    } catch (error) {
        next(error)
    }
};

const refreshToken = async(req,res,next) =>{
    try {
        const {refresh_token} = req.headers;
        const resp = await authService.refreshToken(refresh_token)
        res.status(200).json(resp);
    } catch (error) {
        next(error)
    }
}
const forgotPass = async(req,res,next) => {
    try {
        const {email} = req.body;
        const resp = await authService.forgetPass(email)
        res.status(200).json(resp)

    } catch (error) {
        next(error)
    }
}
const resetPass = async(req,res,next)  => {
    try {
        const { token } = req.query;
        const { newPass } = req.body;
        const resp = await authService.resetPass(newPass ,token)
        res.status(200).json(resp)
    } catch (error) {
        next(error)
    }
}
const changePass = async(req,res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        const {newPass,oldPass} = req.body
        const resp = await authService.changePass(accessToken,oldPass,newPass)
        res.status(200).json(resp)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    register,
    login,
    verifyEmail,
    refreshToken,
    logout,
    forgotPass,
    resetPass,
    changePass
};
