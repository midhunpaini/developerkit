const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function randomIndex(max: number) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  }

  return Math.floor(Math.random() * max);
}

export function generateEndpointId(length = 10) {
  let value = '';

  for (let index = 0; index < length; index += 1) {
    value += ID_ALPHABET[randomIndex(ID_ALPHABET.length)];
  }

  return value;
}
