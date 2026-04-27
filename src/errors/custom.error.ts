export class CustomError extends Error {
    public _statusCode: any;
    public _message: string;
    constructor(public code: number, public message: string) {
        super();
        this.name = "CustomError";
        this._statusCode = code;
        this._message = message;
        Object.setPrototypeOf(this, CustomError.prototype);
    };
}