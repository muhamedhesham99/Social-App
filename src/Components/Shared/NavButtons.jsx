import { NavbarItem } from "@heroui/react";
import { NavLink } from "react-router-dom";

const NavButtons = ({ data: { path, icon, title } }) => {
  return (
    <NavbarItem
      as={NavLink}
      to={path}
      className="flex gap-1 justify-center items-center rounded-xl p-2 hover:bg-primary hover:text-secondary transition duration-200"
    >
      {icon}
      {title}
    </NavbarItem>
  );
};

export default NavButtons;
