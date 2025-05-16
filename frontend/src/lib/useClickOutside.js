import { useEffect } from "react";

export const useClickOutside = (callback, ...refs) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target))
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback, ...refs]);
};
