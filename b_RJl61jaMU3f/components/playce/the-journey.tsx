'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { jsPDF } from 'jspdf'

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

interface TheJourneyProps {
  location: LocationData
  calibration: CalibrationData
  onBack: () => void
  onSave: () => void
}

interface ChatMessage {
  role: 'ai' | 'user'
  content: string
}

interface ItineraryActivity {
  time: string
  name: string
  price: string
  status: string
  transport?: string
}

interface ItineraryDay {
  day: number
  title: string
  activities: ItineraryActivity[]
}

// Generate dynamic itinerary based on calibration
function generateItinerary(location: LocationData, calibration: CalibrationData): ItineraryDay[] {
  const { skillLevel, riskAppetite, budgetRange } = calibration

  const getTransport = () => {
    if (budgetRange === 'LUXE') return 'Private Transfer'
    if (budgetRange === 'MID-RANGE') return 'Scooter'
    return 'Shuttle'
  }

  const getAccommodation = () => {
    if (budgetRange === 'LUXE') return { name: 'Uluwatu Surf Villas', price: '$450' }
    if (budgetRange === 'MID-RANGE') return { name: 'The Slow Boutique', price: '$120' }
    return { name: 'Padang Hostel', price: '$25' }
  }

  const accom = getAccommodation()

  return [
    {
      day: 1,
      title: 'Arrival & Orientation',
      activities: [
        { time: '14:00', name: 'Airport Arrival', price: 'Included', status: 'Confirmed' },
        { time: '15:30', name: `Transfer to ${accom.name}`, price: budgetRange === 'LUXE' ? '$85' : budgetRange === 'MID-RANGE' ? '$25' : '$8', status: 'Best Value', transport: getTransport() },
        { time: '17:00', name: 'Check-in & Equipment Setup', price: accom.price + '/night', status: 'Reserved' },
        { time: '18:30', name: riskAppetite === 'CHILL' ? 'Sunset Beach Walk' : 'Evening Recon Session', price: 'Free', status: 'Open', transport: '10min Walk' },
        { time: '20:00', name: budgetRange === 'LUXE' ? 'Welcome Dinner at Kaum' : 'Local Warung Dinner', price: budgetRange === 'LUXE' ? '$85' : '$8', status: 'Open' },
      ],
    },
    {
      day: 2,
      title: 'First Sessions',
      activities: [
        { time: '05:30', name: skillLevel === 'NOVICE' ? 'Morning Lesson' : 'Dawn Patrol Session', price: skillLevel === 'NOVICE' ? '$80' : 'Included', status: 'Optimal Conditions' },
        { time: '08:00', name: 'Breakfast', price: budgetRange === 'LUXE' ? '$25' : '$5', status: 'Open', transport: '5min Walk' },
        { time: '10:00', name: 'Mid-morning Rest', price: 'Free', status: 'Recovery' },
        { time: '14:00', name: riskAppetite === 'EXTREME' ? 'Advanced Spot Exploration' : 'Beginner-Friendly Afternoon', price: skillLevel === 'NOVICE' ? '$80' : 'Included', status: 'Avoid 2PM Crowds', transport: '15min ' + getTransport() },
        { time: '18:00', name: 'Sunset Session', price: 'Included', status: 'Prime Time' },
      ],
    },
    {
      day: 3,
      title: 'Deep Exploration',
      activities: [
        { time: '05:00', name: 'Early Morning Prime Conditions', price: 'Included', status: 'Best Conditions' },
        { time: '08:30', name: 'Breakfast & Rest', price: budgetRange === 'LUXE' ? '$25' : '$5', status: 'Open' },
        { time: '11:00', name: budgetRange === 'LUXE' ? 'Spa & Recovery Session' : 'Local Market Exploration', price: budgetRange === 'LUXE' ? '$150' : 'Free', status: budgetRange === 'LUXE' ? 'Reservations' : 'Open', transport: '20min ' + getTransport() },
        { time: '15:00', name: riskAppetite === 'EXTREME' ? 'Remote Reef Expedition' : 'Main Break Session', price: riskAppetite === 'EXTREME' ? '$120' : 'Included', status: riskAppetite === 'EXTREME' ? 'Guide Required' : 'Open' },
        { time: '19:00', name: budgetRange === 'LUXE' ? 'Single Fin Sunset Bar' : 'Beach Warung', price: budgetRange === 'LUXE' ? '$45' : '$12', status: 'Open' },
      ],
    },
    {
      day: 4,
      title: 'Cultural Integration',
      activities: [
        { time: '07:00', name: 'Light Morning Session', price: 'Included', status: 'Recovery Day' },
        { time: '09:30', name: 'Breakfast', price: budgetRange === 'LUXE' ? '$25' : '$5', status: 'Open' },
        { time: '11:00', name: 'Temple Visit (Uluwatu)', price: '$5', status: 'Cultural', transport: '25min ' + getTransport() },
        { time: '14:00', name: 'Local Culture & Craft', price: budgetRange === 'LUXE' ? '$80' : '$15', status: 'Experience' },
        { time: '19:00', name: budgetRange === 'LUXE' ? 'Fine Dining at The Lawn' : 'Night Market Food Tour', price: budgetRange === 'LUXE' ? '$120' : '$15', status: budgetRange === 'LUXE' ? 'Reservations Required' : 'Open' },
      ],
    },
    {
      day: 5,
      title: 'Final Sessions & Departure',
      activities: [
        { time: '05:30', name: 'Sunrise Farewell Session', price: 'Included', status: 'Last Session' },
        { time: '08:00', name: 'Final Breakfast', price: budgetRange === 'LUXE' ? '$25' : '$5', status: 'Open' },
        { time: '10:00', name: 'Pack & Checkout', price: 'N/A', status: 'Checkout' },
        { time: '12:00', name: 'Airport Transfer', price: budgetRange === 'LUXE' ? '$85' : budgetRange === 'MID-RANGE' ? '$25' : '$8', status: 'Confirmed', transport: getTransport() },
        { time: '15:00', name: 'Departure', price: 'N/A', status: 'Flight' },
      ],
    },
  ]
}

