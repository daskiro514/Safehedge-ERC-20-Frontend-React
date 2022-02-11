import React from 'react';
import './App.css';
import './css/Pool_page.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import Main from './Main';

import LoadingOverlay from 'react-loading-overlay';
import eventBus from './eventBus';


function App(props) {
	const [active, setActive] = React.useState(true);

	

	React.useEffect(() => {
		setTimeout(() => {
			setActive(false);
		}, 500);
	}, []);

	// eventBus.on("couponApply", (data) =>{
	// 		// setActive(true);
 	//   //  	setTimeout(() => {
	// 		// 	setActive(false);
	// 		// }, 5000);
 	//  });
	// spinner={<img src="/img/SH_Website_Crypto_Coin.png" alt="logo" className="logo-animation img-fluid" />}
	// spinner={
	//       		<video width="100%" height="100" autoPlay loop>
	//             <source src="/img/t_coin.webm" type="video/mp4" />
	//             <source src="/img/t_coin.webm" type="video/ogg" />
	//             Your browser does not support the video tag.
	//           </video>

  return (
	  <Provider store={store}>
	  	<LoadingOverlay
	      	active={active}
	      	spinner={<img src="/img/SH_Website_Crypto_Coin.png" alt="logo" className="logo-animation img-fluid" />}
		    >
		    <video autoPlay muted loop id="myVideo">
				  <source src="/img/BackgroundCompressed.mp4" type="video/mp4" />
				</video>
		    {/*<audio autoPlay className="d-none">
				  <source src="/img/menu_items/FirstLoad.wav" />
				  Your browser does not support the audio tag.
				</audio>*/}
		  	<Router>
			  	<Route path="/" component={Main} />
				</Router>
			</LoadingOverlay>
	  </Provider>	
  );
}

export default App;
