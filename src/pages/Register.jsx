import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Message from '../components/common/Message';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-white bg-clip-text text-transparent">KICKS_SHOP</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-surface-400 mt-1">Join KICKS_SHOP today</p>
          </div>
          {error && <Message variant="error" className="mb-4">{error}</Message>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-surface-300 block mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="input-field w-full" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm text-surface-300 block mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="input-field w-full" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm text-surface-300 block mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required
                className="input-field w-full" placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="text-sm text-surface-300 block mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                className="input-field w-full" placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-surface-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
