import React from 'react';

export interface NavbarProps {
  name: string;
}

const Navbar: React.FC<NavbarProps> = ({ name }) => {
  return <div>Navbar</div>;
};

export default Navbar;
