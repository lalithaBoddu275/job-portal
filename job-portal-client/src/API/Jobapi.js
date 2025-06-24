import axios from 'axios';

// Use Vite's environment variable system
const API_KEY = import.meta.env.VITE_YOUR_RAPIDAPI_KEY;

const options = {
  method: 'GET',
  url: 'https://jsearch.p.rapidapi.com/search',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
  }
};

export const fetchJobs = async (searchTerm) => {
  try {
    const response = await axios.request({
      ...options,
      params: {
        query: searchTerm,
        page: '1',
        num_pages: '1'
      }
    });

    return response.data.data; // List of jobs
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};
