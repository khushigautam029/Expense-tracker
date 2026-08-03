import {
    BarChart3,
    CreditCard,
    FileText,
    LayoutDashboard,
    Wallet
} from "lucide-react";

import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Income",
            path: "/income",
            icon: Wallet,
        },
        {
            name: "Expenses",
            path: "/expenses",
            icon: CreditCard,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: FileText,
        },
    ];

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40
                h-screen
                border-r border-slate-200
                bg-white
                transition-all duration-300
                ${collapsed ? "w-[76px]" : "w-[240px]"}
            `}
        >

            {/* Logo */}
            <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <BarChart3 size={21} />
                    </div>

                    {!collapsed && (
                        <span className="text-lg font-bold text-slate-800">
                            ExpenseTrack
                        </span>
                    )}
                </div>
            </div>


            {/* Menu */}
            <div className="px-3 py-6">

                {!collapsed && (
                    <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-slate-400">
                        MAIN MENU
                    </p>
                )}

                <nav className="space-y-1">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3
                                    rounded-lg
                                    px-3 py-3
                                    text-sm font-medium
                                    transition
                                    ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }
                                    ${collapsed ? "justify-center" : ""}
                                `}
                            >

                                <Icon size={19} />

                                {!collapsed && (
                                    <span>{item.name}</span>
                                )}

                            </NavLink>
                        );
                    })}
                </nav>
            </div>


            {/* Bottom */}
            <div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-3">

                <button
                    className={`
                        flex w-full items-center gap-3
                        rounded-lg px-3 py-3
                        text-sm font-medium text-slate-500
                        transition hover:bg-red-50 hover:text-red-500
                        ${collapsed ? "justify-center" : ""}
                    `}
                >


                </button>

            </div>

        </aside>
    );
};

export default Sidebar;