const {regex, params, messages} = require('./constants');

function checkLength(input, isAdmin) {
  if (!input) return {valid: false, message: 'No password'};
  const minLength = isAdmin ? params.MIN_ADMIN_LENGTH : params.MIN_LENGTH;
  const valid = input.length >= minLength;
  return {valid: valid, message: valid ? null : messages.tooShort(minLength)};
}

function checkWhiteSpace(input) {
  const valid = regex.noSpaces.test(input);
  if (valid) return {valid: true};
  return {valid: false, message: messages.noSpaces};
}

function checkMeetsMinimumCharacterClasses(input) {
  const checks = [regex.uppercase, regex.lowercase, regex.digits, regex.symbols];

  const passes = checks.reduce((ac, reg) => {
    return reg.test(input) ? ac + 1 : ac;
  }, 0);
  if (passes >= params.MIN_CLASSES) {
    return {valid: true};
  }
  return {
    valid: false,
    message: messages.requirements,
  };
}

/**
 * Validates the password.
 * This is the main export for the library
 *
 * @param input {string} password string to try out. null or undefined return false;
 * @param isAdmin {boolean} true if we have additional password requirements for admin users.
 * @returns {{valid: boolean, message?: string}}.  Message should be displayed in case of an invalid password. message is null if validate succeeded
 */
function validate(input, isAdmin) {
  let test = checkLength(input, isAdmin);
  if (!test.valid) return test;
  test = checkWhiteSpace(input);
  if (!test.valid) return test;
  test = checkMeetsMinimumCharacterClasses(input);
  if (!test.valid) return test;
  return test;
}

module.exports = validate;
