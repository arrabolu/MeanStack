export const createError = (statsCode, message) => {
  const err = new Error();
  err.message = message;
  err.status = statsCode;
  return err;
};
