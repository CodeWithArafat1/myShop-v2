
import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import FeaturesSection from '@/components/FeaturesSection'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/shared/Navbar'
import TestimonialsSection from '@/components/TestimonialsSection'
import React from 'react'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection/>
      <CategorySection/>
      <FeaturedProducts/>
      <TestimonialsSection/>
    </div>
  )
}

export default Home