'use strict';

const { createHash } = require('crypto');

const NAMESPACE = '5f4d76';
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};

/**
 * A function that takes a public key and returns the corresponding collection
 * address.
 *
 * This is simpler than the client version, as the public key is not optional.
 * Processor addressing methods always return a full address.
 *
 * Example:
 *   const address = getCollectionAddress(publicKey);
 *   console.log(address);
 *   // '5f4d7600ecd7ef459ec82a01211983551c3ed82169ca5fa0703ec98e17f9b534ffb797'
 */
const getCollectionAddress = publicKey => {
  const hash = createHash('sha512')
    .update(publicKey)
    .digest('hex');

  return NAMESPACE + PREFIXES.COLLECTION + hash.slice(0, 62);
};

/**
 * A function that takes a public key and a moji dna string, returning the
 * corresponding moji address.
 */
const getMojiAddress = (ownerKey, dna) => {
  const keyHash = createHash('sha512')
    .update(ownerKey)
    .digest('hex')
    .slice(0, 8);

  const dnaHash = createHash('sha512')
    .update(dna)
    .digest('hex')
    .slice(0, 54);

  return NAMESPACE + PREFIXES.MOJI + keyHash + dnaHash;
};

/**
 * A function that takes a public key, and returns the corresponding sire
 * listing address.
 */
const getSireAddress = ownerKey => {
  const keyHash = createHash('sha512')
    .update(ownerKey)
    .digest('hex')
    .slice(0, 62);

  return NAMESPACE + PREFIXES.SIRE_LISTING + keyHash;
};

/**
 * EXTRA CREDIT
 * Only needed if you add trading cryptomoji to your transaction processor.
 * Remove the `.skip` from line 184 of tests/01-Services.js to test.
 *
 * A function that takes a public key and one or more moji addresses,
 * returning the corresponding offer address.
 *
 * Unlike the client version, moji may only be identified by addresses, not
 * dna strings.
 */
const getOfferAddress = (ownerKey, addresses) => {
  // Your code here
};

/**
 * A function that takes an address and returns true or false depending on
 * whether or not it is a valid Cryptomoji address. It should reject an
 * address if:
 *   - it is not a string
 *   - it is not 70 hex characters
 *   - it does not start with the correct namespace
 *
 * Example:
 *   const isValid = isValidAddress('00000000');
 *   console.log(isValid);  // false
 */
const isValidAddress = address => {
  if (typeof address !== 'string') return false;
  if (address.length !== 70) return false;
  if (address.slice(0, 6) !== NAMESPACE) return false;

  for (let i = 0; i < address.length; i++) {
    if (isNaN(parseInt(address.charAt(i), 16))) {
      return false;
    }
  }
  return true;
};

module.exports = {
  getCollectionAddress,
  getMojiAddress,
  getSireAddress,
  getOfferAddress,
  isValidAddress
};
