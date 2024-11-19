export function generateOTP(length = 6) {
  let output = "";
  for (let index = 0; index < length; index++) {
    output += Math.floor(Math.random() * 10).toString();
  }
  return output;
}
