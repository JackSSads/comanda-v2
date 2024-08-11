import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components/navbar";
import { Plus, Delete, Minus, Close, ClipBoard } from "../../libs/icons";
import { ProdutService } from "../../service/produt/ProdutService";
import { CheckService } from "../../service/check/CheckService";
import socket from "../../service/socket";
import { ListinProductsForCheck } from "../../components/listinProductsForCheck";
import { useToggleView } from "../../contexts"

export const ListingProduts = () => {

    const { toggleView, setToggleView } = useToggleView()

    const navigate = useNavigate();

    const { id } = useParams();

    // listagem de produtos do db
    const [listProducts, setListProducts] = useState([]);

    // reunindo produtos em uma lista para comanda
    const [addProductsTiket, setAddProductsTiket] = useState([]);

    // produtos que já estão na comanda
    const [getProductComanda, setGetProductComanda] = useState([]);

    const [client, setClient] = useState([]);

    // lista atualizada de produtos - antigos + novos
    const [newProductsComanda, setNewProductsComanda] = useState([]);

    // Estado que armazena o termo de filtro digitado
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        setToggleView(false);
        getAllProducts();
        getCheckById();
    }, []);

    useEffect(() => {
        setNewProductsInComanda();
    }, [addProductsTiket, getProductComanda]);

    const getAllProducts = useCallback(() => {
        try {
            ProdutService.getAll()
                .then((result) => { setListProducts(result.data) })
                .catch((error) => { return toast.error(error); });
        } catch (error) {
            return toast.error(error);
        };
    }, []);

    const getCheckById = useCallback(() => {
        try {
            CheckService.getById(id)
                .then((result) => {
                    setClient(result.data.nameClient);
                    setGetProductComanda(result.data.products);
                })
                .catch((error) => { return toast.error(error); });
        } catch (error) {
            return toast.error(error);
        };
    }, [id]);

    const setNewProductsInComanda = () => {
        setNewProductsComanda([...addProductsTiket, ...getProductComanda]);
    };

    // adicionar produtos
    const addProduct = (_id) => {
        listProducts.forEach(item => {
            if (item._id === _id) {

                if (addProductsTiket.findIndex(product => product._id === _id) !== -1) {
                    return toast("Esse item já foi adicionado", { icon: "🤨", duration: 1200 });
                };

                const newList = [item, ...addProductsTiket];

                setAddProductsTiket(newList);

                return toast("Adicionado", { icon: "😉", duration: 1200 });
            };
        });
    };

    //remover item da lista
    const removeProduct = (_id) => {

        if (addProductsTiket.findIndex(product => product._id === _id) === -1) {
            return toast("Esse item nem foi adicionado", { icon: "🤨", duration: 1200 });
        };

        const newValeu = addProductsTiket.filter(product => product._id !== _id);
        setAddProductsTiket(newValeu);

        return toast("Removido", { icon: "🙄", duration: 1200 });
    };

    // Adicionar obsevação a item
    const obsProduct = (_id, value) => {

        // Primeiro adiciona o produto na lista e dps faz a observação
        const newList = [...addProductsTiket];
        const objEditedIndex = newList.findIndex(product => product._id === _id);

        // verificando se existe um produto para manipular
        if (objEditedIndex !== -1) {
            let objCloned = { ...newList[objEditedIndex] };
            objCloned.obs = value;
            newList[objEditedIndex] = objCloned;
            setAddProductsTiket(newList);
            return;
        } else {
            return toast.error("Primeiro + adicione o produto!", { duration: 1000 });
        };
    };

    // Editando quantidade de cada item
    const alterQnt = async (_id, action) => {

        const newList = [...addProductsTiket];
        const objEditedIndex = newList.findIndex(product => product._id === _id);

        // verificando se existe um produto para manipular
        if (objEditedIndex !== -1) {

            let objCloned = { ...newList[objEditedIndex] };

            if (action === "+") {
                objCloned.qnt += 1;
                toast(`${objCloned.qnt}`, { icon: "😎", duration: 1200 });
            } else if (action === "-" && objCloned.qnt > 1) {
                objCloned.qnt -= 1;
                toast(`${objCloned.qnt}`, { icon: "😒", duration: 1200 });
            };

            objCloned.totalPrice = objCloned.qnt * objCloned.value;
            const indexObjEdited = newList.findIndex(index => index._id === _id);
            newList[indexObjEdited] = objCloned;

            setAddProductsTiket(newList);
        } else {
            toast.error("Primeiro + adicione o produto!", { duration: 1200 });
        };
    };

    // enviar novos produtos para a comanda
    const postProducts = async () => {

        // verifica se existe itens na lista
        if (addProductsTiket.length === 0) {
            return toast.error("Adicione produtos", { duration: 2000 });
        };

        // calculando valor total dos pedidos
        let totalValueCalculed = 0;

        for (let i = 0; i < newProductsComanda.length; i++) {
            let value = Number(newProductsComanda[i]["totalPrice"]);

            totalValueCalculed += value;
        };

        const data = {
            products: newProductsComanda,
            totalValue: totalValueCalculed,
            status: true
        };

        const objSocket = {
            client,
            products: addProductsTiket
        }

        try {
            CheckService.updateById(id, data)
                .then(() => {
                    socket.emit("novo_pedido", objSocket);
                    navigate(`/garcom/comanda/${id}`);
                })
                .catch((error) => { return toast.error(`Ocorreu um erro inesperado! ${error}`); });

        } catch (error) {
            return toast.error("Ocorreu um erro inesperado!");
        };
    };

    const itensFiltrados = listProducts.filter(item =>
        item.nameProduct.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <Navbar title={`Produtos`} url />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[200px] px-3 rounded-xl flex items-center flex-col gap-10">
                <Toaster />
                <ListinProductsForCheck products={addProductsTiket} />
                <div className="fixed bottom-0 flex items-center justify-center w-full bg-[#EB8F00] p-1 text-center text-slate-100">
                    <div className="flex flex-col w-2/3">
                        {addProductsTiket.length ? (
                            <h5 className="text-xl my-3"><span className="font-bold">{addProductsTiket.length}</span> produtos</h5>
                        ) : (
                            <h5 className="text-xl my-3">Adicione produtos</h5>
                        )}

                        <button className="p-3 rounded-md text-white font-semibold bg-[#171821] hover:text-[#171821] border-2 border-transparent hover:border-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => {postProducts(); setToggleView(false)}}
                        >Adicionar</button>
                    </div>
                    { addProductsTiket.length > 0 &&
                        <button className="fixed bottom-1 right-1" onClick={() => setToggleView(!toggleView)}
                        ><ClipBoard /></button>
                    }
                </div>

                <div className="px-3 py-5 w-full rounded-xl shadow-md">
                    <label className="flex gap-2 items-center">
                        <input
                            type="text"
                            className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Buscar produto..."
                            onChange={(e) => setFiltro(e.target.value)}
                            value={filtro}
                        />
                        <i onClick={() => setFiltro("")}><Close /></i>
                    </label>
                </div>

                {itensFiltrados.map((item, index) => (
                    <div key={index} className="flex justify-between items-center px-3 py-5 w-full rounded-xl shadow-md">

                        <div className="w-2/3 flex flex-col items-start">
                            <h3 className="text-slate-900 font-bold">{item.nameProduct}</h3>
                            <h3 className="text-slate-500 text-[15px] font-semibold">R$ {item.value.toFixed(2).replace(".", ",")}</h3>
                            {addProductsTiket.findIndex(product => product._id === item._id) !== -1 && (
                                <label >
                                    <input
                                        type="text" placeholder="Observação"
                                        className="w-full mt-1 border border-slate-500 rounded-[5px] p-1"
                                        onChange={(e) => obsProduct(item._id, e.target.value)}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="h-full ml-5 flex items-center justify-center gap-5 border-l-2 pl-5">
                            <div className="flex flex-col-reverse items-center gap-1 border-2 border-slate-500 rounded-md">
                                <button className="p-1 border-t-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(item._id, "-")}
                                ><Minus /></button>

                                <p className="text-[#EB8F00] font-somibold">
                                    {addProductsTiket.find(product => product._id === item._id)?.qnt || 0}
                                </p>

                                <button className="p-1 border-b-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(item._id, "+")}
                                ><Plus /></button>
                            </div>

                            <div className="flex gap-5 flex-col">
                                <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-blue-500 hover:border-blue-500 transition-all delay-75"
                                    onClick={() => addProduct(item._id)}
                                ><Plus /></button>

                                <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-red-600 hover:border-red-600 transition-all delay-75"
                                    onClick={() => removeProduct(item._id)}
                                ><Delete /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
