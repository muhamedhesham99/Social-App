import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export const AuthLayout = () => {
  const { pathname } = useLocation(); // get the path of location
  const [bgBtnClick, setBgBtnClick] = useState(
    pathname === "/auth/login" ? "login" : "register",
  ); // on reload make ternary operator if the path is '/auth/login' will put 'login' in the initial state where if not, then put 'register'

  useEffect(() => {
    setBgBtnClick(pathname === "/auth/login" ? "login" : "register");
  }, []);

  return (
    <section
      id="login-register"
      className="min-h-screen flex flex-col justify-center gap-10 items-center lg:flex-row lg:justify-start"
    >
      {/********************** Start Logo **********************/}
      <h1
        id="logo"
        className="text-center text-primary font-bold text-5xl w-full lg:w-4/12 lg:text-end xl:text-center mt-3"
      >
        LinkedPosts
      </h1>
      {/********************** End Logo **********************/}
      {/********************** Start Form **********************/}
      <div
        id="login-register-form"
        className="bg-accent1 w-9/12 lg:w-7/12 rounded-3xl p-3 mb-3 mt-3"
      >
        {/********************** Start login-register button **********************/}
        <div className="w-3/4 mx-auto p-2 rounded-medium text-2xl font-medium bg-gray-100 flex gap-5">
          <Button
            onPress={() => setBgBtnClick("login")}
            className={` w-1/2 text-center text-primary/70 data-[hover=true]:text-primary duration-75 rounded-medium p-1 cursor-pointer bg-gray-100 ${bgBtnClick == "login" ? "bg-accent1 text-primary!" : ""}`}
            variant="shadow"
            as={Link}
            to="/auth/login"
          >
            <h2>Login</h2>
          </Button>

          <Button
            onPress={() => setBgBtnClick("register")}
            className={` w-1/2 text-center text-primary/70 data-[hover=true]:text-primary  duration-75 rounded-medium p-1 cursor-pointer bg-gray-100 ${bgBtnClick == "register" ? "bg-accent1 text-primary!" : ""}`}
            variant="shadow"
            as={Link}
            to="/auth/register"
          >
            <h2>Register</h2>
          </Button>
        </div>
        {/********************** End login-register button **********************/}

        <Outlet />
      </div>
      {/********************** End Form **********************/}
    </section>
  );
};
