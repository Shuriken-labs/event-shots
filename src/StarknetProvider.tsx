import React from 'react';
import { StarknetConfig, publicProvider, voyager } from '@starknet-react/core';
import { InjectedConnector } from 'starknetkit/injected';
import { WebWalletConnector } from 'starknetkit/webwallet';
import { mainnet, sepolia } from '@starknet-react/chains'; 

const connectors = [
  new InjectedConnector({
    options: { id: 'argentX', name: 'Argent X' },
  }),
  new InjectedConnector({
    options: { id: 'braavos', name: 'Braavos' },
  }),
];

export default function StarknetProvider({ children }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
