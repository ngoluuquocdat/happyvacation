import { type } from "@testing-library/user-event/dist/type";

const initState = {
    user: {
        username: 'quocdat',
        fullname: 'Ngo Luu Quoc Dat',
        phone: '0905553859',
        email: 'ngoluuquocdat@gmail.com',
        avatarPath: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    }
}

const rootReducer = (state = initState, action) => {
    let user = state.user;
    switch(action.type) {
        case 'SAVE_USER':
            console.log('redux save user action')
            user = action.payload;
            return {
                ...state, user
            }
        default:
            return state;
    }
    
}

export default rootReducer;