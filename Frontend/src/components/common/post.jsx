import {
  FaRegComment,
  FaRegHeart,
  FaTrash,
  FaHeart,
  FaSpinner,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/contextapi";
import axiosInstance from "../../api/axiosInstance";

const Post = ({ post }) => {
  const { authUser, posts, setPosts } = useContext(AppContext);

  const [commentText, setCommentText] = useState("");
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [likedByUser, setLikedByUser] = useState(() => {
    return post.likes.some((like) => like === authUser?._id);
  });
  const isUserPost = authUser?._id === post.user._id;
  const postCreator = post.user;
  const [isPending, setIsPending] = useState(false);
  const [isModal, setIsModal] = useState(false);

  function postingTime(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let i of intervals) {
      const value = Math.floor(diff / i.seconds);
      if (value !== 0) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
          -value,
          i.label
        );
      }
    }

    return "Just now";
  }

  const postTime = postingTime(post.createdAt);

  const removePost = async () => {
    try {
      const res = await axiosInstance.delete(`/post/${post._id}`, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        throw new Error(res.data?.error || "Something went wrong");
      }

      // Remove the post from the UI
      setPosts(posts.filter((p, _) => p._id !== post._id));
    } catch (error) {
      console.error("Error deleting post:", error.message);
      alert(error.response?.data?.error || "Failed to delete post.");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    setIsPending(true);

    try {
      await axiosInstance.post(
        `/post/comment/${post._id}`,
        { text: trimmedComment },
        { withCredentials: true }
      );

      setCommentText("");
    } catch (error) {
      console.error("Error commenting on post:", error);
      alert("Failed to post comment");
    } finally {
      setIsPending(false);
    }
  };

  const toggleLike = async () => {
    setLikedByUser((prev) => !prev);

    try {
      await axiosInstance.post(`/post/like/${post._id}`, {
        withCredentials: true,
      });

      // Update the global posts state inside useEffect
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: likedByUser
                  ? p.likes.filter((id) => id !== authUser._id)
                  : [...p.likes, authUser._id],
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      setLikedByUser((prev) => !prev); // revert UI change on error
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-500">
      <div className="w-8 rounded-full overflow-hidden ">
        <Link to={`/profile/${postCreator.username}`}>
          <img
            src={postCreator.profileImg || "/avatar-placeholder.png"}
            alt="User Profile"
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postCreator.username}`} className="font-bold">
            {postCreator.fullName.length > 15 ? `${postCreator.fullName.slice(0, 15)}...`: postCreator.fullName}
          </Link>
          <span className="text-gray-500 flex gap-1 text-sm">
            <Link to={`/profile/${postCreator.username}`}>
              @{postCreator.username.length > 15 ? `${postCreator.username.slice(0, 15)}...`: postCreator.username}
            </Link>
            <p> . {postTime}</p>
          </span>
          {isUserPost && (
            <span className="flex justify-end flex-1">
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={() => setIsModal(true)}
              />
            </span>
          )}
        </div>
        {isModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-5 rounded-lg border border-gray-500 max-h-[80vh] overflow-auto relative">
              <h2 className="text-xl text-center font-bold text-white mb-4">
                Delete this Post?
              </h2>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsModal(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    removePost();
                    setIsModal(false);
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 overflow-hidden break-words">
          <pre className="whitespace-pre-wrap break-words break-all">
            {post.text}
          </pre>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-500"
              alt="Post Content"
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-1/4 justify-between">
            {/* Like Button */}
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={toggleLike}
            >
              {!likedByUser ? (
                <FaRegHeart className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
              ) : (
                <FaHeart className="text-red-500 w-5 h-5" />
              )}
              <span
                className={`text-md group-hover:text-red-500 ${
                  likedByUser ? "text-red-500" : "text-slate-500"
                }`}
              >
                {post.likes.length}
              </span>
            </div>

            {/* Comment button */}
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => setIsCommentsVisible(!isCommentsVisible)}
            >
              <FaRegComment className="w-5 h-5 text-slate-400 group-hover:text-sky-400" />
              <span className="text-md text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>

            {isCommentsVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
                <div className="bg-gray-900 p-5 rounded-lg border border-gray-500 w-96 max-h-[80vh] overflow-auto">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-4">
                    {post.comments.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center">
                        Be the first one to comment 😉
                      </p>
                    ) : (
                      post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex gap-3 items-start bg-gray-800 p-3 rounded-lg shadow-md"
                        >
                          <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full overflow-hidden">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                              }
                              alt="Comment User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-1 w-full max-w-full">
                            <Link to={`/profile/${comment.user.username}`}>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  {comment.user.fullName.length > 15 ? `${comment.user.fullName.slice(0, 15)}...`: comment.user.fullName}
                                </span>
                                <span className="text-gray-400 text-sm truncate">
                                  @{comment.user.username.length > 15 ? `${comment.user.username.slice(0, 15)}...`: comment.user.username}
                                </span>
                              </div>
                            </Link>
                            <p className="text-gray-300 break-words overflow-hidden overflow-wrap break-word whitespace-pre-wrap">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <form
                    className="mt-4 border-t border-gray-500 pt-4"
                    onSubmit={submitComment}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        className="w-full p-3 rounded-full text-md border border-gray-700 bg-gray-800 text-white shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(() => e.target.value)}
                      />
                      <button
                        className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 w-16 h-7"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "Post"
                        )}
                      </button>
                    </div>
                  </form>
                  <button
                    onClick={() => setIsCommentsVisible(false)}
                    className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
