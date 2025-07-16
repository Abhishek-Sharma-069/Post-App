import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { instance as axios } from "../utils/axios";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const {
    values, handleChange, handleSubmit, error, setError, success, setSuccess, isSubmitting, setValues
  } = useForm({
    initialValues: { username: "", password: "", confirmPassword: "" },
    validate: (vals) => {
      if (!vals.username || !vals.password || !vals.confirmPassword) return "All fields are required.";
      if (vals.password.length < 6) return "Password must be at least 6 characters long.";
      if (vals.password !== vals.confirmPassword) return "Passwords do not match.";
      return "";
    },
    onSubmit: async (vals, { setError, setSuccess, setValues }) => {
      try {
        await axios.post(
          "/auth/register",
          { username: vals.username, password: vals.password },
          { withCredentials: true }
        );
        setSuccess("Registration successful! You can now log in.");
        setValues({ username: "", password: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 1000);
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
        setError(errorMessage);
      }
    }
  });

  return (
    <div className="max-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex justify-center items-center h-screen w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 w-96 bg-gray-100 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 text-white p-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
          <div className="text-center mt-2">
            <span className="text-gray-700">Already have an account? </span>
            <Link to="/login" className="text-amber-600 hover:underline font-semibold">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;


