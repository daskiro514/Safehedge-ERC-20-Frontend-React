import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { GoogleSpreadsheet } from "google-spreadsheet";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Config variables
const SHEET_ID = "0";

const Seminar = () => {
	const useStyles = makeStyles((theme) => ({
	  first_part: {
	  	backgroundImage: "linear-gradient(180deg, #2f0a38, #2f0a38, #2f0a38, #7305a7)",
	  	backgroundRepeat: "no-repeat",
	  	backgroundSize: "100% 100%",
	  },
	  first_part_border: {
	  	backgroundImage: "url('/img/seminar/top_gold_border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "10px",
	    paddingTop: 30,
	  	textAlign: "center",
	  },
	  second_part_border: {
	  	backgroundImage: "url('/img/seminar/middle_gold_border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px",
	  },
	  location_text: {
	  	color: "skyblue",
	  },
	  second_form_part: {
	  	backgroundColor: "#14021a",
	  	padding: 20,
	  },
	  third_part_border: {
	  	backgroundImage: "url('/img/seminar/bottom_green_border.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    padding: "20px",
	  },
	  register_btn: {
	  	marginTop: 20,
	  	width: "40%",
			height: 60,
	    backgroundImage: "url('/img/homepage/Read_more_button.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	    color: "white",
	  }
	}));
	const classes = useStyles();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up('md'));

	const [first, setFirst] = React.useState('');
	const [last, setLast] = React.useState('');
	const [phone, setPhone] = React.useState('');
	const [address, setAddress] = React.useState('');
	const [state, setState] = React.useState('');
	const [zip, setZip] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [wallet, setWallet] = React.useState('');

	/* 
		Processing Googlesheet 
	*/
	const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

	const appendSpreadsheet = async (row) => {
	  try {
	    await doc.useServiceAccountAuth({
	      client_email: process.env.REACT_APP_CLIENT_EMAIL,
	      private_key: process.env.REACT_APP_PRIVATE_KEY,
	    });
	    // loads document properties and worksheets
	    await doc.loadInfo();

	    const sheet = doc.sheetsByTitle["Sheet1"];
	    console.log(sheet.title);
	    const result = await sheet.addRow(row);
	    if (result) {
	    	toast.success("Successfully Registered!");
	    }
	  } catch (e) {
	    console.error('Error: ', e);
	    toast.error("Failed!");
	  }
	};

  const handleAuthClick = (e) => {
  	e.preventDefault();
    // window.gapi.auth2.getAuthInstance().signIn();
    const newRow = { 
    	First: first,
			Last: last,
			Phone: phone,
			Address: address,
			State: state,
			Zip: zip,
			Email: email,
			Wallet: wallet
    };
		appendSpreadsheet(newRow);
		window.open("https://checkout.square.site/merchant/MLFB4FNTPFXZ2/checkout/5RJT6JXSYCGXWK4DZJGPC37X?src=embed", "_blank");
  }

  // const notify = () => toast("Wow so easy!");
  const onRegister = () => {
		toast.error("Successfully Registered!");
  }


	return (
		<div className="page-load">
			<form onSubmit={handleAuthClick}>

			<ToastContainer />
			<div className="text-center">
				<img src="/img/seminar/Crypto_Seminar_Sign_Up_Text.png" alt="" height="50" width="85%" />
			</div>

			<div className={classNames(classes.first_part, "mb-3")}>
				<div className={classes.first_part_border}>
					
						{ matches ? 
							<React.Fragment>
								<h3 className="letter-spacing-10">US FINANCIAL HISTORY - CRYPTO PRESENTATION - WORKSHOP</h3>
								<div className="p-1">
									<Grid container spacing={3}>
					      		<Grid item lg={2} md={2} sm={12} xs={12}>
					      			<img src="/img/seminar/Graph_picture.png" alt="" className="img-fluid" />
					      		</Grid>
					      		<Grid item lg={8} md={8} sm={12} xs={12}>
					      			<div>
					      				<img src="/img/seminar/Sat_Oct_23rd_Text.png" alt="" className="img-fluid" />	
					      			</div>
					      			<div>
					      				<h4 className="letter-spacing-2">Doubletree Suites BY HILTON HOTEL 12200 TAMIAMI TRAIL N.NAPLES.FL 34110</h4>
					      			</div>
					      		</Grid>
					      		<Grid item lg={2} md={2} sm={12} xs={12}>
					      			<div>
					      				<a href="https://www.google.com/maps/dir/26.9143582,-82.0516094/doubletree+inn+naples+fl/@26.609903,-82.1774455,10z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x88db19357204c273:0x360ca05331a5d77!2m2!1d-81.800674!2d26.2818798" target="_blank">
					      					<img src="/img/seminar/location_picture.png" alt="" className="img-fluid" />
					      				</a>
					      			</div>
					      			<div>
					      				<a href="https://www.google.com/maps/dir/26.9143582,-82.0516094/doubletree+inn+naples+fl/@26.609903,-82.1774455,10z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x88db19357204c273:0x360ca05331a5d77!2m2!1d-81.800674!2d26.2818798" target="_blank">
					      					<p className={classes.location_text}>[CLICK HERE FOR DIRECTIONS]</p>
					      				</a>
					      			</div>
					      		</Grid>
					      	</Grid>
					      </div>
							</React.Fragment>
			      	:
			      	<React.Fragment>
			      		<div>
		      				<img src="/img/seminar/Sat_Oct_23rd_Text.png" alt="" width="100%" height="40px" />	
		      			</div>
		      			<div>
		      				<h4 className="letter-spacing-2">Doubletree Suites BY HILTON HOTEL 12200 TAMIAMI TRAIL N.NAPLES.FL 34110</h4>
		      			</div>
								<div className="p-1">
									<Grid container spacing={3}>
					      		<Grid item lg={12} md={12} sm={12} xs={12}>
					      			<h3 className="letter-spacing-10">US FINANCIAL HISTORY - CRYPTO PRESENTATION - WORKSHOP</h3>
					      		</Grid>
					      		<Grid item lg={12} md={12} sm={12} xs={12}>
					      			<div>
					      				<a href="https://www.google.com/maps/dir/26.9143582,-82.0516094/doubletree+inn+naples+fl/@26.609903,-82.1774455,10z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x88db19357204c273:0x360ca05331a5d77!2m2!1d-81.800674!2d26.2818798" target="_blank">
					      					<img src="/img/seminar/location_picture.png" alt="" className="img-fluid" />
					      				</a>
					      			</div>
					      			<div>
					      				<a href="https://www.google.com/maps/dir/26.9143582,-82.0516094/doubletree+inn+naples+fl/@26.609903,-82.1774455,10z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x88db19357204c273:0x360ca05331a5d77!2m2!1d-81.800674!2d26.2818798" target="_blank">
					      					<p className={classes.location_text}>[CLICK HERE FOR DIRECTIONS]</p>
					      				</a>
					      			</div>
					      		</Grid>
					      	</Grid>
					      </div>
							</React.Fragment>
						}
							
				</div>
			</div>

			<div className={classNames(classes.first_part, "mb-3")}>
				<div className={classNames(classes.second_part_border, "pb-3", "pt-4")}>
					<div>
						<img src="/img/seminar/Registration_Text.png" alt="" className="img-fluid" />
					</div>
					<div>
						<h5 className="letter-spacing-2 text-center">PLEASE FILL OUT THE FORM BELOW TO SECURE YOUR SPOT IN THE SEMINAR AND PARTICIPATE IN THE FREE AIRDROP</h5>
					</div>
					{/* ======= START of Form ======*/}

					<div className={classes.second_form_part}>
						

							<div>
								<Grid container spacing={3} className="seminar-form-part">
									<Grid item lg={4} md={12} sm={12} xs={12} >

										<Grid container spacing={3}>
											<Grid item lg={6} md={12} sm={12} xs={12} >
												<label><img src="/img/seminar/first_text.png" alt="" /></label>
											</Grid>
											<Grid item lg={6} md={12} sm={12} xs={12} >
												<input type="text" className="w-100" onChange={e => setFirst(e.target.value)} value={first} required />
											</Grid>
										</Grid>

										<Grid container spacing={3}>
											<Grid item lg={6} md={12} sm={12} xs={12} >
												<label><img src="/img/seminar/last_text.png" alt="" /></label>
											</Grid>
											<Grid item lg={6} md={12} sm={12} xs={12} >
												<input type="text" className="w-100" onChange={e => setLast(e.target.value)} value={last} required />
											</Grid>
										</Grid>

										<Grid container spacing={3}>
											<Grid item lg={6} md={12} sm={12} xs={12} >
												<label><img src="/img/seminar/phone_text.png" alt="" /></label>
											</Grid>
											<Grid item lg={6} md={12} sm={12} xs={12} >
												<input type="text" className="w-100" onChange={e => setPhone(e.target.value)} value={phone} required  />
											</Grid>
										</Grid>

									</Grid>

									<Grid item lg={8} md={12} sm={12} xs={12} >

										<Grid container spacing={3}>
											<Grid item lg={3} md={12} sm={12} xs={12} >
												<label><img src="/img/seminar/address_text.png" alt="" /></label>
											</Grid>
											<Grid item lg={9} md={12} sm={12} xs={12} >
												<input type="text" className="w-100" onChange={e => setAddress(e.target.value)} value={address} required  />
											</Grid>
										</Grid>

										<div className="p-0">
											<Grid container className="seminar-form-part p-0">
												<Grid item lg={1} md={12} sm={12} xs={12} >
												</Grid>
												<Grid item lg={5} md={12} sm={12} xs={12} >
													<Grid container spacing={3}>
														<Grid item lg={6} md={12} sm={12} xs={12} >
															<label><img src="/img/seminar/state_text.png" alt="" /></label>
														</Grid>
														<Grid item lg={6} md={12} sm={12} xs={12} >
															<input type="text" className="w-100" onChange={e => setState(e.target.value)} value={state} required  />
														</Grid>
													</Grid>
												</Grid>
												<Grid item lg={5} md={12} sm={12} xs={12} >
													<Grid container spacing={3}>
														<Grid item lg={6} md={12} sm={12} xs={12} >
															<label><img src="/img/seminar/zip_text.png" alt="" /></label>
														</Grid>
														<Grid item lg={6} md={12} sm={12} xs={12} >
															<input type="text" className="w-100" onChange={e => setZip(e.target.value)} value={zip} required  />
														</Grid>
													</Grid>
												</Grid>
												<Grid item lg={1} md={12} sm={12} xs={12} ></Grid>
											</Grid>
										</div>
										<div>
											<Grid container spacing={3}>
												<Grid item lg={3} md={12} sm={12} xs={12} >
													<label><img src="/img/seminar/email_text.png" alt="" /></label>
												</Grid>
												<Grid item lg={9} md={12} sm={12} xs={12} >
													<input type="text" className="w-100" onChange={e => setEmail(e.target.value)} value={email} required  />
												</Grid>
											</Grid>
										</div>
									</Grid>
								</Grid>

								<Grid container spacing={3} className="seminar-form-part">
									<Grid item lg={3} md={12} sm={12} xs={12} >
										<label><img src="/img/seminar/erc20_text.png" alt="" className="img-fluid"/></label>
									</Grid>
									<Grid item lg={9} md={12} sm={12} xs={12} >
										<input type="text" className="w-100" onChange={e => setWallet(e.target.value)} value={wallet} required  />
									</Grid>
								</Grid>

								{/*<Grid container spacing={3} className="seminar-form-part">
									<Grid item lg={12} md={12} sm={12} xs={12} >
										<div>
											<Button type="submit" className={classes.register_btn}>Register</Button>
										</div>
									</Grid>
								</Grid>*/}

							</div>

					</div>

					{/* ===== END of Form =======*/}
					<div className="mt-2 mb-4 d-flex justify-content-center">
						<div className="w-75">
							<Grid container spacing={2}>
								<Grid item lg={6} md={3} sm={12} xs={12} className="d-flex align-items-center justify-content-center">
									<h4 className="letter-spacing-5 m-0 text-center">
										DONT HAVE AN ERC20 WALLET YET? WE RECOMMEND:
									</h4>
								</Grid>
								<Grid item lg={2} md={3} sm={12} xs={12} className="d-flex align-items-center justify-content-center">
									<img src="/img/seminar/metamask_logo_horizontal.svg" alt="" className="img-fluid" />
								</Grid>
								<Grid item lg={2} md={3} sm={12} xs={12} className="d-flex align-items-center justify-content-center">
									<a href="https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202" target="_blank">
										<img src="/img/seminar/apple_app_store_icon.png" alt="" className="img-fluid" />
									</a>
								</Grid>
								<Grid item lg={2} md={3} sm={12} xs={12} className="d-flex align-items-center justify-content-center">
									<a href="https://play.google.com/store/apps/details?id=io.metamask&hl=en_US&gl=US" target="_blank">
										<img src="/img/seminar/google_play_icon.png" alt="" className="img-fluid" />
									</a>
								</Grid>
							</Grid>
						</div>
						{/*<h5 className="letter-spacing-5">
							DONT HAVE AN ERC20 WALLET YET? WE RECOMMEND: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<img src="/img/seminar/trust_wallet_icon.png" alt="" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<img src="/img/seminar/apple_app_store_icon.png" alt="" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<img src="/img/seminar/google_play_icon.png" alt="" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						</h5>*/}
					</div>
				</div>
			</div>

			<div className={classNames(classes.first_part)}>
				<div className={classNames(classes.third_part_border)}>
					<div>
						<Grid container>
							<Grid item lg={10} md={10} sm={12} xs={12}>
								<div>
									<img src="/img/seminar/Seminar_entry_fee_text.png" alt="" className="img-fluid" />
								</div>
								<div>
									<p className="letter-spacing-5 text-center">
										Our organization is completely International and Decentralized. All arbitration, exchanging, and interest accrual are made through computer code in smart contracts on the Ethereum Blockchain. The Developers of this company do not in any way take responsibility for profits made by token holders. All reasonable expectations of reward are guaranteed by the participating Automated Market Makers and the Decentralized Exchange Uniswap. This Seminar is for educational purposes only and does not constitute as financial advice. After the presentation, there will be a Workshop where we will provide a free AirDrop of Tokens directly into the ERC20 wallets’ of registered participants who have paid the fee.
									</p>
								</div>
							</Grid>
							<Grid item lg={2} md={2} sm={12} xs={12} className="d-flex align-items-center justify-content-center">
								<div>
									<div>
										<img src="/img/seminar/$150_text.png" alt="" className="img-fluid" />
									</div>
									<div>
										<img src="/img/seminar/ticket_price_text.png" alt="" className="img-fluid" />
									</div>
									<div>
										{/*<a target="_blank" href="https://checkout.square.site/merchant/MLFB4FNTPFXZ2/checkout/5RJT6JXSYCGXWK4DZJGPC37X?src=embed">*/}
											<Button type="submit">
												<img src="/img/seminar/process_button.png" alt="" className="img-fluid" />
											</Button>
										{/*</a>*/}
									</div>
								</div>
							</Grid>
						</Grid>
					</div>
				</div>
			</div>

			</form>
		</div>
	)
}

export default Seminar;