'use client'

import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about-us', label: 'About Us', href: '/about-us' },
  { id: 'events', label: 'Events', href: '/events' },
  { id: 'achievements', label: 'Achievements', href: '/achievements' },
  { id: 'members', label: 'Members', href: '/members' },
  { id: 'donations', label: 'Donations', href: '/donations' },
  { id: 'family-details', label: 'Submit Family', href: '/family-details' },
  { id: 'family-list', label: 'Family Directory', href: '/family-list' },
  { id: 'admin', label: 'Admin', href: '/admin' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload?.role?.toLowerCase() === 'admin') {
          setIsAdmin(true)
        }
      } catch (e) {
        console.error('Failed to parse token', e)
      }
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setIsAdmin(false)
    window.location.href = '/login'
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Society</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => {
                if (item.id === 'admin' && !isAdmin) return null;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 cursor-pointer rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md transform hover:scale-105 active:scale-95"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 cursor-pointer rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md transform hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="px-2 pt-2 space-y-1">
              {navItems.map((item) => {
                if (item.id === 'admin' && !isAdmin) return null;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer ${isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-gray-100 mt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="block w-full text-center px-3 py-3 rounded-xl text-base font-bold text-white bg-red-600 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-3 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 transition-colors cursor-pointer"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
