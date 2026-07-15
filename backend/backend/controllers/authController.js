import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        theme: user.theme,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // password has `select: false` in the schema, so explicitly request it here
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        theme: user.theme,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is already attached (minus password) by the `protect` middleware
    res.json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, goals, avatar, theme } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (goals !== undefined) user.goals = goals;
    if (avatar !== undefined) user.avatar = avatar;
    if (theme !== undefined) user.theme = theme;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        goals: updatedUser.goals,
        avatar: updatedUser.avatar,
        theme: updatedUser.theme,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @access  Private
 *
 * JWTs are stateless, so "logout" is really just a client-side action
 * (deleting the stored token). This endpoint exists mainly so the
 * frontend has a consistent API call to hit, and so we have a hook
 * here later if we add refresh-token/blacklist logic.
 */
export const logoutUser = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};
