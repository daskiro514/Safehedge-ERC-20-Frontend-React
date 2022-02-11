
export const setAddress = (data) => dispatch => {
	dispatch({
		type: "SET_ADDRESS",
		payload: data
	});
};
