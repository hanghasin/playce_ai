'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'

interface LocationData {
  name: string
  country: string
  activity: string
  season: string
  difficulty: string
  vibe: string
  image: string
  womenFriendly: number
  soloIndex: number
  logistics: string[]
  facilities: { name: string; available: boolean }[]
  conditions: {
    temp: string
    waves?: string
    snow?: string
    visibility?: string
  }
}

interface CalibrationData {
  skillLevel: 'NOVICE' | 'INTERMEDIATE' | 'PRO' | 'ELITE'
  riskAppetite: 'CHILL' | 'ADVENTURE' | 'EXTREME'
  budgetRange: 'ESSENTIAL' | 'MID-RANGE' | 'LUXE'
}

interface TheMatrixProps {
  location: LocationData
  calibration: CalibrationData
  onBack: () => void
  onConfirm: () => void
}

// Dynamic content generation based on calibration
function generateDynamicContent(location: LocationData, calibration: CalibrationData) {
  const { skillLevel, riskAppetite, budgetRange } = calibration

  // Female-Friendly Tips based on location and skill
  const femaleFriendlyTips = {
    safety: location.womenFriendly >= 80 
      ? 'Highly recommended for solo female travelers. Strong local community support.'
      : location.womenFriendly >= 60
      ? 'Generally safe. Recommended to connect with local female groups.'
      : 'Exercise standard precautions. Travel with companions recommended.',
    community: skillLevel === 'NOVICE' || skillLevel === 'INTERMEDIATE'
      ? 'Active women-only beginner groups available locally.'
      : 'Professional female athlete network present.',
    accommodation: budgetRange === 'LUXE'
      ? 'Women-only spa retreats and boutique hotels available.'
      : budgetRange === 'MID-RANGE'
      ? 'Female-friendly hostels with dedicated floors.'
      : 'Community guesthouses with strong safety ratings.',
  }

  // Logistics based on location
  const internationalAccess = [
    `Nearest Airport: ${location.country === 'Indonesia' ? 'DPS (Ngurah Rai)' : location.country === 'Japan' ? 'NRT (Narita)' : 'LAX (Los Angeles)'}`,
    budgetRange === 'LUXE' ? 'Private transfers available' : 'Shuttle services from airport',
    `Visa: ${location.country === 'Indonesia' ? 'Visa on arrival (30 days)' : location.country === 'Japan' ? 'Visa-free (90 days)' : 'ESTA required'}`,
  ]

  const localTransport = budgetRange === 'LUXE'
    ? ['Private driver', 'Helicopter transfers', 'Luxury SUV rental']
    : budgetRange === 'MID-RANGE'
    ? ['Scooter rental', 'Ride-share apps', 'Local shuttles']
    : ['Public buses', 'Shared vans', 'Walking distance spots']

  // Experiences based on skill and risk
  const experiences = riskAppetite === 'EXTREME'
    ? [
        { name: 'Night sessions', status: 'Available', risk: 'High' },
        { name: 'Remote reef exploration', status: 'Guide required', risk: 'High' },
        { name: 'Competition training', status: 'Pro coaches on-site', risk: 'Medium' },
      ]
    : riskAppetite === 'ADVENTURE'
    ? [
        { name: 'Sunrise sessions', status: 'Available', risk: 'Low' },
        { name: 'Guided excursions', status: 'Daily', risk: 'Medium' },
        { name: 'Local culture immersion', status: 'Recommended', risk: 'Low' },
      ]
    : [
        { name: 'Beginner lessons', status: 'Available', risk: 'Low' },
        { name: 'Beach yoga', status: 'Daily 7AM', risk: 'None' },
        { name: 'Photography tours', status: 'Weekends', risk: 'Low' },
      ]

  // Dining based on budget
  const dining = budgetRange === 'LUXE'
    ? [
        { name: 'Kaum Restaurant', type: 'Fine Dining', status: 'Open', price: '$$$' },
        { name: 'Single Fin', type: 'Sunset Bar', status: 'Open', price: '$$' },
        { name: 'The Lawn', type: 'Beach Club', status: 'Reservations', price: '$$$' },
      ]
    : budgetRange === 'MID-RANGE'
    ? [
        { name: 'Drifter Surf Shop Cafe', type: 'Casual', status: 'Open', price: '$$' },
        { name: 'Bukit Cafe', type: 'Local Fusion', status: 'Open', price: '$$' },
        { name: 'The Cashew Tree', type: 'Organic', status: 'Open', price: '$$' },
      ]
    : [
        { name: 'Warung Local', type: 'Street Food', status: 'Open', price: '$' },
        { name: 'Night Market', type: 'Local', status: '6PM-11PM', price: '$' },
        { name: 'Beach Warungs', type: 'Casual', status: 'Open', price: '$' },
      ]

  // Accommodation based on budget
  const accommodation = budgetRange === 'LUXE'
    ? { type: 'Private Villa', name: 'Uluwatu Surf Villas', price: '$450/night' }
    : budgetRange === 'MID-RANGE'
    ? { type: 'Boutique Hotel', name: 'The Slow', price: '$120/night' }
    : { type: 'Surf Hostel', name: 'Padang Padang Hostel', price: '$25/night' }

  // Pricing estimates
  const pricing = {
    daily: budgetRange === 'LUXE' ? '$500+' : budgetRange === 'MID-RANGE' ? '$150-300' : '$50-100',
    equipment: skillLevel === 'ELITE' || skillLevel === 'PRO' 
      ? 'Bring own equipment recommended' 
      : 'Rental included in most packages',
    lessons: skillLevel === 'NOVICE' 
      ? '$80-150/session' 
      : skillLevel === 'INTERMEDIATE' 
      ? '$120-200/session (intermediate coaching)'
      : 'Private coaching available',
  }

  // Itinerary based on all factors
  const itinerary = [
    {
      day: 1,
      title: 'Arrival & Orientation',
      activities: [
        budgetRange === 'LUXE' ? 'Private airport transfer to villa' : 'Shuttle to accommodation',
        'Equipment check and setup',
        riskAppetite === 'CHILL' ? 'Sunset beach walk' : 'Evening reconnaissance session',
      ],
    },
    {
      day: 2,
      title: 'First Sessions',
      activities: [
        skillLevel === 'NOVICE' ? 'Morning lesson with instructor' : 'Dawn patrol session',
        'Mid-day rest and exploration',
        riskAppetite === 'EXTREME' ? 'Afternoon advanced spot' : 'Beginner-friendly afternoon session',
      ],
    },
    {
      day: 3,
      title: 'Deep Exploration',
      activities: [
        'Early morning prime conditions',
        budgetRange === 'LUXE' ? 'Spa and recovery' : 'Local market exploration',
        riskAppetite === 'ADVENTURE' || riskAppetite === 'EXTREME' 
          ? 'Remote spot expedition' 
          : 'Sunset session at main break',
      ],
    },
    {
      day: 4,
      title: 'Cultural Integration',
      activities: [
        'Rest day or light session',
        'Temple visit and local culture',
        budgetRange === 'LUXE' ? 'Fine dining experience' : 'Local food tour',
      ],
    },
    {
      day: 5,
      title: 'Final Sessions & Departure',
      activities: [
        'Sunrise farewell session',
        'Pack and checkout',
        budgetRange === 'LUXE' ? 'Private transfer to airport' : 'Shuttle to airport',
      ],
    },
  ]

  return {
    femaleFriendlyTips,
    internationalAccess,
    localTransport,
    experiences,
    dining,
    accommodation,
    pricing,
    itinerary,
  }
}

