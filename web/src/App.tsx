import React, { useEffect, useState } from 'react';

import './App.css';

import web3 from './utils/web3-start';

import erc from './utils/erc20';

async function getErc() {
  const manager = await erc.methods.name().call();
  return manager
}


function App() {

  const [manager, setManager] = useState<any>({});

  web3.eth.getAccounts().then(console.log);


  useEffect(() => {
    getErc().then((res) => {
      console.log(res, 456)
      setManager({manager:res});
    });
  }, [])
  return (
    <>{ manager.manager }</>
  )
}

export default App;
