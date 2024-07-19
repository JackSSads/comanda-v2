import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Plus } from "../../libs/icons";
import { Navbar } from "../../components";
import { Delete, Edit } from "../../libs/icons";
import { UsuarioService } from "../../service/usuario/UsuarioService";

export const ManageUser = () => {

    const [id, setId] = useState("");

    const [value, setValue] = useState({
        func: "garcom",
        pass: "",
        email: "",
        nameUser: ""
    });

    const [listUser, setListUser] = useState([]);

    const [action, setAction] = useState("create");

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = useCallback(() => {
        try {
            UsuarioService.getAll()
                .then((result) => {
                    setListUser(result.data);
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    }, []);

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

    const user = () => {
        if (action === "create") {

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
                        getAllUsers();
                    })
                    .catch((error) => { return toast.error(error) });

                setValue(prev => ({ ...prev, pass: "" }));
                setValue(prev => ({ ...prev, email: "" }));
                setValue(prev => ({ ...prev, nameUser: "" }));

            } catch (error) {
                return toast.error(error);
            };

        } else if (action === "edit") {

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
                        getAllUsers();
                    });

                setValue(prev => ({ ...prev, pass: "" }));
                setValue(prev => ({ ...prev, email: "" }));
                setValue(prev => ({ ...prev, nameUser: "" }));
                setAction("create");

            } catch (error) {
                return toast.error(error);
            };
        };
    };

    const loadUser = (_id) => {
        try {
            UsuarioService.getById(_id)
                .then((result) => {
                    setAction("edit");
                    setId(result.data._id);
                    setValue(prev => ({ ...prev, func: result.data.func }));
                    setValue(prev => ({ ...prev, email: result.data.email }));
                    setValue(prev => ({ ...prev, nameUser: result.data.nameUser }));
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    };

    const deleteUser = (_id) => {
        try {
            UsuarioService.deleteById(_id)
                .then((result) => {
                    toast.success(`${result.message}`);
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    };

    return (
        <>
            <Navbar title={"Usuários"} url={"/admin"} />
            <div className="mx-10 flex justify-center items-center flex-col gap-5">
                <Toaster />
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
                    onClick={() => user()}
                ><Plus /> {action === "create" ? "Cadastrar usuário" : "Atualizar usuário"}</button>


                <div className="flex flex-col gap-1 mt-10">
                    <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold">Todos os usuários</h2>

                    <div className="mb-5 overflow-x-auto shadow-md sm:rounded-lg rounded-md">
                        <table className="w-[300px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Usuário
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        E-Mail
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Função
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Ação
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUser.map((e) => (
                                    <tr key={e._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <th scope="row" className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {e.nameUser}
                                        </th>
                                        <td className="px-2 py-2">
                                            {e.email}
                                        </td>
                                        <td className="px-2 py-2">
                                            {e.func === 'admin' ? 'ADM' : 
                                            e.func === 'garcom' ? 'Garçom' :
                                            e.func === 'barmen' ? 'Barmen' :
                                            e.func === 'cozinha' ? 'Cozinha' : ''}
                                        </td>
                                        <td className="px-2 py-2 flex">
                                            <button
                                                className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                                onClick={() => {
                                                    loadUser(e._id);
                                                }}
                                            ><Edit /></button>

                                            <button
                                                className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                                onClick={() => deleteUser(e._id)}
                                            ><Delete /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};