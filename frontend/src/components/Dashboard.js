import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, Square, Clock, Target, TrendingUp, Award, Trophy, Heart, Activity, RefreshCw, Trash2 } from 'lucide-react';



const Dashboard = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedReps, setCompletedReps] = useState(0);
  const [targetReps, setTargetReps] = useState(10);
  const [activityHistory, setActivityHistory] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const intervalRef = useRef(null);
  const activityControlsRef = useRef(null);

  const fitnessActivities = [
    {
      id: 1,
      name: "Push-ups",
      category: "Strength",
      description: "Upper body strength exercise",
      defaultTime: 120,
      defaultReps: 20,
      icon: "💪",
      color: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      name: "Squats",
      category: "Strength",
      description: "Lower body strength exercise",
      defaultTime: 180,
      defaultReps: 25,
      icon: "🦵",
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 3,
      name: "Plank",
      category: "Core",
      description: "Core stability exercise",
      defaultTime: 60,
      defaultReps: 1,
      icon: "🏋️",
      color: "from-green-500 to-teal-500"
    },
    {
      id: 4,
      name: "Burpees",
      category: "Cardio",
      description: "Full body cardio exercise",
      defaultTime: 300,
      defaultReps: 15,
      icon: "🔥",
      color: "from-red-600 to-pink-600"
    },
    {
      id: 5,
      name: "Mountain Climbers",
      category: "Cardio",
      description: "High intensity cardio",
      defaultTime: 180,
      defaultReps: 30,
      icon: "⛰️",
      color: "from-gray-600 to-blue-600"
    },
    {
      id: 6,
      name: "Jumping Jacks",
      category: "Cardio",
      description: "Cardiovascular exercise",
      defaultTime: 240,
      defaultReps: 50,
      icon: "🤸",
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: 7,
      name: "Lunges",
      category: "Strength",
      description: "Lower body strength",
      defaultTime: 150,
      defaultReps: 20,
      icon: "🚶",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 8,
      name: "High Knees",
      category: "Cardio",
      description: "Running in place variation",
      defaultTime: 120,
      defaultReps: 40,
      icon: "🏃",
      color: "from-green-600 to-blue-600"
    },
    {
      id: 9,
      name: "Swimming",
      category: "Cardio",
      description: "Full body swimming exercise",
      defaultTime: 300,
      defaultReps: 10,
      icon: "🏊",
      color: "from-blue-600 to-cyan-500"
    },
    {
      id: 10,
      name: "Jogging",
      category: "Cardio",
      description: "Light running exercise",
      defaultTime: 180,
      defaultReps: 15,
      icon: "🏃‍♂️",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 11,
      name: "Treadmill",
      category: "Cardio",
      description: "Running on a treadmill",
      defaultTime: 240,
      defaultReps: 20,
      icon: "🏃‍♀️",
      color: "from-gray-700 to-gray-900"
    },
    {
      id: 12,
      name: "Sports",
      category: "Recreational",
      description: "Various sports activities",
      defaultTime: 360,
      defaultReps: 5,
      icon: "🏅",
      color: "from-yellow-600 to-amber-600"
    }
  ];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= timeLimit) {
            handleStopActivity();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLimit]);

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setTimeLimit(activity.defaultTime);
    setTargetReps(activity.defaultReps);
    setCurrentTime(0);
    setCompletedReps(0);
    setIsRunning(false);

    setTimeout(() => {
      activityControlsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartActivity = () => {
    if (!selectedActivity) return;
    
    setIsRunning(true);
    setCurrentSession({
      activity: selectedActivity,
      startTime: new Date(),
      timeLimit: timeLimit,
      targetReps: targetReps
    });
  };

  const handlePauseActivity = () => {
    setIsRunning(false);
  };

  const handleStopActivity = () => {
    setIsRunning(false);
    
    if (currentSession) {
      const accuracy = targetReps > 0 ? (completedReps / targetReps) * 100 : 0;
      const completionRate = timeLimit > 0 ? (currentTime / timeLimit) * 100 : 0;
      
      const sessionResult = {
        id: Date.now(),
        ...currentSession,
        endTime: new Date(),
        duration: currentTime,
        completedReps: completedReps,
        targetReps: targetReps,
        accuracy: Math.round(accuracy),
        completionRate: Math.round(completionRate),
        status: accuracy >= 100 ? 'completed' : accuracy >= 80 ? 'good' : 'needs improvement'
      };
      
      setActivityHistory(prev => [sessionResult, ...prev.slice(0, 9)]);
    }
    
    setCurrentSession(null);
    setCurrentTime(0);
    setCompletedReps(0);
  };

  const handleRepIncrement = () => {
    setCompletedReps(prev => prev + 1);
  };

  const handleResetSettings = () => {
    if (selectedActivity) {
      setTimeLimit(selectedActivity.defaultTime);
      setTargetReps(selectedActivity.defaultReps);
    }
  };

  const handleClearHistory = () => {
    setActivityHistory([]);
    setShowClearConfirm(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white';
    return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Strength': return 'bg-red-100 text-red-800';
      case 'Cardio': return 'bg-blue-100 text-blue-800';
      case 'Core': return 'bg-green-100 text-green-800';
      case 'Recreational': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black font-sans text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg text-gray-900 dark:text-white shadow-lg sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  FitTrack Pro
                </h1>
                <p className="hidden sm:block text-gray-400 text-sm">Your daily fitness companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-md">
                <Trophy className="w-4 h-4 inline mr-1.5" />
                {activityHistory.length} Sessions
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { title: "Total Activities", value: fitnessActivities.length, icon: Target, color: "blue" },
            { title: "Completed Today", value: activityHistory.filter(s => new Date(s.startTime).toDateString() === new Date().toDateString()).length, icon: Award, color: "green" },
            { title: "Total Reps", value: activityHistory.reduce((total, session) => total + session.completedReps, 0), icon: TrendingUp, color: "purple" },
            { title: "Avg Accuracy", value: `${activityHistory.length > 0 ? Math.round(activityHistory.reduce((total, session) => total + session.accuracy, 0) / activityHistory.length) : 0}%`, icon: Heart, color: "red" }
          ].map(stat => (
            <div key={stat.title} className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 transform duration-300 hover:border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 bg-${stat.color}-900/50 rounded-full`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="mr-3 text-blue-400 w-7 h-7" />
                Choose Your Activity
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fitnessActivities.map(activity => (
                  <div
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity)}
                    className={`p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl border-2 ${
                      selectedActivity?.id === activity.id 
                        ? `border-blue-500 bg-gradient-to-r ${activity.color} text-white shadow-lg` 
                        : 'border-gray-700 bg-gray-800 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-3xl mr-4 animate-bounce">{activity.icon}</span>
                      <div>
                        <h3 className={`font-bold text-lg text-white`}>{activity.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${selectedActivity?.id === activity.id ? 'bg-white/20 text-white' : getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm mb-4 ${selectedActivity?.id === activity.id ? 'text-white/90' : 'text-gray-400'}`}>{activity.description}</p>
                    <div className={`text-xs rounded-lg p-2 flex justify-between items-center ${selectedActivity?.id === activity.id ? 'bg-white/10' : 'bg-gray-900/50'}`}>
                      <span className={`${selectedActivity?.id === activity.id ? 'text-white/80' : 'text-gray-400'}`}>
                        Default: {Math.floor(activity.defaultTime / 60)}:{(activity.defaultTime % 60).toString().padStart(2, '0')} • {activity.defaultReps} reps
                      </span>
                      {selectedActivity?.id === activity.id && (
                        <span className="font-bold text-white">Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Controls */}
            {selectedActivity && (
              <div ref={activityControlsRef} className="bg-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-700 transition-all duration-500 ease-in-out">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <Play className="mr-3 text-green-400 w-7 h-7" />
                    Activity Session: {selectedActivity.name}
                  </div>
                  <button onClick={handleResetSettings} disabled={isRunning} className="text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-500 flex items-center">
                    <RefreshCw className="w-4 h-4 mr-1.5"/>
                    Reset
                  </button>
                </h2>
                <p className="text-gray-400 mb-4">{selectedActivity.description}</p>
                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Time Limit (seconds)
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-white"
                      min="10"
                      max="3600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Target Reps
                    </label>
                    <input
                      type="number"
                      value={targetReps}
                      onChange={(e) => setTargetReps(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-white"
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
                <button
                  onClick={handleStartActivity}
                  disabled={isRunning}
                  className="flex-1 sm:flex-none flex items-center justify-center px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Start
                </button>
                <button
                  onClick={handlePauseActivity}
                  disabled={!isRunning}
                  className="flex-1 sm:flex-none flex items-center justify-center px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Pause className="mr-2 w-5 h-5" />
                  Pause
                </button>
                <button
                  onClick={handleStopActivity}
                  disabled={!currentSession}
                  className="flex-1 sm:flex-none flex items-center justify-center px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Square className="mr-2 w-5 h-5" />
                  End
                </button>
                <button
                  onClick={handleRepIncrement}
                  disabled={!isRunning}
                  className="flex-1 sm:flex-none flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  +1 Rep
                </button>
                </div>

                {/* Live Progress Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-8">
                  {[
                    { title: "Time Elapsed", value: formatTime(currentTime), icon: Clock, color: "blue" },
                    { title: "Time Remaining", value: formatTime(timeLimit - currentTime), icon: Clock, color: "green" },
                    { title: "Completed Reps", value: completedReps, icon: TrendingUp, color: "purple" },
                    { title: "Accuracy", value: `${targetReps > 0 ? Math.round((completedReps / targetReps) * 100) : 0}%`, icon: Award, color: "orange" }
                  ].map(item => (
                    <div key={item.title} className={`bg-gradient-to-br from-${item.color}-900/50 to-${item.color}-800/50 p-4 rounded-xl text-center border border-${item.color}-700`}>
                      <item.icon className={`mx-auto mb-2 text-${item.color}-400 w-7 h-7`} />
                      <div className="text-xl sm:text-2xl font-bold text-white">{item.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">{item.title}</div>
                    </div>
                  ))}
                </div>

                {/* Progress Bars */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-semibold text-gray-400 mb-2">
                      <span>Time Progress</span>
                      <span>{Math.round((currentTime / timeLimit) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((currentTime / timeLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-semibold text-gray-400 mb-2">
                      <span>Rep Progress</span>
                      <span>{targetReps > 0 ? Math.round((completedReps / targetReps) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${targetReps > 0 ? Math.min((completedReps / targetReps) * 100, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity History Sidebar */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="mr-3 text-purple-400 w-7 h-7" />
                Recent Sessions
              </h2>
              {activityHistory.length > 0 && (
                <button onClick={() => setShowClearConfirm(true)} className="text-sm text-red-400 hover:text-red-300 flex items-center">
                  <Trash2 className="w-4 h-4 mr-1.5"/>
                  Clear
                </button>
              )}
            </div>
            
            {activityHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-900/50 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-500 mx-auto" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No completed sessions yet</p>
                <p className="text-gray-500 text-sm mt-1">Start an activity to see your results!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2 -mr-2">
                {activityHistory.map((session) => (
                  <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:border-blue-500 transition-all duration-200 animate-fade-in bg-white/50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{session.activity.icon}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{session.activity.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProgressColor(session.accuracy)}`}>
                        {session.accuracy}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-300">{formatTime(session.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reps:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-300">{session.completedReps}/{session.targetReps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-300">{new Date(session.startTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 m-4 max-w-sm w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Clear History</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete all session history? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowClearConfirm(false)} className="px-5 py-2 rounded-xl text-white bg-gray-700 hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleClearHistory} className="px-5 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;