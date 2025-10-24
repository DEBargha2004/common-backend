export class SuccessResponse<T extends any = any> {
  public data = undefined as T;
  constructor(public message: string, public statusCode: number = 200) {}

  include(val: T) {
    this.data = val;
    return this;
  }
}
