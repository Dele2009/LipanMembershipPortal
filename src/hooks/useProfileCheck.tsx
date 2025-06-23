import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useProfileCompletionGuard = (
  isOpen: boolean,
  runUserProfileCompletionCheck: () => void
) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/member") && pathname !== "/member/profile") {
      runUserProfileCompletionCheck(); // Initial check immediately

      const id = setInterval(() => {
        console.log("running periodic check...");
        if (!isOpen) {
          runUserProfileCompletionCheck();
          console.log("checked profile completion");
        } else {
          console.log("modal open – skipping check");
        }
      }, 10000); // 10 seconds

      return () => clearInterval(id);
    }
  }, [pathname, isOpen, runUserProfileCompletionCheck]);
};

export default useProfileCompletionGuard;
