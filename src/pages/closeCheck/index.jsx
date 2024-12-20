import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar, Calc } from "../../components";
import { CashierService } from "../../service/cashier/CashierService";
import { SettingService } from "../../service/setting/SettingService";
import { CheckService } from "../../service/check/CheckService";
import socket from "../../service/socket";

export const CloseCheck = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [disabledButton, setDisabledButton] = useState(true);

    const [check, setCheck] = useState({
        _id: "",
        nameClient: "",
        obs: "",
        products: [],
        status: false,
        totalValue: 0,
        pagForm: "",
    });

    const [setting, setSetting] = useState({
        serviceCharge: false,
        serviceChargePercentage: 0,
        imagePix: "",
    });

    const [cashier, setCashier] = useState({
        _id: "",
        comandas: []
    });

    const [union, setUnion] = useState([]);

    const [visibilityCalc, setVisibilityCal] = useState(false);

    useEffect(() => {
        getCheck();
        getCashier();
    }, []);

    useEffect(() => {
        if (cashier.comandas && cashier.comandas.length > 0) {
            for (let i = 0; i < cashier.comandas.length; i++) {

                // verificando se check já existe no cashier
                if (cashier.comandas[i]._id === id) {

                    const deleteCheck = cashier.comandas.filter(item => item._id !== id);

                    setCashier((prev) => ({ ...prev, comandas: deleteCheck }));
                };
            };
        };

        const newCheck = {
            _id: check._id,
            nameClient: check.nameClient,
            pagForm: check.pagForm,
            products: check.products,
            status: false,
            totalValue: check.totalValue,
            obs: check.obs
        };

        setUnion(() => [...(cashier.comandas || []), newCheck]);
    }, [check, cashier]);

    useEffect(() => {
        getSetting();
    }, []);

    const getSetting = useCallback(async () => {
        await SettingService.get()
            .then((result) => {
                setSetting(result);
            });
    }, []);

    const getCheck = useCallback(async () => {
        try {
            await CheckService.getById(id)
                .then((result) => {
                    if (result.data?._id) {
                        setCheck((prev) => ({
                            ...prev,
                            _id: result.data._id,
                            nameClient: result.data.nameClient,
                            obs: result.data.obs,
                            products: result.data.products,
                            status: result.data.status,
                            totalValue: result.data.totalValue,
                            pagForm: result.data.pagForm ? result.data.pagForm : "pix"
                        }));
                        setDisabledButton(false);
                    } else {
                        toast.error("Comanda não encontrada!");
                        return navigate(-1);
                    };
                });
        } catch (error) {
            toast.error(error);
            return navigate(-1);
        };
    }, [id]);

    const getCashier = useCallback(async () => {
        try {
            await CashierService.get()
                .then((result) => {
                    setCashier((prev) => ({
                        ...prev,
                        _id: result.data._id,
                        comandas: result.data.comandas
                    }));
                });
        } catch (error) {
            toast.error(error);
            return navigate(-1);
        };
    }, []);

    const editCheckStatus = () => {
        const data = {
            _id: check._id,
            nameClient: check.nameClient,
            obs: check.obs,
            products: check.products,
            status: false,
            totalValue: check.totalValue,
            pagForm: check.pagForm,
        };

        try {
            CheckService.updateById(id, data)
                .then((result) => {
                    toast.success(result.message);
                })
                .catch(() => {
                    toast.error("Ocorreu um erro na comunicação com o DB");
                });
        } catch (error) {
            toast.error(error);
            return navigate(-1);
        };
    };

    const closeCheck = () => {
        editCheckStatus();

        let totalValueCalculed = 0;

        for (let i = 0; i < union.length; i++) {
            let soma = union[i]["totalValue"];

            totalValueCalculed += soma;
        };

        const obj = {
            comandas: union,
            status: false,
            totalValue: totalValueCalculed
        };

        try {
            CashierService.update(cashier._id, obj)
                .then(() => {
                    if (check.status) {
                        socket.emit("comanda_finalizada", check.nameClient);
                        navigate(-2);
                    } else {
                        navigate(-2);
                    };
                });
        } catch (error) {
            return toast.error(error);
        };
    };

    const cancelCheck = () => {
        try {
            let totalValueCalculed = 0;

            for (let i = 0; i < cashier.comandas.length; i++) {
                let soma = cashier.comandas[i]["totalValue"];

                totalValueCalculed += soma;
            };


            const obj = {
                _id: cashier._id,
                comandas: cashier.comandas,
                totalValue: totalValueCalculed,
                status: false
            };

            CashierService.update(cashier._id, obj);

            CheckService.deleteById(id);

            const comanda_id = check._id;

            if (check.status) {
                socket.emit("comanda_cancelada", { comanda_id, id });
                navigate(-2);
            } else {
                navigate(-2);
            };

        } catch (error) {
            toast.error("Ocorreu um erro na comunicação com o DB");
        };
    };

    const alterVisibilityCalc = () => {
        setVisibilityCal(oldValue => !oldValue)
    };

    return (
        <>
            <Navbar title={`Finalizar: ${check.nameClient}`} url />
            <div className="w-[95%] min-h-[100vh] m-2 p-1 rounded-xl flex items-center justify-center flex-col gap-14">
                <Toaster />
                <div className="px-10 py-14 rounded-md shadow-xl bg-[#D39825]/10">
                    <ul className="max-w-2/3 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                        {check.products.map((e, index) => (
                            <li key={index}
                                className="w-[100%] flex justify-between gap-5 text-slate-700 font-semibold">
                                <span><span className="text-[#EB8F00]">{e.qnt}x</span> - {e.nameProduct}</span><span className="font-bold text-slate-500">R$ {e.totalPrice.toFixed(2).replace(".", ",")}</span>
                            </li>
                        ))}
                    </ul>

                    {setting.serviceCharge ? (
                        <>
                            <h2 className="mt-5 text-center text-slate-900 font-bold text-[22px]">
                                Consumo: <span className="text-slate-500">R$ {parseFloat(check.totalValue).toFixed(2).replace(".", ",")}</span>
                            </h2>
                            <h2 className="flex flex-col mt-5 text-center text-slate-900 font-bold text-[28px]">
                                Total + {setting.serviceChargePercentage}%: <span className="text-slate-500">R$ {parseFloat(check.totalValue + (check.totalValue * setting.serviceChargePercentage / 100)).toFixed(2).replace(".", ",")}</span>
                            </h2>
                        </>
                    ) : (
                        <h2 className="mt-5 text-center text-slate-900 font-bold text-[28px]">
                            Total: <span className="text-slate-500">R$ {parseFloat(check.totalValue).toFixed(2).replace(".", ",")}</span>
                        </h2>
                    )}
                </div>

                <label className="flex flex-col text-slate-900 text-[20px] font-semibold">
                    Pagar com:
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={check.selPagId}
                        name="selPag"
                        value={check.pagForm}
                        onChange={(e) => setCheck((prev) => ({ ...prev, pagForm: e.target.value }))}>
                        <option value={`pix`} >Pix</option>
                        <option value={`dinheiro`} >Dinheiro</option>
                        <option value={`credito`} >Crédito</option>
                        <option value={`debito`} >Débito</option>
                    </select>
                </label>

                {(setting.imagePix && check.pagForm === "pix") && (
                    <img
                        className="w-[250px] rounded-xl object-cover"
                        src={setting.imagePix}
                        alt="Imagem do QR Code Pix"
                    />
                )}

                <button className="w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    disabled={disabledButton}
                    onClick={() => closeCheck()}
                >{check.status ? "Finalizar Comanda" : "Atualizar Comanda"}</button>

                <div className="flex items-center">
                    <input
                        checked={visibilityCalc}
                        readOnly
                        id="default-radio-2"
                        type="radio"
                        value=""
                        name="default-radio"
                        onClick={() => alterVisibilityCalc()}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500  focus:ring-2 " />
                    <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900">{visibilityCalc ? 'Cal. Aberta' : 'Calc. Fechada'}</label>
                </div>

                <Calc visibilityCalc={visibilityCalc} />

                <button className=" w-[250px] p-3 font-semibold rounded-xl bg-red-600 text-white transition-all delay-75"
                    disabled={disabledButton}
                    onClick={() => cancelCheck()}
                >Cancelar Comanda</button>
            </div>
        </>
    );
};
