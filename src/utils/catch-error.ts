export const catchError = async <
  E extends unknown = Error,
  T extends any = any
>(
  promise: Promise<T>
): Promise<[E, null] | [null, T]> => {
  try {
    const res = await promise;
    return [null, res];
  } catch (error) {
    return [error as E, null];
  }
};
