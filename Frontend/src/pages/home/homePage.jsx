import { useContext, useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import AppContext from "../../context/contextapi";


const HomePage = () => {
  
  const {authUser} = useContext(AppContext);
  
  //just toggling the postType for home page
  const [postType, setPostType] = useState("forYou");
  const toggleType = (str) => {
   setPostType((prev) => str);
  }
  

  return (
      <div className="flex-grow border-r border-gray-500 text-white">
        <div className="relative flex w-full border-b border-gray-500">
          <div
            className="absolute top-0 bottom-0 w-1/2 bg-cyan-600 rounded-2xl transition-all duration-300"
            style={{
              left: postType === "forYou" ? "0%" : "50%",
            }}
          ></div>
          <div className="relative flex w-full">
            <div
              className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer ${
                postType === "forYou" ? "text-white" : "text-gray-300"
              }`}
              onClick={() => toggleType("forYou")}
            >
              For You
            </div>
            <div
              className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer ${
                postType === "following" ? "text-white" : "text-gray-300"
              }`}
              onClick={() => toggleType("following")}
            >
              Following
            </div>
          </div>
        </div>
        <CreatePost/>
        <Posts type={postType} username={authUser.username} Id={authUser._id}/>
      </div>
  )
};

export default HomePage;

