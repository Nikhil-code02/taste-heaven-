import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 font-sans text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="hero py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Track Your Fitness Journey</h1>
          <p className="text-xl sm:text-2xl mb-8 opacity-90 animate-fade-in-up delay-200">Advanced analytics, personalized insights, and seamless tracking for your ultimate fitness experience</p>
          <a href="#dashboard" className="cta-btn bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:-translate-y-1 hover:shadow-xl animate-fade-in-up delay-400">
            View Dashboard
          </a>
        </section>

        {/* Dashboard Section */}
        <section id="dashboard" className="dashboard-section bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-white/20 dark:border-gray-700/30">
          <h2 className="section-title text-3xl sm:text-4xl font-bold text-center mb-12">Your Fitness Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { title: "Steps Today", value: "8,547", goal: "10,000", icon: "👟", progress: 85 },
              { title: "Calories Burned", value: "2,156", goal: "kcal today", icon: "🔥", progress: 72 },
              { title: "Heart Rate", value: "72", goal: "bpm (resting)", icon: "❤️", progress: 60 },
              { title: "Sleep Quality", value: "7.5", goal: "hours (excellent)", icon: "😴", progress: 94 },
              { title: "Water Intake", value: "1.8", goal: "liters of 2.5L goal", icon: "💧", progress: 72 },
              { title: "Active Minutes", value: "47", goal: "minutes today", icon: "⚡", progress: 78 }
            ].map((item, index) => (
              <div key={index} className="dashboard-card bg-white/15 dark:bg-gray-700/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-600/30 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                <div className="card-header flex justify-between items-center mb-4">
                  <span className="card-title font-semibold text-lg">{item.title}</span>
                  <div className="card-icon w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                </div>
                <div className="metric-value text-3xl font-bold text-yellow-400 mb-1">{item.value}</div>
                <div className="metric-label text-gray-200 dark:text-gray-300 text-sm mb-3">{item.goal}</div>
                <div className="progress-bar w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div className="progress-fill bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "12", label: "Workouts This Week" },
              { value: "45", label: "Minutes Average" },
              { value: "3.2", label: "Miles Run" },
              { value: "85%", label: "Goals Achieved" }
            ].map((item, index) => (
              <div key={index} className="workout-stat bg-white/10 dark:bg-gray-700/极 rounded-xl p-4 text-center transition-all hover:bg-white/20 dark:hover:bg-gray-700/30 hover:scale-105">
                <div className="workout-stat-value text-2xl font-bold text-yellow-400">{item.value}</div>
                <div className="workout-stat-label text-gray-200 dark:text-gray-300 text-sm mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features text-center py-16">
          <h2 className="section-title text-3xl sm:text-4xl font-bold mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📊", title: "Advanced Analytics", desc: "Deep insights into your fitness patterns with comprehensive data visualization and trend analysis." },
              { icon: "🎯", title: "Smart Goal Setting", desc: "AI-powered goal recommendations based on your fitness level and personalized targets." },
              { icon: "📱", title: "Multi-Device Sync", desc: "Seamlessly sync data across all your devices for a unified fitness tracking experience." },
              { icon: "🏆", title: "Achievement System", desc: "Unlock badges and celebrate milestones to keep you motivated on your fitness journey." }
            ].map((feature, index) => (
              <div key={index} className="feature-card bg-white/10 dark:bg-gray-700/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-600/30 transition-all hover:-translate-y-1 hover:bg-white/20 dark:hover:bg-gray-700/40">
                <div className="feature-icon w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="feature-title text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="feature-desc text-gray-200 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 text-center py-8 mt-16 rounded-2xl">
          <p>&copy; 2025 FitTrack Pro. Your ultimate fitness companion.</p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 1s ease forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
