import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser, SignInButton } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={assets.clogo}
            alt="Logo"
            className="w-14 h-14 object-contain"
          />
          <span className="text-2xl sm:text-4xl font-semibold text-blue-900">
            HireNest
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/applications" className="text-gray-700">Applied Jobs</Link>
              <p className="text-gray-400">|</p>
              <p className="text-gray-600">Hi, {user.firstName + ' ' + user.lastName}</p>
              <UserButton />
            </>
          ) : (
            <>
              <button onClick={() => setShowRecruiterLogin(true)} className="text-gray-600">
                Recruiter Login
              </button>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full">
                  Login
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-100 p-4 mt-2 rounded-lg mx-4">
          {user ? (
            <>
              <Link to="/applications" className="block py-2">Applied Jobs</Link>
              <p className="py-2">Hi, {user.firstName + ' ' + user.lastName}</p>
              <UserButton />
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRecruiterLogin(true)}
                className="block text-left w-full py-2 text-gray-700"
              >
                Recruiter Login
              </button>
              <SignInButton mode="modal">
                <button className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-full">
                  Login
                </button>
              </SignInButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
