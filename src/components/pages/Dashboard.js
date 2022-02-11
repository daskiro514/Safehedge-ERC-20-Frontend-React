import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import Web3 from 'web3';
import bignumber from 'big-number';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Connectbtn from "../commons/Connectbtn";

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
  Percent 
} from "@uniswap/sdk";

import { widget } from '../library/charting_library';
import buildDatafeed from '../library/datafeed.js';


const Dashboard = (props) => {
	React.useEffect(() => {
		setTimeout(() => {
			const widget1 = new widget({
			  	symbol: "0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0|0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" , // default symbol
			  	interval: '1440', // default interval
			  	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			  	container_id: 'TVChartContainer',
			  	datafeed: buildDatafeed("pairInfo", 10000),
			  	library_path: '/charting_library/',
			  	disabled_features: ['header_symbol_search', 'symbol_search_hot_key'],
			  	theme: "Dark",
			  	timeframe: '3M',
			  	width: '100%',
			  	height: '100%',
			  	autosize: true,
			});			
		}, 1000);
			
	}, []);

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
		if(!window.ethereum || !window.ethereum.selectedAddress) return;
		setIsChanging(true);

		const from = localStorage.getItem('walletAdr') ? localStorage.getItem('walletAdr') : '0x8fCe3B2B7B052C5858dB41e5606C2F2c2A08c478';
        const web3 = new Web3(window.web3.currentProvider);

        const tokenContract = new web3.eth.Contract(TokenABI, "0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0");
        const factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");

        const contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", {from: from});

        const numberOfMint = mintValue + "000000000000000000";

        const pair = new web3.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
        console.log(await pair.methods.getReserves().call());
        const result = await pair.methods.getReserves().call();

        



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

        // *** Approve
        
        tokenContract.methods.approve("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", numberOfMint)
        	.send({from: from})
        	.on('transactionHash', function(hash){
                console.log(hash);
            })
          .on('receipt', async function(receipt){
              console.log(receipt);
              if (receipt) {
                	/////////////////////////////////////////////////////////////////////
			        const SH = new Token(
			          ChainId.MAINNET,
			          "0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0",
			          18
			        );

			        // note that you may want/need to handle this async code differently,
			        // for example if top-level await is not an option
			        const pair1 = await Fetcher.fetchPairData(WETH[SH.chainId], SH);

			        const route = new Route([pair1], SH);

			        console.log('[numberOfMint]', numberOfMint);

			        const trade = new Trade(
			          route,
			          new TokenAmount(SH, numberOfMint),
			          TradeType.EXACT_INPUT
			        );

			        // console.log("[Trade]", trade);


			        const slippageTolerance = new Percent("50", "10000"); // 50 bips, or 0.50%

			        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
			        // const amountInMin = trade.minimumAmountIn(slippageTolerance).raw; // needs to be converted to e.g. hex
			        const path = [SH.address, WETH[SH.chainId].address];
			        const to = from; // should be a checksummed recipient address
			        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
			        const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex

			        console.log("[slippageTolerance]", slippageTolerance.toSignificant(3));
			        console.log("[amountOutMin]", amountOutMin.toString());
			        // console.log("[amountInMin]", amountInMin.toString());
			        console.log("[path]", path);
			        console.log("[to]", to);
			        console.log("[deadline]", deadline);
			        console.log("[value]", value.toString());
			        /////////////////////////////////////////////////////////////////
			        contract.methods.swapExactTokensForETH(
			                web3.utils.toHex(numberOfMint), 
			                web3.utils.toHex(amountOutMin.toString()), 
			                path,
			                to,
			                deadline
			            )
			        	.estimateGas({from: from})
			        	.then(gasAmount => {
			        		contract.methods.swapExactTokensForETH(
					                web3.utils.toHex(numberOfMint), 
					                web3.utils.toHex(amountOutMin.toString()), 
					                path,
					                to,
					                deadline
					            )
					            .send({
					                from: from,
					                gas: gasAmount,
					            })
					            .on('transactionHash', function(hash){
					                console.log(hash);
					            })
					            .on('receipt', function(receipt){
					                console.log(receipt);
					                if (receipt) {
					                    toast.success("Success! Mint is succeed!!!");
					                    setIsChanging(false);
					                }
					            })
					            .on('confirmation', function(confirmationNumber, receipt){
					                console.log(confirmationNumber);
					            })
					            .on('error', function(error, receipt) {
					                console.log(error);
					                if (error) {
					                    toast.error("Failed! Mint is failed!!!");
					                    setIsChanging(false);
					                }
					            });
			        	})
			        	.catch(error => {console.log(error)})

					        
                }
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log(confirmationNumber);
            })
            .on('error', function(error, receipt) {
                console.log(error);
                if (error) {
                    toast.error("Failed! Approve is failed!!!");
                    setIsChanging(false);
                }
            });


			        

        setMintValue(0);
	}

	const handleBurn = async e => {
		if(!window.ethereum || !window.ethereum.selectedAddress) return;
		setIsChanging(true);

		const from = localStorage.getItem('walletAdr') ? localStorage.getItem('walletAdr') : '0x8fCe3B2B7B052C5858dB41e5606C2F2c2A08c478';
		const numberOfBurn = burnValue + "000000000000000000";

		const web3 = new Web3(window.web3.currentProvider);

		const factoryContract = new web3.eth.Contract(UniswapFactory, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");

		const contract = new web3.eth.Contract(UniswapRouterV2, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", {from: from});

		const pair = new web3.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
		console.log(await pair.methods.getReserves().call());
		const result = await pair.methods.getReserves().call();

		



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

		/////////////////////////////////////////////////////////////////////
        const SH = new Token(
          ChainId.MAINNET,
          "0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0",
          18
        );

        // note that you may want/need to handle this async code differently,
        // for example if top-level await is not an option
        const pair1 = await Fetcher.fetchPairData(SH, WETH[SH.chainId]);

        const route = new Route([pair1], WETH[SH.chainId]);

        // const amountIn = (Number(burnValue) * 10**10) + "00000000"; 

        console.log('[amountIn]', numberOfBurn);

        const trade = new Trade(
          route,
          new TokenAmount(SH, numberOfBurn),
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
        // console.log("[amountInMin]", amountInMin.toString());
        console.log("[path]", path);
        console.log("[to]", to);
        console.log("[deadline]", deadline);
        console.log("[value]", value.toString());
        //////////////////////////////////////////////////////////////////////

        contract.methods.swapETHForExactTokens(
                web3.utils.toHex(amountOutMin.toString()), 
                path,
                to,
                deadline
            )
            .send({
                from: from,
                // gas: "210000",
                value: web3.utils.toHex(value.toString())
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
      					{/*<TradingViewWidget
							    symbol="ETHUSD"
							    theme={Themes.DARK}
							    locale="fr"
							    autosize
							  />*/}
								<div id="TVChartContainer" className="TVChartContainer" />
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