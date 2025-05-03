import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext)
    const [meetings, setMeetings] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser()
                setMeetings(history)
            } catch (error) {
                console.error("Failed to fetch history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [getHistoryOfUser])
    
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return date.toLocaleDateString('en-US', options)
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Meeting History</h1>
                        <p className="text-gray-500 mt-1">Your previously joined meetings</p>
                    </div>
                    <button 
                        onClick={() => navigate("/home")}
                        className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Home</span>
                    </button>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : meetings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
                        <div className="mx-auto h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No meetings yet</h3>
                        <p className="text-gray-500 mb-6">Your meeting history will appear here once you join meetings.</p>
                        <button 
                            onClick={() => navigate("/home")}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            Start a Meeting
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100">
                            <div className="col-span-6 md:col-span-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Meeting</div>
                            <div className="col-span-3 md:col-span-2 font-medium text-gray-500 text-sm uppercase tracking-wider">Code</div>
                            <div className="col-span-3 md:col-span-4 font-medium text-gray-500 text-sm uppercase tracking-wider">Date</div>
                            <div className="col-span-2 font-medium text-gray-500 text-sm uppercase tracking-wider text-right">Action</div>
                        </div>
                        {meetings.map((meeting, index) => (
                            <div 
                                key={index} 
                                className={`grid grid-cols-12 p-4 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <div className="col-span-6 md:col-span-4 font-medium text-gray-800">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span>Meeting {index + 1}</span>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-2 font-mono text-gray-600">{meeting.meetingCode}</div>
                                <div className="col-span-3 md:col-span-4 text-gray-500 text-sm">{formatDate(meeting.date)}</div>
                                <div className="col-span-2 text-right">
                                    <button 
                                        onClick={() => navigate(`/${meeting.meetingCode}`)}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}