import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    LayoutDashboard,
    Wallet
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {

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
            className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all duration-300 ${collapsed ? "w-[76px]" : "w-[240px]"}
            `}>
            {/* Logo */}
            <div className="flex h-[72px] items-center justify-between border-b border-slate-100  dark:border-slate-700 px-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <BarChart3 size={21} />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold text-slate-800 dark:text-white">
                            ExpenseTrack
                        </span>
                    )}
                </div>

                {/* Close/Expand Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

            </div>


            {/* Menu */}
            <div className="px-3 py-6">
                {!collapsed && (
                    <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500">
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
                                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition
                                    ${isActive
                                        ? ` bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`: `text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white`}${collapsed ? "justify-center" : ""}
                                `}>

                                <Icon size={19} />
                                {!collapsed && (
                                    <span>{item.name}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            
        </aside>
    );
};

export default Sidebar;