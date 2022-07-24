import { type } from "@testing-library/user-event/dist/type";

const initState = {
    // user: {
    //     username: 'quocdat',
    //     fullName: 'Ngo Luu Quoc Dat',
    //     phone: '0905553859',
    //     email: 'ngoluuquocdat@gmail.com',
    //     avatarUrl: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    // },
    user: null,
    bookingInfo: null,
    //baseUrl: "https://localhost:7079",
    baseUrl: "https://happy-vacation.somee.com",
    fcm_token: ''
}

const rootReducer = (state = initState, action) => {
    let user = state.user;
    let fcm_token = state.fcm_token;

    let customerInfo = state.customerInfo;
    let adultsList = state.adultsList;
    let childrenList = state.childrenList;

    switch(action.type) {
        case 'SAVE_USER':
            console.log('redux save user action')
            user = action.payload;
            return {
                ...state, user
            }
        case 'SAVE_FCM_TOKEN':
            console.log('redux save fcm token')
            fcm_token = action.payload;
            return {
                ...state, fcm_token
            }
        case 'SAVE_CUSTOMER':
            customerInfo = action.payload;
            return {
                ...state, customerInfo
            }
        case 'SAVE_ADULTS':
            adultsList = action.payload;
            return {
                ...state, adultsList
            }
        case 'SAVE_CHILDREN':
            childrenList = action.payload;
            return {
                ...state, childrenList
            }
        default:
            return state;
    } 
}

export default rootReducer;