import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import Footer from '../components/Footer';
import JobCard from '../components/jobcard';

const Applyjob = () => {
  const { id } = useParams();
  const [JobData, setJobData] = useState(null);
  const { jobs } = useContext(AppContext);

  useEffect(() => {
    if (jobs.length > 0) {
      const data = jobs.find(job => job._id === id);
      if (data) setJobData(data);
    }
  }, [jobs, id]);

  if (!JobData) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          
          {/* Header */}
          <div className="flex justify-between flex-wrap gap-8 px-6 sm:px-14 py-10 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={JobData.companyId.image}
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{JobData.title}</h1>
                <div className="flex flex-wrap gap-6 text-gray-600 mt-2 justify-center md:justify-start">
                  <span className="flex items-center gap-1"><img src={assets.suitcase_icon} alt="" />{JobData.companyId.name}</span>
                  <span className="flex items-center gap-1"><img src={assets.location_icon} alt="" />{JobData.location}</span>
                  <span className="flex items-center gap-1"><img src={assets.person_icon} alt="" />{JobData.level}</span>
                  <span className="flex items-center gap-1"><img src={assets.money_icon} alt="" />CTC: {kconvert.convertTo(JobData.salary)}</span>
                </div>
              </div>
            </div>
            <div className="text-end max-md:text-center">
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded">Apply Now</button>
              <p className="mt-1 text-gray-600">Posted {moment(JobData.date).fromNow()}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row justify-between items-start px-6 sm:px-14 mt-10">
            {/* Description Section */}
            <div className="w-full lg:w-2/3 mb-10">
              <h2 className="font-bold text-2xl mb-6">Job Description</h2>

              <div
                className="prose max-w-full text-gray-700 prose-h2:mt-6 prose-h2:font-semibold prose-h2:text-lg prose-p:mb-4 prose-li:mb-2 prose-li:list-disc"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              />

              <button className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10">Apply Now</button>
            </div>

            {/* More Jobs Section */}
            <div className="w-full lg:w-1/3 lg:ml-8 space-y-6">
              <h2 className="font-bold text-xl mb-4">More jobs from {JobData.companyId.name}</h2>
              {jobs
                .filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Applyjob;
