import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container px-4 2xl:px-20 mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <img width={160} src={assets.logo} alt="Greatstack Logo" />

        {/* Copyright */}
        <p className="flex-1 text-sm text-gray-500 border-l border-gray-300 pl-4 max-sm:hidden">
          © Greatstack.dev | All rights reserved.
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
