import React from 'react';

const LandingPage = () => {
  return (
    <div>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .cta-btn {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 0.8rem 2rem;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }

          .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
          }

          /* Hero Section */
          .hero {
            padding: 8rem 0 4rem;
            text-align: center;
            color: white;
          }

          .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            opacity: 0;
            animation: fadeInUp 1s ease 0.2s forwards;
          }

          .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            opacity: 0;
            animation: fadeInUp 1s ease 0.4s forwards;
          }

          .hero .cta-btn {
            font-size: 1.1rem;
            padding: 1rem 3rem;
            opacity: 0;
            animation: fadeInUp 1s ease 0.6s forwards;
          }

          /* Dashboard Section */
          .dashboard-section {
            padding: 4rem 0;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            margin: 2rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .section-title {
            text-align: center;
            color: white;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            font-weight: 700;
          }

          .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .dashboard-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .dashboard-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .card-title {
            font-size: 1.2rem;
            color: white;
            font-weight: 600;
          }

          .card-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #ffd700, #ff8c00);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
          }

          .metric-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 0.5rem;
          }

          .metric-label {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          }

          .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            margin-top: 1rem;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(45deg, #ffd700, #ff8c00);
            border-radius: 4px;
            transition: width 2s ease;
          }

          /* Workout Stats */
          .workout-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }

          .workout-stat {
            text-align: center;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .workout-stat:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }

          .workout-stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #ffd700;
          }

          .workout-stat-label {
            color: rgba(255, 255, 255, 0.8);
            margin-top: 0.5rem;
          }

          /* Features Section */
          .features {
            padding: 4rem 0;
            text-align: center;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
          }

          .feature-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }

          .feature-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.2);
          }

          .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
          }

          .feature-title {
            color: white;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .feature-desc {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
          }

          /* Footer */
          footer {
            background: rgba(0, 0, 0, 0.3);
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 4rem;
          }

          /* Animations */
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

          .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
          }

          .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.5rem;
            }
            
            .dashboard {
              grid-template-columns: 1fr;
            }
            
            .metric-value {
              font-size: 2rem;
            }
            
            .cta-btn {
              width: 100%;
              text-align: center;
            }
          }
        `}
      </style>

      <section className="hero">
        <div className="container">
          <h1>Track Your Fitness Journey</h1>
          <p>Advanced analytics, personalized insights, and seamless tracking for your ultimate fitness experience</p>
          <a href="#dashboard" className="cta-btn">View Dashboard</a>
        </div>
      </section>

      <section id="dashboard" className="dashboard-section">
        <div className="container">
          <h2 className="section-title">Your Fitness Dashboard</h2>
          
          <div className="dashboard">
            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Steps Today</span>
                <div className="card-icon">👟</div>
              </div>
              <div className="metric-value" id="steps">8,547</div>
              <div className="metric-label">of 10,000 goal</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '85%'}}></div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Calories Burned</span>
                <div className="card-icon">🔥</div>
              </div>
              <div className="metric-value" id="calories">2,156</div>
              <div className="metric-label">kcal today</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '72%'}}></div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Heart Rate</span>
                <div className="card-icon">❤️</div>
              </div>
              <div className="metric-value" id="heartrate">72</div>
              <div className="metric-label">bpm (resting)</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '60%'}}></div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Sleep Quality</span>
                <div className="card-icon">😴</div>
              </div>
              <div className="metric-value" id="sleep">7.5</div>
              <div className="metric-label">hours (excellent)</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '94%'}}></div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Water Intake</span>
                <div className="card-icon">💧</div>
              </div>
              <div className="metric-value" id="water">1.8</div>
              <div className="metric-label">liters of 2.5L goal</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '72%'}}></div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Active Minutes</span>
                <div className="card-icon">⚡</div>
              </div>
              <div className="metric-value" id="active">47</div>
              <div className="metric-label">minutes today</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '78%'}}></div>
              </div>
            </div>
          </div>

          <div className="workout-grid">
            <div className="workout-stat">
              <div className="workout-stat-value">12</div>
              <div className="workout-stat-label">Workouts This Week</div>
            </div>
            <div className="workout-stat">
              <div className="workout-stat-value">45</div>
              <div className="workout-stat-label">Minutes Average</div>
            </div>
            <div className="workout-stat">
              <div className="workout-stat-value">3.2</div>
              <div className="workout-stat-label">Miles Run</div>
            </div>
            <div className="workout-stat">
              <div className="workout-stat-value">85%</div>
              <div className="workout-stat-label">Goals Achieved</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Advanced Analytics</h3>
              <p className="feature-desc">Deep insights into your fitness patterns with comprehensive data visualization and trend analysis.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Smart Goal Setting</h3>
              <p className="feature-desc">AI-powered goal recommendations based on your fitness level and personalized targets.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Multi-Device Sync</h3>
              <p className="feature-desc">Seamlessly sync data across all your devices for a unified fitness tracking experience.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Achievement System</h3>
              <p className="feature-desc">Unlock badges and celebrate milestones to keep you motivated on your fitness journey.</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2025 FitTrack Pro. Your ultimate fitness companion.</p>
        </div>
      </footer>

      <script>
        {`
          // Animate dashboard values on load
          function animateValue(id, start, end, duration) {
            const element = document.getElementById(id);
            const range = end - start;
            const minTimer = 50;
            let stepTime = Math.abs(Math.floor(duration / range));
            stepTime = Math.max(stepTime, minTimer);
            const startTime = new Date().getTime();
            const endTime = startTime + duration;
            
            function timer() {
              const now = new Date().getTime();
              const remaining = Math.max((endTime - now) / duration, 0);
              const value = Math.round(end - (remaining * range));
              
              if (id === 'sleep') {
                element.innerHTML = (value / 10).toFixed(1);
              } else if (id === 'water') {
                element.innerHTML = (value / 10).toFixed(1);
              } else {
                element.innerHTML = value.toLocaleString();
              }
              
              if (value === end) {
                clearInterval(timer);
              }
            }
            
            const interval = setInterval(timer, stepTime);
          }

          // Scroll animations
          function handleScrollAnimation() {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(element => {
              const elementTop = element.getBoundingClientRect().top;
              const elementVisible = 150;
              
              if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
              }
            });
          }

          // Initialize animations when page loads
          window.addEventListener('load', () => {
            // Animate dashboard values
            setTimeout(() => {
              animateValue('steps', 0, 8547, 2000);
              animateValue('calories', 0, 2156, 2000);
              animateValue('heartrate', 0, 72, 1500);
              animateValue('sleep', 0, 75, 1800);
              animateValue('water', 0, 18, 1600);
              animateValue('active', 0, 47, 1400);
            }, 800);
          });

          // Scroll event listener
          window.addEventListener('scroll', handleScrollAnimation);

          // Smooth scrolling for navigation links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            });
          });

          // Add dynamic updates to dashboard (simulated real-time data)
          setInterval(() => {
            const steps = document.getElementById('steps');
            const currentSteps = parseInt(steps.innerText.replace(',', ''));
            const newSteps = currentSteps + Math.floor(Math.random() * 5);
            steps.innerText = newSteps.toLocaleString();
            
            // Update progress bar
            const progressBar = steps.closest('.dashboard-card').querySelector('.progress-fill');
            const percentage = Math.min((newSteps / 10000) * 100, 100);
            progressBar.style.width = percentage + '%';
          }, 10000); // Update every 10 seconds
        `}
      </script>
    </div>
  );
};

export default LandingPage;
