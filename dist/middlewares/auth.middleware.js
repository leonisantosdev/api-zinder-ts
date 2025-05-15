import jwt from 'jsonwebtoken';
export const validToken = async (req, res, next) => {
    var _a;
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).send({ message: 'Acesso negado' });
            return;
        }
        const { id } = jwt.verify(token, JWT_SECRET);
        req.user = id;
        next();
    }
    catch (error) {
        res.status(401).send({ message: 'Token inválido ou expirado' });
        return;
    }
};
