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

const Airdrop = (props) => {
	const wallet = useSelector(state => state.connectWallet);

	const onLoad = async () => {
		const web3_1 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
	  const USDT_WETH = new web3_1.eth.Contract(UniswapPair, "0x06da0fd433c1a5d7a4faa01111c044910a184553");
    const USDT_WETH_reserve = await USDT_WETH.methods.getReserves().call();

	  const WETH_USDT_price = USDT_WETH_reserve._reserve1 / USDT_WETH_reserve._reserve0 * 10**12;
	  console.log("[***WETH_USDT_price]=>", Number(WETH_USDT_price.toFixed(10)));

	  // console.log("[***WETH_USDT_price]=>", USDT_WETH_reserve);
	  /////////////////////////////////////////////////////////////////////////

		if (window.ethereum) {
			web3 = new Web3(window.web3.currentProvider);
			tokenAddress = "0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0";  // Mainnet
			// const tokenAddress = "0x9de02c024916c3636d34f26fd45cb0b16004c2a2";  // Testnet
			tokenContract = new web3.eth.Contract(TokenABI, tokenAddress);
			contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
			factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");


			if (wallet.address) {
				let myBalance = (await tokenContract.methods.balanceOf(wallet.address).call()).toString();
				// console.log("[address, myBalance]=>", localStorage.getItem('walletAdr'), "=>", myBalance);
			} else {
				//
			}
		}
	}


	React.useEffect(() => {
		onLoad();
		if (window.ethereum) { 
			web3 = new Web3(window.web3.currentProvider);
		}
		return () => {
			//
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
	  	padding: "30px",
	  	paddingBottom: 20,
	  	textAlign: "center",
	  	border: "3px solid white"
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
	  	width: "100%",
	  	height: 40,
	  	backgroundColor: "grey",
	  	marginBottom: 20,
	  	fontSize: 25,
	  	color: "white",
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
		//
	}

	const inputETHAmount = async (amount) => {
		//
	}

	const inputTokenAmount = async (amount) => {
		//
	}



	return (
		<div className="mt-5 page-load">
			<ToastContainer />
			<Grid container spacing={3}>
    		<Grid item lg={4} md={12} sm={12} xs={12} className="p-0">
    		</Grid>
    		<Grid item lg={4} md={12} sm={12} xs={12} className={classnames(classes.z_999, "pl-0", "pr-0")}>
    			<div className={classes.content}>
    				<img src="/img/airdrop/airdrop_logo.png" alt="" className="img-fluid mb-3" />

  					<img src="/img/airdrop/banner.png" alt="" className="w-100 mb-3" />
  					<p>To eligible for free tokens. Please fill out the form below.</p>
  					<p>Join our Email News Letter and our Community!</p>

						<h3 className="text-left">
							Name
						</h3>
						<DelayInput
              minLength={1}
              delayTimeout={1500}
              type="text" 
							className={classes.amountInput} 
							// value={1} 
							placeholder="Full name"
							onChange={(e) => inputETHAmount(e.target.value)} />

						<h3 className="text-left">
							Email
						</h3>
						<DelayInput
              minLength={1}
              delayTimeout={1500}
              type="text" 
							className={classes.amountInput} 
							// value={1} 
							placeholder="user@mail.com"
							onChange={(e) => inputETHAmount(e.target.value)} />

						<p>
							All you need to do is connect your wallet, provide your email, and join either our Discord or Telegram Channel.
						</p>

						<p>
							You then will be able to unlock the free Tokens.
						</p>

    				<Connectbtn className="connect-wallet-btn-3 mt-3" imagePath="/img/pool/Connect_wallet_Text.png" />

    			</div>
    		</Grid>

    		<Grid item lg={4} md={12} sm={12} xs={12} className="p-0">
    		</Grid>
    	</Grid>
		</div>
	)
}

export default Airdrop;