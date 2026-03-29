import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr || !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    setIsAdmin(user.role === 'admin');
    fetchTasks(user.role === 'admin');
  }, [navigate]);

  const fetchTasks = async (adminView) => {
    try {
      setLoading(true);
      const url = adminView ? '/tasks/all' : '/tasks';
      const { data } = await api.get(url);
      setTasks(data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, { title, description, deadline, priority, status });
        toast.success('Task updated');
      } else {
        await api.post('/tasks', { title, description, deadline, priority, status });
        toast.success('Task created');
      }
      resetForm();
      fetchTasks(isAdmin);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('medium');
    setStatus('pending');
    setEditingId(null);
  };

  const handleEdit = (task) => {
    if(isAdmin && task.user !== JSON.parse(localStorage.getItem('user')).id && !task.user._id) {
       toast.error("Can only edit your own tasks natively, updating others should be done with care.");
    }
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(new Date(task.deadline).toISOString().split('T')[0]);
    setPriority(task.priority);
    setStatus(task.status);
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const url = isAdmin ? `/tasks/all/${id}` : `/tasks/${id}`;
      await api.delete(url);
      toast.success('Task deleted');
      fetchTasks(isAdmin);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard {isAdmin ? '(Admin)' : '(User)'}</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginTop: 20 }}>
        <h3>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: 8 }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: 8 }}></textarea>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required style={{ padding: 8 }} />
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: 8 }}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          {editingId && (
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 8 }}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Your Tasks {isAdmin && '- All Users'}</h3>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {tasks.map(task => (
              <div key={task._id} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
                <h4>{task.title} {isAdmin && task.user && <span style={{fontSize: '0.8em', color: '#666'}}>({task.user.email})</span>}</h4>
                <p>{task.description}</p>
                <p>
                  <strong>Status:</strong> {task.status} | <strong>Priority:</strong> {task.priority} | <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button onClick={() => handleEdit(task)} style={{ padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(task._id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#white', border: 'none', borderRadius: 4, cursor: 'pointer', color: 'white' }}>Delete</button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p>No tasks found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;