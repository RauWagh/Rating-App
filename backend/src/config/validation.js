export const nameConstraints = { min: 20, max: 60 };
export const addressConstraints = { max: 400 };
export const passwordConstraints = {
  min: 8,
  max: 16,
  pattern: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/,
};

export function validatePassword(password) {
  return passwordConstraints.pattern.test(password);
}

