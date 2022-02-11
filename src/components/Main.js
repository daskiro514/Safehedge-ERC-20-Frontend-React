import React,  { Suspense, lazy } from 'react';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

// Connect the client side app to the blockchain
import Web3 from 'web3';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';


import Dashboard from './pages/Dashboard';
import Footer from './Footer';

import eventBus from './eventBus';
import PreloadImage from 'react-preload-image';

import Connectbtn from './commons/Connectbtn';
import Addtokenbtn from './commons/Addtokenbtn';

import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
  Price 
} from "@uniswap/sdk";

import UniswapPair from '../abis/UniswapPair.json'


// const ICOpage = lazy(() => import('./pages/ICOpage'));
const Details = lazy(() => import('./pages/Details'));
const Pool = lazy(() => import('./pages/Pool'));
const Homepage = lazy(() => import('./pages/Homepage'));
const Seminar = lazy(() => import('./pages/Seminar'));
const Swap = lazy(() => import('./pages/Swap'));
const Airdrop = lazy(() => import('./pages/Airdrop'));


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    minHeight: "100vh",
    // minWidth: 410,
    backgroundImage: "url('/img/background.jpg')",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
    // backgroundPosition: "center",
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "#480860",
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    padding: 5
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    // backgroundColor: "rgba(0, 0, 0, 0.3)",
    // backgroundImage: "linear-gradient(to right, black, rgb(30, 30, 30))",

    boxShadow: "0 0 10px 10px rgba(30, 30, 30, 0.3)",
    color: "white",
    border: 0,
    backgroundImage: "url(/img/bg_drawer.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  },
  content: {
    flexGrow: 1,
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 100,
    },
    paddingBottom: 50,
    minHeight: "100vh",
  },
  content_1: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuIcon: {
    width: 45,
  },
}));


const SH = new Token(
  ChainId.MAINNET,
  "0x0f8bF37e79930C100f3d93AC0Ee87f0d3e7a7FB0",
  18
);

const USDT = new Token(
  ChainId.MAINNET,
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  18
);