// Generate market comparison data
function generateMarketComparison(calibration: CalibrationData) {
  const { budgetRange } = calibration

  const accommodation = budgetRange === 'LUXE'
    ? {
        name: 'Uluwatu Surf Villas',
        sources: [
          { name: 'Direct', price: '$405', badge: 'Best Rate' },
          { name: 'Booking.com', price: '$450', badge: null },
          { name: 'Airbnb', price: '$480', badge: null },
        ],
      }
    : budgetRange === 'MID-RANGE'
    ? {
        name: 'The Slow Boutique',
        sources: [
          { name: 'Direct', price: '$108', badge: 'Best Rate' },
          { name: 'Booking.com', price: '$120', badge: null },
          { name: 'Agoda', price: '$115', badge: null },
        ],
      }
    : {
        name: 'Padang Padang Hostel',
        sources: [
          { name: 'Hostelworld', price: '$22', badge: 'Best Rate' },
          { name: 'Booking.com', price: '$25', badge: null },
          { name: 'Direct', price: '$25', badge: null },
        ],
      }

  const transport = budgetRange === 'LUXE'
    ? {
        name: 'Airport Transfer',
        sources: [
          { name: 'Direct (Villa)', price: '$75', badge: 'Includes Meet & Greet' },
          { name: 'Grab', price: '$45', badge: null },
          { name: 'Klook', price: '$55', badge: null },
        ],
      }
    : {
        name: 'Airport Shuttle',
        sources: [
          { name: 'Perama', price: '$8', badge: 'Best Value' },
          { name: 'Kura-Kura', price: '$12', badge: null },
          { name: 'Grab', price: '$25', badge: 'Private' },
        ],
      }

  return { accommodation, transport }
}

// Gear checklist based on activity and skill
function generateGearChecklist(location: LocationData, calibration: CalibrationData) {
  const { skillLevel } = calibration
  const isSurfing = location.activity.toLowerCase().includes('surf')

  if (isSurfing) {
    return [
      { item: 'Board', action: skillLevel === 'ELITE' || skillLevel === 'PRO' ? 'Bring' : 'Rent', checked: false },
      { item: 'Wetsuit', action: 'Rent', checked: false },
      { item: 'Zinc Sunscreen', action: 'Bring', checked: true },
      { item: 'Reef Booties', action: 'Bring', checked: false },
      { item: 'Leash', action: skillLevel === 'ELITE' || skillLevel === 'PRO' ? 'Bring' : 'Rent', checked: false },
      { item: 'Wax', action: 'Buy Local', checked: false },
    ]
  }

  return [
    { item: 'Equipment', action: 'Rent', checked: false },
    { item: 'Sun Protection', action: 'Bring', checked: true },
    { item: 'First Aid Kit', action: 'Bring', checked: false },
    { item: 'Water Bottle', action: 'Bring', checked: true },
  ]
}

