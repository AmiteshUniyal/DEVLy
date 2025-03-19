import { MdAddPhotoAlternate } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useContext } from "react";
import AppContext from "../../context/contextapi";
import axiosInstance from "../../api/axiosInstance";
import { FaSpinner } from "react-icons/fa";

const CreatePost = () => {
  const { flag, authUser } = useContext(AppContext);

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const ImgRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    try {
      let imgBase64 = null;

      if (img) {
        const file = img;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise((resolve, reject) => {
          reader.onload = () => {
            imgBase64 = reader.result;
            resolve();
          };
          reader.onerror = (error) => reject(error);
        });
      }

      const res = await axiosInstance.post(
        "/post/create",
        { text, img: imgBase64 },
        { withCredentials: true }
      );

      const data = res.data;
      setText("");
      setImg(null);
      setImgPrev(null);
      console.log("Post created successfully:", data);
    } catch (err) {
      console.error(
        "Failed to create post:",
        err.response?.data?.error || err.message
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setImgPrev(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imgPrev) {
        URL.revokeObjectURL(imgPrev);
      }
    };
  }, [imgPrev]);

  return (
    <div
      className={`flex p-4 items-start gap-4 border-b border-gray-500 ${
        flag ? "block" : "hidden"
      }`}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img
          src={authUser.profileImg || "/avatar-placeholder.png"}
          alt="Profile"
        />
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="w-full p-0 text-lg resize-none border-none focus:outline-none bg-transparent text-white placeholder-gray-400"
          placeholder="Start a Post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {imgPrev && (
          <div className="relative mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-500 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                setImgPrev(null);
                ImgRef.current.value = null;
              }}
            />
            <img
              src={imgPrev}
              alt="Uploaded preview"
              className="w-full h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex gap-3 border-t py-2 border-gray-500">
          <div className="flex gap-2 items-center">
            <MdAddPhotoAlternate
              className="text-blue-400 w-6 h-6 cursor-pointer"
              onClick={() => ImgRef.current.click()}
            />
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={ImgRef}
            onChange={handleImgChange}
          />
          <button
            className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 w-16 h-7"
            disabled={isPending}
          >
            {isPending ? <FaSpinner className="animate-spin" /> : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
