// import { DarkThemeToggle } from "flowbite-react";
import AppRoutes from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApp } from "./hooks/app";
function App() {
  const { isDarkMode } = useApp();
  return (
    <>
        <AppRoutes />
      <ToastContainer
        theme={isDarkMode ? "dark" : "light"}
        autoClose={10_000}
        stacked
      />
    </>
  );
}

export default App;
