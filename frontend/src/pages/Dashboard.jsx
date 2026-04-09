import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">MC</span>
            </div>
            <span className="font-bold text-xl text-gray-900">MeetConnect</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              New Meeting
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition-all"
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
                      Preferences
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome back, <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text">{user?.username}</span>!
          </h1>
          <p className="text-gray-600 text-lg">Ready to connect? Start a meeting or join one below.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🎥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start a Meeting</h3>
            <p className="text-gray-600 mb-4">Instantly start a new video meeting</p>
            <button className="text-blue-600 font-semibold hover:text-blue-700">Start Now →</button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="w-16 h-16 bg-linear-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🔗</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join a Meeting</h3>
            <p className="text-gray-600 mb-4">Join an existing meeting with a code</p>
            <button className="text-green-600 font-semibold hover:text-green-700">Join Now →</button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Meeting</h3>
            <p className="text-gray-600 mb-4">Plan a meeting for later</p>
            <button className="text-purple-600 font-semibold hover:text-purple-700">Schedule →</button>
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Meetings</h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No meetings yet. Start your first meeting today!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
