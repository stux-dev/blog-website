import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, setAuthToken, verifyOtp } from "./authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [page, setPage] = useState(0);
  const [otp, setOtp] = useState(new Array(6).fill(""))
  const otpInputs = useRef([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    const enteredOtp = otp.join("");
    
    try{
      const data = await verifyOtp(form.email, enteredOtp);

      if(data?.token){
        setAuthToken(data.token);
        login(data.token, data.user)
        navigate("/dashboard")
      }else{
        alert("Invalid OTP!");
      }
    }catch(error){
      console.error("Verification Failed!", error)
    }
    
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false; // Only allow numbers

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerUser(
        form.first_name,
        form.last_name,
        form.dob,
        form.email,
        form.password
      );
      
      if (data?.success) {
        setPage(1);
      } else {
        console.error("Registration Failed");
      }
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-6">
          Create your <span className="font-unbounded">StuxDev</span> account
        </h2>{page == 0 ? (

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              First Name
            </label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="John"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Last Name
            </label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200 px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              We've sent a verification code to your email <br/> <strong>{form.email}</strong>
            </p>
            <div className="flex justify-center gap-2">
              {otp.map((data, index) => {
                return (
                  <input
                    className="w-12 h-12 text-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onKeyDown={e => handleOtpKeyDown(e, index)}
                    onFocus={e => e.target.select()}
                    ref={el => (otpInputs.current[index] = el)}
                  />
                );
              })}
            </div>
             <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200 px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Account"}
            </button>
             <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="font-medium underline hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Resend Code
              </button>
            </p>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={goToLogin}
            className="font-medium underline hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Login Here
          </button>
        </p>
      </div>
    </div>
  );
}
