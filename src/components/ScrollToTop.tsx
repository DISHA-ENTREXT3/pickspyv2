import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures that whenever the route changes, the page scrolls back to the top.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
