import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export class IdParamDto {
  @JoiSchema(
    Joi.string().id().required().messages({
      'string.base': 'Id must be a string',
      'string.empty': 'Id is required',
      'any.required': 'Id is required',
      'string.id': 'Id must be a valid id',
    }),
  )
  id: string;
}
