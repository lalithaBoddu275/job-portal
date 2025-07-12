import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Applyjob from './pages/Applyjob';
import Applications from './pages/Applications';
import Recruiterlogin from './components/Recruiterlogin';
import Dashboard from './pages/Dashboard';
import Addjob from './pages/Addjob';
import Managejob from './pages/Managejobs';
import ViewApplication from './pages/ViewApplications';
import { AppContext } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'quill/dist/quill.snow.css';
import './App.css';

function App() {
  const { showRecruiterLogin } = useContext(AppContext);

  return (
    <div>
      {showRecruiterLogin && <Recruiterlogin />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<Applyjob />} />
        <Route path="/applications" element={<Applications />} />

        {/* Dashboard with always-available nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<Addjob />} />
          <Route path="manage-jobs" element={<Managejob />} />
          <Route path="view-applications" element={<ViewApplication />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
