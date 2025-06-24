import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen'>
      {/* Top Navbar */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
          <img
            onClick={() => navigate('/')}
            className='max-sm:w-32 cursor-pointer'
            src={assets.logo}
            alt="Logo"
          />
          <div className='flex items-center gap-3'>
            <p className='max-sm:hidden'>Welcome to Job Portal</p>
            <div className='relative group'>
              <img
                className='w-8 h-8 border rounded-full object-cover'
                src={assets.company_icon}
                alt="Company"
              />
              <div className='absolute hidden group-hover:block top-10 right-0 z-10 text-black'>
                <ul className='bg-white rounded-md border shadow text-sm'>
                  <li className='py-2 px-4 hover:bg-gray-100 cursor-pointer'>Logout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-64 min-h-screen border-r-2'>
          <ul className='flex flex-col pt-5 text-gray-800'>
            <NavLink
              to="/dashboard/add-job"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
                  isActive ? 'bg-blue-100 border-r-4 border-blue-500' : ''
                }`
              }
            >
              <img className='w-4' src={assets.add_icon} alt="Add" />
              <p className='max-sm:hidden'>Add Job</p>
            </NavLink>

            <NavLink
              to="/dashboard/manage-jobs"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
                  isActive ? 'bg-blue-100 border-r-4 border-blue-500' : ''
                }`
              }
            >
              <img className='w-4' src={assets.home_icon} alt="Manage" />
              <p className='max-sm:hidden'>Manage Jobs</p>
            </NavLink>

            <NavLink
              to="/dashboard/view-applications"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
                  isActive ? 'bg-blue-100 border-r-4 border-blue-500' : ''
                }`
              }
            >
              <img className='w-4' src={assets.person_tick_icon} alt="View" />
              <p className='max-sm:hidden'>View Applications</p>
            </NavLink>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
