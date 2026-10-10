import { useState, useEffect, useRef } from 'react'
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
  { id: 'link', label: 'Project URL', type: 'url', placeholder: 'https://…', required: false },
]

const AddPortfolioContainer = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const { data: existingItem, isLoading: isLoadingItem } = useGetPortfolioByIdQuery(id, { skip: !isEditMode })
  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation()
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation()
  const isSaving = isCreating || isUpdating

  const [form, setForm] = useState({ title: '', client: '', category: '', link: '', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Media states
  const [existingImages, setExistingImages] = useState([])
  const [existingVideos, setExistingVideos] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newVideos, setNewVideos] = useState([])
  
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  useEffect(() => {
    if (isEditMode && existingItem) {
      setForm({
        title: existingItem.title || '',
        client: existingItem.client || '',
        category: existingItem.category || '',
        link: existingItem.link || '',
        description: existingItem.description || '',
      })
      
      const images = []
      if (existingItem.images && existingItem.images.length > 0) {
        images.push(...existingItem.images)
      } else if (existingItem.image) {
        images.push(existingItem.image)
      }
      setExistingImages(images)
      setExistingVideos(existingItem.videos || [])
    }
  }, [isEditMode, existingItem])

  useEffect(() => {
    return () => {
      newImages.forEach(img => URL.revokeObjectURL(img.preview))
      newVideos.forEach(vid => URL.revokeObjectURL(vid.preview))
    }
  }, [newImages, newVideos])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }))

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    processImageFiles(files)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files)
    processVideoFiles(files)
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    processImageFiles(files)
  }

  const handleVideoDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    processVideoFiles(files)
  }

  const processImageFiles = (files) => {
    setError('')
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed in this section.')
    }
    
    const sizeValidFiles = validFiles.filter(file => file.size <= 10 * 1024 * 1024)
    if (sizeValidFiles.length !== validFiles.length) {
      setError(prev => prev + (prev ? ' ' : '') + 'Images must be <= 10MB.')
    }

    const totalImages = existingImages.length + newImages.length + sizeValidFiles.length
    if (totalImages > 10) {
      setError('Maximum 10 images total allowed.')
      return
    }

    const newPreviewFiles = sizeValidFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setNewImages(prev => [...prev, ...newPreviewFiles])
  }

  const processVideoFiles = (files) => {
    setError('')
    const validFiles = files.filter(file => file.type.startsWith('video/'))
    if (validFiles.length !== files.length) {
      setError('Only video files are allowed in this section.')
    }
    
    const sizeValidFiles = validFiles.filter(file => file.size <= 50 * 1024 * 1024)
    if (sizeValidFiles.length !== validFiles.length) {
      setError(prev => prev + (prev ? ' ' : '') + 'Videos must be <= 50MB.')
    }

    const totalVideos = existingVideos.length + newVideos.length + sizeValidFiles.length
    if (totalVideos > 2) {
      setError('Maximum 2 videos total allowed.')
      return
    }

    const newPreviewFiles = sizeValidFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    }))
    setNewVideos(prev => [...prev, ...newPreviewFiles])
  }

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages(prev => {
      const clone = [...prev]
      URL.revokeObjectURL(clone[index].preview)
      clone.splice(index, 1)
      return clone
    })
  }

  const setExistingAsCover = (index) => {
    if (index === 0) return
    setExistingImages(prev => {
      const clone = [...prev]
      const item = clone.splice(index, 1)[0]
      clone.unshift(item)
      return clone
    })
  }

  const removeExistingVideo = (index) => {
    setExistingVideos(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewVideo = (index) => {
    setNewVideos(prev => {
      const clone = [...prev]
      URL.revokeObjectURL(clone[index].preview)
      clone.splice(index, 1)
      return clone
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Project title is required.')
      return
    }
    
    const formData = new FormData()
    formData.append('title', form.title)
    if (form.client) formData.append('client', form.client)
    if (form.category) formData.append('category', form.category)
    if (form.link) formData.append('link', form.link)
    if (form.description) formData.append('description', form.description)
    
    if (isEditMode) {
      formData.append('existingImages', JSON.stringify(existingImages))
      formData.append('existingVideos', JSON.stringify(existingVideos))
    }
    
    newImages.forEach(img => {
      formData.append('images', img.file)
    })
    
    newVideos.forEach(vid => {
      formData.append('videos', vid.file)
    })

    try {
      if (isEditMode) {
        await updatePortfolio({ id, body: formData }).unwrap()
      } else {
        await createPortfolio(formData).unwrap()
      }
      setSuccess(true)
      setTimeout(() => navigate('/portfolio'), 1200)
    } catch (err) {
      setError(err?.data?.message || (isEditMode ? 'Failed to update project. Please try again.' : 'Failed to add project. Please try again.'))
    }
  }

  if (isEditMode && isLoadingItem) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">Loading project…</div>
  }

  return (
    <section className="min-h-screen py-12 md:py-16 px-4 md:px-6 max-w-2xl mx-auto">
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

          {/* Project Images Uploader */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">
                Project Images (Max 10)
              </label>
              <span className="text-xs text-gray-500">
                {existingImages.length + newImages.length} / 10
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {existingImages.map((img, i) => (
                <div key={`ext-img-${i}`} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 group aspect-square bg-slate-100 dark:bg-slate-700">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Cover</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    {i !== 0 && (
                      <button type="button" onClick={() => setExistingAsCover(i)} className="text-[10px] bg-white text-slate-900 px-2 py-1 rounded font-semibold transition hover:bg-gray-200">Set Cover</button>
                    )}
                    <button type="button" onClick={() => removeExistingImage(i)} className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"><Icon name="FaXmark" /></button>
                  </div>
                </div>
              ))}
              
              {newImages.map((img, i) => (
                <div key={`new-img-${i}`} className="relative rounded-xl overflow-hidden border border-emerald-500/50 group aspect-square bg-slate-100 dark:bg-slate-700">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {existingImages.length === 0 && i === 0 && (
                    <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Cover</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-sm">
                    <button type="button" onClick={() => removeNewImage(i)} className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"><Icon name="FaXmark" /></button>
                  </div>
                </div>
              ))}
              
              {existingImages.length + newImages.length < 10 && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  onClick={() => imageInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition cursor-pointer aspect-square p-2 text-center bg-gray-50 dark:bg-slate-700/50"
                >
                  <Icon name="FaPlus" className="text-xl mb-1" />
                  <span className="text-[10px]">Add Image</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" multiple className="hidden" ref={imageInputRef} onChange={handleImageChange} />
          </div>
          
          {/* Project Videos Uploader */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">
                Project Videos (Max 2, 50MB each)
              </label>
              <span className="text-xs text-gray-500">
                {existingVideos.length + newVideos.length} / 2
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              {existingVideos.map((vid, i) => (
                <div key={`ext-vid-${i}`} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-xl border border-gray-200 dark:border-slate-600">
                  <div className="w-16 h-12 bg-black rounded-lg overflow-hidden shrink-0">
                    <video src={vid} preload="metadata" muted className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs text-slate-700 dark:text-gray-300 truncate">Existing Video {i + 1}</p>
                  </div>
                  <button type="button" onClick={() => removeExistingVideo(i)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition"><Icon name="FaTrash" /></button>
                </div>
              ))}
              
              {newVideos.map((vid, i) => (
                <div key={`new-vid-${i}`} className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-500/10 p-2 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                  <div className="w-16 h-12 bg-black rounded-lg overflow-hidden shrink-0">
                    <video src={vid.preview} preload="metadata" muted className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs text-slate-700 dark:text-gray-300 truncate">{vid.name}</p>
                    <p className="text-[10px] text-gray-500">{vid.size}</p>
                  </div>
                  <button type="button" onClick={() => removeNewVideo(i)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition"><Icon name="FaTrash" /></button>
                </div>
              ))}
              
              {existingVideos.length + newVideos.length < 2 && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleVideoDrop}
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition bg-gray-50 dark:bg-slate-700/50"
                >
                  <Icon name="FaVideo" className="text-xl text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-slate-700 dark:text-gray-300">Click or drag video to upload</p>
                </div>
              )}
            </div>
            <input type="file" accept="video/*" multiple className="hidden" ref={videoInputRef} onChange={handleVideoChange} />
          </div>

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
                className="text-xs text-red-500 flex items-start gap-1.5 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg"
              >
                <Icon name="FaXmark" className="mt-0.5 shrink-0" /> <span>{error}</span>
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
            {isSaving && (
                <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-blue-500 font-medium flex items-center gap-1.5"
              >
                <Icon name="FaCloudArrowUp" className="animate-pulse" /> Uploading… please wait, don't close this page.
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            variant="emerald"
            className="w-full py-3 rounded-xl text-sm"
            disabled={isSaving || success}
          >
            {isSaving ? (isEditMode ? 'Updating…' : 'Uploading…') : (isEditMode ? 'Update Project' : 'Add Project')}
            <Icon name="FaBriefcase" className="text-xs" />
          </Button>
        </form>
      </Reveal>
    </section>
  )
}

export default AddPortfolioContainer