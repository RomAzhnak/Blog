exports.errorHandler = (err, req, res, next) => {
    switch (true) {
        case err.message === "Unauthorized!":
            return res.status(401).send({ message: err.message });
        case err.message.startsWith('Failed'):
            const is404 = err.message.toLowerCase().endsWith('not found!');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).send({ message: err.message });
        default:
            return res.status(500).send({ message: err.message });
    }
}
