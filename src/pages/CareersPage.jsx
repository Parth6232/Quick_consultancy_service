import React, { useEffect } from 'react'
import CareersContainer from '../features/careers/CareersContainer'

const CareersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-16">
      <CareersContainer />
    </div>
  )
}

export default CareersPage
