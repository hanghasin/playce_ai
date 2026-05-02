'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LocationData {
  name: string
  country: string
  activity: string
  season: string
  difficulty: string
  vibe: string
  image: string
  // Matrix-specific data
  womenFriendly: number // 0-100
  soloIndex: number // 0-100
  logistics: string[] // e.g., ['AIRPORT', 'SHUTTLE', 'BASE']
  facilities: { name: string; available: boolean }[]
  conditions: {
    temp: string
    waves?: string
    snow?: string
    visibility?: string
  }
}

interface TheMatrixProps {
  location: LocationData
  onBack: () => void
  onConfirm: () => void
}

export function TheMatrix({ location, onBack, onConfirm }: TheMatrixProps) {
  const [gridAnimated, setGridAnimated] = useState(false)
  const [modulesVisible, setModulesVisible] = useState(false)

  useEffect(() => {
    // Trigger grid growth animation
    const gridTimer = setTimeout(() => setGridAnimated(true), 100)
    const modulesTimer = setTimeout(() => setModulesVisible(true), 800)
    
    return () => {
      clearTimeout(gridTimer)
      clearTimeout(modulesTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Video - 95% blurred */}
      <div className="absolute inset-0 z-0">
        <Image
          src={location.image}
          alt={location.name}
          fill
          className="object-cover"
          style={{
            filter: 'blur(60px) saturate(1.2)',
            opacity: 0.15,
          }}
          priority
        />
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Grid Lines - Growing animation from center */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Vertical lines */}
        <div 
          className="absolute top-0 bottom-0 left-1/3"
          style={{
            width: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center',
          }}
        />
        <div 
          className="absolute top-0 bottom-0 left-2/3"
          style={{
            width: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            transformOrigin: 'center',
          }}
        />
        {/* Horizontal lines */}
        <div 
          className="absolute left-0 right-0 top-1/3"
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            transformOrigin: 'center',
          }}
        />
        <div 
          className="absolute left-0 right-0 top-2/3"
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            transformOrigin: 'center',
          }}
        />
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
          relative z-20 min-h-screen pt-24 pb-32 px-6 md:px-10
          transition-all duration-1000
          ${modulesVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Location Header - Massive Editorial New */}
        <div className="mb-12 md:mb-16">
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
              fontSize: 'clamp(3rem, 12vw, 8rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            {location.name}
          </h1>
          <p 
            className="text-white/50 text-sm uppercase tracking-[0.15em]"
            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            {location.season} — {location.difficulty}
          </p>
        </div>

        {/* Content Modules - 6 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-6xl">
          
          {/* Module 1: Vibe - Progress bars */}
          <div 
            className="space-y-6"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
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
              Vibe Index
            </h3>
            
            {/* Women-Friendly Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span 
                  className="text-sm text-white/70 uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                >
                  Women-Friendly
                </span>
                <span 
                  className="text-lg text-white"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                >
                  {location.womenFriendly}%
                </span>
              </div>
              <div 
                className="h-[1px] bg-white/10 relative overflow-hidden"
                style={{ border: '0.5px solid rgba(255,255,255,0.05)' }}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/60"
                  style={{ 
                    width: `${location.womenFriendly}%`,
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                  }}
                />
              </div>
            </div>

            {/* Solo Index Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span 
                  className="text-sm text-white/70 uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                >
                  Solo Index
                </span>
                <span 
                  className="text-lg text-white"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                >
                  {location.soloIndex}%
                </span>
              </div>
              <div 
                className="h-[1px] bg-white/10 relative overflow-hidden"
                style={{ border: '0.5px solid rgba(255,255,255,0.05)' }}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/60"
                  style={{ 
                    width: `${location.soloIndex}%`,
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Module 2: Logistics */}
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
              Logistics
            </h3>
            <p 
              className="text-white/80 uppercase tracking-[0.05em] text-base leading-relaxed"
              style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
            >
              {location.logistics.join(' → ')}
            </p>
          </div>

          {/* Module 3: Facilities */}
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
              Facilities
            </h3>
            <ul className="space-y-2">
              {location.facilities.map((facility, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-3 text-white/70"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                >
                  <span className="text-xs">
                    [ {facility.available ? 'x' : ' '} ]
                  </span>
                  <span className="text-sm uppercase tracking-[0.05em]">
                    {facility.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Module 4: Conditions - Large numeric data */}
          <div 
            className="md:col-span-3 mt-8"
            style={{
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
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
              {/* Temperature */}
              <div>
                <p 
                  className="text-5xl md:text-6xl text-white mb-2"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                >
                  {location.conditions.temp}
                </p>
                <p 
                  className="text-xs text-white/40 uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                >
                  Temperature
                </p>
              </div>
              
              {/* Waves (if applicable) */}
              {location.conditions.waves && (
                <div>
                  <p 
                    className="text-5xl md:text-6xl text-white mb-2"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                  >
                    {location.conditions.waves}
                  </p>
                  <p 
                    className="text-xs text-white/40 uppercase tracking-[0.15em]"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                  >
                    Wave Height
                  </p>
                </div>
              )}
              
              {/* Snow (if applicable) */}
              {location.conditions.snow && (
                <div>
                  <p 
                    className="text-5xl md:text-6xl text-white mb-2"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                  >
                    {location.conditions.snow}
                  </p>
                  <p 
                    className="text-xs text-white/40 uppercase tracking-[0.15em]"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                  >
                    Snow Depth
                  </p>
                </div>
              )}
              
              {/* Visibility (if applicable) */}
              {location.conditions.visibility && (
                <div>
                  <p 
                    className="text-5xl md:text-6xl text-white mb-2"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
                  >
                    {location.conditions.visibility}
                  </p>
                  <p 
                    className="text-xs text-white/40 uppercase tracking-[0.15em]"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                  >
                    Visibility
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button - Fixed bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-6 md:p-10"
        style={{
          opacity: modulesVisible ? 1 : 0,
          transform: modulesVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
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
          Confirm This Move
        </button>
      </div>
    </div>
  )
}
