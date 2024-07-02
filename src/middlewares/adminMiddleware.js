



const isAdmin = (req,res,next)  => {
    try {
        const {is_admin} = req.user
        if(is_admin != 1){
            return res.status(401).json({
                success: false,
                mes: ' REQUIRE ADMIN ROLE'
            })
            
        }
        next()

    } catch (error) {
        next(error)
    }
}

module.exports = {
    isAdmin
}