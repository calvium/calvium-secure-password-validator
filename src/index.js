const {regex, params} = require('./constants');

function checkLength(input, isAdmin) {
  if (!input) return {valid: false, message: 'No password'};
  const minLength = isAdmin ? params.MIN_ADMIN_LENGTH : params.MIN_LENGTH;
  const valid = input.length >= minLength;
  return {valid: valid, message: valid ? null : 'Password is too short. ' + minLength + ' is the minimum'};
}

function checkWhiteSpace(input) {
  const valid = regex.noSpaces.test(input);
  if (valid) return {valid: true};
  return {valid: false, message: 'Passwords cannot contain spaces'};
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
    message: `Password must meet at least contain at least three of the following: 
- Uppercase characters of European languages
- Lowercase characters of European languages
- Base 10 digits (i.e. 0 through 9)
- Non alphanumeric characters: ~!@#$%^&*_-+=\`\\|{}][)(;:’”<>,./?
- Any Unicode character that is categorized as an alphabetic character but is not uppercase or lowercase.  This includes Unicode characters from Asian languages.

Your password matched ${passes} of these.
`,
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
