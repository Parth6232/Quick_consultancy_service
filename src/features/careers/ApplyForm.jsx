import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useApplyToJobMutation } from '../../store/redux/apiSlice'
import Icon from '../../utils/iconMap'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

const applySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  currentLocation: z.string().optional(),
  experience: z.string().optional(),
  currentCompany: z.string().optional(),
  currentCTC: z.string().optional(),
  expectedCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  linkedin: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  portfolio: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  coverLetter: z.string().max(3000, 'Cover letter too long').optional(),
})

const ApplyForm = ({ jobId }) => {
  const [applyToJob, { isLoading }] = useApplyToJobMutation()
  const [serverError, setServerError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      currentLocation: '',
      experience: '',
      currentCompany: '',
      currentCTC: '',
      expectedCTC: '',
      noticePeriod: '',
      linkedin: '',
      portfolio: '',
      coverLetter: '',
    },
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setFileError(null)
    if (!file) {
      setResumeFile(null)
      return
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError('Only PDF, DOC, and DOCX files are allowed.')
      setResumeFile(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 5MB.')
      setResumeFile(null)
      return
    }
    setResumeFile(file)
  }

  const removeFile = () => {
    setResumeFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data) => {
    setServerError(null)
    if (!resumeFile) {
      setFileError('Resume is required.')
      return
    }

    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        formData.append(key, data[key])
      }
    })
    formData.append('resume', resumeFile)

    try {
      await applyToJob({ jobId, body: formData }).unwrap()
      setIsSuccess(true)
      reset()
      removeFile()
    } catch (err) {
      setServerError(err?.data?.message || 'Failed to submit application. Please try again.')
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FaCheck" className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h3>
        <p className="text-slate-600 dark:text-gray-300 mb-6">
          Thank you for applying. We will review your application and get back to you soon.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/60 p-6 md:p-8">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon name="FaPaperPlane" className="text-blue-500" /> Apply for this Job
      </h3>

      {serverError && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex gap-3 items-start">
          <Icon name="FaXmark" className="text-lg mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="+1 234 567 8900"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
          
          {/* Location */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Current Location
            </label>
            <input
              {...register('currentLocation')}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="City, Country"
            />
          </div>

          {/* Experience */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Experience
            </label>
            <input
              {...register('experience')}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="e.g. 3 Years"
            />
          </div>

          {/* Current Company */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Current Company
            </label>
            <input
              {...register('currentCompany')}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="Company Name"
            />
          </div>

          {/* Notice Period */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              Notice Period
            </label>
            <input
              {...register('noticePeriod')}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="e.g. 30 Days"
            />
          </div>

          {/* LinkedIn */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
              LinkedIn Profile
            </label>
            <input
              {...register('linkedin')}
              type="url"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow"
              placeholder="https://linkedin.com/in/..."
            />
            {errors.linkedin && <p className="mt-1 text-xs text-red-500">{errors.linkedin.message}</p>}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
            Resume / CV <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(PDF, DOC, DOCX up to 5MB)</span>
          </label>
          
          {!resumeFile ? (
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors
                ${fileError ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-slate-800'}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Icon name="FaCloudUploadAlt" className={`text-4xl mx-auto mb-2 ${fileError ? 'text-red-400' : 'text-blue-400'}`} />
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Click or drag file to upload
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-900/50 border border-blue-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <Icon name="FaFileAlt" className="text-blue-500 text-2xl shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                title="Remove file"
              >
                <Icon name="FaTrash" />
              </button>
            </div>
          )}
          {fileError && <p className="mt-2 text-xs text-red-500">{fileError}</p>}
        </div>

        {/* Cover Letter */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
            Cover Letter
          </label>
          <textarea
            {...register('coverLetter')}
            rows="4"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-shadow resize-y"
            placeholder="Introduce yourself and explain why you'd be a great fit..."
          />
          {errors.coverLetter && <p className="mt-1 text-xs text-red-500">{errors.coverLetter.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold py-3 px-6 rounded-xl shadow-glossy transition active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon name="FaSpinner" className="animate-spin" /> Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  )
}

export default ApplyForm
