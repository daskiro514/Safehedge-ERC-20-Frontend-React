import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Connectbtn from "../commons/Connectbtn";

import TokenABI from '../../abis/Token.json'
import wethABI from '../../abis/wethABI.json'
import UniswapRouterV2 from '../../abis/UniswapV2.json'
import UniswapPair from '../../abis/UniswapPair.json'
import UniswapFactory from '../../abis/UniswapFactory.json'

const Dashboard = (props) => {
	const useStyles = makeStyles((theme) => ({
	  root: {
	    textAlign: "center",
	  },
	  first_part: {
	  	minHeight: "40vh",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	padding: 15,
	  	paddingBottom: 20,
	  	textAlign: "center",
	  	marginBottom: 20,
	  },
	  first_1: {
	  	backgroundColor: "black",
	  	height: "100%",
	  },
	  first_2: {
	  	backgroundColor: "black",
	  	// minHeight: "28vh",
	  	height: "28vh"
	  },
	  first_3: {
	  	backgroundColor: "black",
	  	minHeight: "15vh",
	  },
	  third_margin: {
	  	height: 40
	  },
	  z_999: {
	  	zIndex: 999,
	  },
	  amountInput: {
	  	width: "50%",
	  	height: 70,
	  	backgroundColor: "white",
	  	fontSize: 35,
	  	textAlign: "center",
	  },
	  connect_btn: {
	  	marginTop: 20,
	  	width: "100%",
		height: 50,
	    backgroundImage: "url('/img/dashboard/Connect_Wallet_Button.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	  },
	  gas_part: {
	  	minHeight: "15vh",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	padding: 15,
	  	paddingBottom: 20,
	  	textAlign: "center",
	  	marginBottom: 20,
	  },
	  third_part: {
	  	minHeight: "20vh",
	  	backgroundColor: "rgba(0, 0, 0, 0.8)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	padding: 15,
	  	marginBottom: 20,
	  }
	}));

	const classes = useStyles();


	const [mintValue, setMintValue] = React.useState(0);
	const [burnValue, setBurnValue] = React.useState(0);
	const [isChanging, setIsChanging] = React.useState(false);

	const handleMint = async (e) => {
		setIsChanging(true);
		const web3 = new Web3(window.web3.currentProvider);

		const tokenContract = new web3.eth.Contract(wethABI, "0xc778417E063141139Fce010982780140Aa0cD5Ab");
		const factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");

		const contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", {from: "0x8fCe3B2B7B052C5858dB41e5606C2F2c2A08c478"});

		const numberOfMint = mintValue + "000000000000000000";

		const pair = new web3.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
		console.log(await pair.methods.getReserves().call());
		const result = await pair.methods.getReserves().call();

		const from = localStorage.getItem('walletAdr') ? localStorage.getItem('walletAdr') : '0x8fCe3B2B7B052C5858dB41e5606C2F2c2A08c478';



		const wethAddress = await contract.methods.WETH().call()
				console.log(wethAddress);

		contract.methods.getAmountOut(web3.utils.toHex(numberOfMint), web3.utils.toHex(result._reserve0), web3.utils.toHex(result._reserve1))
			.call()
			.then(r => console.log("[r]=", r))
			.catch(console.log)

		factoryContract.methods.getPair("0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
			.call()
			.then(r => console.log("[Pair addr]=>", r))
			.catch(console.log)

		contract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
				web3.utils.toHex(numberOfMint), 
				0, 
				["0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
				from,
				web3.utils.toHex(((new Date()).getTime()/1000).toFixed(0) + 60*20)
			)
			.send({
				from: from,
				gas: "210000"
			})
			.on('transactionHash', function(hash){
			    console.log(hash);
			})
			.on('receipt', function(receipt){
			    console.log(receipt);
			    if (receipt) {
			    	toast.success("Success! Burnt is succeed!!!");
			    	setIsChanging(false);
			    }
			})
			.on('confirmation', function(confirmationNumber, receipt){
			    console.log(confirmationNumber);
			})
			.on('error', function(error, receipt) {
			    console.log(error);
			    if (error) {
			    	toast.error("Failed! Burnt is failed!!!");
			    	setIsChanging(false);
			    }
			});

		setMintValue(0);
	}

	const handleBurn = async e => {
		setIsChanging(true);

		const numberOfBurn = burnValue + "000000000000000000";

		const web3 = new Web3(window.web3.currentProvider);

		const tokenContract = new web3.eth.Contract(wethABI, "0xc778417E063141139Fce010982780140Aa0cD5Ab");
		const factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");

		const contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", {from: "0x8fCe3B2B7B052C5858dB41e5606C2F2c2A08c478"});

		const pair = new web3.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
		console.log(await pair.methods.getReserves().call());
		const result = await pair.methods.getReserves().call();

		const from = localStorage.getItem('walletAdr') ? localStorage.getItem('walletAdr') : '0x8fCe3B2B7B052C5858dB41e5606C2F2c2A08c478';



		const wethAddress = await contract.methods.WETH().call()
				console.log(wethAddress);

		const burn = await contract.methods.getAmountsIn(web3.utils.toHex("1000000000000000"), ["0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"])
			.call()
			// .then(r => console.log("[r]=", r))
			// .catch(console.log)

		factoryContract.methods.getPair("0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
			.call()
			.then(r => console.log("[Pair addr]=>", r))
			.catch(console.log)

		// console.log(web3.utils.toHex(numberOfBurn));

		contract.methods.swapETHForExactTokens(
				web3.utils.toHex(burn[0]),
				["0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
				from,
				web3.utils.toHex(Math.round(Date.now()/1000)+60*20)
			)
			.send({from: from, gas: "210000", value: web3.utils.toHex(1000000000000000)})
			.on('transactionHash', function(hash){
			    console.log(hash);
			})
			.on('receipt', function(receipt){
			    console.log(receipt);
			    if (receipt) {
			    	toast.success("Success! Burnt is succeed!!!");
			    	setIsChanging(false);
			    }
			})
			.on('confirmation', function(confirmationNumber, receipt){
			    console.log(confirmationNumber);
			})
			.on('error', function(error, receipt) {
			    console.log(error);
			    if (error) {
			    	toast.error("Failed! Burnt is failed!!!");
			    	setIsChanging(false);
			    }
			});
		
		setBurnValue(0);
	}


	return (
		<div className={classes.root}>
			<ToastContainer />
			<img src="/img/dashboard/Dans_DAshboard_text.png" alt="" className="img-fluid" />

			<div className={classes.first_part}>
				<Grid container spacing={3}>
      		<Grid item lg={3} md={12} sm={12} xs={12}>
      			<div className={classes.first_1}>
      				<img src="/img/dashboard/Key_metrics_MEnu_header.png" alt="" className="img-fluid w-100" />
      			</div>
      		</Grid>
      		<Grid item lg={6} md={12} sm={12} xs={12}>
      			<div className="ml-3 mr-3 mt-3 mb-0 text-left">
      				<img src="/img/dashboard/SH_text.png" alt="" className="img-fluid" />
      				<div className={classes.first_2}>
      					<TradingViewWidget
							    symbol="ETHUSD"
							    theme={Themes.DARK}
							    locale="fr"
							    autosize
							  />
      				</div>
      			</div>
      		</Grid>
      		<Grid item lg={3} md={12} sm={12} xs={12}>
      			<div>
      				<div className="row m-0">
      					<div className="col-sm-6 m-0"><p>CHANGE</p></div>
      					<div className="col-sm-6 m-0"><p>CURRENT</p></div>
      				</div>
      				<div className="row mb-3 ml-0 mr-0 bg-dark">
      					<div className="col-sm-6 m-0">
      						<img src="/img/dashboard/text_1025.png" alt="" className="img-fluid" />
      					</div>
      					<div className="col-sm-6 m-0">
      						<img src="/img/dashboard/text_00025.png" alt="" className="img-fluid" />
      					</div>
      				</div>
      				<div className={classes.first_3}>
      					<img src="/img/dashboard/ROI_Menu_HEader.png" alt="" className="img-fluid w-100" />
      				</div>
      				{/*<Button className={classes.connect_btn}>
        			</Button>*/}
        			<Connectbtn className="connect-wallet-btn-3 mt-3" imagePath="/img/pool/Connect_wallet_Text.png" />
        			{/*<Button className="connect-wallet-btn-3 mt-3">
        				<img src="/img/pool/Connect_wallet_Text.png" alt="" className="img-fluid" />
        			</Button>*/}
      			</div>
      		</Grid>
      	</Grid>
			</div>

			<div>
				<Grid container spacing={3}>
      		<Grid item lg={4} md={12} sm={12} xs={12}>
      			<div>
      				<input type="text" className={classes.amountInput} placeholder="TEXT HERE"
      					value={mintValue} onChange={e => setMintValue(e.target.value)} />
      				<Button onClick={handleMint} disabled={isChanging}>
      					<img src="/img/dashboard/Mint_Button.png" alt="" className="img-fluid" />
      				</Button>
      			</div>
      		</Grid>
      		<Grid item lg={4} md={12} sm={12} xs={12}>
      			<div>
      				<input type="text" className={classes.amountInput} placeholder="TEXT HERE" />
      				<div className={classes.gas_part}></div>
      				{/*<Button>
      					<img src="/img/dashboard/Mint_Button.png" alt="" className="img-fluid" />
      				</Button>*/}
      			</div>
      		</Grid>
      		<Grid item lg={4} md={12} sm={12} xs={12}>
      			<div>
      				<input type="text" className={classes.amountInput} placeholder="TEXT HERE"
      					value={burnValue} onChange={e => setBurnValue(e.target.value)} />
      				<Button onClick={handleBurn} disabled={isChanging}>
      					<img src="/img/dashboard/Burn_Button.png" alt="" className="img-fluid" />
      				</Button>
      			</div>
      		</Grid>
      	</Grid>
			</div>

			<div className={classes.third_part}>
				
			</div>
		</div>
	)
}

export default Dashboard;