import React, { useState } from 'react';
import './LoginSignup.css'; // optional styling
import { useNavigate } from 'react-router-dom';
import loginService from '../services/login'
import taskService from '../services/tasks'

function LoginSignup({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isLogin){
      try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedTaskappUser', JSON.stringify(user)
      )
      taskService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log("couldn't login, wrong credentials")
    }
      navigate("/");
    } else{
      await loginService.signUp({
        username, password,
      })
      setUsername('')
      setPassword('')
      setIsLogin(true);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="username"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>

      <p>
        {isLogin ? "New here?" : "Already have an account?"}
        <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? " Create an account" : " Login"}
        </span>
      </p>
    </div>
  );
}

export default LoginSignup;