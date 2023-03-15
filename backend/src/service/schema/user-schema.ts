import {JSONSchemaType} from 'ajv';

// create user interface
interface CreateUser {
  name: string;
}

/** Create board schema */
export const createBoardSchema: JSONSchemaType<CreateUser> = {
  type: 'object',
  properties: {
    name: {type: 'string'},
  },
  required: ['name'],
};

