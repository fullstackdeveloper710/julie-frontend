import joi, { ObjectSchema } from "joi";
import RESPONSE_CODES from "../constant/responseCode.js";
import { CustomError } from "../errors/custom.error.js";


const Validate = (data: object, schema: ObjectSchema = joi.object({}),) => {
    const { error } = schema.validate(data);
    const valid = error == null;
    if (!valid) {
        const { details } = error;
        let message = details.map(i => i.message).join(',');
        message = message.replace(/['"]/g, "");
        throw new CustomError(RESPONSE_CODES.UNPROCESSABLE_ENTITY, message)
    }
};

export default Validate;


