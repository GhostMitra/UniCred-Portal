import React, { useState } from 'react';
import { UserPlus } from 'lucide-react'; // A modern icon for the signup form

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    email: '',
    password: '',
    validId: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType(null);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await new Promise<{ ok: boolean; status: number }>((resolve) => {
        setTimeout(() => {
          const success = Math.random() > 0.1;
          if (success) {
            resolve({ ok: true, status: 200 });
          } else {
            resolve({ ok: false, status: 400 });
          }
        }, 1500);
      });

      if (response.ok) {
        showMessage('Signup successful!', 'success');
      } else {
        showMessage('Signup failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 font-inter p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-slate-700 rounded-2xl mb-4 shadow-xl">
            <UserPlus size={48} className="text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100">Create Account</h1>
          <p className="text-slate-400 mt-2">Join our community of professionals</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-8 rounded-2xl shadow-2xl space-y-4"
        >
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">User Type</label>
            <div className="relative">
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-xl shadow-inner border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 appearance-none"
                required
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Select User Type</option>
                <option value="university" className="bg-slate-800 text-slate-100">University</option>
                <option value="recruiter" className="bg-slate-800 text-slate-100">Recruiter</option>
                <option value="student" className="bg-slate-800 text-slate-100">Student</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-xl shadow-inner border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-xl shadow-inner border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-xl shadow-inner border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              placeholder="Choose a strong password"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">Valid ID</label>
            <input
              type="text"
              name="validId"
              value={formData.validId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-xl shadow-inner border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              placeholder="Enter your valid ID"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 mt-6"
          >
            Signup
          </button>

          {message && (
            <div
              className={`mt-4 p-4 rounded-xl text-center font-medium ${
                messageType === 'success'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;