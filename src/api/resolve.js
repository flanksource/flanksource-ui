export const resolve = async (promise) => {
  let resolved = null;

  try {
    resolved = await promise;
  } catch (e) {
    resolved = { error: e };
  }

  return resolved;
};
