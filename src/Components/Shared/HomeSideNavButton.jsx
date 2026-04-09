import { Button } from "@heroui/react";
import { NavLink } from "react-router-dom";

const HomeSideNavButton = ({ data: { path, icon, title } }) => {
  return (
    <Button
      className={`bg-accent1 text-primary flex justify-start`}
      as={NavLink}
      end={path === "/home"} // make the home not active in feed or community or saved Btn
      to={path}
      startContent={icon}
    >
      {title}
    </Button>
  );
};

export default HomeSideNavButton;
