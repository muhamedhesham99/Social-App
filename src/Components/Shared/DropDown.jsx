import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownItem,
} from "@heroui/react";
import { IoEarth } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { FaLock } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

/************************************ hero ui ********************************/
const DropDown = () => {
  // drop down of the post category as 'public, followers, only me'
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Public"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys],
  );
  /************************************ hero ui ********************************/
  
  /******************************* Start Hooks *********************************/
  const [selectedIcon, setSelectedIcon] = useState(null); // state for selected icon
  useEffect(() => {
    setSelectedIcon(<IoEarth />);
  }, []); // mounting phase
  /******************************* End Hooks *********************************/

  const dropDownItemData = [
    { key: "Public", icon: <IoEarth />, title: "Public" },
    { key: "Followers", icon: <HiUserGroup />, title: "Followers" },
    { key: "Only me", icon: <FaLock />, title: "Only me" },
  ]; // data of dropDownItemData

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="capitalize flex items-center justify-center"
          variant="bordered"
        >
          {selectedIcon}
          {selectedValue}
          <MdOutlineKeyboardArrowDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="single selection example"
        closeOnSelect={true}
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={setSelectedKeys}
      >
        {dropDownItemData.map((data) => {
          return (
            <DropdownItem
              key={data.key}
              startContent={data.icon}
              onPress={() => setSelectedIcon(data.icon)}
            >
              {data.title}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
