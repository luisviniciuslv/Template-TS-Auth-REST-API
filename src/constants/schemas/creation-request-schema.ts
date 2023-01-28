export const creation_request_schema = {
  email: { type: String, required: [true, 'Field is required'] },
  code: { type: String, required: [true, 'Field is required'] },
  created_at: { type: Date, default: Date.now }
};
