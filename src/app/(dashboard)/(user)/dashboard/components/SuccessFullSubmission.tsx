import React from 'react'

const SuccessFullSubmission = ({handleUpdate}:any) => {
  const handleClick = () => {
    handleUpdate();
  };
  return (
    <div className="text-center py-20">
    <h3 className="text-3xl font-bold text-green-600">
      Course Submitted Successfully!
    </h3>
    <p className="text-gray-600 mt-4">
      Thank you for submitting your course.
    </p>
    <button onClick={handleClick} className='px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'>Update Course</button>
  </div>  )
}

export default SuccessFullSubmission