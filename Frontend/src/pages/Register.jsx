import React, {useState} from 'react';
import axios from 'axios';
export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      alert(res.data.message || 'Registered — wait for admin approval');
      setName(''); setEmail(''); setPassword('');
    } catch(err){
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  }
  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button type="submit">Register</button>
    </form>
  );
}
