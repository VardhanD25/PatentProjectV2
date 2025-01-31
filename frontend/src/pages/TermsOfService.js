import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-900 pointer-events-none" />

      <main className="relative container mx-auto px-4 py-32 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-3xl font-bold text-slate-200 mb-8">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">1. Acceptance of Terms</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                By accessing and using Compactness Calculator, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">2. Use of Service</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <p className="text-slate-300">You agree to:</p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Provide accurate and complete information when using our service</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not interfere with or disrupt the service or servers</li>
                <li>Not attempt to gain unauthorized access to any part of the service</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">3. Account Responsibilities</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <p className="text-slate-300">Users are responsible for:</p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Maintaining the confidentiality of their account credentials</li>
                <li>All activities that occur under their account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring their account information is accurate and up-to-date</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">4. Intellectual Property</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                All content, features, and functionality of the Compactness Calculator service, including but not limited to text, graphics, logos, and software, are the exclusive property of Compactness Calculator and are protected by intellectual property laws.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">5. Limitation of Liability</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                Compactness Calculator shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. The service is provided "as is" without any warranties of any kind.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">6. Service Modifications</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will make reasonable efforts to provide notice of significant changes.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">7. Termination</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <p className="text-slate-300">We may terminate or suspend your account if you:</p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Violate these Terms of Service</li>
                <li>Provide false information</li>
                <li>Engage in unauthorized use of the service</li>
                <li>Fail to comply with applicable laws or regulations</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">8. Governing Law</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">9. Contact Information</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                For any questions about these Terms of Service, please contact us at:
                <br />
                <a href="mailto:support@compactnesscalculator.com" className="text-blue-400 hover:text-blue-300">
                  support@compactnesscalculator.com
                </a>
              </p>
            </div>
          </section>

          <div className="text-sm text-slate-400 mt-12">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsOfService;