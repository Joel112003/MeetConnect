import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

function home() {
  let navigate = useNavigate()
  const [meetingCode, setMeetingCode] = useState("")
  
  const { addToUserHistory } = useContext(AuthContext)
  
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode)
    navigate(`/${meetingCode}`)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 shadow-md bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
            <span className="text-white font-bold">M</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">MeetConnect</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/history")}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>History</span>
          </button>
          
          <button 
            onClick={() => {
              localStorage.removeItem("token")
              navigate("/")
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex justify-center items-center px-4 py-16 md:py-32">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome to MeetConnect</h1>
          <p className="text-gray-600 text-center mb-8">Connect with anyone, anywhere, anytime</p>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center border-l-4 border-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="ml-2">
                <h3 className="font-medium text-blue-700">Quick Connect</h3>
                <p className="text-sm text-blue-600">Enter a meeting code or create a new one</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={meetingCode}
                  onChange={e => setMeetingCode(e.target.value)}
                  placeholder="Enter meeting code"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs font-medium text-gray-500">
                  Meeting Code
                </label>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleJoinVideoCall}
                  disabled={!meetingCode}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h4v8h-4v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                  </svg>
                  Join Meeting
                </button>
                
                <button 
                  onClick={() => {
                    const randomCode = Math.random().toString(36).substring(2, 8)
                    setMeetingCode(randomCode)
                  }}
                  className="w-full py-3 px-4 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 text-center">
                Premium quality video conferencing for everyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(home)