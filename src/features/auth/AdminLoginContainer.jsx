import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAdminLoginMutation } from '../../store/redux/apiSlice'
import { setCredentials } from '../../store/redux/slices/authSlice'
import Icon from '../../utils/iconMap.jsx'
import Reveal from '../../common/Reveal.jsx'
import Button from '../../common/Button.jsx'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const AdminLoginContainer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [adminLogin, { isLoading }] = useAdminLoginMutation()
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setErrorMsg('')
    try {
      const result = await adminLogin(data).unwrap()
      dispatch(setCredentials({ token: result.token, user: result.user }))
      navigate('/blog/create')
    } catch (err) {
      setErrorMsg(err.data?.message || 'Admin login failed')
    }
  }

  return (
    <section className="min-h-screen py-12 md:py-20 px-4 md:px-6 max-w-lg mx-auto flex flex-col justify-center">
      <Reveal className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-rose-100 dark:border-rose-500/20">
          <Icon name="FaUserShield" />
          Restricted Area
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Admin Portal
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Log in with your administrator credentials to manage content.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5 mt-2">
                <Icon name="FaXmark" /> {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 rounded-xl text-sm mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Portal'}
            </Button>
          </form>
        </div>
      </Reveal>
    </section>
  )
}

export default AdminLoginContainer
