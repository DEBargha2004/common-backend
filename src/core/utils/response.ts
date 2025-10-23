export class SuccessResponse<T> {
  public data: any = undefined;
  constructor(public message: string, public statusCode: number = 200) {}

  include(val: any) {
    this.data = val;
    return this;
  }
}
