import {
  useAccount,
  useConnect,
  useDisconnect,
  Connector,
} from "@starknet-react/core";
import {
  StarknetkitConnector,
  useStarknetkitConnectModal,
} from "starknetkit";

export const WalletConnector = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  const handleClick = async () => {
    if (address) {
      disconnect();
    } else {
      const { connector } = await starknetkitConnectModal();
      if (connector) {
        await connect({ connector: connector as Connector });
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg border transition-colors ${
        address
          ? "bg-white text-black border-gray-300 hover:bg-gray-100"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {address
        ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})`
        : "Connect Wallet"}
    </button>
  );
};
