/**
 * Custom React hook for managing form state, validation, and submission.
 * Usage:
 *   const { values, handleChange, handleSubmit, error, isSubmitting } = useForm({
 *     initialValues: { ... },
 *     validate: (values) => { ... },
 *     onSubmit: async (values, helpers) => { ... }
 *   });
 */
import { useState } from 'react';

export default function useForm({ initialValues, onSubmit, validate }) {
  // State for form values, error/success messages, and submission status
  const [values, setValues] = useState(initialValues || {});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes (including file inputs)
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    // Run validation if provided
    if (validate) {
      const validationError = validate(values);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      // Call the provided onSubmit function
      await onSubmit(values, { setError, setSuccess, setValues });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return form state and handlers
  return {
    values,
    setValues,
    handleChange,
    handleSubmit,
    error,
    setError,
    success,
    setSuccess,
    isSubmitting,
  };
} 