import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Plus, Close } from "../../libs/icons";
import { useToggleView } from "../../contexts";
import { UsuarioService } from "../../service/usuario/UsuarioService";

export const ModalUser = ({ action, id }) => {

    const { toggleView, setToggleView } = useToggleView();

    const [value, setValue] = useState({
        func: "garcom",
        pass: "",
        email: "",
        nameUser: ""
    });

    const handleInput = (e, action) => {
        switch (action) {
            case "func":
                setValue(prev => ({ ...prev, func: e })); break;
            case "pass":
                setValue(prev => ({ ...prev, pass: e })); break;
            case "email":
                setValue(prev => ({ ...prev, email: e })); break;
            case "nameUser":
                setValue(prev => ({ ...prev, nameUser: e })); break;

            default: return
        };
    };

    const createUser = () => {
        if (value.nameUser === "" || value.email === "" || value.pass === "" | value.func === "") {
            return toast.error("Preencha todos os campos!");
        };

        const data = {
            nameUser: value.nameUser,
            email: value.email,
            pass: value.pass,
            func: value.func
        };

        try {
            UsuarioService.create(data)
                .then((result) => {
                    toast.success(`${result.message}`);
                })
                .catch((error) => { return toast.error(error) });

            setValue(prev => ({ ...prev, pass: "" }));
            setValue(prev => ({ ...prev, email: "" }));
            setValue(prev => ({ ...prev, nameUser: "" }));

        } catch (error) {
            return toast.error(error);
        };
    };

    const updateById = () => {
        if (value.nameUser === "" || value.email === "" || value.pass === "" | value.func === "") {
            return toast.error("Preencha todos os campos!");
        };

        const data = {
            nameUser: value.nameUser,
            email: value.email,
            pass: value.pass,
            func: value.func
        };

        try {
            UsuarioService.updateById(id, data)
                .then((result) => {
                    toast.success(`${result.message}`);
                });

            setValue(prev => ({ ...prev, pass: "" }));
            setValue(prev => ({ ...prev, email: "" }));
            setValue(prev => ({ ...prev, nameUser: "" }));

        } catch (error) {
            return toast.error(error);
        };
    };

    const loadUser = () => {
        try {
            UsuarioService.getById(id)
                .then((result) => {
                    setValue(prev => ({ ...prev, func: result.data.func }));
                    setValue(prev => ({ ...prev, email: result.data.email }));
                    setValue(prev => ({ ...prev, nameUser: result.data.nameUser }));
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    };

    useEffect(() => {
        if (action === "update") {
            loadUser();
        } else {
            setValue(prev => ({ ...prev, pass: "" }));
            setValue(prev => ({ ...prev, email: "" }));
            setValue(prev => ({ ...prev, nameUser: "" }));
        };
    }, [action, id]);

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed top-0 left-0 w-full h-[100dvh] flex flex-col gap-10 justify-center items-center bg-slate-950/50`}>
            <Toaster />
            <div className="bg-white min-h-[300px] w-[300px] pb-5 rounded-md flex justify-center items-center flex-col gap-5 overflow-hidden">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">{action === "new" ? "Cadastrar Usuário" : "Atualizar Usuário"}</h6>
                </div>
                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nome de usuário"
                        onChange={(e) => handleInput(e.target.value, "nameUser")}
                        value={value.nameUser}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="email"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="E-mail"
                        onChange={(e) => handleInput(e.target.value, "email")}
                        value={value.email}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="password"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Senha"
                        onChange={(e) => handleInput(e.target.value, "pass")}
                        value={value.pass}
                    />
                </label>

                <label className="flex flex-col text-slate-900 font-semibold">
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={value.func}
                        name="func"
                        onChange={(e) => handleInput(e.target.value, "func")}>
                        <option value={`garcom`} >Garçom</option>
                        <option value={`barmen`} >Barmen</option>
                        <option value={`cozinha`} >Cozinha</option>
                        <option value={`admin`} >Administrador</option>
                    </select>
                </label>

                <button className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => { action === "new" ? createUser() : updateById() }}
                ><Plus /> {action === "new" ? "Cadastrar usuário" : "Atualizar usuário"}</button>
            </div>
            <button className="flex justify-center p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                onClick={() => setToggleView(false)}
            ><Close /></button>
        </div>
    );
};