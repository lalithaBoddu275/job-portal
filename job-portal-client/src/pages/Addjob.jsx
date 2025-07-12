import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Addjob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState(0);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { backendUrl, companyToken } = useContext(AppContext);
  const navigate = useNavigate();

  // 🚨 Redirect if not logged in as company
  useEffect(() => {
    if (!companyToken) {
      navigate("/"); // or navigate to login
    }
  }, [companyToken, navigate]);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current?.root.innerHTML;
      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      className="container p-4 flex flex-col w-full items-start gap-6"
      onSubmit={handleSubmit}
    >
      <div className="w-full max-w-2xl">
        <p className="mb-2 font-medium">Job Title</p>
        <input
          type="text"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      <div className="w-full max-w-2xl">
        <p className="mb-2 font-medium">Job Description</p>
        <div ref={editorRef} className="h-40 border border-gray-300 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        <div>
          <p className="mb-2 font-medium">Job Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            {JobCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium">Job Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            {JobLocations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-medium">Job Level</p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <p className="mb-2 font-medium">Job Salary</p>
        <input
          type="number"
          min={0}
          placeholder="2500"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-40 px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      <button className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 mt-4">
        Add Job
      </button>
    </form>
  );
};

export default Addjob;
