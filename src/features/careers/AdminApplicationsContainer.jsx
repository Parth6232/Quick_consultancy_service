import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useGetApplicationsQuery, 
  useGetAllJobsAdminQuery, 
  useDeleteApplicationMutation,
  useUpdateApplicationStatusMutation,
  useGetApplicationByIdQuery
} from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal'
import Icon from '../../utils/iconMap'
import timeAgo from '../../utils/timeAgo'

const StatusBadge = ({ status }) => {
  const styles = {
    'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Reviewed': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    'Shortlisted': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    'Hired': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['New']}`}>
      {status}
    </span>
  )
}

const ApplicationModal = ({ appId, onClose }) => {
  const { data: app, isLoading, isError } = useGetApplicationByIdQuery(appId)
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation()

  const handleStatusChange = async (e) => {
    const status = e.target.value
    await updateStatus({ id: appId, status })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="FaUser" className="text-blue-500" /> Application Details
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Icon name="FaXmark" />
          </button>
        </div>

        <div className="p-6 md:p-8 flex-1">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl" />
                <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl" />
              </div>
              <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded-xl" />
            </div>
          ) : isError || !app ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load details.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header Info */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{app.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Applied for: <span className="font-semibold text-slate-700 dark:text-gray-300">{app.jobTitle || (app.job && app.job.title) || 'Unknown Job'}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <select 
                      value={app.status}
                      onChange={handleStatusChange}
                      disabled={isUpdating}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                    <Icon name="FaEnvelope" className="text-gray-400" />
                    <a href={`mailto:${app.email}`} className="hover:text-blue-500 transition-colors">{app.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                    <Icon name="FaPhone" className="text-gray-400" />
                    <a href={`tel:${app.phone}`} className="hover:text-blue-500 transition-colors">{app.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                    <Icon name="FaCalendarAlt" className="text-gray-400" />
                    {new Date(app.createdAt).toLocaleDateString()} ({timeAgo(app.createdAt)})
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Professional Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2">Professional</h4>
                  
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Experience</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{app.experience || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Current Company</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{app.currentCompany || 'N/A'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Current CTC</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{app.currentCTC || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Expected CTC</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{app.expectedCTC || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Notice Period</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{app.noticePeriod || 'N/A'}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2">Additional Links</h4>
                  
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Location</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{app.currentLocation || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">LinkedIn</p>
                    {app.linkedin ? (
                      <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
                        View Profile <Icon name="FaExternalLinkAlt" className="text-[10px]" />
                      </a>
                    ) : <p className="text-sm font-medium text-slate-800 dark:text-gray-200">N/A</p>}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Portfolio</p>
                    {app.portfolio ? (
                      <a href={app.portfolio} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
                        View Portfolio <Icon name="FaExternalLinkAlt" className="text-[10px]" />
                      </a>
                    ) : <p className="text-sm font-medium text-slate-800 dark:text-gray-200">N/A</p>}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Resume</p>
                    {app.resume ? (
                      <a 
                        href={app.resume} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Icon name="FaFileDownload" /> View / Download Resume
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {app.coverLetter && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2 mb-4">Cover Letter</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl text-sm text-slate-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {app.coverLetter}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}


const AdminApplicationsContainer = () => {
  const [selectedJob, setSelectedJob] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewAppId, setViewAppId] = useState(null)

  const { data: jobs } = useGetAllJobsAdminQuery()
  const { data: applications, isLoading, isError } = useGetApplicationsQuery({ 
    job: selectedJob || undefined, 
    status: selectedStatus || undefined 
  })
  
  const [deleteApp, { isLoading: isDeleting }] = useDeleteApplicationMutation()
  const [updateStatus] = useUpdateApplicationStatusMutation()

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application permanently?')) return
    await deleteApp(id)
  }

  const handleStatusChange = async (id, status) => {
    await updateStatus({ id, status })
  }

  // Client side search
  const filteredApps = applications?.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <Reveal className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-blue-100 dark:border-blue-500/20">
            <Icon name="FaUsers" />
            Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Job Applications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Manage candidates and review applications across all openings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Icon name="FaSearch" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
          <select 
            value={selectedJob} 
            onChange={e => setSelectedJob(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="">All Jobs</option>
            {jobs?.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
          <select 
            value={selectedStatus} 
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
      </Reveal>

      {/* Stats row (optional, just total for now) */}
      <Reveal delay={0.1} className="mb-6">
        <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">
          Total Applications: {filteredApps?.length || 0}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-gray-400">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-bold text-slate-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Applied For</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-1"></div><div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20 ml-auto"></div></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-red-500">
                      Failed to load applications.
                    </td>
                  </tr>
                ) : filteredApps?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <Icon name="FaInbox" className="text-4xl text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-700 dark:text-gray-300 font-semibold mb-1">No applications found</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Try adjusting your filters or search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredApps?.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.email}</p>
                        <p className="text-xs text-gray-500">{app.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-gray-300">
                        {app.jobTitle || (app.job && app.job.title) || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {app.experience || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {timeAgo(app.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                        <div className="mt-1">
                          <StatusBadge status={app.status} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setViewAppId(app._id)}
                            className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleDelete(app._id)}
                            disabled={isDeleting}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Icon name="FaTrash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Modal for Details */}
      <AnimatePresence>
        {viewAppId && (
          <ApplicationModal appId={viewAppId} onClose={() => setViewAppId(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default AdminApplicationsContainer
