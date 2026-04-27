export default interface IError {
    success: boolean;
    statusCode: number;
    message: string;
    error: {
        statusCode: number;
        message: string;
    };
}
