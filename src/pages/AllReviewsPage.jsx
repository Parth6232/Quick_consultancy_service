import AllReviewsContainer from '../features/reviews/AllReviewsContainer.jsx'

const AllReviewsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Page header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            All Reviews
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="py-10 px-4 md:px-6">
        <AllReviewsContainer />
      </div>
    </div>
  )
}

export default AllReviewsPage
