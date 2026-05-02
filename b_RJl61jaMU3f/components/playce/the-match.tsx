'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface Activity {
  id: string
  title: string
  subtitle: string
  image: string
  locations: Location[]
}

interface Location {
  id: string
  name: string
  country: string
  season: string
  difficulty: string
  vibe: string
  image: string
  // Matrix page data
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

const activities: Activity[] = [
  {
    id: 'surf',
    title: 'Surf',
    subtitle: 'Dawn patrol',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    locations: [
      {
        id: 'bali',
        name: 'Uluwatu',
        country: 'Bali, Indonesia',
        season: 'APR — OCT',
        difficulty: 'Intermediate',
        vibe: 'Spiritual, Raw',
        image: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=1200&q=90',
        womenFriendly: 85,
        soloIndex: 92,
        logistics: ['NGURAH RAI AIRPORT', 'TAXI 45MIN', 'ULUWATU CLIFF'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Hot Showers', available: true },
          { name: 'Café', available: true },
          { name: 'Surf School', available: true },
        ],
        conditions: { temp: '28°C', waves: '6-8ft' },
      },
      {
        id: 'portugal',
        name: 'Nazaré',
        country: 'Portugal',
        season: 'OCT — MAR',
        difficulty: 'Expert Only',
        vibe: 'Adrenaline, Epic',
        image: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1200&q=90',
        womenFriendly: 70,
        soloIndex: 65,
        logistics: ['LISBON AIRPORT', 'RENTAL CAR 90MIN', 'PRAIA DO NORTE'],
        facilities: [
          { name: 'Pro-Rental', available: false },
          { name: 'Hot Showers', available: true },
          { name: 'Café', available: true },
          { name: 'Medical', available: true },
        ],
        conditions: { temp: '14°C', waves: '30-80ft' },
      },
      {
        id: 'hawaii',
        name: 'Pipeline',
        country: 'Oahu, Hawaii',
        season: 'NOV — FEB',
        difficulty: 'Professional',
        vibe: 'Legendary, Intense',
        image: 'https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?w=1200&q=90',
        womenFriendly: 75,
        soloIndex: 80,
        logistics: ['HONOLULU AIRPORT', 'SHUTTLE 60MIN', 'NORTH SHORE'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Hot Showers', available: true },
          { name: 'Café', available: true },
          { name: 'Lifeguard', available: true },
        ],
        conditions: { temp: '26°C', waves: '10-15ft' },
      },
    ],
  },
  {
    id: 'climb',
    title: 'Climb',
    subtitle: 'High altitude',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80',
    locations: [
      {
        id: 'fontaine',
        name: 'Fontainebleau',
        country: 'France',
        season: 'YEAR-ROUND',
        difficulty: 'All Levels',
        vibe: 'Classic, Zen',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=90',
        womenFriendly: 95,
        soloIndex: 90,
        logistics: ['PARIS CDG', 'TRAIN 45MIN', 'FOREST SECTOR'],
        facilities: [
          { name: 'Crash Pads', available: true },
          { name: 'Café', available: true },
          { name: 'Guidebook', available: true },
        ],
        conditions: { temp: '18°C' },
      },
      {
        id: 'bishop',
        name: 'Bishop',
        country: 'California, USA',
        season: 'OCT — MAY',
        difficulty: 'Intermediate+',
        vibe: 'Desert, Meditative',
        image: 'https://images.unsplash.com/photo-1516592673884-4a382d1124c3?w=1200&q=90',
        womenFriendly: 80,
        soloIndex: 85,
        logistics: ['LAX AIRPORT', 'RENTAL CAR 4HR', 'BUTTERMILKS'],
        facilities: [
          { name: 'Crash Pads', available: true },
          { name: 'Hot Springs', available: true },
          { name: 'Gear Shop', available: true },
        ],
        conditions: { temp: '22°C' },
      },
      {
        id: 'rocklands',
        name: 'Rocklands',
        country: 'South Africa',
        season: 'JUN — SEP',
        difficulty: 'Advanced',
        vibe: 'Remote, Wild',
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=90',
        womenFriendly: 70,
        soloIndex: 60,
        logistics: ['CAPE TOWN AIRPORT', 'RENTAL CAR 3HR', 'CEDERBERG'],
        facilities: [
          { name: 'Camping', available: true },
          { name: 'Café', available: false },
          { name: 'Gear Rental', available: false },
        ],
        conditions: { temp: '16°C' },
      },
    ],
  },
  {
    id: 'dive',
    title: 'Dive',
    subtitle: 'Deep blue',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    locations: [
      {
        id: 'maldives',
        name: 'Maldives',
        country: 'Indian Ocean',
        season: 'NOV — APR',
        difficulty: 'Intermediate',
        vibe: 'Paradise, Serene',
        image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=90',
        womenFriendly: 95,
        soloIndex: 88,
        logistics: ['MALÉ AIRPORT', 'SEAPLANE 30MIN', 'RESORT REEF'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Hot Showers', available: true },
          { name: 'Spa', available: true },
          { name: 'Dive School', available: true },
        ],
        conditions: { temp: '29°C', visibility: '30m+' },
      },
      {
        id: 'raja',
        name: 'Raja Ampat',
        country: 'Indonesia',
        season: 'OCT — APR',
        difficulty: 'All Levels',
        vibe: 'Pristine, Magical',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=90',
        womenFriendly: 80,
        soloIndex: 75,
        logistics: ['SORONG AIRPORT', 'FERRY 2HR', 'HOMESTAY'],
        facilities: [
          { name: 'Gear Rental', available: true },
          { name: 'Hot Showers', available: false },
          { name: 'Basic Café', available: true },
        ],
        conditions: { temp: '28°C', visibility: '25m+' },
      },
      {
        id: 'cenotes',
        name: 'Cenotes',
        country: 'Yucatán, Mexico',
        season: 'YEAR-ROUND',
        difficulty: 'Advanced',
        vibe: 'Mystical, Ancient',
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=90',
        womenFriendly: 85,
        soloIndex: 80,
        logistics: ['CANCUN AIRPORT', 'RENTAL CAR 90MIN', 'CENOTE SYSTEM'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Hot Showers', available: true },
          { name: 'Cave Guide', available: true },
        ],
        conditions: { temp: '24°C', visibility: '100m+' },
      },
    ],
  },
  {
    id: 'ski',
    title: 'Ski',
    subtitle: 'Powder days',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
    locations: [
      {
        id: 'chamonix',
        name: 'Chamonix',
        country: 'French Alps',
        season: 'DEC — APR',
        difficulty: 'Expert',
        vibe: 'Alpine, Majestic',
        image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&q=90',
        womenFriendly: 80,
        soloIndex: 75,
        logistics: ['GENEVA AIRPORT', 'SHUTTLE 90MIN', 'MONT BLANC VALLEY'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Hot Showers', available: true },
          { name: 'Café', available: true },
          { name: 'Ski School', available: true },
        ],
        conditions: { temp: '-5°C', snow: '180cm' },
      },
      {
        id: 'niseko',
        name: 'Niseko',
        country: 'Hokkaido, Japan',
        season: 'DEC — MAR',
        difficulty: 'All Levels',
        vibe: 'Powder, Culture',
        image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&q=90',
        womenFriendly: 90,
        soloIndex: 85,
        logistics: ['NEW CHITOSE AIRPORT', 'BUS 2.5HR', 'HIRAFU VILLAGE'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Onsen', available: true },
          { name: 'Ramen', available: true },
          { name: 'Night Skiing', available: true },
        ],
        conditions: { temp: '-8°C', snow: '400cm' },
      },
      {
        id: 'whistler',
        name: 'Whistler',
        country: 'British Columbia',
        season: 'NOV — MAY',
        difficulty: 'Intermediate+',
        vibe: 'Vast, Adventure',
        image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1200&q=90',
        womenFriendly: 88,
        soloIndex: 82,
        logistics: ['VANCOUVER AIRPORT', 'SEA TO SKY HWY 2HR', 'WHISTLER VILLAGE'],
        facilities: [
          { name: 'Pro-Rental', available: true },
          { name: 'Hot Tubs', available: true },
          { name: 'Après-Ski', available: true },
          { name: 'Heli-Skiing', available: true },
        ],
        conditions: { temp: '-3°C', snow: '250cm' },
      },
    ],
  },
]

interface MatrixLocationData {
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

interface TheMatchProps {
  searchQuery: string
  onBack: () => void
  onViewDetails: (location: MatrixLocationData) => void
}

export function TheMatch({ searchQuery, onBack, onViewDetails }: TheMatchProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  const handleActivityClick = (activityId: string) => {
    if (selectedActivity === activityId) {
      setSelectedActivity(null)
    } else {
      setSelectedActivity(activityId)
    }
  }

  const selectedActivityData = activities.find(a => a.id === selectedActivity)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-8 md:py-5 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-lg tracking-[0.3em] text-white/80 hover:text-white transition-colors uppercase"
          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 300 }}
        >
          Playce
        </button>
        <p 
          className="text-[10px] text-white/30 tracking-[0.2em] uppercase hidden md:block"
          style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
        >
          {searchQuery.slice(0, 40)}{searchQuery.length > 40 ? '...' : ''}
        </p>
      </header>

