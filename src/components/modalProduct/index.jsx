import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useToggleView } from "../../contexts";
import { Plus, Close } from "../../libs/icons";
import { ProdutService } from "../../service/produt/ProdutService";

export const ModalProduct = ({ action, id }) => {

    const [value, setValue] = useState({
        nameProduct: "",
        price: 0,
        category: "Bebida"
    });

    const { toggleView, setToggleView } = useToggleView();

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const createProduct = () => {

        if (value.nameProduct === "" || value.category === "" || value.price === 0) {
            return toast.error("preencha todos os campos");
        };

        const data = {
            nameProduct: value.nameProduct,
            qnt: 1,
            totalPrice: value.price,
            value: value.price,
            category: value.category,
            status: true,
        };

        try {
            ProdutService.create(data)
                .then((result) => {

                    if (result.status) {
                        toast.success(result.message);
                    };

                    setToggleView(false);
                    setValue(prev => ({ ...prev, "nameProduct": "" }));
                    setValue(prev => ({ ...prev, "price": 0 }));
                    setValue(prev => ({ ...prev, "category": "Bebida" }));
                });
        } catch (error) {
            return toast.error(error);
        };
    };

    const updateById = () => {

        if (value.nameProduct === "" || value.category === "" || value.price === 0) {
            return toast.error("preencha todos os campos");
        };

        const data = {
            value: value.price,
            category: value.category,
            nameProduct: value.nameProduct,
            totalPrice: value.price,
        };

        try {
            ProdutService.updateById(id, data)
                .then((result) => {
                    if (result.status === true) {
                        setToggleView(false);
                        return toast.success(result.message);
                    };
                })
                .catch((error) => { return toast.error(error); })
        } catch (error) {
            return toast.error(error);
        };
    };

    useEffect(() => {
        if (id) {
            try {
                ProdutService.getById(id)
                    .then((result) => {
                        setValue(prev => ({ ...prev, price: result.data["value"] }));
                        setValue(prev => ({ ...prev, category: result.data["category"] }));
                        setValue(prev => ({ ...prev, nameProduct: result.data["nameProduct"] }));
                    })
                    .catch((error) => { return toast.error(error) });
            } catch (error) {
                return toast.error(error);
            };
        } else {
            setValue(prev => ({ ...prev, "nameProduct": "" }));
            setValue(prev => ({ ...prev, "price": 0 }));
            setValue(prev => ({ ...prev, "category": "Bebida" }));
        }
    }, [id]);

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed top-0 left-0 w-full h-[100dvh] flex flex-col gap-10 justify-center items-center bg-slate-950/50`}>
            <Toaster />
            <div className="bg-white min-h-[300px] w-[350px] pb-5 rounded-md flex justify-center items-center flex-col gap-5">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">{action === "new" ? "Cadastrar Produto" : "Atualizar Produto"}</h6>
                </div>
                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Produto"
                        onChange={(change) => handleInput("nameProduct", change)}
                        value={value.nameProduct}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="number"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Preço"
                        onChange={(change) => handleInput("price", change)}
                        value={value.price}
                    />
                </label>

                <label className="flex flex-col text-slate-900 font-semibold">
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={value.category}
                        name="category"
                        defaultValue={`bebida`}
                        onChange={(category) => handleInput("category", category)}>
                        <option value={`Bebida`} >Bebida</option>
                        <option value={`Drink`} >Sucos & Drinks</option>
                        <option value={`Petisco`} >Petisco</option>
                        <option value={`Porcao`} >Porção</option>
                        <option value={`Refeicao`} >Refeição</option>
                        <option value={`Salada`} >Salada</option>
                        <option value={`Doce`} >Doce</option>
                    </select>
                </label>

                <button className="flex justify-center w-[250px] p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => action === "new" ? createProduct() : updateById()}
                ><Plus /> {action === "new" ? "Cadastrar" : "Atualizar"}</button>
            </div>

            <button className="flex justify-center p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                onClick={() => setToggleView(false)}
            ><Close /></button>
        </div>
    );
};