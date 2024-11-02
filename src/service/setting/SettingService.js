import { API } from "../axiosConfig";

const  get = async () => {

    try {
        const result = await API.get("/setting");

        return result.data;
    } catch (error) {
        return new Error(error);
    };
};

const update = async (data) => {

    try {
        const result = await API.put("/setting", data);

        return result.data;
    } catch (error) {
        return new Error(error);
    };
};

export const SettingService = {
    get,
    update
};