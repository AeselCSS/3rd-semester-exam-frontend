import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface NavButtonProps {
    to: string;
    children: ReactNode;
    onClick?: () => void;
    selected?: boolean;
}

export const NavButton = ({ to, children, onClick, selected }: NavButtonProps) => {
    return (
        <Link to={to} onClick={onClick} className="w-56">
            <button
                className={
                    selected
                        ? "text-gray-300 font-semibold bg-slate-600 p-4 w-full cursor-default"
                        : "text-gray-100 font-semibold bg-slate-700 p-4 w-full hover:bg-slate-600 transition-colors"
                }
            >
                {children}
            </button>
        </Link>
    );
}
