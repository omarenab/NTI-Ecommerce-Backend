exports.authorize = (...allowedRoles) => {
    return (req,res,next) => {
        const userRole = req.user.role;
        if(!allowedRoles.includes(userRole)){
            return next()
        }
        res.status(403).json({message : 'Unauthorized Access Denied'})
    }

}