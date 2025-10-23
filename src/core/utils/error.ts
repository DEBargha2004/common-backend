export class ApplicationError extends Error {
  constructor(
    public message: any,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message);
  }
}
