import React from 'react';
import UserForm from '../components/UserForm';

const AddMember = ({ onLogout }) => {
  return (
    <div className="min-h-screen py-12 px-6 flex flex-col bg-dark">
      <UserForm />
    </div>
  );
};

export default AddMember;
