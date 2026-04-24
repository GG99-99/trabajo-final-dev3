export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const response = {
        ok: false,
        data: null,
        error: {
            name: err.name || 'InternalError',
            statusCode: statusCode,
            message: err.message || 'An unexpected error occurred'
        }
    };
    return res.status(statusCode).json(response);
}
//# sourceMappingURL=errorHandler.js.map