export function errorHandler(err, req, res, next) {
    const response = {
        ok: false,
        data: null,
        error: {
            name: err.name,
            statusCode: err.statusCode,
            message: err.message
        }
    };
    return res.json(response);
}
//# sourceMappingURL=errorHandler.js.map