import React, { useEffect } from 'react'
import CreateJobContainer from '../features/careers/CreateJobContainer'

const CreateJobPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-16">
      <CreateJobContainer />
    </div>
  )
}

export default CreateJobPage
