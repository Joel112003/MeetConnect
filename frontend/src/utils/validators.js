
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true, error: '' }
}

export const normalizeEmail = (email) => String(email || "").trim().toLowerCase()

export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    }
  }

  return { isValid: true, error: '' }
}

export const validateLoginForm = (credentials) => {
  const { email, password } = credentials
  const errors = {}

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}


export const validateSignupForm = (credentials) => {
  const { email, password, confirmPassword, username } = credentials
  const errors = {}

  if (!username || username.trim().length < 2) {
    errors.username = 'Username must be at least 2 characters'
  }

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateOtp = (otp) => {
  const normalizedOtp = String(otp || "").trim()
  if (!normalizedOtp) {
    return { isValid: false, error: "OTP is required" }
  }
  if (!/^\d{6}$/.test(normalizedOtp)) {
    return { isValid: false, error: "OTP must be a 6-digit code" }
  }
  return { isValid: true, error: "" }
}

export const validateResetPasswordForm = ({ newPassword, confirmPassword }) => {
  const errors = {}

  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.isValid) {
    errors.newPassword = passwordValidation.error
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required"
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const formatValidationError = (errors) => {
  const errorMessages = Object.values(errors).filter(Boolean)
  return errorMessages[0] || 'Validation failed'
}
