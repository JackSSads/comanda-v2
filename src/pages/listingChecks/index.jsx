import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { usePage } from "../../contexts";
import { Plus } from "../../libs/icons";
import { Navbar, NewCheck } from "../../components";
import { CheckService } from "../../service/check/CheckService";
import socket from "../../service/socket";

export const ListingChecks = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [hasCheckWhitOpen, setHasCheckWhitOpen] = useState([]);

    const { isNewCheck, setIsNewCheck } = usePage();

    useEffect(() => {
        handleChecks();
    }, [isNewCheck]);

    useEffect(() => {
        listAllCheckOpen();
    }, [rows])

    // lista_novo_pedido
    useEffect(() => {
        socket.on("lista_novo_pedido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Novo pedido na comanda</h6>
                        <span className="font-semibold">{data}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleChecks();
                        }}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            handleChecks();
        });

        return () => { socket.off("lista_novo_pedido") };
    }, []);

    // nova_comanda
    useEffect(() => {
        socket.on("nova_comanda", () => {
            toast("Nova comanda", { duration: 2000 });
            handleChecks();
        });

        return () => { socket.off("nova_comanda") };
    }, []);

    // comanda_finalizada
    useEffect(() => {
        socket.on("comanda_finalizada", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data}</span> finalizada</h6>
            ), { duration: 2000 });
            handleChecks();
        });

        return () => { socket.off("comanda_finalizada") };
    }, []);

    // produto_pronto
    useEffect(() => {
        socket.on("produto_pronto", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.nameProduct}</span> pronto na comanda</h6>
                        <span className="font-semibold">{data.nameClient}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            handleChecks();
        });

        return () => { socket.off("produto_pronto") };
    }, []);

    // produto_removido
    useEffect(() => {
        socket.on("produto_removido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.product.nameProduct}</span> cancelado na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            handleChecks();
        });

        return () => { socket.off("produto_removido") };
    }, []);

    // alterar_quantidade
    useEffect(() => {
        socket.on("alterar_quantidade", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6><span className="font-semibold">{data.action} {data.product.nameProduct}</span> na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });

            handleChecks();

            return () => { socket.off("alterar_quantidade") };
        });
    }, []);

    // comanda_cancelada
    useEffect(() => {
        socket.on("comanda_cancelada", (data) => {
            toast(() => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ), { duration: 2000 });
        });

        handleChecks();
        return () => { socket.off("comanda_cancelada") };
    }, []);

    const handleChecks = useCallback(() => {
        try {
            CheckService.getAll()
                .then((result) => { setRows(result.data) })
                .catch((error) => { return toast.error(error); });
        } catch (error) {
            return toast.error(error);
        };
    }, []);

    const listAllCheckOpen = () => {
        const listCheck = []

        rows.forEach(item => {

            if (item.status) {
                let data = {
                    obs: item.obs,
                    _id: item._id,
                    status: item.status,
                    pagForm: item.pagForm,
                    products: item.products,
                    nameClient: item.nameClient,
                    totalValue: item.totalValue,
                };

                listCheck.push(data);
            };

        });
        setHasCheckWhitOpen(listCheck);
    };

    return (
        <>
            <Navbar title={`Todas as comandas`} isLogout />
            <div className="w-[95%] min-h-[90vh] py-3 px-5 rounded-xl flex items-center flex-col gap-5">
                <NewCheck />
                <Toaster />
                {hasCheckWhitOpen.length ? hasCheckWhitOpen.map((e) => (
                    <div className={` ${e.status ? "flex" : "hidden"}  justify-between items-center my-3 px-5 py-3 w-full rounded-xl bg-slate-100/20 shadow-md`}
                        key={e._id}>

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">{e.nameClient}</h3>
                            <h3 className="text-slate-400 font-semibold">{e.obs !== "" ? `OBS: ${e.obs}` : ""}</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Total:</span> R$ {e.totalValue.toFixed(2).replace(".", ",")}</h4>
                            <p>{e.status ? "" : "Encerrada"}</p>
                        </div>

                        <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => navigate(`/garcom/comanda/${e._id}`)}
                            disabled={!e.status}
                        ><Plus /></button>
                    </div>
                )) : (
                    <div className="flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">Você não possui comandas em aberto</h3>
                            <h3 className="text-slate-400 font-semibold">Clique em + Nova comanda</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Total:</span> R$ 0,00</h4>
                        </div>

                        <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => setIsNewCheck(true)}
                        ><Plus /></button>
                    </div>
                )}

                <button className="mt-[100px] flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                    onClick={() => setIsNewCheck(true)}
                ><Plus /> Nova comanda</button>
            </div>
        </>
    );
};