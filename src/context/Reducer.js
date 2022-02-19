export const initialState = {
    socket: null,
    loginUser: {},
    selectedUser: {},
    allUsers: [],
    allMessages: {}
}

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SOCKET_CONNECTION':
            return {
                ...state,
                socket: action.payload
            }

        case 'LOGIN_USER':
            return {
                ...state,
                loginUser: action.payload
            }

        case 'USER_LOGOUT':
            return {
                ...state,
                loginUser: {},
                selectedUser: {}
            }

        case 'OPEN_CHAT':
            return {
                ...state,
                selectedUser: action.payload
            }

        case 'CLOSE_CHAT':
            return {
                ...state,
                selectedUser: {}
            }

        case 'ALL_USERS':
            return {
                ...state,
                allUsers: action.payload
            }

        case "PUSH_MESSAGE":
            let messages = { ...state.allMessages }
            messages[action.payload.key] = [...messages[action.payload.key], action.payload.data]
            return {
                ...state,
                allMessages: messages
            }

        case "ADD_MESSAGE":
            const add_messages = { ...state.allMessages }
            add_messages[action.payload.key] = [{ ...action.payload.data }]
            // state.allMessages[action.payload.key] = [action.payload.data]
            return {
                ...state,
                allMessages: add_messages
            }

        default:
            return state
    }
}

export default Reducer