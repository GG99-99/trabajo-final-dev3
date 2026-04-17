export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500; // Usa 500 si no hay statusCode definido
    const response = {
        ok: false,
        data: null,
        error: {
            name: err.name,
            statusCode: statusCode,
            message: err.message
        }
    };
    return res.status(statusCode).json(response); // Establece el status code correctamente
}
//# sourceMappingURL=errorHandler.js.map