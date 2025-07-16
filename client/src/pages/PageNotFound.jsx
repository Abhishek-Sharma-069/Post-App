import React from 'react'
import { Link } from 'react-router-dom'
import { MdErrorOutline } from 'react-icons/md'

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <MdErrorOutline size={80} className="text-amber-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2 text-gray-800">404</h1>
      <p className="text-lg text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link
        to="/"
        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default PageNotFound
