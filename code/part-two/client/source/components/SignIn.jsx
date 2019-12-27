import React from 'react';
import { useState } from 'react';

const SignIn = ({ setPrivateKey }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setPrivateKey(inputKey);
    setInputKey('');
  };

  const handleChange = e => {
    setInputKey(e.target.value);
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <h2>Sign In With Your Private Key</h2>
      <input
        type="text"
        onChange={e => handleChange(e)}
        value={inputKey}
      ></input>
      <input type="submit" value="Sign In"></input>
    </form>
  );
};

export default SignIn;