      {/* Main Content Area */}
      <div className={`pt-20 transition-all duration-700 ${selectedActivity ? 'flex flex-col md:flex-row' : ''}`}>
        
        {/* Sport Cards - Transforms to slim vertical sidebar when selected */}
        <div className={`
          transition-all duration-700 ease-out
          ${selectedActivity 
            ? 'md:w-[140px] md:min-h-screen md:border-r p-4 md:p-3 md:pt-20' 
            : 'p-6 md:p-8'
          }
        `}
        style={{
          borderColor: selectedActivity ? 'rgba(255,255,255,0.06)' : 'transparent'
        }}
        >
          {/* Mobile: Horizontal scroll ribbon when selected */}
          <div className={`
            ${selectedActivity 
              ? 'flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide' 
              : 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'
            }
          `}>
            {activities.map((activity) => {
              const isSelected = selectedActivity === activity.id
              const isOther = selectedActivity && selectedActivity !== activity.id

              return (
                <button
                  key={activity.id}
                  onClick={() => handleActivityClick(activity.id)}
                  className={`
                    group relative overflow-hidden rounded-lg flex-shrink-0
                    transition-all duration-500
                    ${selectedActivity 
                      ? 'w-24 md:w-full aspect-square md:aspect-[4/3]' 
                      : 'aspect-[3/4] md:aspect-[2/3]'
                    }
                  `}
                  style={{
                    filter: isOther ? 'grayscale(100%)' : 'none',
                    opacity: isOther ? 0.4 : 1,
                    border: isSelected ? '0.5px solid rgba(255,255,255,0.4)' : '0.5px solid transparent',
                  }}
                >
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Card Content */}
                  <div className={`
                    absolute bottom-0 left-0 right-0 p-3 md:p-4
                    ${selectedActivity ? 'p-2 md:p-3' : ''}
                  `}>
                    <h3 
                      className={`text-white ${selectedActivity ? 'text-sm md:text-base' : 'text-xl md:text-2xl'}`}
                      style={{ fontFamily: "'Editorial New', Georgia, serif", fontWeight: 100 }}
                    >
                      {activity.title}
                    </h3>
                    {!selectedActivity && (
                      <p 
                        className="text-[10px] text-white/50 uppercase tracking-widest mt-1"
                        style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif" }}
                      >
                        {activity.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Location Bento Cards - Main center area */}
        {selectedActivity && selectedActivityData && (
          <div className="flex-1 p-4 md:p-8 md:pl-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="mb-6 md:mb-8">
              <p 
                className="text-sm text-white/40 italic mb-2"
                style={{ fontFamily: "'Editorial New', Georgia, serif" }}
              >
                {"Your perfect spots for"} 
              </p>
              <h2 
                className="text-3xl md:text-4xl text-white tracking-tight"
                style={{ fontFamily: "'Editorial New', Georgia, serif", fontWeight: 100 }}
              >
                {selectedActivityData.title}
              </h2>
            </div>

            {/* Bento Grid - 3 large horizontal cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 h-auto md:h-[calc(100vh-220px)]">
              {selectedActivityData.locations.map((location) => {
                // Convert to MatrixLocationData format
                const locationData: MatrixLocationData = {
                  name: location.name,
                  country: location.country,
                  activity: selectedActivityData.title,
                  season: location.season,
                  difficulty: location.difficulty,
                  vibe: location.vibe,
                  image: location.image,
                  womenFriendly: location.womenFriendly,
                  soloIndex: location.soloIndex,
                  logistics: location.logistics,
                  facilities: location.facilities,
                  conditions: location.conditions,
                }

                return (
                <button
                  key={location.id}
                  onClick={() => onViewDetails(locationData)}
                  className="
                    group relative overflow-hidden rounded-xl min-h-[280px] md:min-h-0
                    transition-all duration-500 text-left hover:scale-[1.01]
                  "
                  style={{
                    border: '0.5px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Background Image */}
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    {/* Country - pure typography, no icons */}
                    <span 
                      className="text-[11px] text-white/50 uppercase tracking-[0.15em] mb-2"
                      style={{ fontFamily: "'Monument Grotesk', Arial, sans-serif", fontWeight: 400, letterSpacing: '-0.01em' }}
                    >
                      {location.country}
                    </span>
                    
                    {/* Place name - Large Editorial New */}
                    <h3 
                      className="text-white mb-5"
                      style={{ 
                        fontFamily: "'Editorial New', Georgia, serif", 
                        fontWeight: 100,
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        lineHeight: 1.1,
                      }}
                    >
                      {location.name}
                    </h3>
                    
                    {/* Hard Data - Pure typographic hierarchy, Monument Grotesk ONLY, NO icons */}
                    <div className="space-y-1.5 mb-6">
                      {/* Season - Bold uppercase */}
                      <p 
                        className="text-white/90 uppercase"
                        style={{ 
                          fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                          fontWeight: 500, 
                          fontSize: '0.875rem', 
                          letterSpacing: '0.05em',
                        }}
                      >
                        {location.season}
                      </p>
                      {/* Difficulty */}
                      <p 
                        className="text-white/70"
                        style={{ 
                          fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                          fontWeight: 400, 
                          fontSize: '0.875rem', 
                          lineHeight: 1.5,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {location.difficulty}
                      </p>
                      {/* Vibe */}
                      <p 
                        className="text-white/50"
                        style={{ 
                          fontFamily: "'Monument Grotesk', Arial, sans-serif", 
                          fontWeight: 300, 
                          fontSize: '0.8125rem', 
                          lineHeight: 1.5,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {location.vibe}
                      </p>
                    </div>
                    
                    {/* View Details Button - Bottom right, solid 1px white border, 18% bg, blur(12px) */}
                    <div className="flex justify-end">
                      <span 
                        className="
                          inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                          text-sm text-white/90
                          transition-all duration-300
                          group-hover:bg-white/25 group-hover:text-white
                        "
                        style={{
                          fontFamily: "'Monument Grotesk', Arial, sans-serif",
                          fontWeight: 400,
                          letterSpacing: '-0.01em',
                          border: '1px solid rgba(255,255,255,1)',
                          backgroundColor: 'rgba(255,255,255,0.18)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                      </span>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Initial state message when no activity selected */}
        {!selectedActivity && (
          <div className="fixed bottom-8 left-0 right-0 text-center">
            <p 
              className="text-sm md:text-base text-white/40 italic"
              style={{ fontFamily: "'Editorial New', Georgia, serif" }}
            >
              {"Select an activity to discover your perfect destination"}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
