function stringMath(eq, callback) {
  if (typeof eq !== 'string') return handleCallback(new TypeError('The [String] argument is expected.'), null);
  const mulDivMod = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([*/%])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
  const plusMin = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([+-])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
  const parentheses = /(\d)?\s*\(([^()]*)\)\s*/;
  var current;
  while (eq.search(/^\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*$/) === -1) {
    eq = fParentheses(eq);
    if (eq === current) return handleCallback(new SyntaxError('The equation is invalid.'), null);
    current = eq;
  }
  return handleCallback(null, +eq);

  function fParentheses(eq) {
    while (eq.search(parentheses) !== -1) {
      eq = eq.replace(parentheses, function (a, b, c) {
        c = fMulDivMod(c);
        c = fPlusMin(c);
        return typeof b === 'string' ? b + '*' + c : c;
      });
    }
    eq = fMulDivMod(eq);
    eq = fPlusMin(eq);
    return eq;
  }

  function fMulDivMod(eq) {
    while (eq.search(mulDivMod) !== -1) {
      eq = eq.replace(mulDivMod, function (a) {
        const sides = mulDivMod.exec(a);
        const result = sides[2] === '*' ? sides[1] * sides[3] : sides[2] === '/' ? sides[1] / sides[3] : sides[1] % sides [3];
        return result >= 0 ? '+' + result : result;
      });
    }
    return eq;
  }

  function fPlusMin(eq) {
    eq = eq.replace(/([+-])([+-])(\d|\.)/g, function (a, b, c, d) { return (b === c ? '+' : '-') + d; });
    while (eq.search(plusMin) !== -1) {
      eq = eq.replace(plusMin, function (a) {
        const sides = plusMin.exec(a);
        return sides[2] === '+' ? +sides[1] + +sides[3] : sides[1] - sides[3];
      });
    }
    return eq;
  }

  function handleCallback(errObject, result) {
    if (typeof callback !== 'function') {
      if (errObject !== null) throw errObject;
    } else {
      callback(errObject, result);
    }
    return result;

  }

}

if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports) {
  module.exports = stringMath;
}