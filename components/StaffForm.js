"use client";

import { useState } from 'react';

function StaffForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, profilePicture });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Profile Picture URL"
        value={profilePicture}
        onChange={(e) => setProfilePicture(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default StaffForm;
