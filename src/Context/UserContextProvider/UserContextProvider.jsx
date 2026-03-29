import { useEffect, useState } from "react";
import { userContext } from "./UserContextProvider";

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(
    localStorage.getItem("userData") || {},
  ); // get user Data as profile pic and email and name and others

  useEffect(() => {
    const user = localStorage.getItem("userData");
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/auth/login";
      }
    }
  }, []); // when reload the page and the userData expired and removed from local Storage, then will remove the token and wrong userData and redirect to login page to make login again
  return (
    <userContext.Provider value={{ userData, setUserData }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
