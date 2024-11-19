import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { useToggleView } from "../../contexts";
import { ModalProduct } from "../../components";
import { Delete, Edit, Close } from "../../libs/icons";
import { ProdutService } from "../../service/produt/ProdutService";

export const ShowEditProducts = () => {

    const [listProducts, setListProducts] = useState([]);
    const { toggleView, setToggleView } = useToggleView();

    const [filtro, setFiltro] = useState("");
    const [idProduct, setIdProduct] = useState(null);
    const [action, setAction] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getAllProducts();
    }, [toggleView]);

    const getAllProducts = useCallback(async () => {
        try {
            await ProdutService.getAll()
                .then((result) => { setListProducts(result.data); })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    }, []);

    const deleteById = async (_id) => {
        try {
            await ProdutService.deleteById(_id)
                .then((result) => {
                    if (result.status) {
                        getAllProducts();
                        toast.success("Produto deletado");
                    };
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    };

    const haldletoggleViewModal = (action, _id) => {
        setAction(action);
        setIdProduct(_id);
        setToggleView(true);
    };

    const itensFiltrados = listProducts.filter(item =>
        item.nameProduct.toLowerCase().includes(filtro.toLowerCase())
    );

    // Pagination calculations
    const totalItems = itensFiltrados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = itensFiltrados.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <Navbar title={"Meus Produtos"} url />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-6">
                <Toaster />
                <ModalProduct action={action} id={idProduct} />

                <div className="border flex flex-col-reverse justify-center gap-5 px-3 py-5 w-full rounded-xl shadow-md">
                    <label className="flex gap-2 items-center">
                        <input
                            type="text"
                            className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Buscar produto..."
                            onChange={(e) => setFiltro(e.target.value)}
                            value={filtro}
                        />
                        <button type="button" className="border-2 rounded-xl p-[10px] hover:text-red-600 hover:border-red-600 transition-all delay-75">
                            <i onClick={() => setFiltro("")}><Close /></i>
                        </button>
                    </label>
                    <button className="font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => haldletoggleViewModal("new")}
                    >Novo Produto</button>
                </div>

                {currentItems.length === 0 && (
                    <div className="font-semibold text-xl">Nenhum produto foi encontrado</div>
                )}

                {currentItems.map((e) => (
                    <div key={e._id} className="border flex justify-between bg-slate-100/20 items-center px-3 py-2 w-full rounded-xl shadow-md">

                        <div className="w-2/3 flex flex-col items-start">
                            <h3 className="text-slate-900 font-bold">{e.nameProduct}</h3>
                            <h3 className="text-slate-500 text-[15px] font-semibold">R$ {e.value.toFixed(2).replace(".", ",")}</h3>
                            <h3 className="text-[#EB8F00] text-[15px]">{e.category}</h3>
                        </div>

                        <div className="flex gap-8 border-l-2 pl-3">
                            <button className=" text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => haldletoggleViewModal("edit", e._id)}
                            ><Edit /></button>

                            <button className=" text-slate-900 hover:text-red-500 transition-all delay-75"
                                onClick={() => deleteById(e._id)}
                            ><Delete /></button>
                        </div>
                    </div>
                ))}

                {totalPages > 1 && (
                    <div className="flex items-center gap-3 mt-5">
                        <button
                            className="font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >Anterior
                        </button>

                        <span>{currentPage} de {totalPages}</span>
                        
                        <button
                            className="font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >Próxima
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
