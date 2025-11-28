import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import WhyUs from '@/components/home/WhyUs'
import HowItWorks from '@/components/home/HowItWorks'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BottomCTA from '@/components/home/BottomCTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <WhyUs />
      <HowItWorks />
      <FeaturedProducts />
      <BottomCTA />
    </div>
  )
}