export function valiateTypePerson(typePerson) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || user.type != typePerson) {
            res.status(403).json({
                ok: false,
                data: null,
                error: {
                    name: "Forbidden",
                    statusCode: 403,
                    message: "no tienes permiso"
                }
            });
        }
        next();
    };
}
//# sourceMappingURL=validateTypePerson.middleware.js.map