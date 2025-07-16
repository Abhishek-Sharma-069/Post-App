import React from 'react';

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-8 text-lg text-gray-600 animate-pulse">
      {message}
    </div>
  );
} 