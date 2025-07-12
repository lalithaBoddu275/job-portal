import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container px-4 2xl:px-20 mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
  <img
    src={assets.clogo}
    
    alt="Logo"
    className="w-10 h-10 font-serif object-contain"
  />
  <span className="text-2xl font-semibold text-blue-900">HireNest</span>
</div>


        {/* Copyright */}
        <p className="flex-1 text-sm text-gray-500 border-l border-gray-300 pl-4 max-sm:hidden">
          © HireNest.in | All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-2.5">
          <img width={38} src={assets.facebook_icon} alt="Facebook" />
          <img width={38} src={assets.twitter_icon} alt="Twitter" />
          <img width={38} src={assets.instagram_icon} alt="Instagram" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
