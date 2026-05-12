import { apiRequest } from "./apiClient";

export const api = {
  login: (email, password) =>
    apiRequest({
      url: "/api/v1/users/login",
      method: "POST",
      data: { email, password },
    }),

  getCurrentUser: () =>
    apiRequest({
      url: "/api/v1/users/me",
      method: "GET",
    }),

  updateProfile: (payload) =>
    apiRequest({
      url: "/api/v1/users/update-profile",
      method: "PUT",
      data: payload,
    }),

  changePassword: (currentPassword, newPassword, confirmPassword) =>
    apiRequest({
      url: "/api/v1/users/change-password",
      method: "PUT",
      data: { currentPassword, newPassword, confirmPassword },
    }),

  logoutAllDevices: () =>
    apiRequest({
      url: "/api/v1/users/logout-all-devices",
      method: "POST",
    }),

  signup: (username, email, password) =>
    apiRequest({
      url: "/api/v1/users/register",
      method: "POST",
      data: { username, email, password },
    }),

  googleLogin: (token) =>
    apiRequest({
      url: "/api/v1/users/google-login",
      method: "POST",
      data: { credential: token },
    }),

  checkUsernameAvailability: (username) =>
    apiRequest({
      url: "/api/v1/users/username-available",
      method: "GET",
      params: { username },
    }),

  logout: () =>
    apiRequest({
      url: "/api/v1/users/logout",
      method: "POST",
    }),

  getHistoryOfUser: () =>
    apiRequest({
      url: "/api/v1/users/history",
      method: "GET",
    }),

  addMeetingToHistory: (meetingCode) =>
    apiRequest({
      url: "/api/v1/users/history",
      method: "POST",
      data: { meetingCode },
    }),

  requestPasswordOtp: (email) =>
    apiRequest({
      url: "/api/v1/users/forgot-password",
      method: "POST",
      data: { email },
    }),

  verifyPasswordOtp: (email, otp) =>
    apiRequest({
      url: "/api/v1/users/verify-reset-otp",
      method: "POST",
      data: { email, otp },
    }),

  resetPassword: (email, newPassword) =>
    apiRequest({
      url: "/api/v1/users/reset-password",
      method: "POST",
      data: { email, newPassword },
    }),

  scheduleMeeting: (meetingData) =>
    apiRequest({
      url: "/api/v1/meetings/schedule",
      method: "POST",
      data: meetingData,
    }),

  getGoogleCalendarStatus: () =>
    apiRequest({
      url: "/api/v1/meetings/google/status",
      method: "GET",
    }),

  addToGoogleCalendar: (meetingId) =>
    apiRequest({
      url: "/api/v1/meetings/add-to-calendar",
      method: "POST",
      data: { meetingId },
    }),

  getScheduledMeetings: () =>
    apiRequest({
      url: "/api/v1/meetings",
      method: "GET",
    }),

  deleteMeeting: (meetingId) =>
    apiRequest({
      url: `/api/v1/meetings/${meetingId}`,
      method: "DELETE",
    }),

  updateMeeting: (meetingId, data) =>
    apiRequest({
      url: `/api/v1/meetings/${meetingId}`,
      method: "PUT",
      data,
    }),

  completeMeeting: (meetingId, status) =>
    apiRequest({
      url: `/api/v1/meetings/${meetingId}/complete`,
      method: "PATCH",
      data: { status },
    }),

  createRoom: () =>
    apiRequest({
      url: "/api/v1/meetings/create-room",
      method: "POST",
    }),

  validateMeetingCode: (code) =>
    apiRequest({
      url: `/api/v1/meetings/validate/${encodeURIComponent(code)}`,
      method: "GET",
    }),

};
