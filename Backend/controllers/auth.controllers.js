import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {
    try {
		const {fullName, username, email, password} = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid Email"});
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error : "Username is already taken"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error : "Email is already taken"});
        }

        if(password.length < 6){
            return res.status(400).json({error : "Password must be atleast 6 char long"})
        }

        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        });



        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        }
        else{
            res.status(400).json({error: "Invalid user data"});
        }
    }
    catch(error){
        console.log("error in signup controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            console.error("Missing username or password");
            return res.status(400).json({ error: "Username and Password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.error("User not found:", username);
            return res.status(400).json({ error: "Invalid Username or Password" });
        }
        
        if (!user.password) {
            console.error("Password is missing for user:", username);
            return res.status(400).json({ error: "Invalid Username or Password" });
        }

        let correctPassword;
        try {
            correctPassword = await bcrypt.compare(password, user.password);
        } 
        catch (error) {
            console.error("Error comparing passwords:", error.message);
            return res.status(500).json({ error: "Password verification failed" });
        }

        if (!correctPassword) {
            console.error("Incorrect password for user:", username);
            return res.status(400).json({ error: "Invalid Username or Password" });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } 
    catch (error) {
        console.error("error in login controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const logout = async (req, res) => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
  
      res.cookie("jwt", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
  
      res.status(200).json({ message: "Logged out Successfully" });
    } 
    catch (error) {
      console.log("Error in logout controller:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const getMe = async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);        
    } 
    catch (error) {
        console.log("error in getMe controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}