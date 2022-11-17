import { HardhatRuntimeEnvironment } from 'hardhat/types';

const getSignerFromMnemonic = (mnemonic: string, hre: HardhatRuntimeEnvironment) => {
  if ('url' in hre.network.config) {
    const signer = hre.ethers.Wallet.fromMnemonic(mnemonic);
    console.log({ pk: signer.privateKey, mnemonic, address: signer.address, provider: signer.provider });
  }
};

export { getSignerFromMnemonic };
