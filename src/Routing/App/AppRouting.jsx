import { createBrowserRouter } from "react-router-dom";
import { Home } from "../../Pages/Home/Home";
import { NotFound } from "../../Pages/NotFound/NotFound";
import { Login } from "../../Pages/Auth/Login";
import { Register } from "../../Pages/Auth/Register";
import { MainLayout } from "../../Layout/MainLayout/MainLayout";
import { AuthLayout } from "../../Layout/AuthLayout/AuthLayout";
import { MainProtectedRoute } from "../../Components/ProtectedRoute/MainProtectedRoute/MainProtectedRoute";
import { AuthProtectedRoute } from "../../Components/ProtectedRoute/MainProtectedRoute/AuthProtectedRoute";
import Feed from "../../Pages/Home/Feed/Feed";
import MyPosts from "../../Pages/Home/MyPosts/MyPosts";
import Community from "../../Pages/Home/Community/Community";
import Saved from "../../Pages/Home/Saved/Saved";
import HomeAllPosts from "../../Pages/Home/HomeAllPosts/HomeAllPosts";
import PostDetails from "../../Pages/PostDetails/PostDetails";
import AllSuggestedFriends from "../../Pages/AllSuggestedFriends/AllSuggestedFriends";
import { MyProfile } from "../../Pages/MyProfile/MyProfile";
import UserProfile from "../../Pages/UserProfile/UserProfile";
import Setting from "../../Pages/Setting/Setting";

export const Routes = createBrowserRouter([
  /************************** Main Pages **********************/
  {
    path: "",
    element: (
      <MainProtectedRoute>
        <MainLayout />
      </MainProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: "home",
        element: <Home />,
        children: [
          { index: true, element: <HomeAllPosts /> },
          { path: "feed", element: <Feed /> },
          { path: "myposts", element: <MyPosts /> },
          { path: "community", element: <Community /> },
          { path: "saved", element: <Saved /> },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "profile", element: <MyProfile /> },
      { path: "profile/:userId", element: <UserProfile /> },
      { path: "postDetails/:id", element: <PostDetails /> },
      { path: "suggestions", element: <AllSuggestedFriends /> },
      { path: "setting", element: <Setting /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  /************************** Register & Login Pages **********************/
  {
    path: "/auth",
    element: (
      <AuthProtectedRoute>
        <AuthLayout />
      </AuthProtectedRoute>
    ),
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
