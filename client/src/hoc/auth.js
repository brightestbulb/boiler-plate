import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null){
    // option 
    // - null : 아무나 출입이 가능한 페이지
    // - true : 로그인 한 유저만 출입이 가능
    // - false : 로그인한 유저는 출입 불가능한 페이지 ( 로그인, 회원가입 페이지)
    // adminRoute
    // - true : admin user만 들어가기 원하는 페이지


    const dispatch = useDispatch();

    function AuthenticationCheck(props){
        useEffect(() => {

            dispatch(auth()).then(response => {  // 페이지 이동시 dispatch 작동
                console.log(response)

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                }else{  // 로그인 상태
                    if(adminRoute && !response.payload.isAdmin){  // 사용자가 admin이 아닌데 admin 페이지에 들어가려고 하는 경우
                        props.history.push('/')
                    }else{
                        if(option === false){  // 로그인 한 사람이 출입 불가능한 페이지라면
                            props.history.push('/')
                        }
                    }
                }

            })
        
        }, [])

        return (
            <SpecificComponent />
        )
    }


    return AuthenticationCheck
}