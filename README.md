# Withdrawing and collecting Uniswap liquidity
Here you can find code for unsigned test withdrawal and collection of Uniswap liquidity via Web3.JS library.

To run example code you can install Ganache Ethereum simulator and run it with appropriate account in the unlocked mode. Currently, example can be launched on Ubuntu like this (tested to work on AWS Ubuntu 22.04 instance):

```
sudo apt update
sudo apt install npm
sudo npm install ganache -g
ganache --miner.blockTime 1 --fork.url wss://mainnet.infura.io/ws/v3/[get your own RPC url, please, for example, at infura.io]@13266287  --wallet.unlockedAccounts 0xE2313Ab106fFb9196b29f5B8880Ab474355deb90
```

- Ganache should start and you should see `RPC Listening on 127.0.0.1:8545` at the end. Leave this window open.
`@13266287` makes Ganache start simulation from Ethereum block 13266287. `--wallet.unlockedAccounts` enables us able to simulate unsigned transactions, so we don't have to know or share a private key to the unlocked accounts in order to send transactions from these accounts.


From another terminal tab/window get to the current project folder and run:
```
npm install web3
node geth_liquidity_web3.mjs
```
