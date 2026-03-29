import { AppNavbar } from "../../Components/Static/Navbar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
};
