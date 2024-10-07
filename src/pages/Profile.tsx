import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <p className="text-gray-900">{user.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;