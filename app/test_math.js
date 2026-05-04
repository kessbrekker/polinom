const math = require('mathjs');

let expr = math.rationalize('(x+y)^2');
console.log(expr.toString());

let isPolynomial = true;
try {
  let expanded = math.rationalize('x^6 - 1');
  let divisor = math.rationalize('x^2 - 1');
  let result = math.simplify(math.divide(expanded, divisor));
  console.log('Division:', result.toString());
  console.log('Rationalize Division:', math.rationalize('(x^6-1)/(x^2-1)').toString());
} catch (e) {
  console.error(e);
}
