import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-slate-200 mb-8">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">1. Information We Collect</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <h3 className="text-xl text-slate-200">1.1 Personal Information</h3>
              <p className="text-slate-300">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Name and email address when you create an account</li>
                <li>Company information if provided</li>
                <li>Usage data and calculation history</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">2. How We Use Your Information</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <p className="text-slate-300">We use the collected information to:</p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and store your calculations</li>
                <li>Send important notifications about our service</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">3. Data Security</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <p className="text-slate-300">
                We implement appropriate security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage practices</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">4. Data Retention</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. You can request deletion of your account and associated data at any time.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">5. Your Rights</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-4">
              <p className="text-slate-300">You have the right to:</p>
              <ul className="list-disc pl-6 text-slate-300">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">6. Updates to This Policy</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">7. Contact Us</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300">
                If you have any questions about this privacy policy or our practices, please contact us at:
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

export default PrivacyPolicy;