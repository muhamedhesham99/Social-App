import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import TokenContext from "../../Context/TokenContext/TokenContext";
import { userContext } from "../../Context/UserContextProvider/UserContextProvider";
import { toast } from "react-toastify";
import { FaHouse } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import NavButtons from "../Shared/NavButtons";
import { BiSolidMessageRounded } from "react-icons/bi";

export const AppNavbar = () => {
  const { userToken, updateTokenValue } = useContext(TokenContext); // user token for if user login the avatar profile will display and button sign will hidden and function updateTokenValue for reset the value after logout
  const { userData } = useContext(userContext); // get data of user after login as profile pic and username to use in navbar
  const dropDownList = [
    "Home",
    "Profile",
    "Notifications",
    "Setting",
    "Log Out",
  ]; // drop down list
  const { email, photo, name } = userData; // destruct userData

  const navButtonsData = [
    { path: "home/Feed", icon: <FaHouse />, title: "Feed" },
    { path: "profile", icon: <FaUser />, title: "Profile" },
    {
      path: "notifications",
      icon: <BiSolidMessageRounded />,
      title: "Notifications",
    },
  ]; // object has data of nav buttons

  function logOut() {
    localStorage.removeItem("token"); // remove token from local storage and updateTokenValue("") will remove token from localStorage and make re-render due to use updateTokenValue(""), then the AuthProtectedRoute will check if token not exist then the component will navigate to "auth/login"
    updateTokenValue("");
    toast.success("logged out successfully");
  } // function that handle logOut

  return (
    <Navbar className="bg-secondary text-primary shadow-xl rounded-xl mb-5">
      {/* Brand Name*/}
      <NavbarBrand>
        <Link to={"/home"}>
          <h1 className="font-bold text-inherit text-xl">Linked Posts</h1>
        </Link>
      </NavbarBrand>
      {/* Nav buttons*/}
      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        {navButtonsData.map((data, index) => {
          return <NavButtons key={index} data={data} />;
        })}
      </NavbarContent>
      {/* Nav Avatar*/}
      {userToken && ( //if the user login, show the avatar
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform cursor-pointer"
                name="Jason Hughes"
                size="sm"
                src={photo}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                aria-label={`Signed in as ${email}`}
                as={Link}
                to="/profile"
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{email}</p>
              </DropdownItem>
              {dropDownList.map((item) => (
                <DropdownItem
                  key={`${item.split(" ").join("")}`}
                  as={Link}
                  to={`/${item.split(" ").join("").toLowerCase()}`}
                  aria-label={item}
                  color="primary"
                  className={`
                    ${item === "Log Out" ? "bg-primary text-white" : undefined}
                  `}
                  onClick={item === "Log Out" ? logOut : undefined}
                >
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {/* this will return the first two name of full name*/}
          <h2 className="min-w-fit">
            {name?.split(" ").slice(0, 2).join(" ").toUpperCase()}
          </h2>
        </NavbarContent>
      )}
    </Navbar>
  );
};
