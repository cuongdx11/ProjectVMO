const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const sendMail = require('./emailService')
const crypto = require('crypto');
const ErrorRes = require('../helpers/ErrorRes')
const { Op } = require('sequelize');
require('dotenv').config()
const register = async (username, email, password) => {
    try {
        // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, process.env.SLAT);

        // Tạo người dùng mới
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        const verificationToken = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h' // Thời gian hết hạn của token
        });
        await sendMail.sendVerificationEmail(email,verificationToken)
        console.log(`Verification email sent to ${email}`);
        return newUser;
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
            throw new ErrorRes(404, 'User not found')
        }

        // Kiểm tra mật khẩu
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // throw new Error('Incorrect password');
            throw new ErrorRes(401, 'Incorrect password')
        }

        // Tạo accesstoken JWT
        const accessToken = jwt.sign({ userId: user.id, email: user.email,is_admin : user.is_admin  }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '500s' // Thời gian hết hạn của token
        });
        // Tạo refreshtoken JWT
        const refreshToken = jwt.sign({ userId: user.id, email: user.email,is_admin : user.is_admin  }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1h' // Thời gian hết hạn của token
        });
        user.refresh_token = refreshToken;
        await user.save();
        return {
            status : 'Done',
            data : {
                accessToken,
                refreshToken
            }
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
            throw new ErrorRes(404, 'User not found')
        }
        user.refresh_token = null;
        await user.save();
        return {
            message: 'Dang xuat thanh cong'
        }
    } catch (error) {
        throw error;
    }
}
const forgetPass = async(email)  => {
    try {
        const user = await User.findOne({ where: { email } });
        if(!user){
            throw new ErrorRes(404, 'User not found')
        }
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires  = Date.now() + 3600000
        user.reset_password_token = resetPasswordToken
        user.reset_password_expires = resetPasswordExpires
        await user.save()
        await sendMail.sendMailForgotPass(email,resetPasswordToken)
        return {
            status : 'Kiem tra mail cua ban'
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
        const hashedNewPassword = await bcrypt.hash(newPass, process.env.SLAT);
        user.password = hashedNewPassword;
        user.reset_password_token = null
        user.reset_password_expires = null
        await user.save()
        return {
            message : 'Mật khẩu đã được đặt lại thành công'
        }
    } catch (error) {
        throw error;
    }
}

const changePass = async(accessToken,newPass) => {
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            // throw new Error('User not found');
            throw new ErrorRes(404, 'User not found')
        }
        const hashedNewPassword = await bcrypt.hash(newPass, process.env.SLAT);
        user.password = hashedNewPassword;
        await user.save()
        return {
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
            // throw new Error('User not found');
            throw new ErrorRes(404, 'User not found')
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
            throw new ErrorRes(404, 'User not found')
        }
        const accessToken = jwt.sign({ userId: user.id, email: user.email,is_admin : user.is_admin  }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '500s' // Thời gian hết hạn của token
        });
        return {
            status : 'Done',
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
