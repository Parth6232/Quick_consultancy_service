import React, { useEffect } from 'react'
import JobDetailContainer from '../features/careers/JobDetailContainer'

const JobDetailPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-16">
      <JobDetailContainer />
    </div>
  )
}

export default JobDetailPage
