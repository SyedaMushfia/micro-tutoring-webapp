import { useState, useEffect } from "react";

function useViewportWidth(): number {
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const fetchWidth = () => {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', fetchWidth);

        return () => {
            window.removeEventListener('resize', fetchWidth);
        };

    }, [])

    return width;
}

export default useViewportWidth;