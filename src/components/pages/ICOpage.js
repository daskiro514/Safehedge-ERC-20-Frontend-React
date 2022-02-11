import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import eventBus from '../eventBus';
import Connectbtn from '../commons/Connectbtn';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   first_part: {
//   	backgroundColor: "rgba(10, 10, 10, 0.5)",
//   	padding: "20px",
//   },
//   second_part: {
//   	[theme.breakpoints.up('md')]: {
//         height: "calc(100vh - 50px)",
//   	},
//   	height: "200px",
//   	backgroundColor: "rgba(10, 10, 10, 0.5)"
//   },
//   third_part: {
//   	height: "200px",
//   	backgroundColor: "rgba(10, 10, 10, 0.5)"
//   },
//   forth_part: {
//   	height: "200px",
//   	backgroundColor: "rgba(10, 10, 10, 0.5)"
//   },
//   loadingBar: {
//   	width: "100%",
//   	height: 35,
//   	// border: "1px solid black",
//   	boxShadow: "0 0 5px lightgreen",
//   	backgroundImage: "url('/img/ico/Green_loading_bar.png')",
//     backgroundRepeat: "no-repeat",
//     backgroundSize: `${percent_sell}% 100%`,
//   }
// }));


const ICOpage = (props) => {

	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		setLoading(false);
		// eventBus.dispatch("couponApply");
	}, []);

	let percent_sell = 25;

	const useStyles = makeStyles((theme) => ({
	  root: {
	    flexGrow: 1,
	  },
	  first_part: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/ico/Top_MENU_BAR_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	padding: "20px",
	  	paddingBottom: 20,
	  },
	  second_part: {
	  	// [theme.breakpoints.up('md')]: {
	   //      height: "calc(100vh - 50px)",
	  	// },
	  	// height: "200px",
	  	// backgroundImage: "url('/img/ico/Right_get_started_menu_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	minHeight: 350,
	  	height: "100%",
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	display: "flex",
	  	alignItems: "center",
	  },
	  third_part: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/ico/Bottom_2_Menu_squares_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	height: "100%",
	  	padding: 50,
	  	paddingTop: 30,
	  	position: "relative",
	  },
	  forth_part: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/ico/Bottom_2_Menu_squares_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	padding: 50,
	  	paddingTop: 30,
	  	height: "100%",
	  	position: "relative",
	  	[theme.breakpoints.down('md')]: {
	        minHeight: 430,
	  	},
	  },
	  loadingBar: {
	  	width: "100%",
	  	height: 45,
	  	// border: "1px solid black",
	  	boxShadow: "0 0 5px lightgreen",
	  	backgroundImage: "url('/img/ico/Green_loading_bar.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: `${percent_sell}% 100%`,
	    display: "flex",
	    justifyContent: "flex-end",
	    alignItems: "center",
	    paddingRight: 20,
	  },
	  loadingBarBg: {
	  	width: "100%",
	  	backgroundColor: "rgba(0, 0, 0, 0.5)",
	  	marginTop: 50,
	  },
	  emailInput: {
	  	width: "100%",
	  	height: 60,
	  	paddingLeft: 10,
	  	fontSize: 25
	  },
	  third_margin: {
	  	height: 40
	  },
	}));

	const classes = useStyles();

	return (
	  <div className="d-flex align-items-center mt-5 page-load">
	  	{loading ? <h1>Loading...</h1> : <Grid container spacing={3}>
	      <Grid item lg={9} md={12} sm={12} xs={12}>
	        <div className={classes.first_part}>
	        	<div className="text-center pt-2">
	        		<img src="/img/ico/SafeHedge_ICO_Title.png" alt="ico_title" className="img-fluid w-100" />
	        		<img src="/img/ico/SH_token_Text.png" alt="ico_title" className="img-fluid w-75" />
        			{/*<h2 className="mt-3 ico-glow-text letter-spacing-10">1 SAFEHEDGE TOKEN = $.0025</h2>*/}
        			<div className="w-75 m-auto">
        				<p className="mt-1 text-white ico-glow-text letter-spacing-5 ">YOU WILL BE SOLD TOKENS AT .0025 OF A DOLLAR, WHICH CAN BE STAKED IN OUR POOL TO RECEIVE REWARDS. WE ARE ALLOCATING 800,000 TOKENS TO THE FIRST MARKET MAKERS IN THIS PRIVATE SALE</p>
        			</div>
	        	</div>
	        	<div className={classes.loadingBarBg}>
	        		<div className={classes.loadingBar}>
		        		<h3 className="text-white m-0">600,000 / 800,000</h3>
		        	</div>
	        	</div>
	        </div>

	        {/*<div className="d-flex">*/}
	        	<Grid container className="mt-2" spacing={3}>
		        	<Grid item lg={6} md={12} sm={12} xs={12}>
		        		<div className={classes.third_part}>
		        			<img src="/img/ico/your_stake_text.png" alt="" className="img-fluid"/>
			        		{/*<h3 className="ico-glow-text letter-spacing-10">YOUR STAKE: - </h3>*/}
			        		<br />
			        		<br />
			        		<p className="text-white letter-spacing-5">WE WILL EMAIL YOU ONCE THE LIQUIDITY POOL IS AVAILABLE FOR STAKING</p>
			        		<br />
			        		<h5 className="text-white">EMAIL:</h5>
			        		<form noValidate autoComplete="off">
						      <input className={classes.emailInput} type="text" placeholder="YOUR EMAIL" />
						      <div className="mt-2 d-flex align-items-center">
						      	<input type="checkbox" id="check_1" />&nbsp;&nbsp; <label htmlFor="check_1" className="text-white m-0 letter-spacing-5"> I AGREE TO RECEIVE INFORMATION FROM SAFEHEDGE</label>
						      </div>
						      <div className="mt-4">
						          <Button className="connect-wallet-btn-1">
						          	<img src="/img/ico/Subscribe_text.png" alt="" className="img-fluid" />
						          </Button>
					          </div>
						    </form>
						    <div className={classes.third_margin}></div>
			       		</div>
		        	</Grid>
			        	
		       		<Grid item lg={6} md={12} sm={12} xs={12}>
		       			<div className={classes.forth_part}>
		       				<img src="/img/ico/Claim_your_nft_text.png" alt="" className="img-fluid" />
			        		{/*<h3 className="ico-glow-text letter-spacing-10">CLAIM YOUR NFT!</h3>*/}
			        		<div className="text-center mt-2">
			        			<img src="/img/ico/safeHedge_Coin_NFT_Coins.png" alt="safeHedge_Coin_NFT_Coins.png" className="img-fluid glow-coins" />
			        		</div>
			        		<div className="mt-2">
					          	<Connectbtn className="connect-wallet-btn-1" imagePath="/img/ico/Connect_big_wallet_text.png" />
					          	{/*<Button className="connect-wallet-btn-1">
					          		<img src="/img/ico/Connect_big_wallet_text.png" alt="" className="img-fluid" />
					          	</Button>*/}
				          	</div>
			       		</div>
		       		</Grid>
		        </Grid>
	        {/*</div>*/}
		        
	      </Grid>

	      <Grid item lg={3} md={12} sm={12} xs={12}>
	        <div className={classes.second_part}>
	        	<div className="w-100 text-center">
	        		<h3 className="text-white">GET STARTED</h3>
	        		<p className="text-light">BY CONNECTING ONE OF THE WALLETS BELOW</p>
	        		<div className="m-5">
	        			<input className={classes.emailInput} type="text" placeholder="AMOUNT OF TOKENS" />
	        			<Connectbtn className="connect-wallet-btn-2 mt-3" imagePath="/img/ico/right_side_Small_connect_wallet_text.png" />
	        			{/*<Button className="connect-wallet-btn-2 mt-3">
	        				<img src="/img/ico/right_side_Small_connect_wallet_text.png" alt="" className="img-fluid" />
	        			</Button>*/}
	        		</div>
	        	</div>
	        </div>
	      </Grid>
	    </Grid>}
	    
	  </div>
	);
}

export default ICOpage;