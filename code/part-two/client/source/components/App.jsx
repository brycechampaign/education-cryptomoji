import React from 'react';
import PrivateKeyGenerator from './PrivateKeyGenerator';
import { useState } from 'react';

const App = props => {
  const [privateKey, setPrivateKey] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);
  return (
    <React.Fragment>
      <h1>Hello, Cryptomoji!</h1>
      <PrivateKeyGenerator setGeneratedKey={setGeneratedKey} />
      {generatedKey === null ? '' : generatedKey}
      <form>
        <h2>Sign In With Your Private Key</h2>
        <input type="text"></input>
      </form>
    </React.Fragment>
  );
};

export default App;
