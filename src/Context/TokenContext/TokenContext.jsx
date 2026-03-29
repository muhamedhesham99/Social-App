import { useState } from "react";
import { TokenContext } from "./TokenContect";

export const TokenContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(
    localStorage.getItem("token") || "",
  ); // token of user is empty string or get from localStorage if is exist

  function updateTokenValue(newToken) {
    setUserToken(newToken);
  } // function to update token where will pass throw contect value
  return (
    <TokenContext.Provider value={{ userToken, updateTokenValue }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
