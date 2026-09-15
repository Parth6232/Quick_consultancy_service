import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreatePortfolioMutation, useUpdatePortfolioMutation, useGetPortfolioByIdQuery } from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal.jsx'
import Button from '../../common/Button.jsx'
import Icon from '../../utils/iconMap.jsx'

const FIELDS = [
  { id: 'title', label: 'Project Title', type: 'text', placeholder: 'e.g. E-Commerce Platform', required: true },
  { id: 'client', label: 'Client Name', type: 'text', placeholder: 'e.g. Acme Corp', required: false },
  { id: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Web Development', required: false },
  { id: 'image', label: 'Cover Image URL', type: 'url', placeholder: 'https://…', required: false },
  { id: 'link', label: 'Project URL', type: 'url', placeholder: 'https://…', required: false },
]

const AddPortfolioContainer = () => {
  const navigate = useNavigate()
  const { id } = useParams() // route /portfolio/edit/:id se aata hai; add par undefined rehta hai
  const isEditMode = !!id

  const { data: existingItem, isLoading: isLoadingItem } = useGetPortfolioByIdQuery(id, { skip: !isEditMode })
  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation()
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation()
  const isSaving = isCreating || isUpdating

  const [form, setForm] = useState({ title: '', client: '', category: '', image: '', link: '', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Edit mode mein existing project load hote hi form prefill karo
  useEffect(() => {
    if (isEditMode && existingItem) {
      setForm({
        title: existingItem.title || '',
        client: existingItem.client || '',
        category: existingItem.category || '',
        image: existingItem.image || '',
        link: existingItem.link || '',
        description: existingItem.description || '',
      })
    }
  }, [isEditMode, existingItem])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Project title is required.')
      return
    }
    try {
      if (isEditMode) {
        await updatePortfolio({ id, ...form }).unwrap()
      } else {
        await createPortfolio(form).unwrap()
      }
      setSuccess(true)
      setTimeout(() => navigate('/portfolio'), 1200)
    } catch {
      setError(isEditMode ? 'Failed to update project. Please try again.' : 'Failed to add project. Please try again.')
    }
  }

  if (isEditMode && isLoadingItem) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">Loading project…</div>
  }

  return (
    <section className="min-h-screen py-12 md:py-16 px-4 md:px-6 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        to="/portfolio"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition mb-8 group"
      >
        <motion.span whileHover={{ x: -3 }} className="inline-block">
          <Icon name="FaArrowLeft" />
        </motion.span>
        Back to Portfolio
      </Link>

      <Reveal className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-emerald-100 dark:border-emerald-500/20">
          <Icon name={isEditMode ? 'FaPenToSquare' : 'FaPlus'} />
          {isEditMode ? 'Editing Project' : 'New Project'}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          {isEditMode ? 'Edit Portfolio Project' : 'Add a Portfolio Project'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {isEditMode ? 'Update the project details and save your changes.' : 'Showcase your work to clients and prospects.'}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
        >
          {FIELDS.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                {f.label} {f.required && <span className="text-red-400">*</span>}
              </label>
              <input
                id={f.id}
                type={f.type}
                value={form[f.id]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              />
            </div>
          ))}

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the project, challenges solved, technologies used…"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition resize-none"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-500 flex items-center gap-1.5"
              >
                <Icon name="FaXmark" /> {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-500 font-medium flex items-center gap-1.5"
              >
                <Icon name="FaCheck" /> {isEditMode ? 'Updated! Redirecting…' : 'Project added! Redirecting…'}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            variant="emerald"
            className="w-full py-3 rounded-xl text-sm"
            disabled={isSaving || success}
          >
            {isSaving ? (isEditMode ? 'Updating…' : 'Adding…') : (isEditMode ? 'Update Project' : 'Add Project')}
            <Icon name="FaBriefcase" className="text-xs" />
          </Button>
        </form>
      </Reveal>
    </section>
  )
}

export default AddPortfolioContainer