import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { JobCategories, JobLocations, assets } from '../assets/assets';
import JobCard from './jobcard';

const Joblisting = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleLocationChange = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter(job =>
    (selectedCategories.length === 0 || selectedCategories.includes(job.category)) &&
    (selectedLocations.length === 0 || selectedLocations.includes(job.location))
  );

  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="container 2xl:px-20 mx-auto py-8">
      {/* Search Tags */}
      {isSearched && (searchFilter.title || searchFilter.location) && (
        <div className="text-left ml-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Current Search</h3>
          <div className="flex flex-wrap gap-3 text-gray-600">
            {searchFilter.title && (
              <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                {searchFilter.title}
                <img
                  onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
                  src={assets.cross_icon}
                  alt="clear"
                  className="w-4 h-4 cursor-pointer"
                />
              </span>
            )}
            {searchFilter.location && (
              <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                {searchFilter.location}
                <img
                  onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
                  src={assets.cross_icon}
                  alt="clear"
                  className="w-4 h-4 cursor-pointer"
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toggle Filters (Mobile) */}
      <button
        onClick={() => setShowFilter(prev => !prev)}
        className="px-6 py-1.5 rounded border border-gray-400 lg:hidden mb-4"
      >
        {showFilter ? 'Close Filters' : 'Show Filters'}
      </button>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* Filters */}
        <aside className={`lg:w-1/4 space-y-10 ${showFilter ? '' : 'hidden lg:block'}`}>
          {/* Categories */}
          <div>
            <h4 className="font-medium text-lg py-2 text-left">Search by Categories</h4>
            <ul className="space-y-4 text-gray-600">
              {JobCategories.map((category, index) => (
                <li key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`cat-${index}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label htmlFor={`cat-${index}`} className="ml-2">{category}</label>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-medium text-lg py-2 text-left">Search by Locations</h4>
            <ul className="space-y-4 text-gray-600">
              {JobLocations.map((location, index) => (
                <li key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`loc-${index}`}
                    checked={selectedLocations.includes(location)}
                    onChange={() => handleLocationChange(location)}
                  />
                  <label htmlFor={`loc-${index}`} className="ml-2">{location}</label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Job Listings */}
        <main className="lg:w-3/4">
          <h3 className="font-medium text-3xl py-2" id="job-list">Latest Jobs</h3>
          <p className="mb-8 text-gray-700">Get your desired job from top companies</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="p-2"
                disabled={currentPage === 1}
              >
                <img src={assets.left_arrow_icon} alt="Previous" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : ''}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="p-2"
                disabled={currentPage === totalPages}
              >
                <img src={assets.right_arrow_icon} alt="Next" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Joblisting;
