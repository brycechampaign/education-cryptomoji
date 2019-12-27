import React from 'react';
import PrivateKeyGenerator from './PrivateKeyGenerator';
import SignIn from './SignIn';
import { useState } from 'react';

const App = props => {
  const [privateKey, setPrivateKey] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);
  return (
    <React.Fragment>
      <h1>Hello, Cryptomoji!</h1>
      <PrivateKeyGenerator setGeneratedKey={setGeneratedKey} />
      {generatedKey === null ? '' : generatedKey}
      <SignIn setPrivateKey={setPrivateKey} />
    </React.Fragment>
  );
};

export default App;
