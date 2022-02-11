const initialState = {
	address: localStorage.getItem("walletAdr"),
};

function connectWalletReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case "SET_ADDRESS":
      return {...state, address: payload};
    default:
      return state;
  }
}

export default connectWalletReducer;
