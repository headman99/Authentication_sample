import { useState, useRef } from "react";

export default function useLongPress({ onClick, onLongPress }) {
    const [action, setAction] = useState()
    const timerRef = useRef();
    const isLongPressed = useRef(false);

    const handleOnMouseDown = () => {

        startPressTimer()
    }
    const handleOnMouseUp = () => {

        clearTimeout(timerRef.current)
    }
    const handleOnTouchStart = () => {

        startPressTimer()
    }
    const handleOnTouchEnd = () => {

        clearTimeout(timerRef.current)
    }

    const handleOnClick = () => {
        if (isLongPressed.current)
            return;
        setAction("click")
        if (typeof onClick === 'function') {
            onClick()
        }
    }

    const startPressTimer = () => {
        isLongPressed.current = false;
        timerRef.current = setTimeout(() => {
            setAction("longpress")
            isLongPressed.current = true
            if (typeof onLongPress === 'function') {
                onLongPress()
            }
        }, 500)
    }

    return {
        action,
        handlers: {
            onMouseDown: handleOnMouseDown,
            onMouseUp: handleOnMouseUp,
            onTouchStart: handleOnTouchStart,
            onTouchEnd: handleOnTouchEnd,
            onClick: handleOnClick
        }
    }
}