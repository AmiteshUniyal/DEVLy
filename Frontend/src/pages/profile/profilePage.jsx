import { Link, useParams } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";

import Posts from "../../components/common/Posts";
import EditProfile from "./Editprofile";
import AppContext from "../../context/contextapi";
import axiosInstance from "../../api/axiosInstance";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgPrev, setCoverImgPrev] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPrev, setProfileImgPrev] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { authUser } = useContext(AppContext);

  //just toggling the postType for profile page
  const [postType, setPostType] = useState("posts");
  const toggleType = (str) => {
    setPostType((prev) => str);
  };

  const { username } = useParams();
  const isMyProfile = authUser?.username === username;

  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      if (isMyProfile) {
        setUserProfile(authUser);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/user/profile/${username}`);
        setUserProfile(res.data);
      } catch (err) {
        setError(err.res?.data?.error || "Failed to fetch userProfile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, authUser]);

  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (userProfile?.followers) {
      setIsFollow(userProfile.followers.some((id) => id === authUser?._id));
    }
  }, [userProfile, authUser]);

  const followUnfollow = async () => {
    try {
      await axiosInstance.post(`/user/follow/${userProfile._id}`);
      setIsFollow((prev) => !prev);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update follow status");
    }
  };

  function createdTime(timestamp) {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "long" }; // Format: "July 2021"
    return date.toLocaleDateString("en-US", options);
  }

  const joinedDate = createdTime(userProfile?.createdAt);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const imagePrev = URL.createObjectURL(file);
      if (state === "coverImg") {
        setCoverImg(file);
        setCoverImgPrev(imagePrev);
      }
      if (state === "profileImg") {
        setProfileImg(file);
        setProfileImgPrev(imagePrev);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (coverImgPrev) {
        URL.revokeObjectURL(coverImgPrev);
      }
      if (profileImgPrev) {
        URL.revokeObjectURL(profileImgPrev);
      }
    };
  }, [coverImgPrev, profileImgPrev]);

  const [isPending, setIsPending] = useState(false);

  const handleImgSubmit = async (e) => {
    setIsPending(true);

    try {
      let coverImgBase64 = null;
      let profileImgBase64 = null;

      if (coverImg) {
        const file = coverImg;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise((resolve, reject) => {
          reader.onload = () => {
            coverImgBase64 = reader.result;
            resolve();
          };
          reader.onerror = (error) => reject(error);
        });
      }

      if (profileImg) {
        const file = profileImg;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise((resolve, reject) => {
          reader.onload = () => {
            profileImgBase64 = reader.result;
            resolve();
          };
          reader.onerror = (error) => reject(error);
        });
      }

      const res = await axiosInstance.post("/user/update",
        { profileImg: profileImgBase64, coverImg: coverImgBase64 },
        { withCredentials: true }
      );

      const data = res.data;
      setProfileImg(null);
      setProfileImgPrev(null);
      setCoverImg(null);
      setCoverImgPrev(null);
      console.log("profile and coverimage are set successfully", data);
    } catch (err) {
      console.error(
        "Failed to update images",
        err.response?.data?.error || err.message
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
        {!isLoading && !userProfile ? (
          <p className="text-center text-lg mt-4">User not found....</p>
        ) : (
          <div className="flex flex-col">
            {!isLoading && userProfile && (
              <div>
                <div className="flex gap-10 px-4 py-2 items-center">
                  <Link to="/">
                    <FaArrowLeft className="w-4 h-4" />
                  </Link>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg">{userProfile?.fullName.length > 15 ? `${userProfile?.fullName.slice(0, 15)}...`: userProfile?.fullName}</p>
                  </div>
                </div>

                <div className="relative group">
                  <img
                    src={coverImgPrev || userProfile?.coverImg || "/cover.png"}
                    className="h-52 w-full object-cover object-center overflow-hidden"
                    style={{ maxHeight: "208px" }}
                    alt="cover image"
                  />
                  {isMyProfile && (
                    <div
                      className="absolute top-2 right-4 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200"
                      onClick={() => coverImgRef.current.click()}
                    >
                      <MdEdit className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <input
                    type="file"
                    hidden
                    ref={coverImgRef}
                    onChange={(e) => handleImgChange(e, "coverImg")}
                  />
                  <input
                    type="file"
                    hidden
                    ref={profileImgRef}
                    onChange={(e) => handleImgChange(e, "profileImg")}
                  />

                  <div className="absolute -bottom-16 left-3">
                    <div className="w-32 h-32 rounded-full relative group">
                      <img
                        src={
                          profileImgPrev ||
                          userProfile?.profileImg ||
                          "/avatar-placeholder.png"
                        }
                        className="rounded-full border-4 border-gray-800 w-32 h-32 object-cover object-center overflow-hidden"
                      />
                      {isMyProfile && (
                        <div className="absolute top-5 right-3 p-1 bg-blue-500 rounded-full group-hover:opacity-100 opacity-0 cursor-pointer">
                          <MdEdit
                            className="w-4 h-4 text-white"
                            onClick={() => profileImgRef.current.click()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-4 mt-5">
                  {isMyProfile && <EditProfile />}
                  {!isMyProfile && (
                    <button
                      className="border border-gray-500 text-white px-4 py-1 rounded-full text-sm hover:bg-gray-800"
                      onClick={followUnfollow}
                    >
                      {isFollow === true ? "Unfollow" : "Follow"}
                    </button>
                  )}

                  {/* Update button */}
                  {(coverImg || profileImg) && (
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-full text-sm ml-2 hover:bg-green-600"
                      onClick={(e) => handleImgSubmit(e)}
                    >
                      {isPending === true ? "Updating..." : "Update"}
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4 mt-14 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">
                      {userProfile?.fullName.length > 15 ? `${userProfile?.fullName.slice(0, 15)}...`: userProfile?.fullName}
                    </span>
                    <span className="text-sm text-slate-500 truncate">
                      @{userProfile?.username.length > 15 ? `${userProfile?.username.slice(0, 15)}...`: userProfile?.username}
                    </span>
                    <br />
                    <span className="text-sm my-1 break-all">{userProfile?.bio}</span>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    {userProfile?.link && (
                      <div className="flex gap-1 items-center ">
                        <>
                          <FaLink className="w-3 h-3 text-slate-400" />
                          <a
                            href={userProfile.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {userProfile?.link.replace("https://", "").length > 10 ? `${userProfile?.link.replace("https://", "").slice(0, 10)}...` : userProfile?.link.replace("https://", "")}
                          </a>
                        </>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <IoCalendarOutline className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        Joined {joinedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-xs">
                        {userProfile?.following.length}
                      </span>
                      <span className="text-slate-400 text-xs">Following</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-xs">
                        {userProfile?.followers.length}
                      </span>
                      <span className="text-slate-400 text-xs">Followers</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-full border-b border-gray-500 mt-4">
                  <div className="flex w-full">
                    <div
                      className={`flex justify-center flex-1 p-3 cursor-pointer ${
                        postType === "posts" ? "text-white" : "text-slate-400"
                      }`}
                      onClick={() => toggleType("posts")}
                    >
                      Posts
                    </div>
                    <div
                      className={`flex justify-center flex-1 p-3 cursor-pointer ${
                        postType === "likes" ? "text-white" : "text-slate-400"
                      }`}
                      onClick={() => toggleType("likes")}
                    >
                      Liked Posts
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300"
                    style={{
                      width: "50%",
                      left: postType === "posts" ? "0%" : "50%",
                    }}
                  ></div>
                </div>
              </div>
            )}
            {isMyProfile || isFollow ? (
              postType === "posts" || postType === "likes" ? (
                <div className="w-full overflow-hidden mb-12 md:mb-0">
                  <Posts
                    type={postType}
                    username={userProfile.username}
                    Id={userProfile._id}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-600 p-2">
                  <p>No Posts here.....😕</p>
                </div>
              )
            ) : (
              <div className="text-center text-gray-600 p-4">
                <p>This Account is Private</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
