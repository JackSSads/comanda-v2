import { API } from "../axiosConfig";

const get = async () => {
    try {
        const res = await API.get("/caixa");

        if (res) {
            return res.data;
        };

        return new Error("Erro ao carregar caixa!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const update = async (id, data) => {
    try {

        const res = await API.put(`/caixa/${id}`, data);

        if (res) {
            return res.data;
        };

        return new Error("Erro ao atualizar a caixa!");
    } catch (error) {
        return new Error("Erro ao atualizar a caixa!");
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/caixa/${id}`);

        if (res) {
            return res.data;
        };

        return new Error("Erro ao deletar caixa!");
    } catch (error) {
        return new Error("Erro ao deletar caixa!");
    };
};

export const CashierService = {
    get,
    update,
    deleteById,
};