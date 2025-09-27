import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import useAuthCheck from "../hooks/useAuthCheck";
import { instance as axios } from "../utils/axios";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthCheck();
  const {
    values, handleChange, handleSubmit, error, setError, success, setSuccess, isSubmitting
  } = useForm({
    initialValues: { username: "", password: "" },
    validate: (vals) => {
      if (!vals.username || !vals.password) return "All fields are required.";
      return "";
    },
    onSubmit: async (vals, { setError, setSuccess, setValues }) => {
      try {
        const response = await axios.post(
          "/auth/login",
          { username: vals.username, password: vals.password },
          { withCredentials: true }
        );
        setSuccess("Login successful!");
        setValues({ username: "", password: "" });
        // Refresh authentication status
        await refreshAuth();
        navigate("/");
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
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
          <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
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
          <button
            type="submit"
            className="bg-amber-500 text-white p-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <div className="text-center mt-2">
            <span className="text-gray-700">Don't have an account? </span>
            <Link to="/register" className="text-amber-600 hover:underline font-semibold">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
