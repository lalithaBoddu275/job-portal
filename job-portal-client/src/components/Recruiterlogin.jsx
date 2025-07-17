import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axiosInstance from "../axiosInstance"; // ✅ use instance instead of axios
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Recruiterlogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const {
    setShowRecruiterLogin,
    setCompanyToken,
    setCompanyData,
  } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "signup" && !isTextDataSubmitted) {
      if (!name || !email || !password) {
        toast.error("Please fill all fields");
        return;
      }
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === "login") {
        const { data } = await axiosInstance.post(`/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        if (!image) {
          toast.error("Please upload a company logo.");
          return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("image", image);

        const { data } = await axiosInstance.post(`/api/company/register`, formData);

        if (data.success) {
          toast.success("Account created successfully");
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-md"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm mb-4">
          Welcome back! Please {state === "login" ? "sign in" : "sign up"} to continue.
        </p>

        {state === "signup" && isTextDataSubmitted ? (
          <div className="mb-5 text-center">
            <label htmlFor="image" className="cursor-pointer">
              <img
                className="w-16 h-16 mx-auto rounded-full"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload Preview"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
              <p className="text-sm mt-2">Upload Company Logo</p>
            </label>
          </div>
        ) : (
          <>
            {state === "signup" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="person" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email ID"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="lock" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter Password"
                required
              />
            </div>
          </>
        )}

        {state === "login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
        >
          {state === "login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>

        <p className="mt-5 text-center text-sm">
          {state === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState("signup");
                  setIsTextDataSubmitted(false);
                }}
              >
                Signup
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState("login");
                  setIsTextDataSubmitted(false);
                }}
              >
                Login
              </span>
            </>
          )}
        </p>

        <img
          className="absolute top-5 right-5 w-5 cursor-pointer"
          onClick={() => setShowRecruiterLogin(false)}
          src={assets.cross_icon}
          alt="close"
        />
      </form>
    </div>
  );
};

export default Recruiterlogin;
