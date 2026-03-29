import { Button } from "@heroui/react";
import { NavLink } from "react-router-dom";

const HomeSideNavButton = ({ data: { path, icon, title } }) => {
  return (
    <Button
      className="bg-accent1 text-primary flex justify-start"
      as={NavLink}
      to={path}
      startContent={icon}
    >
      {title}
    </Button>
  );
};

export default HomeSideNavButton;
