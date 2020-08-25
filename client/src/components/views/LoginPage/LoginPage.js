import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';  // props.history.push 를 사용하기 위함

function LoginPage(props){

    const dispatch = useDispatch();
    const [Email, setEmail] = useState("")  // useState() 매개변수는 초기값
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);  // setEmail로 현재 상태를 바꿔준다.
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();  // 페이지 refresh 방지
        
        let data = {
            email : Email,
            password : Password
        }

        dispatch(loginUser(data))
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('/')  // 루트 페이지로 이동
                }else{
                    alert('Error')
                }
            })
    }

    return(
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <form style={{display:'flex', flexDirection:'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br/>
                <button type="submit">
                    Login
                </button>           
            </form>
        </div>
    )
}

export default withRouter(LoginPage)