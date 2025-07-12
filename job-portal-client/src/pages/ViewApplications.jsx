import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import Loading from '../components/Loading';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ViewApplication = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(false);

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Update application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplications(); // refresh the list
        toast.success(`Application ${status}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  if (applicants === false) return <Loading />;
  if (applicants.length === 0) return <div className="text-center mt-10">No applications yet.</div>;

  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {applicants
              .filter(item => item.jobId && item.userId)
              .map((applicant, index) => (
                <tr key={index} className="text-gray-700 border-b">
                  <td className="py-2 px-4 text-center">{index + 1}</td>

                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-10 h-10 rounded-full max-sm:hidden"
                        src={applicant.userId.image}
                        alt={`${applicant.userId.name}'s profile`}
                      />
                      <span>{applicant.userId.name}</span>
                    </div>
                  </td>

                  <td className="py-2 px-4 max-sm:hidden">{applicant.jobId.title}</td>
                  <td className="py-2 px-4 max-sm:hidden">{applicant.jobId.location}</td>

                  <td className="py-2 px-4">
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center"
                    >
                      Resume
                      <img
                        src={assets.resume_download_icon}
                        alt="Download Icon"
                        className="w-4 h-4"
                      />
                    </a>
                  </td>

                  <td className="py-2 px-4 relative">
                    {applicant.status.toLowerCase() === 'pending' ? (
                      <div className="relative inline-block text-left group">
                        <button className="text-gray-500 action-button">...</button>
                        <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                          <button
                            onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}
                            className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className={`capitalize ${applicant.status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
                        {applicant.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplication;
