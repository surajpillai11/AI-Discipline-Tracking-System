import { validationResult } from "express-validator";

/**
 * Runs after the validation chains defined in authValidators.js.
 * If any rule failed, respond with a 400 and a list of clean messages
 * instead of letting the request continue to the controller.
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};
