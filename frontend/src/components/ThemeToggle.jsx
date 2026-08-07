import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-lg
                bg-slate-200
                dark:bg-slate-700
                hover:scale-105
                transition
            "
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
                <Moon className="w-5 h-5 text-slate-700" />
            )}
        </button>
    );
};

export default ThemeToggle;