import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DelayInput} from 'react-delay-input';
import classnames from 'classnames';

import Connectbtn from '../commons/Connectbtn';
import Farm from './Farm';

import TokenABI from '../../abis/Token.json'
import wethABI from '../../abis/wethABI.json'
import UniswapRouterV2 from '../../abis/UniswapV2.json'
import UniswapPair from '../../abis/UniswapPair.json'
import UniswapFactory from '../../abis/UniswapFactory.json'

import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
  Percent,
  Price 
} from "@uniswap/sdk";

import { useUserPositions } from '../apollo/helper';

	
let web3 = null;

let tokenAddress = "";
let tokenContract = null;
let contract = null;
let factoryContract = null;

let SH = new Token(
  ChainId.MAINNET,
  "0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0",
  18
);

let USDT = new Token(
  ChainId.MAINNET,
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  18
);

let interval_id = 0;

const Pool = (props) => {
	const wallet = useSelector(state => state.connectWallet);

	const [ETHAmount, setETHAmount] = React.useState(0);
	const [tokenAmount, setTokenAmount] = React.useState(0);
	const [isChanging, setIsChanging] = React.useState(false);
	const [maxTokens, setMaxTokens] = React.useState(0);
	const [maxETH, setMaxETH] = React.useState(0);
	const [gasPrice, setGasPrice] = React.useState(0);
	const [fastGas, setFastGas] = React.useState({gasAmount: 0, waitTime: 0});
	const [fastestGas, setFastestGas] = React.useState({gasAmount: 0, waitTime: 0});
	const [safelowGas, setSafelowGas] = React.useState({gasAmount: 0, waitTime: 0});
	const [averageGas, setAverageGas] = React.useState({gasAmount: 0, waitTime: 0});
	const [ethValue, setETHValue] = React.useState({gasAmount: 0, waitTime: 0});
	const [positionPercent, setPositionPercent] = React.useState(0);
	const [positionValue, setPositionValue] = React.useState(0);
	const [earnedFee, setEarnedFee] = React.useState(0);
	const [token0Number, setToken0Number] = React.useState(0);
	const [token1Number, setToken1Number] = React.useState(0);

	const onLoad = async () => {
		const web3_1 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
	  const USDT_WETH = new web3_1.eth.Contract(UniswapPair, "0x06da0fd433c1a5d7a4faa01111c044910a184553");
    const USDT_WETH_reserve = await USDT_WETH.methods.getReserves().call();

	  const WETH_USDT_price = USDT_WETH_reserve._reserve1 / USDT_WETH_reserve._reserve0 * 10**12;
	  console.log("[***WETH_USDT_price]=>", Number(WETH_USDT_price.toFixed(10)));
	  setETHValue(WETH_USDT_price);

	  // console.log("[***WETH_USDT_price]=>", USDT_WETH_reserve);
	  /////////////////////////////////////////////////////////////////////////

		setGasPrice(await web3_1.eth.getGasPrice());
	 	fetch("https://ethgasstation.info/api/ethgasAPI.json?")
			.then(res => res.json())
			.then(res => {
				console.log("*****=>", (res.fast * 200394 * WETH_USDT_price))
				setFastGas({gasAmount: (res.fast * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.fastWait});
				setFastestGas({gasAmount: (res.fastest * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.fastestWait});
				setSafelowGas({gasAmount: (res.safeLow * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.safeLowWait});
				setAverageGas({gasAmount: (res.average * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.avgWait});
			})
			.catch(console.log);
				
		interval_id = setInterval(async () => {
			 setGasPrice(await web3_1.eth.getGasPrice());
			 fetch("https://ethgasstation.info/api/ethgasAPI.json?")
				.then(res => res.json())
				.then(res => {
					console.log("*****=>", (res.fast * 200394 / 10**10 * WETH_USDT_price).toFixed(0))
					setFastGas({gasAmount: (res.fast * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.fastWait});
					setFastestGas({gasAmount: (res.fastest * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.fastestWait});
					setSafelowGas({gasAmount: (res.safeLow * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.safeLowWait});
					setAverageGas({gasAmount: (res.average * 200394 / 10**10 * WETH_USDT_price).toFixed(0), waitTime: res.avgWait});
				})
				.catch(console.log);
		}, 10000)

		if (window.ethereum) {
			web3 = new Web3(window.web3.currentProvider);
			tokenAddress = "0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0";  // Mainnet
			// const tokenAddress = "0x9de02c024916c3636d34f26fd45cb0b16004c2a2";  // Testnet
			tokenContract = new web3.eth.Contract(TokenABI, tokenAddress);
			contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
			factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");


			if (wallet.address) {
				// useUserPositions(wallet.address);
				try {
					useUserPositions(wallet.address)
						.then(res => {
							setPositionValue(res.positionValue.toFixed(0));
							setPositionPercent(res.positionPercent.toFixed(0));
							setEarnedFee(res.fees.toFixed(0));
							setToken0Number(res.positionToken0.toFixed(0));
							setToken1Number(res.positionToken1.toFixed(3));
						})
				} catch (err) {} 
					
				let myBalance = (await tokenContract.methods.balanceOf(wallet.address).call()).toString();
				setMaxTokens(myBalance);
				// console.log("[address, myBalance]=>", localStorage.getItem('walletAdr'), "=>", myBalance);
				let myETH = (await web3.eth.getBalance(wallet.address)).toString();
				setMaxETH(myETH);
				// console.log("[myETH]=>", myETH);

				// setGasPrice(await web3_1.eth.getGasPrice());
			 // 	fetch("https://ethgasstation.info/api/ethgasAPI.json?")
				// 	.then(res => res.json())
				// 	.then(res => {
				// 		setFastGas({gasAmount: res.fast, waitTime: res.fastWait});
				// 		setFastestGas({gasAmount: res.fastest, waitTime: res.fastestWait});
				// 		setSafelowGas({gasAmount: res.safeLow, waitTime: res.safeLowWait});
				// 		setAverageGas({gasAmount: res.average, waitTime: res.avgWait});
				// 	})

				// interval_id = setInterval(async () => {
				// 	 setGasPrice(await web3_1.eth.getGasPrice());
				// 	 fetch("https://ethgasstation.info/api/ethgasAPI.json?")
				// 		.then(res => res.json())
				// 		.then(res => {
				// 			setFastGas({gasAmount: res.fast, waitTime: res.fastWait});
				// 			setFastestGas({gasAmount: res.fastest, waitTime: res.fastestWait});
				// 			setSafelowGas({gasAmount: res.safeLow, waitTime: res.safeLowWait});
				// 			setAverageGas({gasAmount: res.average, waitTime: res.avgWait});
				// 		})
				// 		.catch(console.log);
				// }, 10000)
			} else {
				setMaxTokens(0);
				setMaxETH(0);
			}
		}
	}


	React.useEffect(() => {
		onLoad();
		if (window.ethereum) { 
			web3 = new Web3(window.web3.currentProvider);
		}
		return () => {
			clearInterval(interval_id);
    };
	}, [wallet]);

	const useStyles = makeStyles((theme) => ({
	  root: {
	    flexGrow: 1,
	  },
	  content: {
	  	minHeight: "calc(100vh - 150px)",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	padding: "20px",
	  	paddingBottom: 20,
	  	textAlign: "center",
	  },
	  first_part: {
	  	backgroundImage: "linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(72, 15, 144, 0.4) 100%);",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	padding: 15,
	  	paddingBottom: 20,
	  	textAlign: "center",
	  	marginBottom: 20,
	  },
	  first_1: {
	  	textAlign: "right",
	  	position: "relative",
	  },
	  third_margin: {
	  	height: 40
	  },
	  z_999: {
	  	zIndex: 999,
	  },
	  amountInput: {
	  	width: "90%",
	  	height: 40,
	  	backgroundColor: "grey",
	  	marginBottom: 20,
	  	textAlign: "right",
	  	fontSize: 25,
	  	color: "white",
	  	paddingLeft: 70,
	  },
	  exceedInput: {
	  	width: "90%",
	  	height: 40,
	  	backgroundColor: "grey",
	  	marginBottom: 20,
	  	textAlign: "right",
	  	fontSize: 25,
	  	color: "white",
	  	paddingLeft: 70,
	  	border: "2px solid red"
	  },
	  tip_part: {
	  	background: "radial-gradient(black, transparent)",
    	padding: 20,
	  }
	}));

	const classes = useStyles();




	const handleAdd = async () => {
		console.log(window.ethereum)
		if(!window.ethereum || !window.ethereum.selectedAddress || !wallet.address) return toast.warning("Connect Wallet 🤯");
		if (Number(tokenAmount) <= 0 && Number(ETHAmount) <= 0) return toast.error("Input value 🤯");
		else if (Number(tokenAmount) > maxTokens / 10**18 || Number(ETHAmount) > maxETH / 10**18 - 0.05) return toast.error("Input Value is Exceeded! 🤯");
		setIsChanging(true);
		let numberOfToken = tokenAmount * 10**10 + "00000000";
		let numberOfETH = ETHAmount * 10**10 + "00000000";
		const from = wallet.address;
		// *** Approve
		// console.log("[numberOfToken]=>", web3.utils.isBigNumber(numberOfToken));
        tokenContract.methods.approve("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", web3.utils.toHex(numberOfToken))
        	.send({from: from})
        	.on('transactionHash', function(hash){
                console.log(hash);
          })
          .on('receipt', async function(receipt){
            console.log(receipt);
            if (receipt) {
            	contract.methods.addLiquidityETH(
									tokenAddress,
						      web3.utils.toHex(numberOfToken), 
						      0,
						      0,
						      from,
						      web3.utils.toHex(Math.floor(Date.now() / 1000) + 60 * 20)
						    )
						    .estimateGas({from: from, value: web3.utils.toHex(numberOfETH)})
						    .then(function(gasAmount) {
						    	// setGasOfAdd(gasAmount);
						    	console.log("[add gas fee]=>", gasAmount);

						    	contract.methods.addLiquidityETH(
			        				tokenAddress,
			                web3.utils.toHex(numberOfToken), 
			                0,
			                0,
			                from,
			                web3.utils.toHex(Math.floor(Date.now() / 1000) + 60 * 20)
				            )
				            .send({
				                from: from,
				                gas: gasAmount,
				                value: web3.utils.toHex(numberOfETH)
				            })
				            .on('transactionHash', function(hash){
				                console.log(hash);
				            })
				            .on('receipt', function(receipt){
				                console.log(receipt);
				                if (receipt) {
				                    toast.success("Success! Mint is succeed!!!  👌");
				                    setIsChanging(false);
				                }
				            })
				            .on('confirmation', function(confirmationNumber, receipt){
				                console.log(confirmationNumber);
				            })
				            .on('error', function(error, receipt) {
				                console.log(error);
				                if (error) {
				                    toast.error("Failed! Mint is failed!!! 🤯");
				                    setIsChanging(false);
				                }
				            });
						    })
						    .catch(function(error) {console.log(error)})
			        		
              }
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log(confirmationNumber);
            })
            .on('error', function(error, receipt) {
                console.log(error);
                if (error) {
                    toast.error("Failed! Approve is failed!!! 🤯");
                    setIsChanging(false);
                }
            });
	}

	const handleRemove = async () => {
		if (!window.ethereum || !window.ethereum.selectedAddress || !wallet.address) return toast.warning("Connect Wallet  🤯");
		if (Number(tokenAmount) <= 0 && Number(ETHAmount) <= 0) return toast.error("Input value  🤯");
		// if (Number(tokenAmount) > maxTokens / 10**18 || Number(ETHAmount) > maxETH / 10**18 - 0.05) return toast.error("Input value is Exceeded");
		setIsChanging(true);
		let numberOfToken = tokenAmount * 10**10 + "00000000";
		let numberOfETH = ETHAmount * 10**10 + "00000000";
		const from = wallet.address;
		// let pairAddress = await factoryContract.methods.getPair(tokenAddress, WETH[ChainId.ROPSTEN].address).call();
		let pairTokenContract = new web3.eth.Contract(TokenABI, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
		let pairContract = new web3.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
		let reserves = await pairContract.methods.getReserves().call();
		let liquidity_qty = await pairTokenContract.methods.balanceOf(from).call();
		let totalSupply = await pairTokenContract.methods.totalSupply().call();

		let SH_amount = (liquidity_qty / totalSupply).toFixed(5) * reserves._reserve0;
		let ETH_amount = (liquidity_qty / totalSupply).toFixed(5) * reserves._reserve1;
		console.log("[SH_amount]=>", SH_amount);
		console.log("[ETH_amount]=>", ETH_amount);

		if (tokenAmount * 10**18 > SH_amount || ETHAmount * 10**18 > ETH_amount) {
			setIsChanging(false)
			return toast.error("The liquidity quantity is exceed! 🤯");
		}

		// console.log("[ISBN]=>", web3.utils.isBN(ETHAmount * 10**18), ": ", tokenAmount * 10**18 > SH_amount);

		let remove_liq_qty = ((tokenAmount * 10**18 / SH_amount) * liquidity_qty).toFixed(0);
		console.log("[remove_liq_qty]=>", remove_liq_qty);
            
		//*** Approve
        pairContract.methods.approve("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", remove_liq_qty)
        	.send({from: from})
        	.on('transactionHash', function(hash){
                console.log(hash);
          })
          .on('receipt', async function(receipt){
            console.log(receipt);
            if (receipt) {
            	contract.methods.removeLiquidityETH(
									"0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE",
						      web3.utils.toHex(remove_liq_qty), 
						      0,
						      0,
						      from,
						      web3.utils.toHex(Math.floor(Date.now() / 1000) + 60 * 20)
						    )
						    .estimateGas({from: from})
						    .then(function(gasAmount) {
						    	// setGasOfRemove(gasAmount);
						    	console.log("[remove gas fee]=>", gasAmount);

						    	contract.methods.removeLiquidityETH(
			        				"0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE",
								      web3.utils.toHex(remove_liq_qty), 
								      0,
								      0,
								      from,
								      web3.utils.toHex(Math.floor(Date.now() / 1000) + 60 * 20)
				            )
				            .send({
				                from: from,
				                gas: gasAmount,
				                // value: web3.utils.toHex(numberOfETH)
				            })
				            .on('transactionHash', function(hash){
				                console.log(hash);
				            })
				            .on('receipt', function(receipt){
				                console.log(receipt);
				                if (receipt) {
				                    toast.success("Success! Mint is succeed!!!  👌");
				                    setIsChanging(false);
				                }
				            })
				            .on('confirmation', function(confirmationNumber, receipt){
				                console.log(confirmationNumber);
				            })
				            .on('error', function(error, receipt) {
				                console.log(error);
				                if (error) {
				                    toast.error("Failed! Mint is failed!!! 🤯");
				                    setIsChanging(false);
				                }
				            });
						    })
						    .catch(function(error) {console.log(error)})
			        		
              }
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log(confirmationNumber);
            })
            .on('error', function(error, receipt) {
                console.log(error);
                if (error) {
                    toast.error("Failed! Approve is failed!!! 🤯");
                    setIsChanging(false);
                }
            });
	}

	const inputETHAmount = async (amount) => {
		if (Number(amount) <= 0 || Number(amount) > Number(maxETH / 10**18 - 0.05)) return; 
		setETHAmount(amount);
		/////////////////////////////////////////////////////////////////////
		const web3_1 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
	  const SH_WETH = new web3_1.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
    console.log("[SH_WETH]", await SH_WETH.methods.getReserves().call());
    const SH_WETH_reserve = await SH_WETH.methods.getReserves().call();

	  const WETH_SH_price = new Price(
	  	WETH[SH.chainId],
	  	SH,
	  	SH_WETH_reserve._reserve1,
	  	SH_WETH_reserve._reserve0
	  );
	  console.log("[WETH_SH_price]=>", Number(WETH_SH_price.toSignificant(10)).toFixed(10));
	  setTokenAmount((WETH_SH_price.toSignificant(10) * amount).toFixed(10));
	}

	const inputTokenAmount = async (amount) => {
		if (Number(amount) <= 0) return; 
		setTokenAmount(amount);
		/////////////////////////////////////////////////////////////////////
		const web3_1 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
	  const SH_WETH = new web3_1.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
    console.log("[SH_WETH]", await SH_WETH.methods.getReserves().call());
    const SH_WETH_reserve = await SH_WETH.methods.getReserves().call();
    console.log(SH)
	  const SH_WETH_price = new Price(
	  	SH,
	  	WETH[SH.chainId],
	  	SH_WETH_reserve._reserve0,
	  	SH_WETH_reserve._reserve1
	  );
	  console.log("[SH_WETH_price]=>", Number(SH_WETH_price.toSignificant(10)).toFixed(10));
	  setETHAmount((SH_WETH_price.toSignificant(10) * amount).toFixed(10));
	}



	return (
		<div className="mt-5 page-load">
			<ToastContainer />
			<Grid container spacing={3}>
	      		<Grid item lg={1} md={12} sm={12} xs={12} className="p-0">
	      		</Grid>
	      		<Grid item lg={4} md={12} sm={12} xs={12} className={classes.z_999}>
	      			<div className={classes.content}>
	      				<img src="/img/pool/Pool_Text.png" alt="" className="img-fluid" />

	      				<div className={classes.first_part}>
	      					<img src="/img/pool/Safehedge_Text.png" alt="" className="img-fluid" />
	      					<div className={classes.first_1}>
	      						<p className="letter-spacing-2">
	      							AVAILABLE <u>{(maxTokens / 10**18)}</u> SAFEHEDGE 
	      							&nbsp;
	      							<span className="badge badge-pill badge-primary cursor-hand" onClick={e => inputTokenAmount((maxTokens / 10**18).toFixed(10))}>MAX</span>
	      						</p>
	      						<DelayInput
		                  minLength={1}
		                  delayTimeout={1500}
		                  type="text" 
	      							className={(Number(tokenAmount) <= (maxTokens / 10**18).toFixed(10)) ? classes.amountInput : classes.exceedInput} 
	      							value={tokenAmount}
	      							onChange={(e) => inputTokenAmount(e.target.value)} />
	      						<img src="/img/pool/Safehedge_Coin_Logo.png" alt="" className="img-fluid Ethereum-Coin"/>
	      					</div>
	      					{
	      						(Number(tokenAmount) > (maxTokens / 10**18).toFixed(10))
	      						&&
	      						<div className="text-right">
		      						<h6 className="text-danger validation-text"><small>Input value is exceeded than your balance.</small></h6>
		      					</div>
	      					}
	      				</div>

	      				<div className={classes.first_part}>
	      					<img src="/img/pool/EthereumText.png" alt="" className="img-fluid" />
	      					<div className={classes.first_1}>
	      						<p className="letter-spacing-2">
	      							AVAILABLE <u>{(maxETH / 10**18).toFixed(10)}</u> ETH 
	      							&nbsp;
	      							<span className="badge badge-pill badge-primary cursor-hand" onClick={e => inputETHAmount((maxETH / 10**18 - 0.05).toFixed(10))}>MAX</span>
	      						</p>
	      						<DelayInput
		                  minLength={1}
		                  delayTimeout={1500}
		                  type="text" 
	      							className={Number(ETHAmount) === 0 || (Number(ETHAmount) <= (maxETH / 10**18 - 0.05).toFixed(10)) ? classes.amountInput : classes.exceedInput} 
	      							value={ETHAmount} 
	      							onChange={(e) => inputETHAmount(e.target.value)} />
	      						<img src="/img/pool/Ethereum_Coin.png" alt="" className="img-fluid Ethereum-Coin"/>
	      					</div>
	      					{
	      						Number(ETHAmount) !== 0 && (Number(ETHAmount) > (maxETH / 10**18 - 0.05).toFixed(10))
	      						&&
	      						<div className="text-right">
		      						<h6 className="text-danger validation-text"><small>Input value is exceeded than your balance.</small></h6>
		      					</div>
	      					}
	      				</div>

	      				<div>
	      					<div className="row m-0 pl-3 pr-3">
		      					<div className="col-md-6 pl-3 pr-3 text-center">
		      						<h5 className="text-primary">Liquidity <small>(including Fee)</small></h5>
		      						<h5 className="text-danger">$ {positionValue}</h5>
		      						
		      					</div>
		      					<div className="col-md-6 pl-3 pr-3 text-center">
		      						<h5 className="text-success">Fees Earned <small>(Cumulative)</small></h5>
		      						<h5 className="text-warning">$ {earnedFee}</h5>
		      					</div>
		      					<div className="col-md-12 pl-3 pr-3 text-center">
		      						<hr className="bg-info" />
		      					</div>
		      				</div>

		      				<div className="row m-0 pl-3 pr-3">
		      					<div className="col-md-6 pl-3 pr-3 text-center">
		      						<h5 className="text-primary">safehedge</h5>
		      						<h5 className="text-danger">{token0Number}</h5>
		      						
		      					</div>
		      					<div className="col-md-6 pl-3 pr-3 text-center">
		      						<h5 className="text-success">ETH</h5>
		      						<h5 className="text-warning">{token1Number}</h5>
		      					</div>
		      					<div className="col-md-12 pl-3 pr-3 text-center">
		      						<hr className="bg-info" />
		      					</div>
		      				</div>

	      					<div className="row m-0 pl-3 pr-3">
		      					<div className="col-md-6 pl-3 pr-3 text-center">
		      						<h5 className="text-primary">Fast :  <small> ${fastGas.gasAmount} ({fastGas.waitTime}m)</small></h5>
		      						<h5 className="text-danger">Fastest :  <small> ${fastestGas.gasAmount} ({fastestGas.waitTime}m)</small></h5>
		      						
		      					</div>
		      					<div className="col-md-6 pl-3 pr-3 text-center">
		      						<h5 className="text-success">Safelow :  <small> ${safelowGas.gasAmount} ({safelowGas.waitTime}m)</small></h5>
		      						<h5 className="text-warning">Average :  <small> ${averageGas.gasAmount} ({averageGas.waitTime}m)</small></h5>
		      					</div>
		      					<div className="col-md-12 pl-3 pr-3 text-center">
		      						<hr className="bg-info" />
		      					</div>
		      				</div>

	      					<div className="row m-0 pl-3 pr-3">
		      					<div className="col-md-6 pl-3 pr-3 text-left">
		      						{/*<h4>Transfer Gas Price</h4>*/}
		      					</div>
		      					<div className="col-md-6 pl-3 pr-3 text-right">
		      						{/*<h4>$ {(gasPrice / 10**13 * ethValue).toFixed(6)}</h4>*/}
		      						<p className="m-0">
		      							+5% BACK INTO LIQUIDITY
		      							&nbsp;
	      								{
	      									localStorage.getItem('walletAdr') && 
	      									<a href={"https://v2.info.uniswap.org/account/" + localStorage.getItem('walletAdr')} target="_blank">
		      									<span className="badge badge-pill badge-primary cursor-hand">analytics</span>
		      								</a>
	      								}
		      						</p>
		      					</div>
		      				</div>
		      				<br />
		      				<div className="row m-0 pl-3 pr-3">
		      					<div className="col-md-6 p-1 text-left">
		      						<Button className="w-100 pool-btn" onClick={handleAdd} disabled={isChanging}>ADD</Button>
		      					</div>
		      					<div className="col-md-6 p-1 text-right">
		      						<Button className="w-100 pool-btn" onClick={handleRemove} disabled={isChanging}>REMOVE</Button>
		      					</div>
		      				</div>

		      				<Connectbtn className="connect-wallet-btn-3 mt-3" imagePath="/img/pool/Connect_wallet_Text.png" />
		      				{/*<Button className="connect-wallet-btn-3 mt-3">
		        				<img src="/img/pool/Connect_wallet_Text.png" alt="" className="img-fluid" />
		        			</Button>*/}

		        		</div>

		        		<div className={classnames(classes.tip_part, "text-center", "mt-3")}>
	      					<h5>
	      						This pool is provided to the community to participate in the Liquidity that supports our ecosystem. In order to Stake, you will be charged a gas fee that is calculated based on current Ethereum Network Traffic. Please make sure you have extra ETH and adjust your Gwei to get the best current Fee Rate. If you have any problems with this form use the native backend form from Uniswap V2 and try the “Settings” Wheel to adjust the slippage. 
	      						<a href="https://app.uniswap.org/#/add/v2/0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0/ETH" target="_blank" className="text-info">
	      							<u> HERE </u>
	      						</a>
	      					</h5>
	      				</div>
		      				
	      			</div>
	      		</Grid>
	      		<Grid item lg={2} md={12} sm={12} xs={12} className="p-0">
	      		</Grid>
	      		<Grid item lg={4} md={12} sm={12} xs={12} className={classes.z_999}>
	      			<Farm />
	      		</Grid>
	      		<Grid item lg={1} md={12} sm={12} xs={12} className="p-0">
	      		</Grid>
	      	</Grid>
		</div>
	)
}

export default Pool;