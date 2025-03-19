import express from 'express';
import { getUserProfile, followUnfollowUser, updateUserProfile, getSuggestedUser} from '../controllers/user.controllers.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/find", protectRoute, getSuggestedUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUserProfile );

export default router;