import React, { useEffect } from 'react'
import AdminApplicationsContainer from '../features/careers/AdminApplicationsContainer'

const AdminApplicationsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-16">
      <AdminApplicationsContainer />
    </div>
  )
}

export default AdminApplicationsPage