function Main(props) {
  const { windows } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [usdPrice, setUsdPrice] = React.useState(0);
  const [ethPrice, setEthPrice] = React.useState(0);

  React.useEffect(() => {
    loadWeb3();
    calculatePrice();
    setInterval(() => {
      calculatePrice();
    }, 600000);
  }, []);

  

  const loadWeb3 = async () => {
   if (window.ethereum) {
     window.web3 = new Web3(window.ethereum);
     // await window.ethereum.enable();
     // window.web3.eth.defaultAccount = window.ethereum.selectedAddress;
     console.log("[window.ethereum.selectedAddress]=>", window.ethereum.selectedAddress)
     if (window.ethereum.selectedAddress === null) {
      // localStorage.removeItem("walletAdr");
     }
     window.ethereum.on('connect', (connectInfo: ConnectInfo) => {
      console.log(connectInfo)
     });

     window.ethereum.on('disconnect', (error: ProviderRpcError) => {
      console.log(error)
     });

     window.ethereum.on('accountsChanged', (accounts) => {
      console.log(accounts);
      if (accounts.length === 0) {
        localStorage.removeItem("walletAdr");
        window.location.reload();
      }
     });
     console.log("1. ethereum");
   } else if (window.web3) {
     window.web3 = new Web3(window.web3.currentProvider);
     console.log("2. web3");
   } else {
     console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
   }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const calculatePrice = async () => {
    const web3 = new Web3("https://mainnet.infura.io/v3/7ab7e02667a844bb876a7326a5f68d7c");
    const SH_WETH = new web3.eth.Contract(UniswapPair, "0xcC888f701a6F7A9100dd71064aFf002f7Ef898aE");
    const WETH_USDT = new web3.eth.Contract(UniswapPair, "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852");
    // console.log("[SH_WETH]", await SH_WETH.methods.getReserves().call());
    // console.log("[WETH_USDT]", await WETH_USDT.methods.getReserves().call());
    const SH_WETH_reserve = await SH_WETH.methods.getReserves().call();
    const WETH_USDT_reserve = await WETH_USDT.methods.getReserves().call();

    const SH_price = new Price(
      SH,
      WETH[SH.chainId],
      SH_WETH_reserve._reserve0,
      SH_WETH_reserve._reserve1
    );

    const WETH_price = new Price(
      WETH[SH.chainId],
      USDT,
      WETH_USDT_reserve._reserve0,
      WETH_USDT_reserve._reserve1
    );

    // console.log("[SH_WETH_price]=>", SH_price.toSignificant(10));
    // console.log("[WETH_price]=>", WETH_price.toSignificant(18) * 10**12);
    console.log("[SH_USD_price]=>", SH_price.toSignificant(10) * WETH_price.toSignificant(18) * 10**12);

    setUsdPrice(SH_price.toSignificant(10) * WETH_price.toSignificant(18) * 10**12);
    setEthPrice(SH_price.toSignificant(10));
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (e) => {
    var audio = new Audio("/img/menu_items/MenuButtonClick.wav");
    audio.play();
    // eventBus.dispatch("couponApply");
  }

  const connectWallet = async e => {
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('[wallet adr]:', accounts[0]);
  }

  const drawer = (
    <div className="mr-3">
      <audio autoPlay className="d-none">
        <source src="/img/menu_items/FirstLoad.wav" />
        Your browser does not support the audio tag.
      </audio>

      {/*<div className={classes.toolbar} />*/}
      <div className="text-center mt-1">
        <Link to="/" onClick={handleListItemClick}>
          {/*<video width="100%" height="100" autoPlay loop>
            <source src="/img/t_coin.webm" type="video/mp4" />
            <source src="/img/t_coin.webm" type="video/ogg" />
            Your browser does not support the video tag.
          </video>*/}
          {/*<img src="/img/t_coin.gif" alt="" width="100%" height="100" />*/}
          <img src="/img/SH_Website_Crypto_Coin.png" alt="logo" className="logo-animation img-fluid" />
          <img src="/img/SafeHedge_Text.png" alt="logo" className="img-fluid" />
          {/*<img src="/img/Green_Dollar_Text.png" alt="green" className="img-fluid" width="50%" />*/}
        </Link>
        <h4 className="usdPrice">$ {usdPrice.toFixed(5)}</h4>
        {/*<h4 className="ethPrice">{ethPrice} ETH</h4>*/}
      </div>
      <Divider />
      <List>
        <a href="https://buy.moonpay.com/" target="_blank">
          <ListItem 
            onClick={handleListItemClick}
            button className="listItem">
            <ListItemIcon className="text-center"><img src="/img/menu_items/ETH_logo.png" alt="buy" width="80%" /></ListItemIcon>
            <ListItemText><img src="/img/menu_items/ETH_text.png" alt="" width="80%" height="32px"/></ListItemText>
          </ListItem>
        </a>
        {/*<a href="https://app.uniswap.org/#/swap?inputCurrency=0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0" target="_blank">
          <ListItem 
            onClick={handleListItemClick}
            button className="listItem">
            <ListItemIcon className="text-center"><img src="/img/menu_items/SWAP_logo.png" alt="SWAP" width="80%" /></ListItemIcon>
            <ListItemText><img src="/img/menu_items/SWAP_text.png" alt="" width="80%" height="32px" /></ListItemText>
          </ListItem>
        </a>

        <a href="https://app.uniswap.org/#/add/v2/0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0/ETH" target="_blank">
          <ListItem 
            onClick={handleListItemClick}
            button className="listItem">
            <ListItemIcon className="text-center"><img src="/img/menu_items/STAKE_logo.png" alt="SWAP" width="80%" /></ListItemIcon>
            <ListItemText><img src="/img/menu_items/STAKE_text.png" alt="" width="80%" height="32px" /></ListItemText>
          </ListItem>
        </a>*/}

        {/*<a href={"http://localhost:8081/" + text.toLowerCase()}>*/}
        {['SWAP', 'STAKE', 'AIRDROP'].map((text, index) => (
          <Link to={"/" + text.toLowerCase()} key={index}>
            <ListItem 
              onClick={handleListItemClick}
              button key={text} className={("/" + text) === props.history.location.pathname.toUpperCase() ? "listItem active" : "listItem"}>
              <ListItemIcon className="text-center"><img src={"/img/menu_items/" + text + "_logo.png"} alt={text} width="80%" /></ListItemIcon>
              {/*<ListItemText primary={text} className="listItemFont" />*/}
              <ListItemText><img src={"/img/menu_items/" + text + "_text.png"} alt="" width="80%" height="32px" /></ListItemText>
            </ListItem>
          </Link>
        ))}

        <a href="https://youtu.be/z5zt7X41pvo" target="_blank">
          <ListItem 
            onClick={handleListItemClick}
            button className="listItem">
            <ListItemIcon className="text-center"><img src="/img/menu_items/SEMINAR_logo.png" alt="SWAP" width="80%" /></ListItemIcon>
            <ListItemText><img src="/img/menu_items/SEMINAR_text.png" alt="" width="80%" height="32px" /></ListItemText>
          </ListItem>
        </a>
        <a href="https://rarible.com/safehedgecrypto" target="_blank">
          <ListItem 
            onClick={handleListItemClick}
            button className="listItem">
            <ListItemIcon className="text-center"><img src="/img/menu_items/NFT_logo.png" alt="SWAP" width="80%" /></ListItemIcon>
            <ListItemText><img src="/img/menu_items/NFT_text.png" alt="" width="80%" height="32px" /></ListItemText>
          </ListItem>
        </a>
        <a href="https://safe-hedge-crypto.creator-spring.com" target="_blank">
          <ListItem 
            onClick={handleListItemClick}
            button className="listItem">
            <ListItemIcon className="text-center"><img src="/img/menu_items/MERCH_logo.png" alt="SWAP" width="80%" /></ListItemIcon>
            <ListItemText><img src="/img/menu_items/MERCH_text.png" alt="" width="80%" height="32px" /></ListItemText>
          </ListItem>
        </a>

        <Link to="/info">
          <ListItem 
            onClick={handleListItemClick}
            button key="info" className={"/INFO" === props.history.location.pathname.toUpperCase() ? "listItem active" : "listItem"}>
            <ListItemIcon className="text-center"><img src={"/img/menu_items/INFO_logo.png"} alt="info" width="80%" /></ListItemIcon>
            {/*<ListItemText primary={text} className="listItemFont" />*/}
            <ListItemText><img src={"/img/menu_items/INFO_text.png"} alt="" width="80%" height="32px" /></ListItemText>
          </ListItem>
        </Link>
        {/*</Link>*/}
      </List>
      <Divider />
      <List>
        <div className="ml-2 mt-2 text-center">
          <Connectbtn className="connect-wallet-btn" imagePath="/img/Small_Connect_Wallet_Text_Menu.png" />
          <Addtokenbtn className="connect-wallet-btn" imagePath="/img/Small_Connect_Wallet_Text_Menu.png" />
        </div>
      </List>
      <Divider />
      <List>
        <div className="text-center mt-2">
          <img src="/img/smart_hedging_ecosystem_text.png" alt="logo" className="img-fluid" width="70%" />
        </div>
      </List>
      <List className="mt-2">
        <div className="text-center w-100 letter-spacing-2 copyright">
          <span>COPYRIGHT SAFEHEDGE &copy; 2021</span>
        </div>
      </List>
    </div>
  );

  const container = windows !== undefined ? () => windows().document.body : undefined;
  const matches = useMediaQuery('(min-width:1280px)');

  return (
        <div>
          
          <div className={classes.root}>
            <div className="mask">
              <CssBaseline />
              <Hidden smUp implementation="css">
                <AppBar position="fixed" className={classes.appBar}>
                  <Toolbar className="pr-0">
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      className={classes.menuButton}
                    >
                      {/*<MenuIcon />*/}
                      <img src="/img/menuBAR.png" alt="" className={classes.menuIcon} />
                    </IconButton>
                    <Typography variant="h6" noWrap className="font-1">
                      <img src="/img/SH_Website_Crypto_Coin.png" alt="logo" className="topbar-logo-size mr-1" />
                      <img src="/img/mobilemenutitle.png" alt="logo" width="80%" height="50px" />
                    </Typography>
                  </Toolbar>
                </AppBar>
              </Hidden>
              <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                  <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                  >
                    {drawer}
                  </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Drawer
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                  >
                    {drawer}
                  </Drawer>
                </Hidden>
              </nav>
              <main className={classes.content}>
                <div className={classes.content_1}>
                  <Hidden smUp implementation="css">
                    <div className={classes.toolbar} />
                  </Hidden>
                  <div>
                    <div>
                      {/*{
                        props.location.pathname !== '/seminar' && props.location.pathname !== '/info' && props.location.pathname !== '/dandash' && props.location.pathname !== '/' && props.location.pathname !== '/stake'  && (
                            <img src="/img/SafeHedge_Mascot.png" alt="SafeHedge_Mascot.png" className="safehedge-mascot" />
                          )
                      }*/}
                    </div>
                      
                    
                    <div>

                     <Suspense fallback={<div>Loading...</div>}>
                      <Switch>
                        <Route path="/buy">
                          <h2>BUY</h2>
                        </Route>
                        <Route path="/trade">
                          <h2>Trade</h2>
                        </Route>
                        <Route exact path="/" component={Homepage} />
                        <Route path="/stake" component={Pool} />
                        {/*<Route path="/alpha" component={ICOpage} />*/}
                        <Route path="/seminar" component={Seminar} />
                        <Route path="/airdrop" component={Airdrop} />
                        <Route path="/swap" component={Swap} />
                        <Route path="/info" component={Details} />
                        <Route path="/dandash" component={Dashboard} />
                      </Switch>
                     </Suspense>

                    </div>
                  </div>
                </div>

                {matches ? <Footer /> : <Footer className="footer-mobile"/>}
                
              </main>
                
            </div>
          </div>
        </div>
  );
}

Main.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  windows: PropTypes.func,
};

export default Main;
