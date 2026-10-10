import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetJobByIdQuery, useDeleteJobMutation, useUpdateJobMutation } from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal'
import Icon from '../../utils/iconMap'
import timeAgo from '../../utils/timeAgo'
import ApplyForm from './ApplyForm'
import { unescapeNewlines } from '../../utils/formatText'

const JobDetailContainer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: job, isLoading, isError } = useGetJobByIdQuery(id)
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')
  
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()
  const [updateJob] = useUpdateJobMutation()

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    await deleteJob(id)
    navigate('/careers')
  }

  const handleToggleActive = async () => {
    await updateJob({ id, body: { isActive: !job.isActive } })
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-pulse min-h-screen">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-8" />
        <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-6" />
        <div className="flex gap-4 mb-12">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24" />
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
             <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
             <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
             <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
          </div>
          <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="text-center py-32 min-h-screen flex flex-col items-center justify-center">
        <Icon name="FaXmark" className="text-5xl text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Job Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This position may have been closed or removed.</p>
        <Link to="/careers" className="text-blue-600 hover:underline">
          &larr; Back to Careers
        </Link>
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen">
      <Reveal>
        <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors">
          <Icon name="FaArrowLeft" /> Back to all jobs
        </Link>
      </Reveal>

      {/* Header section */}
      <Reveal delay={0.1}>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 mb-10 shadow-sm border border-gray-100 dark:border-slate-700/60 relative">
          
          {isAdmin && (
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <button
                onClick={handleToggleActive}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  job.isActive 
                    ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800/50 dark:text-green-400 dark:bg-green-900/20' 
                    : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:bg-slate-700/50'
                }`}
              >
                <Icon name={job.isActive ? "FaEye" : "FaEyeSlash"} />
                {job.isActive ? 'Active' : 'Closed'}
              </button>
              <Link
                to={`/careers/edit/${job._id}`}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
              >
                <Icon name="FaPenToSquare" />
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 transition-colors"
              >
                <Icon name="FaTrash" />
              </button>
            </div>
          )}

          {!job.isActive && !isAdmin && (
            <div className="mb-4 inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold border border-red-200 dark:border-red-800/50">
              Applications Closed
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 pr-32">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-4 md:gap-8 items-center text-sm font-medium text-slate-700 dark:text-gray-300">
            {job.department && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon name="FaBriefcase" />
                </div>
                {job.department}
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Icon name="FaMapMarkerAlt" />
                </div>
                {job.location}
              </div>
            )}
            {job.jobType && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon name="FaClock" />
                </div>
                {job.jobType}
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto text-gray-500 dark:text-gray-400 text-xs">
              <Icon name="FaCalendarAlt" />
              Posted {timeAgo(job.createdAt)}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        {/* Left: Job Details */}
        <div className="lg:col-span-3 space-y-10">
          <Reveal delay={0.2}>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Role Description</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed break-words">
                {unescapeNewlines(job.description)}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/60">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Experience</h3>
                <p className="text-slate-900 dark:text-white font-medium">{job.experience || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Salary</h3>
                <p className="text-slate-900 dark:text-white font-medium">{job.salary || 'Not specified'}</p>
              </div>
            </div>
          </Reveal>

          {job.skills?.length > 0 && (
            <Reveal delay={0.4}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg border border-blue-100 dark:border-blue-800/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Right: Application Form */}
        <div className="lg:col-span-2">
          <Reveal delay={0.5} className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar pr-1">
            {job.isActive ? (
              <ApplyForm jobId={job._id} />
            ) : (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="FaLock" className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Applications Closed</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6">
                  We are no longer accepting applications for this position.
                </p>
                <Link to="/careers" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors">
                  View other openings
                </Link>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default JobDetailContainer
