import { useEffect, useState } from "react";
import useForm from "../hooks/useForm";
import { getAllPosts, createPost } from "../api/posts";
import ErrorMessage from "../components/ErrorMessage";

function CreatePost() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const {
    values, setValues, handleChange, handleSubmit, error, setError, isSubmitting
  } = useForm({
    initialValues: { title: "", postText: "", image: null },
    validate: (vals) => {
      if (!vals.title || !vals.postText) return "Title and post text are required.";
      return "";
    },
    onSubmit: async (vals, { setError, setValues }) => {
      try {
        const formData = new FormData();
        formData.append("title", vals.title);
        formData.append("postText", vals.postText);
        if (vals.image) {
          formData.append("image", vals.image);
        }
        const response = await createPost(formData);
        if (response.data && response.data.data) {
          setValues({ title: "", postText: "", image: null });
          setPreviewUrl("");
          setError("");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error 
          ? `${error.response.data.error}: ${error.response.data.details || ''}`
          : "Failed to create post. Please try again.";
        setError(errorMessage);
      }
    }
  });

  useEffect(() => {
    getAllPosts()
      .then((response) => {
        setListOfPosts(response.data.listOfPosts || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch posts");
      });
  }, [setError]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex justify-center items-center h-screen w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 w-4xl bg-gray-100 rounded-lg shadow-lg"
        >
            <ErrorMessage message={error} />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={values.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <textarea
              name="postText"
              placeholder="Post Text"
              value={values.postText}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <div className="flex flex-col gap-2">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded"
              />
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-10 rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-amber-500 text-white p-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Post..." : "Add Post"}
            </button>
          </form>
        </div>
      </div>
  );
}

export default CreatePost;


