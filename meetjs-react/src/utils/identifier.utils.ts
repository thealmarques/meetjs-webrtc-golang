export function byteToHex(byte) {
  return ('0' + byte.toString(16)).slice(-2);
}

export function generateId(len = 40) {
  var arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, byteToHex).join("");
}