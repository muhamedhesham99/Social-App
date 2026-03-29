import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TokenContextProvider } from "./Context/TokenContext/TokenContext.jsx";
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import UserContextProvider from "./Context/UserContextProvider/UserContextProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer autoClose={2000} />
    <QueryClientProvider client={queryClient}>
      <TokenContextProvider>
        <UserContextProvider>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </UserContextProvider>
      </TokenContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
