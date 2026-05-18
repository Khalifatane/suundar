// Example: Using Supabase Authentication in a React Component
import React, { useState } from 'react';
import { useSupabaseAuth, useSupabaseProfile } from '../hooks';

export const AuthExample: React.FC = () => {
  const { user, loading, signUp, signIn, signOut } = useSupabaseAuth();
  const { profile, updateProfile } = useSupabaseProfile(user?.id || null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    const result = await signUp(email, password);
    if (result.success) {
      alert('Sign up successful! Please check your email.');
    } else {
      alert(`Error: ${result.error}`);
    }
    setIsSigningUp(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.success) {
      alert('Signed in successfully!');
      setEmail('');
      setPassword('');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      alert('Signed out successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleUpdateProfile = async () => {
    const firstName = prompt('Enter first name:');
    if (firstName) {
      const result = await updateProfile({ first_name: firstName });
      if (result.success) {
        alert('Profile updated!');
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Authentication</h2>
        <form onSubmit={handleSignIn} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <button
          onClick={handleSignUp}
          className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
        >
          Sign Up Instead
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
      {profile && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="mb-2">
            <strong>Name:</strong> {profile.first_name || 'Not set'}
          </p>
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      )}
      <button
        onClick={handleSignOut}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AuthExample;
