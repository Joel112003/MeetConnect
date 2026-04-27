export const sendSuccess = (res, status, payload = {}) => {
  return res.status(status).json(payload);
};

export const sendError = (res, status, message, payload = {}) => {
  return res.status(status).json({ message, ...payload });
};
