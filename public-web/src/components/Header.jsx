import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

function Header() {
    const navigate = useNavigate();
    const [clickCount, setClickCount] = useState(0);
    const resetTimer = useRef(null);

    function handleAdminEntry() {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (resetTimer.current) {
            clearTimeout(resetTimer.current);
        }

        if (newCount === 3){
            navigate("/admin/login");
            setClickCount(0);
            return;
        }

        resetTimer.current = setTimeout(() => {
            setClickCount(0);
        }, 2000); 

    }
    return (
        <header>
            <h1>
                הקליניקה של <span onClick={handleAdminEntry}>רוני</span>
            </h1>
        </header>
    );
}

export default Header;