import { useState } from "react";

import toast, { Toaster } from "react-hot-toast";

import { Close } from "../../libs/icons";
import socket from "../../service/socket";
import { useToggleView } from "../../contexts";
import { CheckService } from "../../service/check/CheckService";

export const NewCheck = () => {

    const [value, setValue] = useState({
        nameClient: "",
        obs: ""
    });

    const [loading, setLoading] = useState(false);

    const { toggleView, setToggleView } = useToggleView();

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
                            setToggleView(false);
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
        <div className={`${toggleView ? "block" : "hidden"} fixed top-0 left-0 h-[100dvh] w-[100vw] bg-slate-950/50 py-3 px-1 flex flex-col justify-center items-center gap-5`}>
            <Toaster />
            <div className="h-[300px] w-[300px] rounded-md border-hidden bg-white pb-10 flex flex-col justify-between items-center overflow-hidden">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">Nova comanda</h6>
                </div>
                <div className="flex flex-col items-center gap-3">

                    <label className="w-[270px] text-sm font-bold mb-2 text-[#1C1D26]">
                        <input
                            className="text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="nameClient"
                            name="nameClient"
                            required
                            placeholder="Nome do cliente"
                            onChange={(e) => handleInput("nameClient", e)}
                            value={value.nameClient}
                        />
                    </label>

                    <label className="w-[270px] text-sm font-bold mb-2 text-[#1C1D26]">
                        <input
                            className="text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="w-[270px] rounded-xl bg-[#EB8F00] text-white font-semibold p-3 hover:bg-[#1C1D26] hover:text-white"
                >Cadastrar</button>
            </div>

            <button className="flex justify-center p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                onClick={() => setToggleView(false)}
            ><Close /></button>

        </div>
    );
};