export function TheMatrix({ location, calibration, onBack, onConfirm }: TheMatrixProps) {
  const [gridAnimated, setGridAnimated] = useState(false)
  const [modulesVisible, setModulesVisible] = useState(false)
  const [expandedDays, setExpandedDays] = useState<number[]>([1])

  const dynamicContent = useMemo(
    () => generateDynamicContent(location, calibration),
    [location, calibration]
  )

  useEffect(() => {
    const gridTimer = setTimeout(() => setGridAnimated(true), 100)
    const modulesTimer = setTimeout(() => setModulesVisible(true), 800)
    
    return () => {
      clearTimeout(gridTimer)
      clearTimeout(modulesTimer)
    }
  }, [])

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Hero Background Image with gradient mask */}
      <div className="absolute inset-0 z-0">
        <Image
          src={location.image}
          alt={location.name}
          fill
          className="object-cover object-center"
          style={{
            opacity: 0.35,
          }}
          priority
        />
        {/* Bottom-to-top gradient mask */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.1) 100%)',
          }}
        />
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Grid Lines */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Vertical lines - 4 columns */}
        {[1/4, 1/2, 3/4].map((pos, i) => (
          <div 
            key={`v-${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${pos * 100}%`,
              width: '0.5px',
              background: 'rgba(255,255,255,0.06)',
              transform: gridAnimated ? 'scaleY(1)' : 'scaleY(0)',
              transition: `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
              transformOrigin: 'center',
            }}
          />
        ))}
        {/* Horizontal lines */}
        {[1/5, 2/5, 3/5, 4/5].map((pos, i) => (
          <div 
            key={`h-${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${pos * 100}%`,
              height: '0.5px',
              background: 'rgba(255,255,255,0.06)',
              transform: gridAnimated ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.05}s`,
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors uppercase tracking-[0.3em] text-sm"
          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
        >
          Back
        </button>
        <span 
          className="text-lg tracking-[0.3em] text-white/80 uppercase"
          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
        >
          Playce
        </span>
      </header>

      {/* Main Content */}
      <div 
        className={`
          relative z-20 min-h-screen pt-24 pb-40 px-6 md:px-10
          transition-all duration-1000
          ${modulesVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Location Header */}
        <div className="mb-10 md:mb-14">
          <p 
            className="text-xs text-white/40 uppercase tracking-[0.2em] mb-3"
            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
          >
            {location.activity} — {location.country}
          </p>
          <h1 
            className="text-white mb-4"
            style={{ 
              fontFamily: "'Editorial New', Georgia, serif", 
              fontWeight: 100,
              fontSize: 'clamp(2.5rem, 10vw, 6rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            {location.name}
          </h1>
          <p 
            className="text-white/50 text-sm uppercase tracking-[0.15em]"
            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
          >
            {location.season} — {location.difficulty} — {calibration.budgetRange}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6 max-w-7xl">
          
          {/* Module 1: Vibe Index (Extended) */}
          <div 
            className="space-y-6"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
          >
            <h3 
              className="text-[11px] text-white/40 uppercase pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 500,
                letterSpacing: '0.1em',
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              VIBE INDEX
            </h3>
            
            {/* Women-Friendly */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70 uppercase tracking-[0.1em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Women-Friendly
                </span>
                <span className="text-lg text-white" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                  {location.womenFriendly}%
                </span>
              </div>
              <div className="h-[1px] bg-white/10 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/60"
                  style={{ width: `${location.womenFriendly}%`, transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' }}
                />
              </div>
            </div>

            {/* Solo Index */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70 uppercase tracking-[0.1em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Solo Index
                </span>
                <span className="text-lg text-white" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                  {location.soloIndex}%
                </span>
              </div>
              <div className="h-[1px] bg-white/10 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/60"
                  style={{ width: `${location.soloIndex}%`, transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s' }}
                />
              </div>
            </div>

            {/* Vibe description */}
            <p 
              className="text-[14px] text-white/50"
              style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400, lineHeight: 1.6 }}
            >
              {location.vibe}
            </p>
          </div>

          {/* Module 2: Female-Friendly Tips */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}
          >
            <h3 
              className="text-[11px] text-white/40 uppercase pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 500,
                letterSpacing: '0.1em',
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              FEMALE-FRIENDLY TIPS
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Safety
                </p>
                <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  {dynamicContent.femaleFriendlyTips.safety}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Community
                </p>
                <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  {dynamicContent.femaleFriendlyTips.community}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Accommodation
                </p>
                <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  {dynamicContent.femaleFriendlyTips.accommodation}
                </p>
              </div>
            </div>
          </div>

          {/* Module 3: International Access */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              International Access
            </h3>
            <ul className="space-y-2">
              {dynamicContent.internationalAccess.map((item, index) => (
                <li 
                  key={index}
                  className="text-sm text-white/70 leading-relaxed"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Module 4: Local Transportation */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Local Transportation
            </h3>
            <ul className="space-y-2">
              {dynamicContent.localTransport.map((item, index) => (
                <li 
                  key={index}
                  className="text-sm text-white/70"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Module 5: Must-Try Experiences */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Must-Try Experiences
            </h3>
            <ul className="space-y-3">
              {dynamicContent.experiences.map((exp, index) => (
                <li key={index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-white/80 uppercase tracking-[0.05em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                      {exp.name}
                    </span>
                    <span className="text-[10px] text-white/40" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                      {exp.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                    {exp.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Module 6: Top-Rated Dining */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Top-Rated Dining
            </h3>
            <ul className="space-y-3">
              {dynamicContent.dining.map((place, index) => (
                <li key={index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-white/80" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                      {place.name}
                    </span>
                    <span className="text-[10px] text-white/40" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                      {place.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-white/50" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                      {place.type}
                    </span>
                    <span 
                      className={`text-[10px] uppercase tracking-[0.1em] ${place.status === 'Open' ? 'text-white/60' : 'text-white/40'}`}
                      style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                    >
                      {place.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Module 7: Pricing */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Pricing Estimate
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-2xl text-white mb-1" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                  {dynamicContent.pricing.daily}
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.1em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Daily Budget
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/60" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  {dynamicContent.pricing.equipment}
                </p>
                <p className="text-sm text-white/60" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  {dynamicContent.pricing.lessons}
                </p>
              </div>
            </div>
          </div>

          {/* Module 8: Accommodation */}
          <div 
            className="space-y-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Recommended Stay
            </h3>
            <div className="space-y-2">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.1em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                {dynamicContent.accommodation.type}
              </p>
              <p className="text-lg text-white/80" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}>
                {dynamicContent.accommodation.name}
              </p>
              <p className="text-sm text-white/60" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                {dynamicContent.accommodation.price}
              </p>
            </div>
          </div>

          {/* Module 9: Current Conditions - Full width */}
          <div 
            className="md:col-span-3 lg:col-span-4 mt-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3 mb-6"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Current Conditions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              <div>
                <p className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                  {location.conditions.temp}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-[0.15em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                  Temperature
                </p>
              </div>
              {location.conditions.waves && (
                <div>
                  <p className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                    {location.conditions.waves}
                  </p>
                  <p className="text-xs text-white/40 uppercase tracking-[0.15em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                    Wave Height
                  </p>
                </div>
              )}
              {location.conditions.snow && (
                <div>
                  <p className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                    {location.conditions.snow}
                  </p>
                  <p className="text-xs text-white/40 uppercase tracking-[0.15em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                    Snow Depth
                  </p>
                </div>
              )}
              {location.conditions.visibility && (
                <div>
                  <p className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}>
                    {location.conditions.visibility}
                  </p>
                  <p className="text-xs text-white/40 uppercase tracking-[0.15em]" style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}>
                    Visibility
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Module 10: External Links */}
          <div 
            className="md:col-span-3 lg:col-span-4 mt-4"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3 mb-4"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              External Resources
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(location.name + ' ' + location.country)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-sm text-white/70 uppercase tracking-[0.1em] transition-all duration-300 hover:text-white hover:bg-white/5"
                style={{
                  fontFamily: "'Monument Grotesk', Arial, sans-serif",
                  fontWeight: 400,
                  border: '0.5px solid rgba(255,255,255,0.3)',
                }}
              >
                Google Maps
              </a>
              <a
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location.name + ' ' + location.country)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-sm text-white/70 uppercase tracking-[0.1em] transition-all duration-300 hover:text-white hover:bg-white/5"
                style={{
                  fontFamily: "'Monument Grotesk', Arial, sans-serif",
                  fontWeight: 400,
                  border: '0.5px solid rgba(255,255,255,0.3)',
                }}
              >
                Booking.com
              </a>
              <a
                href={`https://www.airbnb.com/s/${encodeURIComponent(location.name + '--' + location.country)}/homes`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-sm text-white/70 uppercase tracking-[0.1em] transition-all duration-300 hover:text-white hover:bg-white/5"
                style={{
                  fontFamily: "'Monument Grotesk', Arial, sans-serif",
                  fontWeight: 400,
                  border: '0.5px solid rgba(255,255,255,0.3)',
                }}
              >
                Airbnb
              </a>
            </div>
          </div>

          {/* Module 11: Itinerary Preview */}
          <div 
            className="md:col-span-3 lg:col-span-4 mt-6"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
            }}
          >
            <h3 
              className="text-xs text-white/30 uppercase tracking-[0.2em] pb-3 mb-6"
              style={{ 
                fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                fontWeight: 400,
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              Suggested Itinerary
            </h3>
            <div className="space-y-2">
              {dynamicContent.itinerary.map((day) => (
                <div 
                  key={day.day}
                  className="border-b border-white/5"
                >
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full flex items-center justify-between py-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-baseline gap-6">
                      <span 
                        className="text-2xl text-white/80"
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                      >
                        Day {day.day}
                      </span>
                      <span 
                        className="text-sm text-white/50 uppercase tracking-[0.1em]"
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                      >
                        {day.title}
                      </span>
                    </div>
                    <span 
                      className="text-white/40 text-sm"
                      style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                    >
                      {expandedDays.includes(day.day) ? '[ - ]' : '[ + ]'}
                    </span>
                  </button>
                  {expandedDays.includes(day.day) && (
                    <div className="pb-4 pl-12 md:pl-20 space-y-2">
                      {day.activities.map((activity, index) => (
                        <p 
                          key={index}
                          className="text-sm text-white/60"
                          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                        >
                          {activity}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button - Fixed bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-6 md:p-10 bg-gradient-to-t from-black via-black/80 to-transparent"
        style={{
          opacity: modulesVisible ? 1 : 0,
          transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
        }}
      >
        <button
          onClick={onConfirm}
          className="
            w-full md:w-auto md:min-w-[400px] md:mx-auto md:block
            py-5 px-12
            text-white uppercase tracking-[0.2em] text-sm
            transition-all duration-300
            hover:bg-white/20
          "
          style={{
            fontFamily: "'Monument Grotesk', Arial, sans-serif",
            fontWeight: 400,
            border: '1px solid rgba(255,255,255,1)',
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          Plan My Journey
        </button>
      </div>
    </div>
  )
}
