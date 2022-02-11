import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import Hidden from '@material-ui/core/Hidden';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { widget } from '../library/charting_library';
import buildDatafeed from '../library/datafeed.js';

import Slideshow from '../commons/Slideshow';
 

const Homepage = (props) => {
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

		try {
			window.mediumWidget();
		} catch (err) {}
		
		return () => {
			try {
				window.MediumWidget.unmount();
			} catch (err) {}
    };
	}, []);

	const useStyles = makeStyles((theme) => ({
	  root: {
	    textAlign: "center",
	  },
	  first_part: {
	  	// height: "40vh",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	textAlign: "center",
	  },
	  ecosystem_part: {
	  	// height: "40vh",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	textAlign: "center",
	  	marginBottom: 20,
	  },
	  chart_part: {
	  	height: "calc(100% - 30px)",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	textAlign: "center",
	  	marginBottom: 20,
	  	minHeight: 450
	  },
	  blog_part: {
	  	height: "100%",
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	marginBottom: 20,
	  },
	  third_margin: {
	  	height: 40
	  },
	  z_999: {
	  	zIndex: 999,
	  },
	  third_part: {
	  	minHeight: "20vh",
	  	height: "20vh",
	  	backgroundColor: "rgba(0, 0, 0, 0.8)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  	marginTop: 10,
	  	marginBottom: 20,
	  },
	  p_font: {
	  	fontSize: 25,
	  	letterSpacing: "2px !important",
	  	marginBottom: 5
	  },
	  connect_btn: {
	  	marginTop: 20,
	  	width: "40%",
			height: 60,
	    backgroundImage: "url('/img/homepage/Read_more_button.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	  },
	  smart_hedging_eco_text_border: {
	  	backgroundImage: "url('/img/homepage/Smart_headging_eco_Border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px 5px",
	  },
	  smart_hedging_eco_content_border: {
	  	backgroundImage: "url('/img/homepage/Smart_hedging_Eco_text_box_border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px",
	    textAlign: "justify",
	  },
	  SH_Gold_Border: {
	  	backgroundImage: "url('/img/homepage/SH_Gold_Border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px 5px",
	  },
	  chart_part_1: {
	  	padding: 15,
	  	height: "calc(100% - 70px)",
	  },
	  latest_blog_border: {
	  	height: "inherit",
	  	backgroundImage: "url('/img/homepage/latest_blog_border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "10px 30px",
	    // paddingTop: 20,
	    alignItems: "center",
	  },
	  liquidity_border: {
	  	height: "inherit",
	  	backgroundImage: "url('/img/homepage/liquidity_border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "10px 30px",
	    // paddingTop: 20,
	    alignItems: "center",
	  },
	  flex_1: {
	  	flex: 1
	  },
	}));

	const classes = useStyles();
	const matches = useMediaQuery('(min-width:1280px)');


	return (
		<div className="text-center page-load">
			{/*<Helmet>
				<title>Homepage</title>
				<meta name="description" content="Homepage" />
      </Helmet>*/}
			{ matches ? 
				<React.Fragment>
					<div>
						<img src="/img/homepage/incodewetrustbig.png" alt="" width="50%" height="60px" />
					</div>

					<div>
						<Grid container spacing={3}>
		      		<Grid item lg={4} md={12} sm={12} xs={12}>
		      			<div className={classes.ecosystem_part}>
		    					<div className={classes.smart_hedging_eco_text_border}>
		    						<img src="/img/homepage/smart_hedging_eco_text.png" alt="" className="img-fluid w-100" />
		    					</div>
		      				<div className={classes.smart_hedging_eco_content_border}>
											<p className={classes.p_font}>
												Due to all the uncertainty in crypto today, there is an absolute need for hedging. The safehedge ecosystem utilizes ai to stabilize any volatility in our network and provides leveraged tokens short and long.
											</p>
											<br />
											<p className={classes.p_font}>
												Making use of the latest trading algorithms we keep our community informed about confirmation signals and trends. This empowers them to make proper decisions about their wealth management no matter the market conditions.
											</p>
		      				</div>
		      			</div>
		      		</Grid>
		      		<Grid item lg={8} md={12} sm={12} xs={12}>
		      			<div className={classes.chart_part}>
		      				<div className={classes.SH_Gold_Border}>
		    						<img src="/img/homepage/SH_gold_text.png" alt="" className="img-fluid" />
		    					</div>
		    					<div className={classes.chart_part_1}>
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
		      	</Grid>
					</div>

					{/*<div className={classes.third_part}>
						<div className={classes.liquidity_border}>
							<div id="TVChartContainer1" className="TVChartContainer" />
						</div>
					</div>*/}

					<div>
						<Grid container spacing={3}>
		      		<Grid item lg={7} md={12} sm={12} xs={12}>
		      			<div className={classes.blog_part}>
		    					<div className={classes.latest_blog_border}>
		    						<div>
		    							<img src="/img/homepage/latest_blog_text.png" alt="" className="p-2 img-fluid" style={{height: 70}} />
		    						</div>
		    						<div id="medium-widget"></div>
		    						<div>
		    							<a href="https://medium.com/@safehedgecrypto" target="_blank">
		    								<Button className={classes.connect_btn}>
		    									<img src="/img/homepage/Read_more_text.png" alt="" width="70%" />
				      					</Button>
				      				</a>
		    						</div>
		    					</div>
		      			</div>
		      		</Grid>
		      		<Grid item lg={5} md={12} sm={12} xs={12}>
		      			<div className={classes.blog_part}>
		    					<div className={classNames(classes.latest_blog_border)}>
		    						<div><img src="/img/homepage/merchshoptitle.png" alt="merch" className="img-fluid" /></div>
		    						<div className="d-flex justify-content-around align-items-center">
		    							<div className={classes.flex_1}>
		    								<div>
		    									<img src="/img/homepage/Shop_merch_text.png" alt="" className="img-fluid" />
		    								</div>
		    								<div>
		    									<a href="https://safe-hedge-crypto.creator-spring.com" target="_blank">
			    									<Button className={classNames(classes.connect_btn, "w-75")}>
		    											<img src="/img/homepage/buynow.png" alt="" className="img-fluid" />
			    									</Button>
		    									</a>
		    								</div>
		    							</div>
		    							<div className={classes.flex_1}>
			      						<img src="/img/homepage/T_Shirt_Merch_picture.png" alt="" className="img-fluid" />
		    							</div>
		    						</div>
		    						<div className="mt-5">
		    							{/*<iframe width="100%" height="345" src="https://youtu.be/YRl5NCerLaw">
		    							</iframe>*/}
		    							<Slideshow />
		    						</div>
		    						<div>
		    							<img src="/img/SafeHedge_Mascot.png" alt="" className="img-fluid" />
		    						</div>
		    					</div>
		      			</div>
		      		</Grid>
		      	</Grid>
					</div>
				</React.Fragment>
				:
				<React.Fragment>
					<div>
						<Hidden smUp implementation="css">
							<img src="/img/homepage/Finished_new_coin.png" alt="" className="img-fluid logo-animation" />
						</Hidden>

						<div>
							<img src="/img/homepage/incodewetrustbig.png" alt="" width="85%" height="40px" />
						</div>
					</div>

					<div>
						<Grid container spacing={3}>
		      		<Grid item lg={8} md={12} sm={12} xs={12}>
		      			<div className={classes.chart_part}>
		      				<div className={classes.SH_Gold_Border}>
		    						<img src="/img/homepage/SH_gold_text.png" alt="" className="img-fluid" />
		    					</div>
		    					<div className={classes.chart_part_1}>
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
		      		<Grid item lg={4} md={12} sm={12} xs={12}>
		      			<div className={classes.ecosystem_part}>
		    					<div className={classes.smart_hedging_eco_text_border}>
		    						<img src="/img/homepage/smart_hedging_eco_text.png" alt="" className="w-100" height="30px" />
		    					</div>
		      				<div className={classes.smart_hedging_eco_content_border}>
											<p className={classes.p_font}>
												Due to all the uncertainty in crypto today, there is an absolute need for hedging. The safehedge ecosystem utilizes ai to stabilize any volatility in our network and provides leveraged tokens short and long.
											</p>
											<br />
											<p className={classes.p_font}>
												Making use of the latest trading algorithms we keep our community informed about confirmation signals and trends. This empowers them to make proper decisions about their wealth management no matter the market conditions.
											</p>
		      				</div>
		      			</div>
		      		</Grid>
		      	</Grid>
					</div>

					{/*<div className={classes.third_part}>
						<div className={classes.liquidity_border}>
							<div id="TVChartContainer1" className="TVChartContainer" />
						</div>
					</div>*/}

					<div>
						<Grid container spacing={3}>
		      		<Grid item lg={7} md={12} sm={12} xs={12}>
		      			<div className={classes.blog_part}>
		    					<div className={classes.latest_blog_border}>
		    						<div>
		    							<img src="/img/homepage/latest_blog_text.png" alt="" className="p-2 w-75" height="70px" />
		    						</div>
		    						
		    						<div id="medium-widget"></div>
		    						<div>
		    							<a href="https://medium.com/@safehedgecrypto" target="_blank">
		    								<Button className={classNames(classes.connect_btn, "w-75")}>
		    									<img src="/img/homepage/Read_more_text.png" alt="" width="img-fluid" />
				      					</Button>
				      				</a>
		    						</div>
		    					</div>
		      			</div>
		      		</Grid>
		      		<Grid item lg={5} md={12} sm={12} xs={12}>
		      			<div className={classes.blog_part}>
		    					<div className={classNames(classes.latest_blog_border)}>
		    						<div><img src="/img/homepage/merchshoptitle.png" alt="merch" className="img-fluid" /></div>
		    						<div className="d-flex justify-content-around align-items-center">
		    							<div className={classes.flex_1}>
		    								<div>
		    									<img src="/img/homepage/Shop_merch_text.png" alt="" className="img-fluid" />
		    								</div>
		    								<div>
    										<a href="https://safe-hedge-crypto.creator-spring.com" target="_blank">
		    									<Button className={classNames(classes.connect_btn, "w-75")}>
		    											<img src="/img/homepage/buynow.png" alt="" className="img-fluid" />
		    									</Button>
	    									</a>
		    								</div>
		    							</div>
		    							<div className={classes.flex_1}>
			      						<img src="/img/homepage/T_Shirt_Merch_picture.png" alt="" className="img-fluid" />
		    							</div>
		    						</div>
		    						<div className="mt-5">
		    							{/*<iframe width="100%" height="345" src="https://youtu.be/YRl5NCerLaw">
		    							</iframe>*/}
		    							<Slideshow />
		    						</div>
		    					</div>
		      			</div>
		      		</Grid>
		      	</Grid>
					</div>
				</React.Fragment>
			}
					
		</div>
	)
}

export default Homepage;