import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import Footer from '../components/Footer';
import JobCard from '../components/jobcard';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance'; // ✅ use this
import { useAuth } from '@clerk/clerk-react';

const Applyjob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [currentJob, setCurrentJob] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const {
    jobs,
    userData,
    userApplications = [],
  } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/jobs/${id}`);
      if (data.success) {
        setCurrentJob(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error('Login to apply for jobs');
      }
      if (!userData.resume) {
        navigate('/applications');
        return toast.error('Upload resume to apply');
      }

      const token = await getToken();
      const { data } = await axiosInstance.post(
        `/api/users/apply`,
        { jobId: currentJob._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsAlreadyApplied(true); // update status immediately
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAlreadyApplied = () => {
    if (userApplications && currentJob) {
      const hasApplied = userApplications.some(
        item => item.jobId._id === currentJob._id
      );
      setIsAlreadyApplied(hasApplied);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    checkAlreadyApplied();
  }, [currentJob, userApplications]);

  if (!currentJob) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-between flex-wrap gap-8 px-6 sm:px-14 py-10 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={currentJob?.companyId?.image || assets.company_icon}
                alt="Company Logo"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{currentJob?.title}</h1>
                <div className="flex flex-wrap gap-6 text-gray-600 mt-2 justify-center md:justify-start">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {currentJob?.companyId?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {currentJob?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {currentJob?.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(currentJob?.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-end max-md:text-center">
              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied}
                className="bg-blue-600 p-2.5 px-10 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
              <p className="mt-1 text-gray-600">Posted {moment(currentJob?.date).fromNow()}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start px-6 sm:px-14 mt-10">
            <div className="w-full lg:w-2/3 mb-10">
              <h2 className="font-bold text-2xl mb-6">Job Description</h2>
              <div
                className="prose max-w-full text-gray-700 prose-h2:mt-6 prose-h2:font-semibold prose-h2:text-lg prose-p:mb-4 prose-li:mb-2 prose-li:list-disc"
                dangerouslySetInnerHTML={{
                  __html: currentJob?.description || "<p>No description provided.</p>",
                }}
              />
              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied}
                className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
            </div>

            <div className="w-full lg:w-1/3 lg:ml-8 space-y-6">
              <h2 className="font-bold text-xl mb-4">More jobs from {currentJob?.companyId?.name}</h2>
              {jobs
                .filter(
                  job =>
                    job._id !== currentJob._id &&
                    job.companyId?._id === currentJob?.companyId?._id
                )
                .filter(job => {
                  const appliedJobsIds = new Set(
                    userApplications.map(app => app.jobId && app.jobId._id)
                  );
                  return !appliedJobsIds.has(job._id);
                })
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
