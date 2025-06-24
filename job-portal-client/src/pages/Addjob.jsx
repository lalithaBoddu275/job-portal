import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Addjob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState(0);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { jobs } = useContext(AppContext); // if needed later

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }

    // cleanup if needed
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const description = quillRef.current?.root.innerHTML;
    const jobData = {
      title,
      location,
      category,
      level,
      salary,
      description,
    };
    console.log("New Job Posted:", jobData);
    // You can now send jobData to backend
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
