'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRight } from 'lucide-react'

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

interface TheCalibrationProps {
  location: LocationData
  onBack: () => void
  onProceed: (calibration: CalibrationData) => void
}

const skillOptions = ['NOVICE', 'INTERMEDIATE', 'PRO', 'ELITE'] as const
const riskOptions = ['CHILL', 'ADVENTURE', 'EXTREME'] as const
const budgetOptions = ['ESSENTIAL', 'MID-RANGE', 'LUXE'] as const

export function TheCalibration({ location, onBack, onProceed }: TheCalibrationProps) {
  const [gridAnimated, setGridAnimated] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [gridFlicker, setGridFlicker] = useState(false)
  
  const [calibration, setCalibration] = useState<CalibrationData>({
    skillLevel: 'INTERMEDIATE',
    riskAppetite: 'ADVENTURE',
    budgetRange: 'MID-RANGE',
  })

  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    // Trigger grid growth animation
    const gridTimer = setTimeout(() => setGridAnimated(true), 100)
    const contentTimer = setTimeout(() => setContentVisible(true), 600)
    
    return () => {
      clearTimeout(gridTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  const handleSelectionChange = useCallback((
    field: keyof CalibrationData, 
    value: CalibrationData[keyof CalibrationData]
  ) => {
    setCalibration(prev => ({ ...prev, [field]: value }))
    
    // Trigger grid flicker
    setGridFlicker(true)
    setTimeout(() => setGridFlicker(false), 300)
    
    // Show recalculating status
    setIsRecalculating(true)
    const skillLabel = field === 'skillLevel' ? value : calibration.skillLevel
    setStatusMessage(`Recalculating safety indices and logistics for ${skillLabel} level...`)
    
    setTimeout(() => {
      setIsRecalculating(false)
      setStatusMessage('')
    }, 1500)
  }, [calibration.skillLevel])

  const handleProceed = () => {
    onProceed(calibration)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Grid Lines - Growing animation with flicker effect */}
      <div className={`absolute inset-0 z-10 pointer-events-none ${gridFlicker ? 'grid-flicker' : ''}`}>
        {/* Vertical lines */}
        <div 
          className="absolute top-0 bottom-0 left-1/4"
          style={{
            width: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center',
          }}
        />
        <div 
          className="absolute top-0 bottom-0 left-1/2"
          style={{
            width: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            transformOrigin: 'center',
          }}
        />
        <div 
          className="absolute top-0 bottom-0 left-3/4"
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
          className="absolute left-0 right-0 top-1/4"
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            transformOrigin: 'center',
          }}
        />
        <div 
          className="absolute left-0 right-0 top-1/2"
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            transformOrigin: 'center',
          }}
        />
        <div 
          className="absolute left-0 right-0 top-3/4"
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            transform: gridAnimated ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
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

      {/* Main Content - Calibration Console */}
      <div 
        className={`
          relative z-20 min-h-screen flex flex-col items-center justify-center px-6 md:px-10 py-24
          transition-all duration-1000
          ${contentVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Header - CALIBRATION */}
        <div className="text-center mb-12 md:mb-16">
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
            CALIBRATION
          </h1>
          <p 
            className="text-white/50 text-sm uppercase tracking-[0.15em]"
            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
          >
            Define your profile to refine the matrix.
          </p>
        </div>

        {/* Calibration Console */}
        <div className="w-full max-w-2xl space-y-10 md:space-y-12">
          
          {/* Section 1: Skill Level */}
          <div 
            className="space-y-4"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
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
              Skill Level
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectionChange('skillLevel', option)}
                  className={`
                    px-5 py-3 text-sm uppercase tracking-[0.1em] transition-all duration-300
                    ${calibration.skillLevel === option 
                      ? 'bg-white text-black' 
                      : 'bg-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }
                  `}
                  style={{
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    fontWeight: calibration.skillLevel === option ? 500 : 400,
                    border: calibration.skillLevel === option 
                      ? '0.5px solid rgba(255,255,255,1)' 
                      : '0.5px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Risk Appetite */}
          <div 
            className="space-y-4"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
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
              Risk Appetite
            </h3>
            <div className="flex flex-wrap gap-2">
              {riskOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectionChange('riskAppetite', option)}
                  className={`
                    px-5 py-3 text-sm uppercase tracking-[0.1em] transition-all duration-300
                    ${calibration.riskAppetite === option 
                      ? 'bg-white text-black' 
                      : 'bg-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }
                  `}
                  style={{
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    fontWeight: calibration.riskAppetite === option ? 500 : 400,
                    border: calibration.riskAppetite === option 
                      ? '0.5px solid rgba(255,255,255,1)' 
                      : '0.5px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Budget Range */}
          <div 
            className="space-y-4"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
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
              Budget Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectionChange('budgetRange', option)}
                  className={`
                    px-5 py-3 text-sm uppercase tracking-[0.1em] transition-all duration-300
                    ${calibration.budgetRange === option 
                      ? 'bg-white text-black' 
                      : 'bg-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }
                  `}
                  style={{
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    fontWeight: calibration.budgetRange === option ? 500 : 400,
                    border: calibration.budgetRange === option 
                      ? '0.5px solid rgba(255,255,255,1)' 
                      : '0.5px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* AI Status Message */}
          <div 
            className="h-6 flex items-center justify-center"
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {statusMessage && (
              <p 
                className={`
                  text-[10px] text-white/40 uppercase tracking-[0.1em] text-center
                  transition-opacity duration-300
                  ${isRecalculating ? 'opacity-100' : 'opacity-0'}
                `}
                style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
              >
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        {/* Proceed to Matrix Button */}
        <div 
          className="mt-12 md:mt-16"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <button
            onClick={handleProceed}
            className="
              inline-flex items-center gap-3 px-10 py-5
              text-white uppercase tracking-[0.2em] text-sm
              transition-all duration-300
              hover:bg-white/20
            "
            style={{
              fontFamily: "'Monument Grotesk', Arial, sans-serif",
              fontWeight: 400,
              border: '1px solid rgba(255,255,255,1)',
              backgroundColor: 'rgba(255,255,255,0.20)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            Proceed to Matrix
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Current destination indicator */}
        <div 
          className="absolute bottom-8 left-0 right-0 text-center"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}
        >
          <p 
            className="text-[10px] text-white/20 uppercase tracking-[0.2em]"
            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
          >
            Calibrating for {location.name}, {location.country}
          </p>
        </div>
      </div>
    </div>
  )
}
