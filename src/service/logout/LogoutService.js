import { API } from "../axiosConfig";

const logout = async () => {

    try {
        await API.get("/logout");
    } catch (error) {
        return new Error("Erro ao reslizar logout!");
    };
};

export const LogoutService = {
    logout
};