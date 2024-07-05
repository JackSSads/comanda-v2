import { API } from "../axiosConfig";

const login = async (data) => {
    try {
        const res = await API.post("/login", data);

        if (res) {

            if (res.data.status) {

                const auth = res.data.status;

                sessionStorage.setItem('auth', auth);

                return res.data;

            } else {
                sessionStorage.setItem('auth', false)
            };
        };

        return new Error("Erro ao realizar login!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

export const LoginService = {
    login
};