import {useState} from "react";
import { NavButton } from "./NavButton";

const NavBar = () => {
    const [selected, setSelected] = useState<string>(window.location.pathname);

    return (
        <nav className="bg-slate-700 w-full pl-32 pr-10 flex gap-2 items-center justify-between mt-16">
            <div className="flex justify-evenly items-center gap-5">
                <NavButton
                    to={"/"}
                    onClick={() => setSelected("/")}
                    selected={selected === "/"}
                >
                    Home
                </NavButton>

                <NavButton
                    to={"/participants"}
                    onClick={() => setSelected("/participants")}
                    selected={selected === "/participants"}
                >
                    Participants
                </NavButton>
                <NavButton
                    to={"/results"}
                    onClick={() => setSelected("/results")}
                    selected={selected === "/results"}
                >
                    Results
                </NavButton>
            </div>
        </nav>
    );
}

export default NavBar;