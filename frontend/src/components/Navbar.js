import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <section className='flex flex-col sm:flex-row justify-between px-2 sm:px-8 py-2 sm:py-4 bg-gray-100'>
        <Link to={'/'}><h1 className='text-2xl font-medium text-gray-600 text-center'>MOVIECRITIC</h1></Link>
       <div className='flex max-sm:justify-between max-sm:text-sm  gap-4 max-sm:mt-2'>
        <Link to={'/movie-form'}
          className='px-2 sm:px-4 py-2 bg-white border-2 border-purple-200 text-purple-500 font-medium rounded-lg'
        >
          Add New Movie
        </Link>
        <Link
         to={'/review-form'}
          className='px-2 sm:px-4 py-2 text-white bg-purple-500 font-medium rounded-lg'
        >
          Add New Review
        </Link>
      </div>
    </section>
  )
}

export default Navbar