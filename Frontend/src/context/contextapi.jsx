import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // just to toggle the create post button
    const [flag, setFlag] = useState(false);

    const toggleFlag = () => {
      setFlag((prev) => !prev);
    };

    // authentication state
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);

    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/auth/me', { withCredentials: true });
        setAuthenticated(true);
        setAuthUser(res.data || null);
        console.log("User authenticated:", res.data);
      } 
      catch (error) {
        if (error.response?.status === 401) {
          // the user is not logged in
          setAuthenticated(false);
          setAuthUser(null);
        } else {
          console.error('Unexpected error during authentication check:', error.response?.data?.error || error.message);
        }
      } 
      finally {
        setLoading(false); 
      }
    };
  
    useEffect(() => {
      checkAuth(); 
    }, [authUser]); 
     
    
    //this is used to remove and add posts simultaneously
	  const [posts, setPosts] = useState([]);
     
    
    const contextValues = {
      flag,
      toggleFlag,

      authenticated,
      loading,
      checkAuth,
      authUser,

      posts,

      setPosts,
    };
  
    return (
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    );
};

  export default AppContext;