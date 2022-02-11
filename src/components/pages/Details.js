import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


const Details = (props) => {
	const useStyles = makeStyles((theme) => ({
	  root: {
	    flexGrow: 1,
	  },
	  first_part: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/info/Total_Supply_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #270136, #270136, #270136, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	textAlign: "center"
	  },
	  second_part: {
	  	// [theme.breakpoints.up('md')]: {
	   //      height: "calc(100vh - 50px)",
	  	// },
	  	// height: "200px",
	  	// backgroundImage: "url('/img/info/Initial_market_cap_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #270136, #270136, #270136, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	textAlign: "center"
	  },
	  third_1: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/info/SH_tokenomics_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #270136, #270136, #270136, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	height: "100%",
	  	textAlign: "center",
	  },
	  third_2: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/info/Graph_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #270136, #270136, #270136, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	height: "100%",
	  	textAlign: "center",
	  	marginTop: 5,
	  	position: "relative"
	  },
	  third_3: {
	  	// backgroundColor: "rgba(10, 10, 10, 0.35)",
	  	// backgroundImage: "url('/img/info/Color_name_background.png')",
	  	backgroundImage: "linear-gradient(180deg, #270136, #270136, #270136, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	height: "100%",
	  	textAlign: "center",
	  	padding: 5,
	  	marginTop: 15,
	  },
	  third_margin: {
	  	height: 40
	  },
	  whitepapers: {
	  	position: "absolute",
	  	bottom: 10,
	  	left: 20,
	  	color: "lightblue",
	  	fontSize: 20
	  },
	  initial_market_cap_border: {
	  	backgroundImage: "url('/img/info/INITIAL_MARKET_CAP_BORDER.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px 5px",
	  },
	  total_supply_border: {
	  	backgroundImage: "url('/img/info/TOTAL_SUPPLY_BORDER.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px 5px",
	  },
	  tokenommics_border: {
	  	backgroundImage: "url('/img/info/SH_TOKENOMICS_BORDER.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px 5px",
	  },
	  paragraph_border: {
	  	height: "100%",
	  	backgroundImage: "url('/img/info/SMART_HEDGING_ECOSYSTEM_PARAGRAPH_BORDER.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px 5px",
	  },
	}));

	const classes = useStyles();


	return (
		<div className="mt-5 page-load">

			<Grid container spacing={3}>
	      		<Grid item lg={5} md={12} sm={12} xs={12}>
	      			<div className={classes.first_part}>
	      				<div className={classes.total_supply_border}>
	      					<div>
		      					<img src="/img/info/Total_Supply_Text.png" alt="" className="img-fluid" />
		      				</div>
		      				<div>
		      					<img src="/img/info/426000000_Text.png" alt="" className="img-fluid" />
		      				</div>
	      				</div>
	      			</div>
	      		</Grid>
	      		<Grid item lg={1} md={12} sm={12} xs={12}>
	      		</Grid>
	      		<Grid item lg={6} md={12} sm={12} xs={12}>
	      			<div className={classes.second_part}>
	      				<div className={classes.initial_market_cap_border}>
	      					<div>
		      					<img src="/img/info/Initial_Market_Cap_Text.png" alt="" className="img-fluid" />
		      				</div>
		      				<div>
		      					<img src="/img/info/$2000_USDC_Text.png" alt="" className="img-fluid" />
		      				</div>
	      				</div>
	      			</div>
	      		</Grid>
	      	</Grid>

	      	<br />
	      	<br />

	      	<Grid container spacing={3}>
	      		<Grid item lg={7} md={12} sm={12} xs={12}>
	      			<div className="pt-0">
	      				<div className={classes.third_1}>
	      					<div className={classes.tokenommics_border}>
	      						<img src="/img/info/SH_tokenomics_text.png" alt="" className="img-fluid" />
	      					</div>
	      				</div>
	      				<div className={classes.third_2}>
	      					<div className={classes.paragraph_border}>
	      						<img src="/img/info/Graph.png" alt="" className="img-fluid" />
	      					</div>
	      					<a href="https://docs.google.com/document/d/1Xe7pLYVM3C8MGHxPDp2WNcouMwlD8LpbvkFZi8q_eWs/edit" className={classes.whitepapers} target="_blank">
	      						<img src="/img/info/logo.png" alt="" width="20px" className="mr-2 logo-animation-1" />
	      						White Papers
	      					</a>
	      				</div>
	      				<div className={classes.third_3}>
	      					<img src="/img/info/color_name.png" alt="" className="img-fluid" />
	      				</div>
	      			</div>
	      		</Grid>
	      		<Grid item lg={5} md={12} sm={12} xs={12}>
	      			<div className="">
	      				<img src="/img/info/forth_1.png" alt="" className="img-fluid mb-3 w-100" style={{height: 65}} />
	      				<img src="/img/info/forth_2.png" alt="" className="img-fluid mb-3 w-100" style={{height: 345}} />
	      				<img src="/img/info/forth_3.png" alt="" className="img-fluid mb-0 w-100" style={{height: 67}} />
	      			</div>
	      		</Grid>
	      	</Grid>

		</div>
	)
}

export default Details;