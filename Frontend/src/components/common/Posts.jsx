import Post from "./post";
import axiosInstance from "../../api/axiosInstance";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/contextapi";
import { FaSpinner } from "react-icons/fa";

const Posts = ({ type, username, Id }) => {
  const { authUser, posts, setPosts } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPostEndpoint = () => {
    if (type === "forYou") {
      return "/post/all";
    } else if (type === "following") {
      return "/post/following";
    } else if (type === "posts") {
      return `/post/user/${username}`;
    } else if (type === "likes") {
      return `/post/likes/${Id}`;
    } else {
      return "/post/all";
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(getPostEndpoint(), {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [type, authUser?.username, authUser?._id]);

  return (
    <>
      {error && <p className="text-center my-4 text-red-500">{error}</p>}
      {isLoading ? (
        <div className="flex justify-center pt-8">
          <div className="flex flex-col items-center gap-2">
            <FaSpinner className="text-4xl text-blue-600 animate-spin" />
            <p className="text-lg text-gray-400">Just a sec...</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center my-4 text-gray-400">No posts available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
