import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //ms
		httpOnly: true,     // prevent XSS attacks cross-site scripting attacks
		sameSite: "None", // ✅ Required for cross-origin requests
		secure: true, // ✅ Must be true for cross-origin cookies in production
	});
};