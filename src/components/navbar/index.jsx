import { useNavigate } from "react-router-dom";

import { usePage, useToggleView } from "../../contexts";
import { LogoutService } from "../../service/logout/LogoutService";
import { useConnectionMonitor } from "../../hooks/connectionMonitor"

import { Back, ArrowRight } from "../../libs/icons";

export const Navbar = ({ title, url, isLogout }) => {

    const isOnline = useConnectionMonitor()

    const logoutButton = !!isLogout;

    const { isNewCheck } = usePage();
    const { setToggleView } = useToggleView();

    const navigate = useNavigate();

    const backOldPage = () => {
        setToggleView(false);
        navigate(-1);
    };

    const logout = () => {
        LogoutService.logout()
            .then(() => {
                setToggleView(false);
                return navigate("/login");
            });
    };

    return (
        <nav className={`fixed top-0 w-full h-16 px-5 flex ${url ? "justify-between" : logout ? "justify-between" : "justify-center"} items-center bg-[#EB8F00] text-slate-100`}>

            <div>
                {!isOnline ? (
                    <h2 className={`transition-all delay-200 uppercase bg-red-600 px-3 py-2 rounded-md font-bold text-white`}>Sem internet</h2>
                ) : (
                    <h2 className="transition-all delay-200 font-bold uppercase text-[18px]">{title}</h2>
                )}
            </div>

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