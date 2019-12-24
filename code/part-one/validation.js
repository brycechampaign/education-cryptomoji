'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = transaction => {
  const { source, recipient, amount, signature } = transaction;
  if (transaction.amount < 0) return false;
  if (!signing.verify(source, source + recipient + amount, signature)) {
    return false;
  }
  return true;
};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = block => {
  let hash = createHash('sha256');
  for (let tx of block.transactions) {
    if (!isValidTransaction(tx)) return false;
  }
  hash.update(block.nonce + block.previousHash + block.transactions.toString());
  if (hash.digest().toString() !== block.hash) return false;

  return true;
};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is a missing genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  const { blocks } = blockchain;

  if (blocks[0].previousHash !== null) return false;
  let previousHash = null;
  for (let i = 0; i < blocks.length; i++) {
    if (i !== 0 && blocks[i].previousHash === null) {
      return false;
    }

    if (!isValidBlock(blocks[i])) return false;

    if (previousHash !== blocks[i].previousHash) return false;
    previousHash = blocks[i].hash;
  }

  return true;
};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  blockchain.blocks[1].previousHash = null;
};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
