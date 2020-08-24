import Axios from 'axios';
import { LOGIN_USER, REGISTER_USER } from './types';


export function loginUser(dataToSubmit){

    // 1. LoginPage.js에서 dispatch
    // 2. action
    const request = Axios.post('/api/users/login', dataToSubmit)  // 서버에 login 요청
         .then(response => response.data)

    return {  // 3. request를 reducer(user_reducer.js)에 전달. type & response(payload)을 넣어줘야 한다.
        type : LOGIN_USER,  // combineReducers로 가서 type에 따라서 reducer로 전달. 
        payload : request   
    }
}

export function registerUser(dataToSubmit){

    const request = Axios.post('/api/users/register', dataToSubmit)
         .then(response => response.data)

    return {
        type : REGISTER_USER,
        payload : request   
    }
}