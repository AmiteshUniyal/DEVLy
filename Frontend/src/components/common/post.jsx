import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/contextapi";
import axiosInstance from "../../api/axiosInstance";

const Post = ({ post }) => {

  const {authUser} = useContext(AppContext);

  const [commentText, setCommentText] = useState("");
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const postCreator = post.user;
  let likedByUser = false;
  const submittingComment = false;
  const isUserPost = authUser?._id === post.user._id;
  const postTime = "1h ago";

  const removePost = async () => {
	try {
		const res = await axiosInstance.delete(`/post/${post._id}`, { withCredentials: true });

		if (res.status !== 200) {
			throw new Error(res.data?.error || "Something went wrong");
		}

		// Remove the post from the UI
		// setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
	} catch (error) {
		console.error("Error deleting post:", error.message);
		alert(error.response?.data?.error || "Failed to delete post.");
	}
};


  const submitComment = (e) => {
    e.preventDefault();
  };
  const toggleLike = () => {
	likedByUser = !likedByUser;
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-500">
      <div className="w-8 rounded-full overflow-hidden">
        <Link to={`/profile/${postCreator.username}`}>
          <img src={postCreator.profileImg || "/avatar-placeholder.png"} alt="User Profile" />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postCreator.username}`} className="font-bold">
            {postCreator.fullName}
          </Link>
          <span className="text-gray-500 flex gap-1 text-sm">
            <Link to={`/profile/${postCreator.username}`}>@{postCreator.username}</Link>
            <p> . {postTime}</p>
          </span>
          {isUserPost && (
            <span className="flex justify-end flex-1">
              <FaTrash className="cursor-pointer hover:text-red-500" onClick={removePost} />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden hello">
          <p>{post.text}</p>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-500"
              alt="Post Content"
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
			<div className="flex gap-4 items-center w-2/3 justify-between">
				
				<div className="flex gap-1 items-center cursor-pointer group"
					onClick={() => setIsCommentsVisible(!isCommentsVisible)}
				>
					<FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
					<span className="text-sm text-slate-500 group-hover:text-sky-400">
						{post.comments.length}
					</span>
				</div>

				{isCommentsVisible && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
					<div className="bg-gray-900 p-5 rounded-lg border border-gray-500 w-96 max-h-[80vh] overflow-auto">
						<h3 className="font-bold text-lg mb-4">COMMENTS</h3>
						<div className="flex flex-col gap-4">
							{post.comments.length === 0 ? (
							<p className="text-sm text-slate-500 text-center">Be the first one to comment 😉</p>
							) : (
							post.comments.map((comment) => (
								<div key={comment._id} className="flex gap-3 items-start bg-gray-800 p-3 rounded-lg shadow-md">
									<div className="w-10 h-10 rounded-full overflow-hidden">
										<img
										src={comment.user.profileImg || "/avatar-placeholder.png"}
										alt="Comment User"
										/>
									</div>
									<div className="flex flex-col flex-1">
										<div className="flex items-center gap-2">
											<span className="font-bold text-white">{comment.user.fullName}</span>
											<span className="text-gray-400 text-sm ">@{comment.user.username}</span>
										</div>
										<p className="text-gray-300 break-all">{comment.text}</p>
									</div>
								</div>
							))
							)}
						</div>
					<form className="mt-4 border-t border-gray-500 pt-4" onSubmit={submitComment}>
						<div className="flex items-center gap-3">
						<input
							type="text"
							className="w-full p-3 rounded-full text-md border border-gray-700 bg-gray-800 text-white shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
							placeholder="Write a comment..."
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
						/>
						<button className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all">
							{submittingComment ? "Posting..." : "Post"}
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

				{/* Repost Button */}
				<div className="flex gap-1 items-center cursor-pointer group">
				<BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
				<span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
				</div>

				{/* Like Button */}
				<div className="flex gap-1 items-center group cursor-pointer" onClick={toggleLike}>
					{!likedByUser ? (
						<FaRegHeart className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
					) : (
						<FaRegHeart className="w-4 h-4 text-red-500" />
					)}
					<span className={`text-sm group-hover:text-red-500 ${likedByUser ? "text-red-500" : "text-slate-500"}`}>
						{post.likes.length}
					</span>
				</div>
			</div>

			<div className="flex w-1/3 justify-end gap-2 items-center">
				<FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
			</div>
        </div>
      </div>
    </div>
	
  );
};

export default Post;
