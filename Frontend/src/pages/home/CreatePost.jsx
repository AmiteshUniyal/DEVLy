import { MdAddPhotoAlternate } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useContext } from "react";
import AppContext from "../../context/contextapi";

const CreatePost = () => {

  const {flag} = useContext(AppContext);

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const ImgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Post created successfully");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const imageURL = URL.createObjectURL(file);
      setImg(imageURL);
    }
  };

  useEffect(() => {
    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  return (
    <div
      className={`flex p-4 items-start gap-4 border-b border-gray-500 ${
        flag ? "block" : "hidden" 
      }`}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img src={data.profileImg || "/avatar-placeholder.png"} alt="Profile" />
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="w-full p-0 text-lg resize-none border-none focus:outline-none bg-transparent text-white placeholder-gray-400"
          placeholder="Start a Post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-500 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                ImgRef.current.value = null;
              }}
            />
            <img
              src={img}
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
          <input type="file" hidden accept="image/*" ref={ImgRef} onChange={handleImgChange}/>
          <button
            className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-medium hover:bg-blue-600 transition"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
