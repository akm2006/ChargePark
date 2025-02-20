"use client"
import { motion } from "framer-motion"
import { Battery, MapPin, Zap, Car, Search, Mail, Phone, MapIcon, Github } from "lucide-react"
import Link from "next/link"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 pt-8"
      >
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <Zap size={32} className="text-emerald-400" />
            <span className="text-2xl font-bold text-white">ChargePark</span>
          </motion.div>
          <Link href={"/search"}>  <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-400 text-gray-900 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-emerald-500"
          >
            Get Started
          </motion.button></Link>

        </nav>

        {/* Hero section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Finding EV Charging
              <br />
              <span className="text-emerald-400">Made Simple</span>
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              Locate nearby charging stations and parking spots in real-time. Navigate with confidence, charge with
              ease.
            </p>
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-400 text-gray-900 px-8 py-3 rounded-full font-semibold shadow-md hover:bg-emerald-500"
              >
                Download App
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-gray-600"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="md:w-1/2"
          >
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700"
              >
                <div className="flex justify-center mb-4">
                  <MapPin size={48} className="text-emerald-400" />
                </div>
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Search size={20} className="text-gray-400" />
                    <span className="text-gray-400">Search for charging stations...</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-700 p-4 rounded-lg">
                    <Battery className="text-blue-400 mb-2" />
                    <h3 className="font-semibold">Fast Charging</h3>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-700 p-4 rounded-lg">
                    <Car className="text-green-400 mb-2" />
                    <h3 className="font-semibold">Smart Parking</h3>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Features section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Battery size={32} />,
              title: "Real-time Availability",
              description: "Check charging station status instantly",
            },
            {
              icon: <MapPin size={32} />,
              title: "Smart Navigation",
              description: "Get turn-by-turn directions to your destination",
            },
            {
              icon: <Car size={32} />,
              title: "Parking Finder",
              description: "Locate available parking spots nearby",
            },
          ].map((feature, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
              <div className="text-emerald-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-900 text-white"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap size={24} className="text-emerald-400" />
                <h3 className="text-xl font-bold">ChargePark</h3>
              </div>
              <p className="text-gray-400 mb-4">Making EV charging and parking simple and accessible for everyone.</p>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Powered By</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <MapIcon size={16} className="text-gray-500" />
                  <span>Google Maps API</span>
                </li>
                <li>Next.js</li>
                <li>Firebase</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Find Stations</li>
                <li>Parking Solutions</li>
                <li>Support</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-500" />
                  <span>contact@chargepark.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 ChargePark. All rights reserved.</p>
            <div className="flex justify-center items-center space-x-2 mt-4">
              <motion.div whileHover={{ scale: 1.1 }} className="bg-gray-800 p-2 rounded-full">
                <Github size={20} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default LandingPage