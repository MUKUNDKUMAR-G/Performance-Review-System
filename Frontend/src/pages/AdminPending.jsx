import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function AdminPending() {
  const [pending, setPending] = useState([]);

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users/pending', { headers: { Authorization: 'Bearer ' + token }});
      setPending(res.data);
    } catch(err) {
      alert('Error loading pending users: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(()=>{ load(); },[]);

  const approve = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${id}/approve`, { action: 'approve', role: 'employee' }, { headers: { Authorization: 'Bearer ' + token }});
      load();
    } catch(err){
      alert('Approve error: ' + (err.response?.data?.error || err.message));
    }
  };

  const reject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${id}/approve`, { action: 'reject' }, { headers: { Authorization: 'Bearer ' + token }});
      load();
    } catch(err){
      alert('Reject error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Pending Users</h2>
      {pending.length === 0 && <div>No pending users</div>}
      <ul>
        {pending.map(u => (
          <li key={u.id}>
            {u.name} — {u.email} — created: {new Date(u.createdAt).toLocaleString()}
            <button onClick={()=>approve(u.id)}>Approve</button>
            <button onClick={()=>reject(u.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
