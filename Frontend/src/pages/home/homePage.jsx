import { useContext } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import AppContext from "../../context/contextapi";


const HomePage = () => {
  
  const {postType, toggleType} = useContext(AppContext);

  return (
    <>
      <div className="flex-grow border-r border-gray-500 text-white">
        <div className="flex w-full border-b border-gray-500">
          <div
            className={`flex justify-center flex-1 p-3 transition rounded-2xl duration-300 cursor-pointer ${
              postType === "forYou" ? "bg-cyan-600" : "hover:bg-cyan-600"
            }`}
            onClick={() => toggleType("forYou")}
          >
            For you
          </div>
          <div
            className={`flex justify-center flex-1 p-3 transition rounded-2xl duration-300 cursor-pointer ${
              postType === "following" ? "bg-cyan-600" : "hover:bg-cyan-600"
            }`}
            onClick={() => toggleType("following")}
          >
            Following
          </div>
        </div>
        <CreatePost/>
        <Posts />
      </div>
    </>
  )
};

export default HomePage;