export function TheJourney({ location, calibration, onBack, onSave }: TheJourneyProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: `I've optimized your ${calibration.budgetRange.toLowerCase()} itinerary for ${location.name}. Day 2 is scheduled for a morning session to avoid the 2 PM peak crowds. Ferry prices compared: Direct booking saves 15% vs. platforms.`,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [gearChecklist, setGearChecklist] = useState(() => generateGearChecklist(location, calibration))
  const [isExporting, setIsExporting] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const itinerary = useMemo(() => generateItinerary(location, calibration), [location, calibration])
  const marketComparison = useMemo(() => generateMarketComparison(calibration), [calibration])

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        `Noted. I've adjusted the itinerary based on your preferences. The ${calibration.skillLevel.toLowerCase()} sessions are now optimized for ${location.conditions.waves || location.conditions.temp} conditions.`,
        `Good point. I've found an alternative route that saves 20 minutes on Day 3. The scooter rental near the accommodation offers better rates than airport pickup.`,
        `I've updated the dining reservations. The local spot I recommended has a 4.8 rating and is popular with ${calibration.riskAppetite === 'CHILL' ? 'relaxed travelers' : 'adventure seekers'}.`,
        `Weather update: ${location.conditions.temp} expected throughout your stay. I've scheduled outdoor activities during optimal windows.`,
      ]
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const toggleGearItem = (index: number) => {
    setGearChecklist(prev =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    )
  }

  const handleExportPDF = async () => {
    setIsExporting(true)

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      let yPosition = margin

      // Helper functions
      const addText = (text: string, x: number, y: number, options: { size?: number; style?: string; color?: number } = {}) => {
        const { size = 10, style = 'normal', color = 0 } = options
        pdf.setFontSize(size)
        pdf.setFont('helvetica', style)
        pdf.setTextColor(color)
        pdf.text(text, x, y)
        return y + (size * 0.4)
      }

      const addLine = (y: number) => {
        pdf.setDrawColor(200)
        pdf.setLineWidth(0.1)
        pdf.line(margin, y, pageWidth - margin, y)
        return y + 5
      }

      // Header
      addText('PLAYCE', margin, yPosition, { size: 8, style: 'normal', color: 150 })
      addText('JOURNEY ITINERARY', pageWidth - margin - 40, yPosition, { size: 8, style: 'normal', color: 150 })
      yPosition += 15

      // Location Title
      yPosition = addText(location.name.toUpperCase(), margin, yPosition, { size: 28, style: 'normal', color: 0 })
      yPosition += 3
      yPosition = addText(`${location.country} — ${location.activity}`, margin, yPosition, { size: 10, style: 'normal', color: 100 })
      yPosition += 2
      yPosition = addText(`${location.season} — ${calibration.budgetRange}`, margin, yPosition, { size: 9, style: 'normal', color: 150 })
      yPosition += 8
      yPosition = addLine(yPosition)
      yPosition += 5

      // Profile Summary
      addText('TRAVELER PROFILE', margin, yPosition, { size: 8, style: 'bold', color: 100 })
      yPosition += 6
      addText(`Skill Level: ${calibration.skillLevel}`, margin, yPosition, { size: 9, color: 50 })
      addText(`Risk Appetite: ${calibration.riskAppetite}`, margin + 50, yPosition, { size: 9, color: 50 })
      addText(`Budget: ${calibration.budgetRange}`, margin + 105, yPosition, { size: 9, color: 50 })
      yPosition += 10
      yPosition = addLine(yPosition)
      yPosition += 8

      // Itinerary
      for (const day of itinerary) {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage()
          yPosition = margin
        }

        addText(`DAY ${day.day.toString().padStart(2, '0')}`, margin, yPosition, { size: 12, style: 'bold', color: 0 })
        addText(day.title, margin + 20, yPosition, { size: 10, style: 'normal', color: 80 })
        yPosition += 8

        for (const activity of day.activities) {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = margin
          }

          addText(activity.time, margin, yPosition, { size: 8, style: 'normal', color: 120 })
          addText(activity.name, margin + 18, yPosition, { size: 9, style: 'normal', color: 30 })
          addText(activity.price, pageWidth - margin - 30, yPosition, { size: 8, style: 'normal', color: 80 })
          addText(activity.status, pageWidth - margin - 10, yPosition, { size: 7, style: 'normal', color: 130 })
          yPosition += 5

          if (activity.transport) {
            addText(`↳ ${activity.transport}`, margin + 18, yPosition, { size: 7, style: 'italic', color: 150 })
            yPosition += 4
          }
        }
        yPosition += 6
      }

      // Gear Checklist
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = margin
      }

      yPosition = addLine(yPosition)
      yPosition += 5
      addText('GEAR CHECKLIST', margin, yPosition, { size: 8, style: 'bold', color: 100 })
      yPosition += 6

      gearChecklist.forEach((gear) => {
        const checkmark = gear.checked ? '[x]' : '[ ]'
        addText(`${checkmark} ${gear.item} (${gear.action})`, margin, yPosition, { size: 9, color: gear.checked ? 100 : 50 })
        yPosition += 5
      })

      // Market Comparison
      yPosition += 5
      yPosition = addLine(yPosition)
      yPosition += 5
      addText('MARKET COMPARISON', margin, yPosition, { size: 8, style: 'bold', color: 100 })
      yPosition += 6

      addText(`${marketComparison.accommodation.name}`, margin, yPosition, { size: 9, style: 'normal', color: 30 })
      yPosition += 5
      marketComparison.accommodation.sources.forEach((source) => {
        const badgeText = source.badge ? ` — ${source.badge}` : ''
        addText(`${source.name}: ${source.price}${badgeText}`, margin + 5, yPosition, { size: 8, color: source.badge ? 50 : 100 })
        yPosition += 4
      })

      // Footer
      yPosition = pageHeight - 15
      pdf.setDrawColor(220)
      pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5)
      addText('Generated by Playce AI', margin, yPosition, { size: 7, style: 'normal', color: 150 })
      addText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin - 35, yPosition, { size: 7, style: 'normal', color: 150 })

      // Save PDF
      pdf.save(`playce-${location.name.toLowerCase().replace(/\s+/g, '-')}-journey.pdf`)
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
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

      {/* Main Split-Screen Layout */}
      <div 
        className="flex flex-col lg:flex-row h-screen pt-16"
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Left Panel: AI Advisor (40%) */}
        <div 
          className="w-full lg:w-[40%] h-[40vh] lg:h-full flex flex-col"
          style={{ borderRight: '0.5px solid rgba(255,255,255,0.08)' }}
        >
          {/* Panel Header */}
          <div className="px-6 py-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
            <h2 
              className="text-xs text-white/40 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
            >
              AI Strategic Advisor
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 ${message.role === 'user' ? 'bg-white/10' : 'bg-transparent'}`}
                  style={{ 
                    border: message.role === 'ai' ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
                    borderRadius: '2px',
                  }}
                >
                  {message.role === 'ai' && (
                    <p 
                      className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-2"
                      style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                    >
                      Playce AI
                    </p>
                  )}
                  <p 
                    className="text-sm text-white/80 leading-relaxed"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
                  >
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="px-6 py-4" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Refine your journey..."
                className="flex-1 bg-transparent text-white/80 placeholder-white/30 text-sm outline-none"
                style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
              />
              <button
                onClick={handleSendMessage}
                className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Master Itinerary (60%) */}
        <div className="w-full lg:w-[60%] h-[60vh] lg:h-full flex flex-col overflow-hidden">
          {/* Itinerary Header */}
          <div className="px-6 py-6 lg:py-8" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
            <h1 
              className="text-white mb-2"
              style={{ 
                fontFamily: "'Editorial New', Georgia, serif", 
                fontWeight: 100,
                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {location.name}
            </h1>
            <p 
              className="text-white/40 text-xs uppercase tracking-[0.15em]"
              style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
            >
              {location.country} — {itinerary.length} Days — {calibration.budgetRange}
            </p>
          </div>

          {/* Scrollable Itinerary Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-32">
            {/* Day Timeline */}
            {itinerary.map((day) => (
              <div key={day.day} className="py-6" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                {/* Day Header */}
                <div className="flex items-baseline gap-4 mb-4">
                  <span 
                    className="text-white text-lg"
                    style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}
                  >
                    DAY {day.day.toString().padStart(2, '0')}
                  </span>
                  <span 
                    className="text-white/50 text-sm"
                    style={{ fontFamily: "'Editorial New', Georgia, serif", fontWeight: 100 }}
                  >
                    {day.title}
                  </span>
                </div>

                {/* Activities */}
                <div className="space-y-3 pl-2">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex}>
                      <div className="flex items-start gap-4">
                        {/* Time */}
                        <span 
                          className="text-white/40 text-xs w-12 flex-shrink-0"
                          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                        >
                          {activity.time}
                        </span>

                        {/* Activity Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span 
                              className="text-white/90 text-sm"
                              style={{ fontFamily: "'Editorial New', Georgia, serif", fontWeight: 300 }}
                            >
                              {activity.name}
                            </span>
                            <span 
                              className="text-white/50 text-xs flex-shrink-0"
                              style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                            >
                              {activity.price}
                            </span>
                          </div>
                          <span 
                            className="text-white/30 text-[10px] uppercase tracking-[0.1em]"
                            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>

                      {/* Transport Node */}
                      {activity.transport && (
                        <div className="flex items-center gap-4 mt-2 ml-12">
                          <div className="w-[1px] h-3 bg-white/10" />
                          <span 
                            className="text-white/25 text-[10px] uppercase tracking-[0.1em]"
                            style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                          >
                            {activity.transport}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Gear Check Section */}
            <div className="py-6" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <h3 
                className="text-xs text-white/30 uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
              >
                Gear Check
              </h3>
              <div className="flex flex-wrap gap-3">
                {gearChecklist.map((gear, index) => (
                  <button
                    key={index}
                    onClick={() => toggleGearItem(index)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-all ${
                      gear.checked 
                        ? 'bg-white/10 text-white/80' 
                        : 'bg-transparent text-white/40'
                    }`}
                    style={{ 
                      fontFamily: "'Monument Grotesk', Arial, sans-serif",
                      border: '0.5px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {gear.checked ? '[x]' : '[ ]'} {gear.item} ({gear.action})
                  </button>
                ))}
              </div>
            </div>

            {/* Market Comparison Section */}
            <div className="py-6" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <h3 
                className="text-xs text-white/30 uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
              >
                Market Comparison
              </h3>

              {/* Accommodation */}
              <div className="mb-4">
                <p 
                  className="text-sm text-white/70 mb-2"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                >
                  {marketComparison.accommodation.name}
                </p>
                <div className="flex flex-wrap gap-4">
                  {marketComparison.accommodation.sources.map((source, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span 
                        className="text-xs text-white/40"
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                      >
                        {source.name}:
                      </span>
                      <span 
                        className={`text-sm ${source.badge ? 'text-white/90' : 'text-white/50'}`}
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                      >
                        {source.price}
                      </span>
                      {source.badge && (
                        <span 
                          className="text-[10px] text-white/40 uppercase tracking-[0.1em]"
                          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                        >
                          {source.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div>
                <p 
                  className="text-sm text-white/70 mb-2"
                  style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                >
                  {marketComparison.transport.name}
                </p>
                <div className="flex flex-wrap gap-4">
                  {marketComparison.transport.sources.map((source, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span 
                        className="text-xs text-white/40"
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                      >
                        {source.name}:
                      </span>
                      <span 
                        className={`text-sm ${source.badge ? 'text-white/90' : 'text-white/50'}`}
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                      >
                        {source.price}
                      </span>
                      {source.badge && (
                        <span 
                          className="text-[10px] text-white/40 uppercase tracking-[0.1em]"
                          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                        >
                          {source.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="py-6">
              <h3 
                className="text-xs text-white/30 uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400 }}
              >
                External Links
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(location.name + ' ' + location.country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs text-white/60 hover:text-white uppercase tracking-[0.15em] transition-colors"
                  style={{ 
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    border: '0.5px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Google Maps
                </a>
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs text-white/60 hover:text-white uppercase tracking-[0.15em] transition-colors"
                  style={{ 
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    border: '0.5px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Booking.com
                </a>
                <a
                  href={`https://www.airbnb.com/s/${encodeURIComponent(location.name)}/homes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs text-white/60 hover:text-white uppercase tracking-[0.15em] transition-colors"
                  style={{ 
                    fontFamily: "'Monument Grotesk', Arial, sans-serif",
                    border: '0.5px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Airbnb
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 md:px-10 md:py-5 flex items-center justify-between gap-4 bg-black/80"
        style={{ 
          borderTop: '0.5px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Secondary Action */}
        <button
          onClick={onSave}
          className="px-6 py-3 text-xs text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors"
          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
        >
          Save to Account
        </button>

        {/* Primary CTA */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="px-8 py-3 text-sm text-white uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            fontFamily: "'Monument Grotesk', Arial, sans-serif",
            border: '1px solid rgba(255,255,255,0.8)',
          }}
        >
          {isExporting ? 'Exporting...' : 'Export PDF Journey'}
        </button>
      </div>
    </div>
  )
}
