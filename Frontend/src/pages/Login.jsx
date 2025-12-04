import React, {useState} from 'react';
import axios from 'axios';
export default function Login({onLogin}) {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch(err){
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };
  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button type="submit">Login</button>
    </form>
  );
}
