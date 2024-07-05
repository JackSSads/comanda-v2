const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class LoginController {
    static async login(req, res) {

        try {
            const { email, pass } = await req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.json({ message: 'Usuário não encontrado', status: false });
            };

            const passCompared = bcrypt.compareSync(pass, user.pass);

            if (!passCompared) {
                return res.json({ message: 'Senha incorreta', status: false });
            };

            if (user && passCompared) {

                const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
                    expiresIn: '1d' // expires in 1 day
                });

                res.cookie('Authorization', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None',
                });

                const result = {
                    func: user.func,
                    status: true,
                };

                return res.status(200).json(result);
            };

        } catch (error) {
            return res.status(500).json({ message: `Erro de autenticação`, status: false });
        };
    };
};