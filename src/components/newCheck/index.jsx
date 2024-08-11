import { useState } from "react";

import toast, { Toaster } from "react-hot-toast";

import { usePage } from "../../contexts";
import { Close } from "../../libs/icons";
import { CheckService } from "../../service/check/CheckService";
import socket from "../../service/socket";

export const NewCheck = () => {

    const [value, setValue] = useState({
        nameClient: "",
        obs: ""
    });

    const [loading, setLoading] = useState(false);

    const { isNewCheck, setIsNewCheck } = usePage();

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };


    const createCheck = () => {
        if (value.nameClient === "") {
            setValue(prev => ({ ...prev, nameClient: "Nova comanda" }));
        };

        if (value.nameClient !== "") {
            setLoading(true);

            const data = {
                nameClient: value.nameClient,
                obs: value.obs,
                products: [],
                totalValue: 0,
                status: true,
                pagForm: ""
            };

            try {
                CheckService.create(data)
                    .then((result) => {
                        if (result.status) {
                            socket.emit("nova_comanda", data);
                            setIsNewCheck(false);
                            return;
                        };

                        toast.error(result.message);
                    });
            } catch (error) {
                return toast.error(error);
            };
        };
    };

    return (
        <div className={`${isNewCheck ? "block" : "hidden"} fixed top-0 left-0 h-[100dvh] w-[100vw] bg-slate-950/50 py-3 px-1 flex flex-col justify-center items-center gap-5`}>
            <Toaster />
            <div className="h-[300px] w-[350px] rounded-xl border border-hidden bg-[#1C1D26] py-10 flex flex-col justify-between items-center text-slate-100">

                <div className="flex flex-col items-center gap-3">

                    <label className="w-[270px] text-sm font-bold mb-2 text-slate-400">
                        <input
                            className="text-white bg-transparent border border-[#393636] rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="nameClient"
                            name="nameClient"
                            required
                            placeholder="Nome do cliente"
                            onChange={(e) => handleInput("nameClient", e)}
                            value={value.nameClient}
                        />
                    </label>

                    <label className="w-[270px] text-sm font-bold mb-2 text-slate-400">
                        <input
                            className="text-white bg-transparent border border-[#393636] rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="indicacao"
                            name="obs"
                            required
                            placeholder="Observação"
                            onChange={(e) => handleInput("obs", e)}
                            value={value.obs}
                        />
                    </label>
                </div>

                <button onClick={() => createCheck()}
                    disabled={loading}
                    className="w-[270px] rounded-xl bg-[#EB8F00] text-[#1C1D26] font-semibold p-3 border border-transparent hover:border-[#EB8F00] hover:bg-[#1C1D26] hover:text-white"
                >Cadastrar</button>
            </div>

            <button className="text-white p-2 rounded-md font-semibold bg-[#1C1D26] hover:text-[#1C1D26] hover:bg-[#EB8F00]"
                onClick={() => setIsNewCheck(false)}
            ><Close /></button>

        </div>
    );
};