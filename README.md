Secure Password Validator
-------

Designed for some very specific password rules:

- Minimum of 8 characters
- Admin Account: 14 characters minimum 
- Combination of at least three of the following:
    - Uppercase characters of European languages
    - Lowercase characters of European languages
    - Base 10 digits (i.e. 0 through 9)
    - Non alphanumeric characters: ~!@#$%^&*_-+=`\|{}][)(;:’”<>,./?
    - Any Unicode character that is categorized as an alphabetic character but is not uppercase or lowercase.  This includes Unicode characters from Asian languages.
    
 Usage
 -----
 
 ```
 const validator = require('calvium-secure-password-validator');
 
 const {valid, message} = validator(passwordInput);
 
 if (!valid) {
    console.warn('Invalid Password', message); 
 }
 ```
 
 Message will be `undefined` if the validation succeeds. If it fails, then a helpful message explaining why is shown.
 
 Run the Tests
 -----
 
```
npm run test
``` 
