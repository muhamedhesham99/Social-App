import { Outlet } from "react-router-dom";
import { FaRegBookmark, FaRegNewspaper } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { IoEarthOutline } from "react-icons/io5";
import HomeSideNavButton from "../../Components/Shared/HomeSideNavButton";
import PostCreate from "../../Components/Shared/PostCreate";
import SuggestedFriends from "../../Components/Shared/SuggestedFriends";

export const Home = () => {
  const sideNavButtonsData = [
    { path: "/home/feed", icon: <FaRegNewspaper />, title: "Feed" },
    { path: "/home/myposts", icon: <LuSparkles />, title: "My Posts" },
    { path: "/home/community", icon: <IoEarthOutline />, title: "Community" },
    { path: "/home/saved", icon: <FaRegBookmark />, title: "Saved" },
  ]; // object has data of side nav buttons of home page

  return (
    <>
      <main className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-[80%] xl:w-[90%] 2xl:w-[95%] mx-auto">
        {/********************** start sideNav-buttons *******************************************/}
        <aside
          id="sideNav-buttons"
          className="xl:col-span-3 xl:order-1 flex flex-col gap-2 xl:sticky top-20 self-start z-10"
        >
          {sideNavButtonsData.map((data, index) => {
            return <HomeSideNavButton key={index} data={data} />;
          })}
        </aside>
        {/********************** End sideNav-buttons *******************************************/}
        {/********************** Start sideNav-suggestion *******************************************/}
        <aside
          id="sideNav-suggestion"
          className="xl:col-span-3 xl:order-3 xl:sticky top-20 self-start z-10"
        >
          <SuggestedFriends />
        </aside>
        {/********************** End sideNav-suggestion *******************************************/}
        {/********************** Start Outlet Sections *******************************************/}
        <section id="posts" className="xl:col-span-6 xl:order-2  min-h-screen">
          <PostCreate />
          <Outlet />
          <div className="flex items-center justify-center text-accent2 text-sm mt-3">
            You reached the end
          </div>
        </section>
        {/********************** End Outlet Sections *******************************************/}
      </main>
    </>
  );
};
