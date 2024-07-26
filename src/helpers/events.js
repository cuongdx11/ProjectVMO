const EventEmitter = require('events')

const eventEmitter = new EventEmitter()

const rolePermissionService = require('../services/rolePermissionService')


eventEmitter.on('update-rolePermission', (data) => {
    const {roleId,permissionId} = data
    rolePermissionService.updateRolePermission(roleId,permissionId)
})

eventEmitter.on('delete-rolePermission',(data) => {
    const {roleId,permissionId} = data
    rolePermissionService.deleteRolePermission(roleId,permissionId)
})

console.log('Event đang chạy')

module.exports = eventEmitter;