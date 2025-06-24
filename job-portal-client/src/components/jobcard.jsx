import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/apply-job/${job._id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="border p-6 shadow rounded bg-white hover:shadow-lg transition-all duration-300">
      {/* Company Icon */}
      <div className="flex justify-between items-center">
        <img
          src={job.companyId?.image || assets.company_icon}
          alt={`${job.companyId?.name || 'Company'} Logo`}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Job Title */}
      <h4 className="font-medium text-xl mt-2 text-gray-800">{job.title}</h4>

      {/* Location and Level */}
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
          {job.location || 'Remote'}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
          {job.level || 'Entry'}
        </span>
      </div>

      {/* Description Preview */}
      <div
        className="text-gray-500 text-sm mt-4"
        dangerouslySetInnerHTML={{
          __html:
            job.description?.length > 150
              ? job.description.slice(0, 150) + '...'
              : job.description || '<p>No description provided.</p>',
        }}
      />

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 mt-6">
        <button
          onClick={handleNavigation}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Apply now
        </button>
        <button
          onClick={handleNavigation}
          className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-50"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
