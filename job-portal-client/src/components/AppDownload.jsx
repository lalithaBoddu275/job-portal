import React from 'react';
import { assets } from '../assets/assets';

const AppDownload = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto my-20'>
      <div className='relative bg-gradient-to-r from-violet-50 p-12 sm:p-24 lg:p-32 rounded-lg overflow-hidden flex flex-col lg:flex-row items-center justify-between'>
        
        {/* Text + Buttons Section */}
        <div className='z-10 max-w-xl'>
          <h1 className='text-2xl sm:text-4xl font-bold mb-8'>
            Download Mobile App For Better Experience
          </h1>
          <div className='flex gap-4'>
            <a href="#" className='inline-block'>
              <img className='h-12' src={assets.play_store} alt="Play Store" />
            </a>
            <a href="#" className='inline-block'>
              <img className='h-12' src={assets.app_store} alt="App Store" />
            </a>
          </div>
        </div>

        {/* App Image */}
        <img
          src={assets.app_main_img}
          alt="App Main"
          className='hidden lg:block lg:absolute lg:right-10 lg:bottom-0 w-72'
        />
      </div>
    </div>
  );
};

export default AppDownload;
