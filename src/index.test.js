const validate = require('./index');
const {regex} = require('./constants');

test('null, undefined to be false', () => {
  expect(validate(null, false).valid).toBe(false);
  expect(validate(undefined, false).valid).toBe(false);
});

test('non admin: 7 chars is too short', () => {
  expect(validate('abcdefg', false).valid).toBe(false);
  expect(validate('abcdefg', false).message).toBe('Password is too short. 8 is the minimum');
});

test('admin: 13 chars is too short', () => {
  expect(validate('abcdefghijk', true).valid).toBe(false);
  expect(validate('abcdefghijk', true).message).toBe('Password is too short. 14 is the minimum');
});

test('uppercase Euro works with accented chars and ASCII', () => {
  expect(regex.uppercase.test('À')).toBe(true);
  expect(regex.uppercase.test('Ò')).toBe(true);
  expect(regex.uppercase.test('A')).toBe(true);
  expect(regex.uppercase.test('O')).toBe(true);
  expect(regex.uppercase.test('Ω')).toBe(true);
  expect(regex.uppercase.test('a')).toBe(false);
  expect(regex.uppercase.test('o')).toBe(false);
});

test('lowercase Euro works with accented chars and ASCII', () => {
  expect(regex.lowercase.test('å')).toBe(true);
  expect(regex.lowercase.test('ò')).toBe(true);
  expect(regex.lowercase.test('a')).toBe(true);
  expect(regex.lowercase.test('o')).toBe(true);
  expect(regex.lowercase.test('A')).toBe(false);
  expect(regex.lowercase.test('O')).toBe(false);
});

test('alphanumeric but not uppercase or lowercase', () => {
  const tests = ['あ', '中'];
  tests.forEach(t => {
    const valid = regex.nonUppercaseAndLowercaseAlphabeticalCharacters.test(t);
    if (!valid) {
      console.log(`Failed with ${valid.message}`, t);
    }
    expect(valid).toBe(true);
  });
});

test('symbols', () => {
  const symbols = '~!@#$%^&*_-+=`|{}][)(;:\'"<>,./?'.split('');
  symbols.forEach(s => {
    const actual = regex.symbols.test(s);
    expect(actual).toBe(true);
  });
});

test('not symbols', () => {
  const notSymbols = 'abc±§'.split('');
  notSymbols.forEach(s => {
    expect(regex.symbols.test(s)).toBe(false);
  });
});

test('has upper, lower, and symbol', () => {
  const tests = ['Ab%aaaaa', 'Àò!aaaaa'];

  tests.forEach(t => {
    const actual = validate(t, false);
    if (!actual.valid) {
      console.log(`Failed with ${actual.message}`, t);
    }
    expect(actual.valid).toBe(true);
  });
});

test('has digit, upper, and symbol', () => {
  const tests = ['111GGG!!!!', 'Àò!aaaaa'];

  tests.forEach(t => {
    const actual = validate(t, false);
    if (!actual.valid) {
      console.log(`Failed with ${actual.message} Input: ${t}`);
    }
    expect(actual.valid).toBe(true);
  });
});


test('various failures for 2 Rules', () => {
  const tests = ['!@£$%^&*()', 'abcdefghi', '123456789', '±±±±±±±±±§§§±±§§±±'];

  tests.forEach(t => {
    const actual = validate(t, false, 2);
    if (actual.valid) {
      console.log(`Unexpectedly passed password: ${t}`);
    }
    expect(actual.valid).toBe(false);
  });
});

test('various failures for 3 Rules', () => {
    const tests = ['11111!!!!', 'ò!aaaaa', 'aaaaaaaaaaaaaa', '±±±±±±±±±§§§±±§§±±', 'AAAA1111', 'AAAAaaaa'];

    tests.forEach(t => {
        const actual = validate(t, false, 3);
        if (actual.valid) {
            console.log(`Unexpectedly passed password: ${t}`);
        }
        expect(actual.valid).toBe(false);
    });
});

test('various failures for 4 Rules', () => {
    const tests = ['11111!!!!', 'ò!aaaaa', 'aaaaaaaaaaaaaa', '±±±±±±±±±§§§±±§§±±', '%$$Ω1!@$', 'AA11aabb', '@@@aaa111'];

    tests.forEach(t => {
        const actual = validate(t, false, 4);
        if (actual.valid) {
            console.log(`Unexpectedly passed password: ${t}`);
        }
        expect(actual.valid).toBe(false);
    });
});

test('various successes with 2 rules', () => {
    const tests = ['%$$Ω1!@$', 'AAAA1111', 'AAAAaaaa'];

    tests.forEach(t => {
        const actual = validate(t, false, 2);
        if (!actual.valid) {
            console.log(`Unexpectedly failed password: ${t}`);
        }
        expect(actual.valid).toBe(true);
    });
});

test('various successes with 3 rules', () => {
  const tests = ['%$$Ω1!@$', 'AA11aabb', '@@@aaa111'];

  tests.forEach(t => {
    const actual = validate(t);
    if (!actual.valid) {
      console.log(`Unexpectedly failed password: ${t}`);
    }
    expect(actual.valid).toBe(true);
  });
});

test('various successes with 4 rules', () => {
    const tests = ['%$$Ω1!@$a', 'A1a!bbbb', ',.<>Aa1b'];

    tests.forEach(t => {
        const actual = validate(t, false, 4);
        if (!actual.valid) {
            console.log(`Unexpectedly failed password: ${t}`);
        }
        expect(actual.valid).toBe(true);
    });
});
