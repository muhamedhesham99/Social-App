import { RouterProvider } from "react-router-dom";
import { Routes } from "./Routing/App/AppRouting";

function App() {
  return (
    <>
      <RouterProvider router={Routes} />
    </>
  );
}

export default App;
