export const generateMeetingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const isValidMeetingCode = (code) => {
  if (!code) return false;

  return /^[A-Za-z0-9]{4,20}$/.test(code.trim());
};

export const getMeetingCodeFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code') || null;
};

export const buildMeetingURL = (code) => {
  return `${window.location.origin}/videomeet?code=${code}`;
};
