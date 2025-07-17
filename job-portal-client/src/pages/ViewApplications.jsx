import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axiosInstance from '../axiosInstance'; // ✅ Using axiosInstance
import Loading from '../components/Loading';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ViewApplication = () => {
  const { companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(false);

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axiosInstance.get('/api/company/applicants', {
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

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axiosInstance.post(
        '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplications();
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
  if (applicants.length === 0)
    return <div className="text-center mt-10 text-gray-500">No applications yet.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="w-full max-w-5xl bg-white border border-gray-200 rounded-md shadow-sm text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User</th>
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
                <tr key={applicant._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-center">{index + 1}</td>

                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-8 h-8 rounded-full object-cover max-sm:hidden"
                        src={applicant.userId.image || assets.default_user_icon}
                        alt={applicant.userId.name}
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
                      className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition"
                    >
                      Resume
                      <img
                        src={assets.resume_download_icon}
                        alt="Download"
                        className="w-4 h-4"
                      />
                    </a>
                  </td>

                  <td className="py-2 px-4">
                    {applicant.status.toLowerCase() === 'pending' ? (
                      <div className="relative inline-block text-left group">
                        <button className="text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
                          ...
                        </button>
                        <div className="absolute z-10 hidden group-hover:block top-8 right-0 w-32 bg-white border border-gray-200 rounded shadow">
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, 'Accepted')
                            }
                            className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, 'Rejected')
                            }
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`capitalize font-medium ${
                          applicant.status === 'Accepted'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
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
