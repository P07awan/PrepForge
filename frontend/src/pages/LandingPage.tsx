import { Link } from 'react-router-dom';
import { BrainCircuit, Video, BarChart3, Users, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">PrepForge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Interview Skills with{' '}
            <span className="text-primary-600">AI-Powered</span> Practice
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            PrepForge combines cutting-edge AI technology with real-time human interviews to
            help you ace your next job interview. Practice, improve, and succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose PrepForge?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <BrainCircuit className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Interviews</h3>
            <p className="text-gray-600">
              Practice with advanced AI that provides instant feedback on your responses,
              communication, and confidence.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Video className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Human Interviews</h3>
            <p className="text-gray-600">
              Connect with experienced interviewers for realistic practice sessions via
              secure video calls.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <BarChart3 className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-gray-600">
              Track your progress with comprehensive performance reports and personalized
              improvement suggestions.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Interview Types</h3>
            <p className="text-gray-600">
              Practice technical, HR, behavioral, coding, and domain-specific interviews
              tailored to your needs.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Zap className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
            <p className="text-gray-600">
              Get real-time analysis on your answers, including technical accuracy and
              communication skills.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your interview sessions and data are completely secure and private. We prioritize
              your confidentiality.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful candidates who prepared with PrepForge
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Contact/Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help or Have Questions?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team is here to support you. Reach out for queries, feedback, or collaboration opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <a 
              href="mailto:prepforge563@gmail.com"
              className="card hover:shadow-lg transition-shadow flex items-center space-x-4 group"
            >
              <div className="bg-primary-100 p-4 rounded-lg group-hover:bg-primary-200 transition-colors">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Email Support</p>
                <p className="text-gray-900 font-semibold">prepforge563@gmail.com</p>
              </div>
            </a>

            <a 
              href="tel:+917232915352"
              className="card hover:shadow-lg transition-shadow flex items-center space-x-4 group"
            >
              <div className="bg-secondary-100 p-4 rounded-lg group-hover:bg-secondary-200 transition-colors">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Phone Support</p>
                <p className="text-gray-900 font-semibold">+91 7232915352</p>
              </div>
            </a>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              <span className="font-medium">Business Hours:</span> Monday - Saturday, 9:00 AM - 6:00 PM IST
            </p>
            <p className="text-gray-500 text-sm mt-2">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BrainCircuit className="w-6 h-6 text-primary-400" />
                <span className="text-lg font-bold text-white">PrepForge</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered interview preparation platform helping candidates ace their dream jobs.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-primary-400">Login</Link></li>
                <li><Link to="/register" className="hover:text-primary-400">Sign Up</Link></li>
                <li><a href="#features" className="hover:text-primary-400">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:prepforge563@gmail.com" className="hover:text-primary-400">
                    prepforge563@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+917232915352" className="hover:text-primary-400">
                    +91 7232915352
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">© 2025 PrepForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
