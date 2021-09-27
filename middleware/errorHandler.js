exports.errorHandler = (err, req, res, next) => {
    switch (true) {
        case typeof err.message === 'string':
            const is404 = err.message.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).send({ message: err.message });
        default:
            return res.status(500).json({ message: err.message });
    }
}
