const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const sendMail = require('./emailService')
const crypto = require('crypto');
const ErrorRes = require('../helpers/ErrorRes')
const { Op } = require('sequelize');
require('dotenv').config()
const redisClient = require('../config/redisConfig');
const Queue = require('bull');
const emailQueue = new Queue('email-queue', {
    redis: redisClient
});
const register = async (username, email, password,is_notification) => {
    try {
        // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT, 10));
        const check = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        })
        if (check) {
            throw new ErrorRes(409, check.email === email ? 'Email đã tồn tại' : 'Username đã tồn tại');
        }
        // Tạo người dùng mới
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            is_notification 
        });
       
        const verificationToken = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h' // Thời gian hết hạn của token
        });
        // await sendMail.sendVerificationEmail(email,verificationToken)
        // console.log(`Verification email sent to ${email}`);
        await emailQueue.add('verify-email',{
            email:email,
            verificationToken:verificationToken
        })
        // return  newUser;
        return {
            status: "success",
            message: "Đăng ký thành công , vui lòng kiểm tra mail để xác minh tài khoản",
        }
    } catch (error) {
        throw error;
    }
};

const login = async (email, password) => {
    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // throw new Error('User not found')
            throw new ErrorRes(404, 'Tài khoản không tồn tại')
        }

        // Kiểm tra mật khẩu
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // throw new Error('Incorrect password');
            throw new ErrorRes(401, 'Sai mật khẩu hoặc thiếu')
        }

        // Tạo accesstoken JWT
        const accessToken = jwt.sign({ userId: user.id, email: user.email,is_admin : user.is_admin  }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '600s' // Thời gian hết hạn của token
        });
        // Tạo refreshtoken JWT
        const refreshToken = jwt.sign({ userId: user.id, email: user.email,is_admin : user.is_admin  }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1h' // Thời gian hết hạn của token
        });
        user.refresh_token = refreshToken;
        await user.save();
        return {
            status : "success",
            message: "Đăng nhập thành công",
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw error;
    }
};
const logout = async(accessToken) => {
    try {
        // const decode
        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ where: { id: decode.userId } });
        if (!user) {
            // throw new Error('User not found')
            throw new ErrorRes(404, 'Tài khoản không tồn tại')
        }
        user.refresh_token = null;
        await user.save();
        return {
            message: "Đăng xuất thành công"
        }
    } catch (error) {
        throw error;
    }
}
const forgetPass = async(email)  => {
    try {
        const user = await User.findOne({ where: { email } });
        if(!user){
            throw new ErrorRes(404, 'Tài khoản không tồn tại')
        }
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires  = Date.now() + 3600000
        user.reset_password_token = resetPasswordToken
        user.reset_password_expires = resetPasswordExpires
        await user.save()
        await sendMail.sendMailForgotPass(email,resetPasswordToken)
        return {
            status : "success",
            message: "Vui lòng kiểm tra email của bạn"
        }
    } catch (error) {
        throw error;
    }
}
const resetPass = async(newPass,token) => {
    try {
        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_password_expires: {
                    [Op.gt]: Date.now() // Tìm những người dùng có reset_password_expires lớn hơn thời điểm hiện tại
                }
            }
        });
        if(!user){
            throw new ErrorRes(404, 'Token không hợp lệ hoặc đã hết hạn')
        }
        const Salt = parseInt(process.env.SALT, 10);
        const hashedNewPassword = await bcrypt.hash(newPass, Salt);
        user.password = hashedNewPassword;
        user.reset_password_token = null
        user.reset_password_expires = null
        await user.save()
        return {
            status : 'success',
            message : 'Mật khẩu đã được đặt lại thành công'
        }
    } catch (error) {
        throw error;
    }
}

const changePass = async(accessToken,oldPass,newPass) => {
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            // throw new Error('User not found');
            throw new ErrorRes(404, 'Tài khoản không tồn tại')
        }
        const passwordMatch = await bcrypt.compare(oldPass, user.password);

        if (!passwordMatch) {
            // throw new Error('Incorrect password');
            throw new ErrorRes(401, 'Mật khẩu cũ không đúng')
        }
        const Salt = parseInt(process.env.SALT, 10);
        const hashedNewPassword = await bcrypt.hash(newPass, Salt);
        user.password = hashedNewPassword;
        await user.save()
        return {
            status : 'success',
            message : 'Mật khẩu đã được đổi thành công'
        }
    } catch (error) {
        throw error;
    }
}
const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            throw new ErrorRes(404, 'Tài khoản không tồn tại')
        }

        user.is_verified = true;
        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
};

const refreshToken = async(refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId);
        if(!user) {
            throw new ErrorRes(404, 'Tài khoản không tồn tại')
        }
        const accessToken = jwt.sign({ userId: user.id, email: user.email,is_admin : user.is_admin  }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '500s' // Thời gian hết hạn của token
        });
        return {
            status : 'success',
            accessToken : accessToken
        }


    } catch (error) {
        throw error;
    }
}
module.exports = {
    register,
    login,
    verifyEmail,
    refreshToken,
    forgetPass,
    resetPass,
    changePass,
    logout
};
