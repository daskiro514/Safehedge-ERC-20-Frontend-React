import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import {setAddress} from '../../actions/connectWallet';


const Connectbtn = (props) => {
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
    	let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
	   	localStorage.setItem('walletAdr', accounts[0]);
	   	dispatch(setAddress(accounts[0]));
	  } else {
	  	window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
	  } 
  }

  const disconnect = async e => {
  	if (window.ethereum) {
  		if (window.confirm("Are you going to disconnect wallet?")) {
  			localStorage.removeItem('walletAdr');
		   	dispatch(setAddress(null));
  		}
	  } else {
	  	window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
	  } 
  }


	return (
		<React.Fragment>
			{ wallet.address === null ?
				(<Button className={props.className} onClick={connectWallet}>
					<img src={props.imagePath} alt="connect" className="img-fluid" />
				</Button>)
				:
				(<div className="d-flex justify-content-center">
					<div className={classes.overflow_ellipsis} onClick={disconnect}>{wallet.address}</div>
				</div>)
			}
			
		</React.Fragment>
	);
}

export default Connectbtn;