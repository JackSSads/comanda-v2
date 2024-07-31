import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Plus } from "../../libs/icons";
import { Navbar } from "../../components";
import { ProdutService } from "../../service/produt/ProdutService";

export const CreateProdut = () => {

    const [value, setValue] = useState({
        nameProduct: "",
        price: 0,
        category: "Bebida"
    });

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

                    setValue(prev => ({ ...prev, "nameProduct": "" }));
                    setValue(prev => ({ ...prev, "price": 0 }));
                    setValue(prev => ({ ...prev, "category": "Bebida" }));
                });
        } catch (error) {
            return toast.error(error);
        };
    };

    return (
        <>
            <Navbar title={`Cadastrar produto`} url />
            <div className="mx-10 flex justify-center items-center flex-col gap-5">
                <Toaster />
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
                    onClick={() => createProduct()}
                ><Plus /> Cadastrar item</button>
            </div>
        </>
    );
};
