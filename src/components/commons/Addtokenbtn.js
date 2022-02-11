import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import {setAddress} from '../../actions/connectWallet';


const Addtokenbtn = (props) => {
	const dispatch = useDispatch();
	const wallet = useSelector(state => state.connectWallet);

	const useStyles = makeStyles((theme) => ({
	  root: {
	    textAlign: "center",
	  },
	  connect_btn: {
	  	marginTop: 20,
	  	width: "40%",
			height: 60,
	    backgroundImage: "url('/img/homepage/Read_more_button.png')",
	    backgroundRepeat: "no-repeat",
	    backgroundSize: "100% 100%",
	  },
	  overflow_ellipsis: {
  	  width: "inherit",
		  overflow: "hidden",
		  textOverflow: "ellipsis", 
		  fontSize: 25,
		  marginTop: 30,
		  color: "white",
		  width: 180
		 },
	}));
	const classes = useStyles();

	const connectWallet = async e => {
    // console.log('[wallet adr]:', localStorage.getItem('walletAdr'));
    if (window.ethereum) {
    	const tokenAddress = '0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0';
			const tokenSymbol = 'SAFEHEDGE';
			const tokenDecimals = 18;
			const tokenImage = 'https://i.ibb.co/PtH2wMm/SH-Website-Crypto-Coin.png';

			try {
			  // wasAdded is a boolean. Like any RPC method, an error may be thrown.
			  const wasAdded = await window.ethereum.request({
			    method: 'wallet_watchAsset',
			    params: {
			      type: 'ERC20', // Initially only supports ERC20, but eventually more!
			      options: {
			        address: tokenAddress, // The address that the token is at.
			        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
			        decimals: tokenDecimals, // The number of decimals in the token
			        image: tokenImage, // A string url of the token logo
			      },
			    },
			  });

			  if (wasAdded) {
			    console.log('Thanks for your interest!');
			  } else {
			    console.log('Your loss!');
			  }
			} catch (error) {
			  console.log(error);
			}
	  } else {
	  	window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
	  } 
  }

	return (
		<React.Fragment>
			<Button className="add-token-btn" onClick={connectWallet}>Add TOKEN</Button>
		</React.Fragment>
	);
}

export default Addtokenbtn;