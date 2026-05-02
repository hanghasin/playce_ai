'use client'

import { useState, useCallback } from 'react'
import { TheAbyss } from '@/components/playce/the-abyss'
import { TheMatch } from '@/components/playce/the-match'
import { TheCalibration } from '@/components/playce/the-calibration'
import { TheMatrix } from '@/components/playce/the-matrix'

type Page = 'abyss' | 'match' | 'calibration' | 'matrix'

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

interface CalibrationData {
  skillLevel: 'NOVICE' | 'INTERMEDIATE' | 'PRO' | 'ELITE'
  riskAppetite: 'CHILL' | 'ADVENTURE' | 'EXTREME'
  budgetRange: 'ESSENTIAL' | 'MID-RANGE' | 'LUXE'
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('abyss')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<MatrixLocationData | null>(null)
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage('match')
      setIsTransitioning(false)
    }, 600)
  }, [])

  const handleBackToAbyss = useCallback(() => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage('abyss')
      setSearchQuery('')
      setSelectedLocation(null)
      setCalibrationData(null)
      setIsTransitioning(false)
    }, 600)
  }, [])

  const handleBackToMatch = useCallback(() => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage('match')
      setSelectedLocation(null)
      setCalibrationData(null)
      setIsTransitioning(false)
    }, 600)
  }, [])

  const handleBackToCalibration = useCallback(() => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage('calibration')
      setIsTransitioning(false)
    }, 600)
  }, [])

  // View Details triggers calibration (Page 3)
  const handleViewDetails = useCallback((locationData: MatrixLocationData) => {
    setSelectedLocation(locationData)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage('calibration')
      setIsTransitioning(false)
    }, 600)
  }, [])

  // Proceed from calibration to matrix (Page 4)
  const handleProceedToMatrix = useCallback((calibration: CalibrationData) => {
    setCalibrationData(calibration)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage('matrix')
      setIsTransitioning(false)
    }, 600)
  }, [])

  const handleConfirm = useCallback(() => {
    // Handle confirmation - could navigate to booking, show success, etc.
    alert('Booking confirmed! Get ready for your adventure.')
  }, [])

  return (
    <main 
      className={`
        min-h-screen bg-black
        page-transition
        ${isTransitioning ? 'page-blur-out' : ''}
      `}
    >
      {currentPage === 'abyss' && (
        <TheAbyss onSubmit={handleSearch} />
      )}
      
      {currentPage === 'match' && (
        <TheMatch 
          searchQuery={searchQuery} 
          onBack={handleBackToAbyss}
          onViewDetails={handleViewDetails}
        />
      )}

      {currentPage === 'calibration' && selectedLocation && (
        <TheCalibration 
          location={selectedLocation}
          onBack={handleBackToMatch}
          onProceed={handleProceedToMatrix}
        />
      )}

      {currentPage === 'matrix' && selectedLocation && calibrationData && (
        <TheMatrix 
          location={selectedLocation}
          calibration={calibrationData}
          onBack={handleBackToCalibration}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  )
}
