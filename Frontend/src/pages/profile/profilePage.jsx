import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

import Posts from "../../components/common/Posts";
import EditProfile from "./Editprofile";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [postType, setpostType] = useState("posts");

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const isLoading = false;
	const isMyProfile = true;

	const user = {
		_id: "1",
		fullName: "Amitesh",
		username: "amiteshuniyal",
		profileImg: "",
		coverImg: "/cover.png",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		link: "hello.com",
		following: ["1", "2", "3"],
		followers: ["1", "3"],
	};

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if(file) {
			const imageURL = URL.createObjectURL(file);     
            state === "coverImg" && setCoverImg(imageURL);
            state === "profileImg" && setProfileImg(imageURL);
		}
	};

    useEffect(() => {
        return () => {
          if (coverImg) {
            URL.revokeObjectURL(coverImg);
          }
          if (profileImg) {
            URL.revokeObjectURL(profileImg);
          }
        };
    }, [coverImg, profileImg]);


	return (
		<>
			<div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<div>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
								</div>
							</div>

							<div className='relative group'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>

								<div className='absolute -bottom-16 left-3'>
									<div className='w-32 rounded-full relative group'>
										<img
											src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
											className='rounded-full border-4 border-gray-800'
										/>
										<div className='absolute top-5 right-3 p-1 bg-blue-500 rounded-full group-hover:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
                                
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfile/>}
								{!isMyProfile && (
									<button
										className='border border-gray-500 text-white px-4 py-1 rounded-full text-sm hover:bg-gray-800'
										onClick={() => alert("Followed successfully")}
									>
										Follow
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='bg-green-500 text-white px-4 py-1 rounded-full text-sm ml-2 hover:bg-green-600'
										onClick={() => alert("Profile updated successfully")}
									>
										Update
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-400' />
												<a
													href={user.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user.link.replace("https://"* "")}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-400' />
										<span className='text-sm text-slate-400'>Joined July 2021</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-400 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-400 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-500 mt-4'>
								<div
									className={`flex justify-center flex-1 p-3 cursor-pointer ${
										postType === "posts"
											? "text-white border-b-2 border-blue-500"
											: "text-slate-400"
									}`}
									onClick={() => setpostType("posts")}
								>
									Posts
								</div>
								<div
									className={`flex justify-center flex-1 p-3 cursor-pointer ${
										postType === "likes"
											? "text-white border-b-2 border-blue-500"
											: "text-slate-400"
									}`}
									onClick={() => setpostType("likes")}
								>
									Likes
								</div>
							</div>
						</div>
					)}
					<Posts />
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
