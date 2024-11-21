import {CiLight} from "react-icons/ci";
import {useEffect, useState} from "react";

export default function ToggleTheme() {
    const initialTheme = localStorage.getItem("theme") || "light";
    const [theme, setTheme] = useState(initialTheme);

    function changeTheme() {
        if (theme === "light") {
            setTheme("dracula");
        } else {
            setTheme("light");
        }
    }
    
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme") || "dracula";
        document.querySelector("html")?.setAttribute("data-theme", localTheme);
        document.querySelector("main")?.setAttribute("data-theme", localTheme)
    }, [theme]);
    
    return (
        <div className="navbar-end">
            <button onClick={changeTheme} className="btn min-h-0 h-auto p-2">
                <CiLight className="h-6 w-6 text-base-content"></CiLight>
            </button>
        </div>
    )
}