import registerHandler from "./auth/register.js";
import loginHandler from "./auth/login.js"
import { connectDB } from "../config/db.js";
import validation from "./middleware/validation.js";
import { logoutHandler } from "./auth/logout.js";
import { authMiddleware } from "./middleware/authMiddleware.js";


export{ registerHandler, loginHandler, connectDB, validation, logoutHandler, authMiddleware};