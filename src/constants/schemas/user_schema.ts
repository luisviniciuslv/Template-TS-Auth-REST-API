export const user_schema = {
  email: { type: String, required: [true, 'Field is required'] },
  password: { type: String, required: [true, 'Field is required'] },
  message: { type: String, required: false, default: '' }
};
