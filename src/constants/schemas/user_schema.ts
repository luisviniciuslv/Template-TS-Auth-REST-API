export const user_schema = {
  name: { type: String, required: [true, 'Field is required'] },
  email: { type: String, required: [true, 'Field is required'] },
  password: { type: String, required: [true, 'Field is required'] },
  message: { type: String, required: false }
}