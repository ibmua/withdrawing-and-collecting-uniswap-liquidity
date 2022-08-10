# Withdrawing and collecting Uniswap liquidity
Here you can find code for unsigned test withdrawal and collection of Uniswap liquidity via Web3.JS library.

It is important that it is run with a more or less recent (like v17) version of NodeJS, otherwise you might get issues. This is why you should uninstall npm in case you already have it installed and install it via NVM, which is also the recommended way. This is how we can install NPM with NodeJS version 17, which works well with the script.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 17
```

To run example code you can install Ganache Ethereum simulator and run it with appropriate account in the unlocked mode. Currently, example can be launched on Ubuntu like this (tested to work on AWS Ubuntu 22.04 instance):

```
sudo apt update
sudo apt install git
npm install ganache -g

git clone https://github.com/ibmua/withdrawing-and-collecting-uniswap-liquidity.git
cd withdrawing-and-collecting-uniswap-liquidity

npm install web3 
ganache --miner.blockTime 1 --fork.url wss://mainnet.infura.io/ws/v3/[get your own RPC url, please, for example, at infura.io]@13266287  --wallet.unlockedAccounts 0xE2313Ab106fFb9196b29f5B8880Ab474355deb90
```

- Ganache should start and you should see `RPC Listening on 127.0.0.1:8545` at the end. Leave this window open.
`@13266287` makes Ganache start simulation from Ethereum block 13266287. `--wallet.unlockedAccounts` enables us able to simulate unsigned transactions, so we don't have to know or share a private key to the unlocked accounts in order to send transactions from these accounts.


Open another terminal tab/window in parallel, get into the current project folder and run the script.
```
node geth_liquidity_web3.mjs
```

In case a Ganache instance was open for a more or less long time, it might hang up and become unresponsive. In that case it needs to be restarted (Ctrl+C to quit and free the socket (port) and then start again).
