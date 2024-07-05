const Cashier = require("../models/Cashier");

module.exports = class CashierController {
    static async getAll(req, res) {
        try {
            const data = await Cashier.find();

            if (data.length <= 0) {
                try {

                    const data = { comandas: [], totalValue: 0, status: true };

                    await Cashier.create(data);

                    const dataGet = await Cashier.find();

                    return new Promise(() => res.status(200).json({ dataGet, status: true }));

                } catch (error) {
                    return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
                };
            } else {
                return new Promise(() => res.status(200).json({ data, status: true }));
            };
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async getById(req, res) {
        const { id } = req.params;

        try {
            const data = await Cashier.findOne({ _id: id });

            if (!data) return res.status(500).json({ message: "Erro ao buscar Caixa", status: false });

            return new Promise(() => res.status(200).json({ data, status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async create(req, res) {
        const { comandas, totalValue, status } = req.body;

        if (comandas === "" || totalValue === "" || status === "") return res.json({ message: "Preencha todos os campos", status: false });

        try {
            const data = { comandas, totalValue: 0, status: true };

            await Cashier.create(data);

            return new Promise(() => res.status(201).json({ message: "Caixa cadastrada com sucesso", status: true }));

        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async updateById(req, res) {
        const { id } = req.params;
        const { comandas, totalValue, status } = req.body;

        try {

            const data = { comandas, totalValue, status };

            await Cashier.updateOne({ _id: id }, data);

            return new Promise(() => res.status(200).json({ message: "Caixa atualizada", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async deleteById(req, res) {
        const { id } = req.params;

        if (!id) return res.status(500).json({ message: "Caixa ineistente!", status: false });

        try {
            await Cashier.deleteOne({ _id: id });

            return new Promise(() => res.status(200).json({ message: "Caixa deletado", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };
};