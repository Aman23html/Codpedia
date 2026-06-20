import React from 'react'
import Hero from './landing/Hero'
import WhoWeAre from './landing/WhoWeAre'
import EcosystemTree from './landing/EcosystemTree'
import AreasOfImpact from './landing/ImpactAreas'
import WhyChooseUs from './landing/WhyChooseUs'

function Homepage() {
  return (
    <div>
      <Hero/>
      <WhoWeAre />
      {/* <EcosystemTree /> */}
      <AreasOfImpact />
      <WhyChooseUs />
    </div>
  )
}

export default Homepage
