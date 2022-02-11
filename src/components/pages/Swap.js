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

import Addtokenbtn from '../commons/Addtokenbtn';
import Bitcoinswap from './Bitcoinswap';

	
let web3 = null;

let tokenAddress = "";
let tokenContract = null;
let contract = null;
let factoryContract = null;

let SH = new Token(
  ChainId.MAINNET,
  "0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0",
  18
);

let USDT = new Token(
  ChainId.MAINNET,
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  18
);

let interval_id = 0;

const Swap = (props) => {
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
			tokenAddress = "0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0";  // Mainnet
			// const tokenAddress = "0x9de02c024916c3636d34f26fd45cb0b16004c2a2";  // Testnet
			tokenContract = new web3.eth.Contract(TokenABI, tokenAddress);
			contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
			factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");


			if (wallet.address) {
				let myBalance = (await tokenContract.methods.balanceOf(wallet.address).call()).toString();
				setMaxTokens(myBalance);
				// console.log("[address, myBalance]=>", localStorage.getItem('walletAdr'), "=>", myBalance);
				let myETH = (await web3.eth.getBalance(wallet.address)).toString();
				setMaxETH(myETH);
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




	const handleSwap = async () => {
		console.log(window.ethereum)
		if(!window.ethereum || !window.ethereum.selectedAddress || !wallet.address) return toast.warning("Connect Wallet 🤯");
		if (Number(tokenAmount) <= 0 && Number(ETHAmount) <= 0) return toast.error("Input value 🤯");
		else if (Number(ETHAmount).toFixed(10) > (maxETH / 10**18 - 0.05).toFixed(10)) return toast.error("Input Value is Exceeded! 🤯");
		setIsChanging(true);
		console.log("========", ETHAmount, maxETH / 10**18 - 0.05)
		try {
			let numberOfToken = tokenAmount * 10**10 + "00000000";
			let numberOfETH = ETHAmount * 10**10 + "00000000";
			const from = wallet.address;
			// *** Approve
			// console.log("[numberOfToken]=>", web3.utils.isBigNumber(numberOfToken));

			const pair1 = await Fetcher.fetchPairData(SH, WETH[SH.chainId]);

	    const route = new Route([pair1], WETH[SH.chainId]);
	    console.log('[amountIn]', numberOfToken);
	    const trade = new Trade(
	      route,
	      new TokenAmount(SH, numberOfToken),
	      TradeType.EXACT_OUTPUT
	    );
	    // console.log("[TokenAmount]", (new TokenAmount(WETH[SH.chainId], amountIn)));
	    const slippageTolerance = new Percent("50", "10000"); // 50 bips, or 0.50%

	    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
	    // const amountInMin = trade.minimumAmountIn(slippageTolerance).raw; // needs to be converted to e.g. hex
	    const path = [WETH[SH.chainId].address, SH.address];
	    const to = from; // should be a checksummed recipient address
	    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
	    const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex

	    console.log("[slippageTolerance]", slippageTolerance.toSignificant(3));
	    console.log("[amountOutMin]", amountOutMin.toString());
	    console.log("[path]", path);
	    console.log("[to]", to);
	    console.log("[deadline]", deadline);
	    console.log("[value]", value.toString());
	        

	    contract.methods.swapETHForExactTokens(
	          web3.utils.toHex(amountOutMin.toString()), 
	          path,
	          to,
	          deadline
	      )
	      .send({
	          from: from,
	          value: web3.utils.toHex(value.toString())
	      })
	      .on('receipt', function(receipt){
	          console.log(receipt);
	          if (receipt) {
	              toast.success("Success! Swap is succeed!!!  👌");
	              setIsChanging(false);
	          }
	      })
	      .on('error', function(error, receipt) {
	          console.log(error);
	          if (error) {
	              toast.error("Failed! SWAP is failed!!! 🤯");
	              setIsChanging(false);
	          }
	      });
		} catch (err) {
			toast.error("Failed! SWAP is failed!!! 🤯");
		}
	}

	const inputETHAmount = async (amount) => {
		if (Number(amount) <= 0) return; 
		try {
			setETHAmount(amount);
			/////////////////////////////////////////////////////////////////////
			const web3_1 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
		  const SH_WETH = new web3_1.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
	    console.log("[SH_WETH]", await SH_WETH.methods.getReserves().call());
	    const SH_WETH_reserve = await SH_WETH.methods.getReserves().call();

		  const routerV2 = new web3_1.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
		  routerV2.methods.getAmountOut(web3_1.utils.toHex(amount * 10**10 + "00000000"), web3_1.utils.toHex(SH_WETH_reserve._reserve1), web3_1.utils.toHex(SH_WETH_reserve._reserve0))
	        .call()
	        .then(r => setTokenAmount((r / 10**18).toFixed(0)))
	        .catch(console.log)
		} catch (err) {console.log(err)}
	}

	const inputTokenAmount = async (amount) => {
		if (Number(amount) <= 0) return; 
		try {
			setTokenAmount(amount);
			/////////////////////////////////////////////////////////////////////
			const web3_1 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
		  const SH_WETH = new web3_1.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
	    console.log("[SH_WETH]", await SH_WETH.methods.getReserves().call());
	    const SH_WETH_reserve = await SH_WETH.methods.getReserves().call();
	    console.log(SH)
		  const routerV2 = new web3_1.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
		  routerV2.methods.getAmountIn(web3_1.utils.toHex(amount * 10**10 + "00000000"), web3_1.utils.toHex(SH_WETH_reserve._reserve1), web3_1.utils.toHex(SH_WETH_reserve._reserve0))
	        .call()
	        .then(r => setETHAmount((r / 10**18).toFixed(4)))
	        .catch(err => setETHAmount(0))
		} catch (err) {}
	}



	return (
		<div className="mt-5 page-load">
			<ToastContainer />
			<Grid container spacing={3}>
    		<Grid item lg={1} md={12} sm={12} xs={12} className="p-0">
    		</Grid>
    		<Grid item lg={4} md={12} sm={12} xs={12} className={classnames(classes.z_999, "pl-0", "pr-0")}>
    			<div className={classes.content}>
    				<img src="/img/swap/Swap_Text.png" alt="" className="img-fluid" />

    				

    				<div className={classes.first_part}>
    					<img src="/img/pool/EthereumText.png" alt="" className="img-fluid mb-3" />
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
      						<h6 className="text-danger validation-text"><small>Input ETH value is exceeded than your balance or less than 0.05eth.</small></h6>
      					</div>
    					}
    				</div>

    				<div className={classes.first_part}>
    					<img src="/img/pool/Safehedge_Text.png" alt="" className="img-fluid" />
    					<div className={classes.first_1}>
    						<p className="letter-spacing-2">
    							Your balance <u>{(maxTokens / 10**18)}</u> SAFEHEDGE 
    							&nbsp;
    							{/*<span className="badge badge-pill badge-primary cursor-hand" onClick={e => inputTokenAmount((maxTokens / 10**18).toFixed(10))}>MAX</span>*/}
    						</p>
    						{/*<DelayInput
                  minLength={1}
                  delayTimeout={1500}
                  type="text" 
    							className={(Number(tokenAmount) <= (maxTokens / 10**18).toFixed(10)) ? classes.amountInput : classes.exceedInput} 
    							value={tokenAmount}
    							onChange={(e) => inputTokenAmount(e.target.value)} />*/}
    						<DelayInput
                  minLength={1}
                  delayTimeout={1500}
                  type="text" 
    							className={classes.amountInput} 
    							value={tokenAmount}
    							onChange={(e) => inputTokenAmount(e.target.value)} />
    						<img src="/img/pool/Safehedge_Coin_Logo.png" alt="" className="img-fluid Ethereum-Coin"/>
    					</div>
    					{/*{
    						(Number(tokenAmount) > (maxTokens / 10**18).toFixed(10))
    						&&
    						<div className="text-right">
      						<h6 className="text-danger validation-text"><small>Input value is exceeded than your balance.</small></h6>
      					</div>
    					}*/}
    				</div>





    				<div>
    					<div className="row m-0 pl-3 pr-3">
      					<div className="col-md-4 pl-3 pr-3 text-center">
      						<h6 className="text-primary">Fast :  <small> ${fastGas.gasAmount}{/* ({fastGas.waitTime}m)*/}</small></h6>
      						<h6 className="text-danger">Fastest :  <small> ${fastestGas.gasAmount}{/* ({fastestGas.waitTime}m)*/}</small></h6>
      					</div>
      					<div className="col-md-4 pl-3 pr-3 text-center">
      						<div className="d-flex align-items-center justify-content-center" style={{height: "100%"}}>
      							<img src="/img/swap/gas.png" alt="" width="70" />
      						</div>
      					</div>
      					<div className="col-md-4 pl-3 pr-3 text-center">
      						<h6 className="text-success">Safelow :  <small> ${safelowGas.gasAmount}{/* ({safelowGas.waitTime}m)*/}</small></h6>
      						<h6 className="text-warning">Average :  <small> ${averageGas.gasAmount}{/*({averageGas.waitTime}m)*/}</small></h6>
      					</div>
      					<div className="col-md-12 pl-3 pr-3 text-center">
      						<Addtokenbtn className="connect-wallet-btn" imagePath="/img/Small_Connect_Wallet_Text_Menu.png" />
      						<hr className="bg-info" />
      					</div>
      				</div>

    					{/*<div className="row m-0 pl-3 pr-3">
      					<div className="col-md-6 pl-3 pr-3 text-left">
      					</div>
      					<div className="col-md-6 pl-3 pr-3 text-right">
      						<p className="m-0">
      							+5% BACK INTO LIQUIDITY
      						</p>
      					</div>
      				</div>*/}
      				<br />
      				<div className="row m-0 pl-3 pr-3">
      					<div className="col-md-12 p-1 text-left">
      						<Button className="w-100 pool-btn" onClick={handleSwap} disabled={isChanging}>SWAP</Button>
      					</div>
      				</div>

      				<Connectbtn className="connect-wallet-btn-3 mt-3" imagePath="/img/pool/Connect_wallet_Text.png" />
      				
      				{/*<Button className="connect-wallet-btn-3 mt-3">
        				<img src="/img/pool/Connect_wallet_Text.png" alt="" className="img-fluid" />
        			</Button>*/}

        		</div>

        		<div className={classnames(classes.tip_part, "text-center", "mt-3")}>
    					<h5>
    						Swap capabilities are provided by Uniswap Labs. We do not in any way sell tokens or provide brokerage services. Any KYC or reporting is the sole responsibility of the Dex and its Decentralized Algorithms. This form uses API to connect to their backend. All gas and transaction fees are charged by Ethereum Blockchain and Uniswap. Please make sure you have enough ETH left over for the gas fee. If you have problems using this form you can click HERE to swap directly.
    						<a href="https://app.uniswap.org/#/swap?inputCurrency=0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0" target="_blank" className="text-info">
    							<u> HERE </u>
    						</a>
    					</h5>
    				</div>{/**/}

    				
      				
    			</div>
    		</Grid>

    		<Grid item lg={2} md={12} sm={12} xs={12} className="p-0">
    		</Grid>

    		<Grid item lg={4} md={12} sm={12} xs={12} className="pl-0 pr-0" style={{marginTop: "calc(50vh - 200px)"}}>
					{/*<Bitcoinswap />*/}
					<div id="iframe-widget-wrapper" style={{height: 355}}>
			      {/*<iframe id='iframe-widget' src='https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=false&amount=0.1&from=btc&horizontal=false&lang=en-US&link_id=5d3084f155d47a&locales=false&logo=false&to=eth' style={{height: 560, width: "100%", border: "none"}}></iframe>*/}
			      <iframe id='iframe-widget' src='https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=false&amount=0.1&from=btc&horizontal=false&lang=en-US&link_id=c2de6f48930654&locales=false&logo=false&primaryColor=51086e&to=eth&toTheMoon=false' style={{height: 560, width: "100%", border: "none"}}></iframe>
    
			    </div>
    		</Grid>
    		<Grid item lg={1} md={12} sm={12} xs={12} className="p-0">
    		</Grid>
    	</Grid>
		</div>
	)
}

export default Swap;