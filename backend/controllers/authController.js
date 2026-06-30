import { authService } from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password fields are all required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters in length.',
      });
    }

    const userProfile = await authService.signup(name, email, password);

    return res.status(211).json({
      success: true,
      message: 'User created successfully.',
      data: userProfile,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are both required.',
      });
    }

    const loginData = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: loginData,
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    // req.user has been attached by authMiddleware after validating the token
    const email = req.user.email;
    const profile = await authService.getProfile(email);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};
