import React from 'react';
import { createPrivateKey } from '../services/signing';

const PrivateKeyGenerator = ({ setGeneratedKey }) => {
  const handleSubmit = e => {
    e.preventDefault();
    setGeneratedKey(createPrivateKey());
  };
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <h2>Generate Private Key</h2>
      <input type="submit" value="Generate key"></input>
    </form>
  );
};

export default PrivateKeyGenerator;
