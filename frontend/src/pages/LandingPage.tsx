import { Link } from 'react-router-dom';
import { BrainCircuit, Video, BarChart3, Users, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PrepForge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-700">Trusted by 10,000+ job seekers</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Master Your Interview<br/>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Skills with AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            PrepForge combines cutting-edge AI technology with real-time human interviews to
            help you <span className="font-semibold text-purple-600">ace your next job interview</span>. Practice, improve, and succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
              <span className="flex items-center justify-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-bold text-lg hover:border-purple-400 hover:shadow-lg transition-all">
              View Demo
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free forever plan
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose PrepForge?</h2>
          <p className="text-xl text-gray-600">Everything you need to succeed in your interviews</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                  <BrainCircuit className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">AI-Powered Interviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice with advanced AI that provides instant feedback on your responses,
                communication, and confidence.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                  <Video className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Live Human Interviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with experienced interviewers for realistic practice sessions via
                secure video calls.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl">
                  <BarChart3 className="w-10 h-10 text-pink-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Detailed Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your progress with comprehensive performance reports and personalized
                improvement suggestions.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Multiple Interview Types</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice technical, HR, behavioral, coding, and domain-specific interviews
                tailored to your needs.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
                  <Zap className="w-10 h-10 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                Get real-time analysis on your answers, including technical accuracy and
                communication skills.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl">
                  <Shield className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your interview sessions and data are completely secure and private. We prioritize
                your confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of successful candidates who prepared with PrepForge
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
            Start Your Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Contact/Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Need Help or Have Questions?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our team is here to support you. Reach out for queries, feedback, or collaboration opportunities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <a 
                href="mailto:prepforge563@gmail.com"
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Email Support</p>
                    <p className="text-gray-900 font-bold text-lg">prepforge563@gmail.com</p>
                  </div>
                </div>
              </a>

              <a 
                href="tel:+917232915352"
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Phone Support</p>
                    <p className="text-gray-900 font-bold text-lg">+91 7232915352</p>
                  </div>
                </div>
              </a>
            </div>

            <div className="text-center mt-10">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">Business Hours:</span> Monday - Saturday, 9:00 AM - 6:00 PM IST
              </p>
              <p className="text-gray-500 mt-2">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">PrepForge</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered interview preparation platform helping candidates ace their dream jobs.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Features
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:prepforge563@gmail.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    prepforge563@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+917232915352" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +91 7232915352
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} PrepForge. All rights reserved. Made with{' '}
              <span className="text-red-500">♥</span> to help you succeed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
