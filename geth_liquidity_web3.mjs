// ganache --miner.blockTime 1 --fork.url wss://mainnet.infura.io/ws/v3/[your-own-infura-access-url-required]@13266287  --wallet.unlockedAccounts 0xE2313Ab106fFb9196b29f5B8880Ab474355deb90
// 13266287 is last ETH block before GETH contract hack - first fake mint was https://etherscan.io/tx/0x78f67582fde638a94f3ad7869eef8d8a3518e5c4f4a349f19c80d4afde17b7f8


import Web3 from 'web3'
import ERC20ABI from './ERC20.json' assert { type: "json" }
import INonfungiblePositionManagerABI from './INonfungiblePositionManager.json' assert { type: "json" }

const WALLET_ADDRESS 		= "0xE2313Ab106fFb9196b29f5B8880Ab474355deb90"
const Old_GETH_Token_addr	= "0x9ad03c34aab604a9e0fde41dbf8e383e11c416c4"
const WETH9_Token 			= '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'	//	wrapped ETH
const positionManagerAddress= "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"	//	Uniswap NonfungiblePositionManager
const UNISWAP_NFT_TOKENS = [
							129737,
							125244,
							123797,
							120979,

							115678,
							73830,
							72603,
							72560,
							68838,
							65359,
							21531,
							]




async function main() 
	{
	const web3 = new Web3("http://127.0.0.1:8545");


	async function getETHBalanceForAddress(for_whom)
		{
		let balanceInWei = await web3.eth.getBalance(for_whom)
		console.log(for_whom, "ETH balance", web3.utils.fromWei(balanceInWei) )
		}


	async function getTokenBalanceForAddress(for_whom, TOKEN_ADDRESS)
		{
		const TOKEN = new web3.eth.Contract(
				ERC20ABI,
				TOKEN_ADDRESS,
				{ from: WALLET_ADDRESS, gasLimit: 1000000 }
			)

		const token_balance = await TOKEN.methods.balanceOf(for_whom).call();
		console.log(for_whom, "token", TOKEN_ADDRESS,"balance:", web3.utils.fromWei(token_balance) )
		}


	async function check_wallet_balances(for_wallet)
		{
		return new Promise(async (resolve)=>
			{
			await await_next_block_and_exec(()=>
				{
				console.log("check_wallet_balances")
				getTokenBalanceForAddress(for_wallet, Old_GETH_Token_addr)
				getTokenBalanceForAddress(for_wallet, WETH9_Token)
				getETHBalanceForAddress(for_wallet)
				})
			resolve()
			})
		}


	async function await_next_block_and_exec(x, b)
		{
		return new Promise(async resolve => 
			{
			let prev_block = 0
			if (typeof b === 'undefined') 
				prev_block = await web3.eth.getBlockNumber()
			else
				prev_block = b

			const cur_block = await web3.eth.getBlockNumber()

			console.log("prev_block", prev_block,  "cur_block", cur_block)

			if (cur_block > prev_block)
				{
				await x()
				resolve()
				}
			else
				setTimeout( ()=>await_next_block_and_exec(async()=>{await x(); resolve();}, cur_block), 2000)
			})
		}




	const networkId = await web3.eth.net.getId();

	const nonFungiblePositionManagerContract = new web3.eth.Contract(
			INonfungiblePositionManagerABI.abi,
			positionManagerAddress,
			{ from: WALLET_ADDRESS, gasLimit: 500000 }
		)


	await check_wallet_balances(WALLET_ADDRESS)

	for(let i=0; i < UNISWAP_NFT_TOKENS.length; i++)
		{
		console.log("")
		console.log("")
		let nft_token_id = UNISWAP_NFT_TOKENS[i]
		console.log("i", i, "of", UNISWAP_NFT_TOKENS.length, "token", nft_token_id)
		try {
			let res = await nonFungiblePositionManagerContract.methods.positions( String( nft_token_id ) ).call()

			const totalLiquidity = res.liquidity
			console.log(nft_token_id, "nft token, totalLiquidity", totalLiquidity.toString())

			if (totalLiquidity == 0)
				continue;

			const params = {
				tokenId:	nft_token_id,
				liquidity:	totalLiquidity,
				amount0Min: 0,
				amount1Min: 0,
				deadline: Math.floor(Date.now() / 1000) + (60 * 10),
				}


			await	await_next_block_and_exec(async()=>
				{
				let res2 = await nonFungiblePositionManagerContract.methods.decreaseLiquidity(params).send()
				console.log("res2", res2)
				})



			let collect_params = {
				tokenId: nft_token_id,
				amount0Max: "100000000000000000000",
				amount1Max: "100000000000000000000",
				recipient: WALLET_ADDRESS,
				}



			await	await_next_block_and_exec(async()=>
				{
				let res3 = await nonFungiblePositionManagerContract.methods.collect(collect_params).send()
				console.log("res3", res3)
				})


			}
		catch(e)
			{
			console.log(e)
			}

		console.log("")
		console.log("")
		}

	await check_wallet_balances(WALLET_ADDRESS)

	}

main()