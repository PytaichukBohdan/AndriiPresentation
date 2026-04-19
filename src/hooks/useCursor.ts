import { useEffect, useRef } from "react";

export function useCursor(enabled: boolean = true) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = document.createElement("div");
    el.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "width:14px",
      "height:14px",
      "background:#CCFF00",
      "border:2px solid #000",
      "pointer-events:none",
      "z-index:9999",
      "transform:translate(-50%,-50%)",
      "transition:transform 40ms linear",
    ].join(";");
    document.body.appendChild(el);
    document.body.classList.add("brutal-cursor");
    ref.current = el;

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    const onDown = () => (el.style.transform = "translate(-50%,-50%) scale(1.6)");
    const onUp = () => (el.style.transform = "translate(-50%,-50%) scale(1)");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.removeChild(el);
      document.body.classList.remove("brutal-cursor");
      ref.current = null;
    };
  }, [enabled]);
}

export default useCursor;
