'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { decode, encode } = require('./services/encoding');
const {
  getCollectionAddress,
  getMojiAddress
} = require('./services/addressing');
const getPrng = require('./services/prng');
const { createHash } = require('crypto');

const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '5f4d76';

/**
 * A Cryptomoji specific version of a Hyperledger Sawtooth Transaction Handler.
 */
class MojiHandler extends TransactionHandler {
  /**
   * The constructor for a TransactionHandler simply registers it with the
   * validator, declaring which family name, versions, and namespaces it
   * expects to handle. We'll fill this one in for you.
   */
  constructor() {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [FAMILY_VERSION], [NAMESPACE]);
  }

  /**
   * The apply method is where the vast majority of all the work of a
   * transaction processor happens. It will be called once for every
   * transaction, passing two objects: a transaction process request ("txn" for
   * short) and state context.
   *
   * Properties of `txn`:
   *   - txn.payload: the encoded payload sent from your client
   *   - txn.header: the decoded TransactionHeader for this transaction
   *   - txn.signature: the hex signature of the header
   *
   * Methods of `context`:
   *   - context.getState(addresses): takes an array of addresses and returns
   *     a Promise which will resolve with the requested state. The state
   *     object will have keys which are addresses, and values that are encoded
   *     state resources.
   *   - context.setState(updates): takes an update object and returns a
   *     Promise which will resolve with an array of the successfully
   *     updated addresses. The updates object should have keys which are
   *     addresses, and values which are encoded state resources.
   *   - context.deleteState(addresses): deletes the state for the passed
   *     array of state addresses. Only needed if attempting the extra credit.
   */
  apply(txn, context) {
    const { payload, header, signature } = txn;
    const publicKey = header.signerPublicKey;
    let action;

    return new Promise((resolve, reject) => {
      try {
        action = decode(payload).action;
      } catch (err) {
        reject(new InvalidTransaction('Poorly encoded payload'));
      }

      if (action === 'CREATE_COLLECTION') {
        const address = getCollectionAddress(publicKey);
        return context
          .getState([address])
          .then(state => {
            if (JSON.stringify(state[address]) !== '[]') {
              throw new InvalidTransaction('Signer already has a collection');
            }

            const moji = [];
            const mojiAddresses = [];

            for (let i = 0; i < 3; i++) {
              const dna = createHash('sha512')
                .update(JSON.stringify(getPrng(signature)(1000)))
                .digest('hex')
                .slice(0, 36);

              const address = getMojiAddress(publicKey, dna);
              mojiAddresses.push(address);

              moji.push(
                context.setState({
                  [address]: encode({
                    dna,
                    owner: publicKey,
                    breeder: null,
                    sire: null,
                    bred: null,
                    sired: null
                  })
                })
              );
            }

            return Promise.all(moji)
              .then(() =>
                context.setState({
                  [address]: encode({
                    key: publicKey,
                    moji: mojiAddresses
                  })
                })
              )
              .then(addresses => resolve(addresses));
          })
          .catch(err => reject(err));
      } else {
        reject(new InvalidTransaction('Invalid action'));
      }
    });
  }
}

module.exports = MojiHandler;
