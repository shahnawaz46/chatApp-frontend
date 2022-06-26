export const initialstate = {
    loginUser: {},
    socket: null,
    allMessages: {}
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

        case "MESSAGES":
            const M_key = action.payload.key
            const M_message = action.payload.msg

            if (M_key in state.allMessages)
                return { ...state, allMessages: { ...state.allMessages, [M_key]: [...state.allMessages[M_key], M_message] } }

            else
                return { ...state, allMessages: { ...state.allMessages, [M_key]: [M_message] } }


        case "FETCH_MESSAGE":
            return {
                ...state,
                allMessages: action.payload.messagesObj
            }


        case "USER_LOGOUT":
            return {
                ...state,
                loginUser: {},
                allMessages: {}
            }

        default:
            return state
    }
}