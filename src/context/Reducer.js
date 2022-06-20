export const initialstate = {
    loginUser: {},
    socket: null
}

export const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {

        case "SOCKET_CONNECTION":
            return {
                ...state,
                socket: action.payload
            }

        case "UPDATE_USER":
            return {
                ...state,
                loginUser: action.payload
            }

        default:
            return state
    }
}