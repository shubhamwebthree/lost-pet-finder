import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <p>&copy; {currentYear} Lost Pet Finder. ICP All rights reserved .</p>
    </footer>
  );
};

export default Footer;
