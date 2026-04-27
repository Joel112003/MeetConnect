export const toPublicUser = (userDoc) => ({
  _id: userDoc._id,
  username: userDoc.username,
  email: userDoc.email,
  createdAt: userDoc.createdAt,
});
