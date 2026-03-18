"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Search, X, Loader2 } from "lucide-react"

interface VenueAutocompleteProps {
  label: string
  required?: boolean
  value: string
  placeholder?: string
  onSelect: (venueName: string, address: string, mapsUrl: string) => void
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  address?: {
    [key: string]: string
  }
}

export function VenueAutocomplete({
  label,
  required,
  value,
  placeholder,
  onSelect
}: VenueAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Sync internal query state with value prop when value changes externally
  useEffect(() => {
    setQuery(value)
  }, [value])

  const searchVenues = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    setIsOpen(true)

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'id,en',
          'User-Agent': 'undang-io/1.0 (https://undang.io)'
        }
      })

      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (error) {
      console.error("Error fetching locations from Nominatim:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      searchVenues(val)
    }, 600)
  }

  const handleSelect = (result: NominatimResult) => {
    const parts = result.display_name.split(',')
    const venueName = parts[0].trim()
    const address = parts.slice(1, 4).map(p => p.trim()).join(', ').trim()
    const mapsUrl = `https://www.google.com/maps?q=${result.lat},${result.lon}`

    onSelect(venueName, address, mapsUrl)
    setQuery(venueName)
    setIsOpen(false)
    setResults([])
  }

  const handleClear = () => {
    setQuery("")
    onSelect("", "", "")
    setResults([])
    setIsOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#726C67] mb-1.5">
        {label}{required && <span className="text-[#E05555] ml-1">*</span>}
      </label>
      
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#D4A91C] text-[#C2BEB8] transition-colors">
          <MapPin className="w-4 h-4" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 3 && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#EDE6D6] bg-white pl-10 pr-10 py-2.5 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#D4A91C]" />}
          {!isLoading && query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-[#FAF8F3] rounded-full text-[#C2BEB8] hover:text-[#1E1B18] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-[#EDE6D6] shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#9A9390]">Mencari lokasi...</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {results.map((res, i) => {
                const parts = res.display_name.split(',')
                const title = parts[0].trim()
                const subtitle = parts.slice(1, 4).map(p => p.trim()).join(', ').trim()
                
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(res)}
                    className="w-full text-left px-5 py-3 hover:bg-[#FAF8F3] transition-colors border-b border-[#F7F5F0] last:border-0"
                  >
                    <p className="font-semibold text-sm text-[#1E1B18]">{title}</p>
                    <p className="text-xs text-[#9A9390] truncate mt-0.5">{subtitle}</p>
                  </button>
                )
              })}
            </div>
          )}
          
          <div className="bg-[#FAF8F3] px-4 py-2 flex items-center gap-2 border-t border-[#EDE6D6]">
            <Search className="w-3 h-3 text-[#D4A91C]" />
            <span className="text-[10px] font-medium text-[#9A9390]">Data lokasi dari OpenStreetMap</span>
          </div>
        </div>
      )}
    </div>
  )
}
