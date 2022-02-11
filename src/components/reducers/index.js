import { combineReducers } from 'redux';
import alert from './alert';
import connectWallet from './connectWallet';

export default combineReducers({
	alert,
	connectWallet
});
