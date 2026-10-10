import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetJobsQuery, useGetAllJobsAdminQuery, useDeleteJobMutation, useUpdateJobMutation } from '../../store/redux/apiSlice'
import TiltCard from '../../common/TiltCard.jsx'
import GradientBorderCard from '../../common/GradientBorderCard.jsx'
import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'
import timeAgo from '../../utils/timeAgo.js'
import { unescapeNewlines } from '../../utils/formatText'

// ── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 animate-pulse">
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
      <div className="flex gap-2 mb-2">
         <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
         <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
      </div>
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-4/6" />
      <div className="pt-4 flex justify-between">
         <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-24" />
      </div>
    </div>
  </div>
)

// ── Job Card ──────────────────────────────────────────────────────────────
const JobCard = ({ job, index, isAdmin }) => {
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()
  const [updateJob] = useUpdateJobMutation()

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this job?')) return
    await deleteJob(job._id)
  }

  const handleToggleActive = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await updateJob({ id: job._id, body: { isActive: !job.isActive } })
  }

  return (
    <Reveal delay={index * 0.05}>
      <div className="relative h-full">
        {isAdmin && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
             <button
              onClick={handleToggleActive}
              title={job.isActive ? "Close applications" : "Open applications"}
              className={`cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 ${job.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition`}
            >
              <Icon name={job.isActive ? "FaEye" : "FaEyeSlash"} className="text-xs" />
            </button>
            <Link
              to={`/careers/edit/${job._id}`}
              onClick={(e) => e.stopPropagation()}
              title="Edit Job"
              className="cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition"
            >
              <Icon name="FaPenToSquare" className="text-xs" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Job"
              className="cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-red-600 dark:text-red-400 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition"
            >
              <Icon name="FaTrash" className="text-xs" />
            </button>
          </div>
        )}

        <TiltCard maxTilt={5} className="h-full">
          <GradientBorderCard rounded="rounded-xl" className="shadow-sm hover:shadow-glossy-lg transition-shadow duration-300 h-full">
            <div className="group relative bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl h-full flex flex-col p-5">
              
              {!job.isActive && (
                <div className="absolute -top-3 -left-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-3 py-1 rounded-full font-semibold border border-red-200 dark:border-red-800/50 shadow-sm z-10">
                  Closed
                </div>
              )}

              <div className="mb-2">
                <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white line-clamp-2">
                  {job.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.department && (
                   <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md">
                     <Icon name="FaBriefcase" className="text-[10px]" /> {job.department}
                   </span>
                )}
                {job.location && (
                   <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-md">
                     <Icon name="FaMapMarkerAlt" className="text-[10px]" /> {job.location}
                   </span>
                )}
                {job.jobType && (
                   <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-1 rounded-md">
                     <Icon name="FaClock" className="text-[10px]" /> {job.jobType}
                   </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3 whitespace-pre-line break-words">
                {unescapeNewlines(job.description)}
              </p>

              {job.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {job.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="text-[10px] uppercase font-bold tracking-wide text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="text-[10px] uppercase font-bold tracking-wide text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700/50 px-2 py-0.5 rounded">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo(job.createdAt)}
                </div>
                <Link
                  to={`/careers/${job._id}`}
                  className="cursor-pointer text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  {job.isActive ? "Apply Now" : "View Details"}
                </Link>
              </div>
            </div>
          </GradientBorderCard>
        </TiltCard>
      </div>
    </Reveal>
  )
}

// ── Main Container ─────────────────────────────────────────────────────────
const CareersContainer = () => {
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')
  const { data: publicJobs, isLoading: isPublicLoading, isError: isPublicError } = useGetJobsQuery(undefined, { skip: isAdmin })
  const { data: adminJobs, isLoading: isAdminLoading, isError: isAdminError } = useGetAllJobsAdminQuery(undefined, { skip: !isAdmin })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const isLoading = isAdmin ? isAdminLoading : isPublicLoading
  const isError = isAdmin ? isAdminError : isPublicError
  const jobsData = isAdmin ? adminJobs : publicJobs

  // Client-side filtering
  const filteredJobs = jobsData?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.department?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'All' || job.jobType === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <Reveal className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-blue-100 dark:border-blue-500/20">
          <Icon name="FaBriefcase" />
          Careers
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Join our <span className="text-blue-600 dark:text-blue-400">Team</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
          Help us build the future of consulting. Explore opportunities to work with passionate people on challenging problems.
        </p>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
          <div className="relative w-full md:w-auto flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="FaSearch" className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          {isAdmin && (
            <Link
              to="/careers/create"
              className="w-full md:w-auto inline-flex justify-center items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 px-6 py-2.5 rounded-xl shadow-glossy transition active:scale-95 shrink-0"
            >
              <Icon name="FaPlus" className="text-xs" />
              Post a Job
            </Link>
          )}
        </div>
      </Reveal>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-20">
          <Icon name="FaXmark" className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Failed to load jobs. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredJobs?.length === 0 && (
        <div className="text-center py-24 bg-white/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800">
          <Icon name="FaBriefcase" className="text-5xl text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-gray-300 font-semibold text-lg mb-1">No openings right now</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Check back later or try adjusting your filters.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && filteredJobs?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1000 }}>
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
              >
                <JobCard job={job} index={i} isAdmin={isAdmin} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export default CareersContainer
