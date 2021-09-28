exports.errorHandler = (err, req, res, next) => {
    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).send({ message: err });
        default:
            return res.status(500).send({ message: err.message });
    }
}
