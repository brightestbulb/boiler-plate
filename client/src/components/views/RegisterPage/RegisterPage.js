import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {

    const dispatch = useDispatch();
    const [Email, setEmail] = useState("")  // useState() 매개변수는 초기값
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("") 

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();  // 페이지 refresh 방지

        if(Password !== ConfirmPassword){
            return alert('비밀번호는 서로 같아야 합니다.');
        }
        
        let data = {
            email : Email,
            password : Password,
            name : Name
        }

        dispatch(registerUser(data))
            .then(response => {
                if(response.payload.success){
                    props.history.push("/login")
                }else{
                    alert("Failed to sign up");
                }
            })
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <form style={{display:'flex', flexDirection:'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" onChange={onEmailHandler} />

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                
                <label>Password check</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <br/>
                <button type="submit">
                    회원 가입
                </button>           
            </form>
        </div>
    )
}

export default RegisterPage
