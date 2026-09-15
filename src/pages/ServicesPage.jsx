import { useEffect } from 'react'
import ProcessContainer from '../features/process/ProcessContainer.jsx'
import CarouselContainer from '../features/carousel/CarouselContainer.jsx'
import ServicesContainer from '../features/services/ServicesContainer.jsx'
import VideoReels from '../common/VideoReels.jsx'

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div>
      <ProcessContainer />
      <CarouselContainer />
      <ServicesContainer />
      <VideoReels />
    </div>
  )
}

export default ServicesPage
