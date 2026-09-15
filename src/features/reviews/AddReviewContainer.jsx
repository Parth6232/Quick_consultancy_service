import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import Button from '../../common/Button.jsx'
import Icon from '../../utils/iconMap.jsx'
import { useCreateReviewMutation } from '../../store/redux/apiSlice'

const schema = z.object({
  role: z.string().max(80).optional(),
  quote: z.string().min(10, 'Please write at least 10 characters').max(500),
  rating: z.number().min(1, 'Please select a rating').max(5),
})

const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          whileTap={{ scale: 0.85 }}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="text-2xl cursor-pointer"
        >
          <Icon
            name="FaStar"
            className={(hover || value) >= n ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-600'}
          />
        </motion.button>
      ))}
    </div>
  )
}

const AddReviewContainer = () => {
  const navigate = useNavigate()
  const token = useSelector((s) => s.auth.token)
  const user = useSelector((s) => s.auth.user)
  const [createReview, { isLoading }] = useCreateReviewMutation()
  const [errorMsg, setErrorMsg] = useState('')
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: '', quote: '', rating: 0 },
  })

  const onSubmit = async (data) => {
    setErrorMsg('')
    try {
      await createReview(data).unwrap()
      setDone(true)
      setTimeout(() => navigate('/'), 1800)
    } catch (err) {
      setErrorMsg(err.data?.message || 'Failed to submit review. Please try again.')
    }
  }

  if (!token) {
    return (
      <section className="py-20 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Icon name="FaStar" className="text-4xl text-blue-400 mb-4" />
        <p className="font-semibold text-slate-900 dark:text-white mb-1">Log in to write a review</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Reviews are tied to your account.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
        >
          Log In
        </Link>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-xl mx-auto min-h-screen">
      <Reveal className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Share your experience</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Posting as <span className="font-semibold">{user?.name}</span>
        </p>
      </Reveal>

      {done ? (
        <Reveal>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-8 text-center">
            <Icon name="FaCheck" className="text-3xl text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-900 dark:text-white">Thank you for your review!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Redirecting you home…</p>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => <StarPicker value={field.value} onChange={field.onChange} />}
              />
              {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Your Role / Company <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="role"
                {...register('role')}
                placeholder="e.g. Founder, TechSolutions"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>

            <div>
              <label htmlFor="quote" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Your Review
              </label>
              <textarea
                id="quote"
                rows={4}
                {...register('quote')}
                placeholder="Tell us about your experience..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
              />
              {errors.quote && <p className="text-xs text-red-500 mt-1">{errors.quote.message}</p>}
            </div>

            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

            <Button type="submit" variant="primary" className="w-full justify-center" disabled={isLoading}>
              {isLoading ? 'Submitting…' : 'Submit Review'}
              <Icon name="FaPaperPlane" className="text-xs" />
            </Button>
          </form>
        </Reveal>
      )}
    </section>
  )
}

export default AddReviewContainer
