import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home: React.FC = () => {
  // Add state to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    // This is a placeholder - replace with your actual authentication check
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Add smooth scrolling effect
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href');
        if (id && id !== '#') {
          document.querySelector(id)?.scrollIntoView({
            behavior: 'smooth'
          });
        } else if (id === '#') {
          // Scroll to top if href is just "#"
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div>
      {/* Header & Navigation */}
     

      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroBgOverlay}></div>
        <img 
          src="/home.jpeg"
          alt="Restaurant Interior" 
          className={styles.heroImage}
        />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Welcome to Taste Haven</h1>
            <p>Indulge in an unforgettable culinary journey through exquisite flavors and artful presentation. Our passionate chefs craft each dish to perfection using the finest locally-sourced ingredients.</p>
            {isLoggedIn ? (
              <Link to="/reservation" className={styles.reservationBtn}>Make a Reservation</Link>
            ) : (
              <Link to="/login" className={styles.reservationBtn}>Book a Table</Link>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Our Story</h2>
          </div>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>Founded in 2010, Taste Haven began with a simple vision: to create a dining experience that celebrates both tradition and innovation. Our culinary team, led by award-winning Chef Michael Rodriguez, brings together global techniques and local flavors to create dishes that surprise and delight.</p>
              <p>We believe that great food is about more than just taste – it's about creating memories. Every element of our restaurant, from the carefully curated wine list to the seasonal menu changes, is designed to offer our guests an exceptional dining experience.</p>
              <p>Our commitment to sustainability guides everything we do. We work directly with local farmers and producers to ensure the highest quality ingredients while supporting our community and minimizing our environmental impact.</p>
            </div>
            <div className={styles.aboutImage}>
              <img src="https://www.hotelieracademy.org/wp-content/uploads/2017/04/athens-was-hotel.jpg" alt="Taste Haven restaurant interior" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section id="menu" className={styles.menuSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Featured Menu</h2>
          </div>
          <div className={styles.menuGrid}>
            <div className={styles.menuItem}>
              <div className={styles.menuImage} style={{ backgroundImage: "url('https://www.wholesomeyum.com/wp-content/uploads/2023/08/wholesomeyum-Pan-Seared-Scallops-24.jpg')" }}></div>
              <div className={styles.menuInfo}>
                <h3>Pan-Seared Scallops</h3>
                <p>Fresh sea scallops, cauliflower purée, truffle oil, micro greens</p>
                <div className={styles.menuPrice}>1050/-</div>
              </div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuImage} style={{ backgroundImage: "url('https://thehappyfoodie.co.uk/wp-content/uploads/2021/08/tart-london-crispy-roast-chicken-c9d17bc8-70e6-4a70-a79c-6e5ecc3ec118_s900x0_c2145x1253_l0x504.jpg')" }}></div>
              <div className={styles.menuInfo}>
                <h3>Herb-Roasted Chicken Supreme</h3>
                <p>Succulent herb-roasted chicken supreme served with velvety truffle mashed potatoes, seasonal greens, and a fragrant lemon-thyme jus.</p>
                <div className={styles.menuPrice}>1250/-</div>
              </div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuImage} style={{ backgroundImage: "url('https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2019/11/vegan-mushroom-risotto-close-800x1200.jpg')" }}></div>
              <div className={styles.menuInfo}>
                <h3>Wild Mushroom Risotto</h3>
                <p>Arborio rice, seasonal wild mushrooms, aged parmesan, herbs</p>
                <div className={styles.menuPrice}>1500/-</div>
              </div>
            </div>
          </div>
          <Link to="/menu" className={styles.viewMenuBtn}>View Full Menu</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Guest Experiences</h2>
          </div>
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>The attention to detail in every dish was remarkable. From the amuse-bouche to the dessert, Taste Haven delivered a culinary experience that was truly unforgettable.</p>
              <div className={styles.testimonialAuthor}>
                <div>
                  <div className={styles.authorName}>Sarah Johnson</div>
                  <div className={styles.authorTitle}>Food Critic</div>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>We celebrated our anniversary at Taste Haven and were blown away by both the food and service. The staff went above and beyond to make our evening special.</p>
              <div className={styles.testimonialAuthor}>
                <div>
                  <div className={styles.authorName}>Robert & Emma Chen</div>
                  <div className={styles.authorTitle}>Regular Guests</div>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>As someone with dietary restrictions, I'm often limited when dining out. The chef at Taste Haven created a customized tasting menu that was both accommodating and exquisite.</p>
              <div className={styles.testimonialAuthor}>
                <div>
                  <div className={styles.authorName}>Miguel Santos</div>
                  <div className={styles.authorTitle}>Local Resident</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reservation" className={styles.reservationSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Make a Reservation</h2>
          </div>
          <form className={styles.reservationForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Your Name" className={styles.formInput} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your Email" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" placeholder="Your Phone" className={styles.formInput} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Date</label>
                <input type="date" id="date" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="time">Time</label>
                <input type="time" id="time" className={styles.formInput} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="guests">Number of Guests</label>
                <select id="guests" className={styles.formSelect}>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5 People</option>
                  <option value="6">6 People</option>
                  <option value="7+">7+ People</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="occasion">Occasion (Optional)</label>
                <select id="occasion" className={styles.formSelect}>
                  <option value="none">None</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="business">Business Dinner</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="special">Special Requests (Optional)</label>
              <input type="text" id="special" placeholder="Any special requests or dietary requirements?" className={styles.formInput} />
            </div>
            <button type="submit" className={styles.submitBtn}>Confirm Reservation</button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Contact Us</h2>
          </div>
          <div className={styles.contactContainer}>
            <div className={styles.contactInfo}>
              <div className={styles.contactCard}>
                <h3>Visit Us</h3>
                <div className={styles.contactDetail}>
                  <div className={styles.contactIcon}>📍</div>
                  <div>
                    <p>123 Culinary Avenue</p>
                    <p>Hyderabad District, 500040</p>
                  </div>
                </div>
                <div className={styles.contactDetail}>
                  <div className={styles.contactIcon}>🕒</div>
                  <div>
                    <p><strong>Lunch:</strong> Mon-Fri, 11:30am - 2:30pm</p>
                    <p><strong>Dinner:</strong> Daily, 5:30pm - 10:00pm</p>
                    <p><strong>Brunch:</strong> Sat-Sun, 10:00am - 3:00pm</p>
                  </div>
                </div>
              </div>
              <div className={styles.contactCard}>
                <h3>Reach Out</h3>
                <div className={styles.contactDetail}>
                  <div className={styles.contactIcon}>📞</div>
                  <div>
                    <p>123-4567</p>
                  </div>
                </div>
                <div className={styles.contactDetail}>
                  <div className={styles.contactIcon}>✉️</div>
                  <div>
                    <p>info@tastehaven.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.map}>
              <img src="https://www.nobroker.in/locality-iq/images/Jubilee%20Hills.webp" alt="Map location" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContainer}>
            <div className={styles.footerCol}>
              <h4>Taste Haven</h4>
              <p>Experience culinary excellence in the heart of the city. Our passionate team is dedicated to creating unforgettable dining moments.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Quick Links</h4>
              <ul className={styles.footerMenu}>
                <li><a href="#home">Home</a></li>
                <li><a href="#reservation">Reservations</a></li>
                <li><a href="#menu">Menu</a></li>
                {isLoggedIn ? (
                  <>
                    <li><Link to="/profile">Profile</Link></li>
                  </>
                ) : (
                  <li><Link to="/login">Login</Link></li>
                )}
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Contact Info</h4>
              <ul className={styles.footerContact}>
                <li><i>📍</i> 123 Culinary Avenue, 500040</li>
                <li><i>📞</i> 123-4567</li>
                <li><i>✉️</i> info@tastehaven.com</li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YT</a>
              </div>
            </div>
          </div>
          <div className={styles.copyright}>
            <p>&copy; 2025 Taste Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 