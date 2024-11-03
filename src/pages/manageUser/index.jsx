import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { useToggleView } from "../../contexts";
import { Delete, Edit, Plus, Reflesh } from "../../libs/icons";
import { UsuarioService } from "../../service/usuario/UsuarioService";
import { SettingService } from "../../service/setting/SettingService";
import { ModalUser } from "../../components/modalUser";

export const ManageUser = () => {
    const { toggleView, setToggleView } = useToggleView();

    const [id, setId] = useState(null);

    const [listUser, setListUser] = useState([]);

    const [action, setAction] = useState(null);

    const [setting, setSetting] = useState({
        _id: "",
        establishmentName: "",
        serviceCharge: "",
        serviceChargePercentage: "",
        imagePix: ""
    });

    useEffect(() => {
        getAllUsers();
    }, [toggleView]);

    useEffect(() => {
        getSetting();
    }, []);

    const getSetting = useCallback(() => {
        SettingService.get()
            .then((result) => {
                setSetting(result);
            })
            .catch((error) => { return toast.error(error) });
    }, []);

    const updateSetting = useCallback(() => {
        const payload = {
            _id: setting._id,
            establishmentName: setting.establishmentName,
            serviceCharge: Boolean(setting.serviceCharge),
            serviceChargePercentage: Number(setting.serviceChargePercentage),
            imagePix: setting.imagePix
        };

        if (!payload._id) {
            return toast.error("Configurações não carregadas.");
        };

        SettingService.update(payload)
            .then((result) => {
                setSetting(result.data);
                toast.success(result.message);
            })
            .catch((error) => { return toast.error(error) });
    }, [setting]);

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

    const deleteUser = (_id) => {
        try {
            UsuarioService.deleteById(_id)
                .then((result) => {
                    toast.success(`${result.message}`);
                    getAllUsers()
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    };

    const handleModal = (action, id) => {
        setId(id);
        setAction(action);
        setToggleView(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSetting((prev) => ({ ...prev, imagePix: reader.result }));
        };

        if (file) {
            reader.readAsDataURL(file);
        };
    };

    const handleSetting = (onChange, e) => {
        switch (onChange) {
            case "establishmentName":
                setSetting((prev) => ({ ...prev, establishmentName: e.target.value }));
                break;
            case "serviceCharge":
                setSetting((prev) => ({ ...prev, serviceCharge: e.target.value === "true" }));
                break;
            case "serviceChargePercentage":
                setSetting((prev) => ({ ...prev, serviceChargePercentage: e.target.value }));
                break;
            default:
                break;
        };
    };

    return (
        <>
            <Navbar title={"Usuários"} url />
            <div className="flex flex-col gap-10 mb-10">
                <div className="flex justify-center items-center flex-col gap-5 border-b-2 pb-5">
                    <Toaster />
                    <ModalUser action={action} id={id} />

                    <div className="flex flex-col gap-1 mt-10 max-w-[300px]">
                        <h2 className="w-[300px] text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                        >Todos os usuários</h2>

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
                                                    onClick={() => handleModal("update", e._id)}
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
                    <button className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                        onClick={() => handleModal("new")}
                    ><Plus />Cadastrar usuário</button>
                </div>

                <div className="">
                    <h2 className="w-[300px] text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                    >Configurações</h2>

                    <div className="mt-5 flex flex-col gap-1">
                        <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                            Nome do Estabelecimento
                            <input
                                type="text"
                                id="establishmentName"
                                name="establishmentName"
                                className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => handleSetting("establishmentName", e)}
                                value={setting.establishmentName}
                            />
                        </label>

                        <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                            Cobrar Taxa de Serviço?
                            <select className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="serviceCharge"
                                name="serviceCharge"
                                value={setting.serviceCharge ? "true" : "false"}
                                onChange={(e) => handleSetting("serviceCharge", e)}>
                                <option value="true" >Sim</option>
                                <option value="false" >Não</option>
                            </select>
                        </label>

                        <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                            Percentual de Taxa de Serviço (%)
                            <input
                                type="number"
                                id="serviceChargePercentage"
                                name="serviceChargePercentage"
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => handleSetting("serviceChargePercentage", e)}
                                value={setting.serviceChargePercentage}
                            />
                        </label>

                        <label className={`${toggleView ? "-z-10" : ""} relative w-full flex flex-col items-center gap-3`}>
                            <div className="w-full flex flex-col items-center gap-3 border rounded-xl p-3 relative">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("qrcodepix").click()}
                                    className="w-full py-2 bg-[#EB8F00] text-white font-semibold rounded-lg hover:bg-[#1C1D26] transition-all"
                                >
                                    QR Code Pix
                                </button>

                                {setting.imagePix && (
                                    <div className="relative w-2/3">
                                        <img
                                            className="w-[250px] rounded-xl object-cover"
                                            src={setting.imagePix}
                                            alt="Imagem do QR Code Pix"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setSetting((prev) => ({ ...prev, imagePix: "" }))}
                                            className="absolute bottom-2 right-2 p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-100 transition-all"
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                id="qrcodepix"
                                name="qrcodepix"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>

                        <button
                            className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-white self-center mt-5
                            rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                            onClick={() => updateSetting()}
                        ><Reflesh />Atualizar configurações</button>
                    </div>
                </div>
            </div>
        </>
    );
};