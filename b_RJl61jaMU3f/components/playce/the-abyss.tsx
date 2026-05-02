'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

interface TheAbyssProps {
  onSubmit: (query: string) => void
}

const placeholders = [
  "I want to relax in Bali with some light surfing...",
  "Looking for alpine climbing somewhere remote...",
  "A peaceful yoga retreat by the ocean...",
  "Mountain biking through ancient forests...",
  "Diving with manta rays in clear waters...",
]

const suggestions = [
  "Surf trip in Portugal",
  "Alpine climbing in Chamonix", 
  "Yoga retreat by the sea",
]

export function TheAbyss({ onSubmit }: TheAbyssProps) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isMouseInViewport, setIsMouseInViewport] = useState(false)
  const [query, setQuery] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayPlaceholder, setDisplayPlaceholder] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle mouse movement for spotlight
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    setMousePos({ x, y })
    if (!isMouseInViewport) {
      setIsMouseInViewport(true)
    }
  }, [isMouseInViewport])

  // Handle touch movement
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.touches[0].clientX - rect.left) / rect.width
    const y = (e.touches[0].clientY - rect.top) / rect.height
    
    setMousePos({ x, y })
    if (!isMouseInViewport) {
      setIsMouseInViewport(true)
    }
  }, [isMouseInViewport])

  // Handle mouse leave - spotlight fades to opacity 0
  const handleMouseLeave = useCallback(() => {
    setIsMouseInViewport(false)
  }, [])

  // Handle mouse enter
  const handleMouseEnter = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
    setIsMouseInViewport(true)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchstart', handleTouchMove)
    container.addEventListener('touchend', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchstart', handleTouchMove)
      container.removeEventListener('touchend', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, handleTouchMove])

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentPlaceholder = placeholders[placeholderIndex]
    let charIndex = 0
    let timeout: NodeJS.Timeout

    if (isTyping) {
      const typeChar = () => {
        if (charIndex <= currentPlaceholder.length) {
          setDisplayPlaceholder(currentPlaceholder.slice(0, charIndex))
          charIndex++
          timeout = setTimeout(typeChar, 50)
        } else {
          setTimeout(() => setIsTyping(false), 2000)
        }
      }
      typeChar()
    } else {
      const deleteChar = () => {
        if (charIndex > 0) {
          charIndex--
          setDisplayPlaceholder(currentPlaceholder.slice(0, charIndex))
          timeout = setTimeout(deleteChar, 30)
        } else {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
          setIsTyping(true)
        }
      }
      charIndex = currentPlaceholder.length
      deleteChar()
    }

    return () => clearTimeout(timeout)
  }, [placeholderIndex, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSubmit(suggestion)
  }

  const spotlightX = mousePos.x * 100
  const spotlightY = mousePos.y * 100

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden cursor-none bg-black"
    >
      {/* Layer 1: Video - bottom layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover saturate-[1.2] contrast-[1.1]"
          poster="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&q=80"
        >
          <source 
            src="https://player.vimeo.com/external/370467553.hd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bdb11546&profile_id=174&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Layer 2: Spotlight overlay - small focused 120px light source, opacity 0 when mouse leaves */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: isMouseInViewport ? 1 : 0,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle 120px at ${spotlightX}% ${spotlightY}%, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.9) 80%, black 100%)`,
          }}
        />
      </div>

      {/* Layer 2b: Solid black overlay when mouse is not in viewport */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none bg-black transition-opacity duration-500 ease-out"
        style={{
          opacity: isMouseInViewport ? 0 : 1,
        }}
      />

      {/* Layer 3: Content - z-50, always 100% white and readable */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4 md:px-8 pointer-events-none">
        {/* Logo - PLAYCE */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 pointer-events-auto">
          <span 
            className="text-sm md:text-base text-white uppercase"
            style={{ 
              fontFamily: "'Monument Grotesk', Arial, sans-serif",
              fontWeight: 400,
              letterSpacing: '0.25em',
            }}
          >
            Playce
          </span>
        </div>

        {/* Hero Content */}
        <div className="text-center w-full max-w-5xl mx-auto">
          {/* Main Headline - Editorial New, thin, 5.5vw, single line */}
          <h1 
            className="text-white leading-[1] mb-6 md:mb-8 whitespace-nowrap"
            style={{ 
              fontSize: '5.5vw',
              fontWeight: 100,
              fontFamily: "'Editorial New', 'PP Editorial New', Georgia, serif",
              letterSpacing: '-0.02em',
            }}
          >
            Find what moves you.
          </h1>

          {/* Subtitle - Monument Grotesk, tight letter-spacing */}
          <p 
            className="uppercase text-xs md:text-sm text-white/60 mb-12 md:mb-16 whitespace-nowrap"
            style={{ 
              letterSpacing: '0.4em',
              fontFamily: "'Monument Grotesk', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            Not more choices. Just the one.
          </p>

          {/* Premium Search Card with backdrop-blur: 25px */}
          <div className="w-full max-w-2xl mx-auto pointer-events-auto">
            <div 
              className="rounded-2xl p-4 md:p-5 transition-all duration-300"
              style={{
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                backgroundColor: 'rgba(15, 15, 15, 0.75)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
              }}
            >
              <form onSubmit={handleSubmit}>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={displayPlaceholder}
                  rows={2}
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/30 resize-none mb-4 leading-relaxed"
                  style={{ 
                    caretColor: 'white',
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                
                {/* Bottom Bar */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 text-sm"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                  >
                    <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                    <span style={{ fontWeight: 300 }}>Get Inspired</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-black text-sm transition-all duration-200 hover:opacity-90"
                    style={{
                      fontFamily: "'Monument Grotesk', Arial, sans-serif",
                      fontWeight: 500,
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 100%)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span>Discover</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </form>
            </div>

            {/* Suggestion Pills - ultra-thin 0.5px borders */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 rounded-full text-xs text-white/50 hover:text-white/80 transition-all duration-200 hover:bg-white/5"
                  style={{
                    border: '0.5px solid rgba(255, 255, 255, 0.15)',
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p 
            className="text-[10px] md:text-xs text-white/20 tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
          >
            Move to explore
          </p>
        </div>
      </div>

      {/* Custom cursor */}
      <div 
        className="fixed w-4 h-4 border border-white/40 rounded-full pointer-events-none z-[100] hidden md:block transition-opacity duration-300"
        style={{
          left: `calc(${mousePos.x * 100}% - 8px)`,
          top: `calc(${mousePos.y * 100}% - 8px)`,
          opacity: isMouseInViewport ? 1 : 0,
        }}
      />
    </div>
  )
}
