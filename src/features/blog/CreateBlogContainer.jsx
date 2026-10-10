import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateBlogMutation, useUpdateBlogMutation, useGetBlogByIdQuery } from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal.jsx'
import Button from '../../common/Button.jsx'
import Icon from '../../utils/iconMap.jsx'

const FIELDS = [
  { id: 'title', label: 'Post Title', type: 'text', placeholder: 'e.g. Top 5 Tax-Saving Strategies for 2025', required: true },
  { id: 'author', label: 'Author Name', type: 'text', placeholder: 'e.g. QCS Editorial Team', required: false },
]

const CreateBlogContainer = () => {
  const navigate = useNavigate()
  const { id } = useParams() // route /blog/edit/:id se aata hai; create par undefined rehta hai
  const isEditMode = !!id

  const { data: existingPost, isLoading: isLoadingPost } = useGetBlogByIdQuery(id, { skip: !isEditMode })
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const isSaving = isCreating || isUpdating

  const [form, setForm] = useState({ title: '', author: '', content: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Image states
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [removeImage, setRemoveImage] = useState(false)
  
  const fileInputRef = useRef(null)

  // Edit mode mein existing post load hote hi form prefill karo
  useEffect(() => {
    if (isEditMode && existingPost) {
      setForm({
        title: existingPost.title || '',
        author: existingPost.author || '',
        content: existingPost.content || '',
      })
      if (existingPost.image) {
        setImagePreview(existingPost.image)
        setRemoveImage(false)
      }
    }
  }, [isEditMode, existingPost])

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imageFile && imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imageFile, imagePreview])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }))

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    processFile(file)
  }
  
  const processFile = (file) => {
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB.')
      return
    }
    if (imageFile && imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  const handleRemoveImage = () => {
    if (imageFile && imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview('')
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and Content are required.')
      return
    }

    const formData = new FormData()
    formData.append('title', form.title)
    if (form.author) formData.append('author', form.author)
    formData.append('content', form.content)
    
    if (imageFile) {
      formData.append('image', imageFile)
    } else if (removeImage) {
      formData.append('removeImage', 'true')
    }

    try {
      if (isEditMode) {
        await updateBlog({ id, body: formData }).unwrap()
        setSuccess(true)
        setTimeout(() => navigate(`/blog/${id}`), 1200)
      } else {
        await createBlog(formData).unwrap()
        setSuccess(true)
        setTimeout(() => navigate('/blog'), 1200)
      }
    } catch (err) {
      setError(err?.data?.message || (isEditMode ? 'Failed to update. Please try again.' : 'Failed to publish. Please try again.'))
    }
  }

  if (isEditMode && isLoadingPost) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">Loading post…</div>
  }

  return (
    <section className="min-h-screen py-12 md:py-16 px-4 md:px-6 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        to={isEditMode ? `/blog/${id}` : '/blog'}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-8 group"
      >
        <motion.span whileHover={{ x: -3 }} className="inline-block">
          <Icon name="FaArrowLeft" />
        </motion.span>
        Back to Blog
      </Link>

      <Reveal className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-blue-100 dark:border-blue-500/20">
          <Icon name={isEditMode ? 'FaPenToSquare' : 'FaPlus'} />
          {isEditMode ? 'Editing Post' : 'New Post'}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          {isEditMode ? 'Edit Blog Post' : 'Write a Blog Post'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {isEditMode ? 'Update the details below and save your changes.' : 'Share your expertise with our audience.'}
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
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>
          ))}

          {/* Cover Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              Cover Image (Max 10MB)
            </label>
            {!imagePreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition bg-gray-50 dark:bg-slate-700/50"
              >
                <Icon name="FaCloudArrowUp" className="text-3xl text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-gray-300">Click or drag image to upload</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPEG, PNG, WEBP</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-600 group w-full max-w-sm mx-auto">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold hover:bg-gray-100 transition"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              rows={10}
              value={form.content}
              onChange={handleChange}
              placeholder="Write your article here…"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
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
                <Icon name="FaCheck" /> {isEditMode ? 'Updated! Redirecting…' : 'Published! Redirecting…'}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 rounded-xl text-sm"
            disabled={isSaving || success}
          >
            {isSaving ? (isEditMode ? 'Updating…' : 'Uploading & Publishing…') : (isEditMode ? 'Update Post' : 'Publish Post')}
            <Icon name="FaPaperPlane" className="text-xs" />
          </Button>
        </form>
      </Reveal>
    </section>
  )
}

export default CreateBlogContainer