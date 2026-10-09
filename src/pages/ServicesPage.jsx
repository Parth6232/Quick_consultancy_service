import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProcessContainer from '../features/process/ProcessContainer.jsx'
import CarouselContainer from '../features/carousel/CarouselContainer.jsx'
import ServicesContainer from '../features/services/ServicesContainer.jsx'
import VideoReels from '../common/VideoReels.jsx'
import ServiceDetailPanel from '../common/ServiceDetailPanel.jsx'
import { openService, closeService } from '../store/redux/slices/servicesSlice.js'
import { SERVICES } from '../constant/siteData.js'

const ServicesPage = () => {
  const dispatch = useDispatch()
  const activeServiceId = useSelector((state) => state.services.activeServiceId)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryServiceId = searchParams.get('service')

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  // Check backward compatibility for ?service=...
  useEffect(() => {
    if (queryServiceId) {
      if (SERVICES.some(s => s.id === queryServiceId)) {
        dispatch(openService(queryServiceId))
      }
      navigate('/services', { replace: true })
    }
  }, [queryServiceId, dispatch, navigate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(closeService())
    }
  }, [dispatch])

  const handleClose = () => {
    dispatch(closeService())
  }

  return (
    <div>
      <ProcessContainer />
      <CarouselContainer />
      <ServicesContainer />
      <VideoReels />

      <ServiceDetailPanel 
        serviceId={activeServiceId} 
        onClose={handleClose} 
      />
    </div>
  )
}

export default ServicesPage
