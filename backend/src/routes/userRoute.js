import { Router } from 'express'
import { loginUser, registerUser, logOutUser } from '../controllers/authController.js';
import { getUserDetails } from '../controllers/userController.js';
import { authVerify } from '../middleware/verifyUser.js';
import { loginValidation, registerValidation } from '../utils/validations.js';

const router = Router();

router.post('/register', registerValidation, registerUser)
router.post('/login', loginValidation, loginUser)
router.get('', authVerify, getUserDetails)
router.get('/logout', logOutUser)

export default router;