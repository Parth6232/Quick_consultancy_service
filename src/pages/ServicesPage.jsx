import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const queryServiceId = searchParams.get('service')

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  // Sync URL query -> Redux
  useEffect(() => {
    if (queryServiceId) {
      if (SERVICES.some(s => s.id === queryServiceId)) {
        dispatch(openService(queryServiceId))
      } else {
        // Invalid ID in URL
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('service')
        setSearchParams(newParams, { replace: true })
      }
    } else {
      dispatch(closeService())
    }
  }, [queryServiceId, dispatch, searchParams, setSearchParams])

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('service')
    setSearchParams(newParams, { replace: true })
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
