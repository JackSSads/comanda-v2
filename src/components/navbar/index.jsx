import { useNavigate } from "react-router-dom";

import { usePage } from "../../contexts";

import { Back, ArrowRight } from "../../libs/icons";

export const Navbar = ({ title, url, isLogout }) => {

    const logoutButton = !!isLogout;

    const { isNewCheck } = usePage();

    const navigate = useNavigate();

    const backOldPage = () => {
        navigate(url);
    };

    const logout = () => {
        sessionStorage.removeItem("auth");
        navigate("/login");
    };

    return (
        <nav className={`fixed top-0 w-full h-16 px-5 flex ${url ? "justify-between" : logout ? "justify-between" : "justify-center"} items-center bg-[#EB8F00] text-slate-100`}>
            <h2 className="font-bold uppercase text-[18px]">{title}</h2>
            
            {url ?
                <button className="px-3 py-2 rounded-md bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                    onClick={backOldPage}
                ><Back /></button>
                : false}

            {(logoutButton && !isNewCheck) ?
                <button className="px-3 py-2 rounded-md border-2 border-red-600 bg-red-600 hover:text-red-600 hover:bg-transparent text-white transition-all delay-75"
                    onClick={logout}
                ><ArrowRight /></button>
                : false}
        </nav>
    );
};