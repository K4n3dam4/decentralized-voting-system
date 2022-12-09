import React from 'react';

export interface AdminElectionProps {
  type: 'election' | 'user';
  list?: any;
}

const AdminList: React.FC<AdminElectionProps> = ({ type, list }) => {
  return <div />;
};

export default AdminList;
