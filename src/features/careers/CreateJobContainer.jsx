import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateJobMutation, useUpdateJobMutation, useGetJobByIdQuery } from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal'
import Icon from '../../utils/iconMap'
import { unescapeNewlines } from '../../utils/formatText'

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  experience: z.string().optional(),
  salary: z.string().optional(),
  skills: z.string().optional(),
  description: z.string().min(10, 'Description is required (min 10 characters)'),
  isActive: z.boolean().default(true),
})

const CreateJobContainer = () => {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const { data: jobData, isLoading: isFetching } = useGetJobByIdQuery(id, { skip: !isEditMode })
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation()
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation()

  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: '',
      location: '',
      jobType: 'Full-time',
      experience: '',
      salary: '',
      skills: '',
      description: '',
      isActive: true,
    },
  })

  // Prefill in edit mode
  useEffect(() => {
    if (isEditMode && jobData) {
      reset({
        title: jobData.title || '',
        department: jobData.department || '',
        location: jobData.location || '',
        jobType: jobData.jobType || 'Full-time',
        experience: jobData.experience || '',
        salary: jobData.salary || '',
        skills: jobData.skills ? jobData.skills.join(', ') : '',
        description: unescapeNewlines(jobData.description) || '',
        isActive: jobData.isActive ?? true,
      })
    }
  }, [isEditMode, jobData, reset])

  const onSubmit = async (data) => {
    setServerError(null)
    
    // Process skills: split by comma, trim, remove empty
    const skillsArray = data.skills
      ? data.skills.split(',').map(s => s.trim()).filter(s => s)
      : []

    const payload = {
      ...data,
      skills: skillsArray,
    }

    try {
      if (isEditMode) {
        await updateJob({ id, body: payload }).unwrap()
      } else {
        await createJob(payload).unwrap()
      }
      navigate('/careers')
    } catch (err) {
      setServerError(err?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} job.`)
    }
  }

  if (isEditMode && isFetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  const isLoading = isCreating || isUpdating
  const isActiveChecked = watch('isActive')

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 min-h-screen">
      <Reveal>
        <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors">
          <Icon name="FaArrowLeft" /> Back to careers
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-slate-700/60">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isEditMode ? 'Edit Job Posting' : 'Post a New Job'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            {isEditMode ? 'Update the details for this position.' : 'Fill in the details below to create a new job opening.'}
          </p>

          {serverError && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex gap-3 items-start">
              <Icon name="FaXmark" className="text-lg mt-0.5" />
              <p>{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                  placeholder="e.g. Senior Frontend Developer"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  {...register('department')}
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                  placeholder="e.g. Engineering"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                  placeholder="e.g. Remote, or New York, NY"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Job Type
                </label>
                <select
                  {...register('jobType')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Experience Required
                </label>
                <input
                  {...register('experience')}
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                  placeholder="e.g. 3-5 Years"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Salary
                </label>
                <input
                  {...register('salary')}
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                  placeholder="e.g. $100k - $120k, or Competitive"
                />
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  {...register('skills')}
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
                  placeholder="e.g. React, Node.js, TypeScript"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows="8"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow resize-y whitespace-pre-wrap"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              
              {/* Is Active Toggle */}
              {isEditMode && (
                <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Active Status</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      If inactive, applications will be closed for this job.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" {...register('isActive')} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700 dark:text-gray-300">
                      {isActiveChecked ? 'Open' : 'Closed'}
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
              <Link
                to="/careers"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 shadow-glossy transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading ? (
                  <><Icon name="FaSpinner" className="animate-spin" /> Saving...</>
                ) : (
                  <>{isEditMode ? 'Update Job' : 'Publish Job'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  )
}

export default CreateJobContainer
