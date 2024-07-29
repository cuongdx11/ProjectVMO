const jwt = require('jsonwebtoken');
const User =require('../models/userModel')
const Role = require('../models/roleModel')
const Permission = require('../models/permissionModel')
const redisClient = require('../config/redisConfig')
require('dotenv').config();
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'

        if (!token) {
            return res.status(401).json({ error: 'Access token is missing or invalid' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }

            req.user = user; // Thêm thông tin người dùng vào yêu cầu
            next(); // Tiếp tục xử lý yêu cầu
        });
    } catch (error) {
        next(error)
    }
};

const checkPermission = (requiredPermission) => {
    return async(req,res,next) => {
        try {
            const userReq = req.user
            if(!userReq){
                return res.status(401).json({error: 'Unauthorized user!'})
            }
            const userId = userReq.userId
            let userPermissions = await redisClient.get(`permissions:${userId}`);
            if(userPermissions&&userPermissions.includes(requiredPermission)){
                userPermissions = JSON.parse(userPermissions)
            }else{
                const user = await User.findByPk(userReq.userId,{
                    include: [{
                        model: Role,
                        as: 'role',
                        include: [{
                            model: Permission,
                            as:'permissions'
                        }]
                    }]
                })
                if(!user){
                    return res.status(404).json({error: 'Unauthorized user!'})
                }
                // Lưu quyền vào Redis
                userPermissions = user.role.flatMap(role => role.permissions.map(permission => permission.name));
                await redisClient.set(`permissions:${userId}`, JSON.stringify(userPermissions));
            }
            
            // Kiểm tra quyền hạn yêu cầu
            const hasPermission = userPermissions.includes(requiredPermission);
            if (!hasPermission) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}
    
module.exports = {
    authenticateToken,
    checkPermission
}
