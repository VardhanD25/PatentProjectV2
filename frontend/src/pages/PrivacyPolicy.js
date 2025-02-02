import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
      {/* Background Pattern */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#163d640a_1px,transparent_1px),linear-gradient(to_bottom,#163d640a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-[#163d64]/5 to-white"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow p-8 mt-[80px] mb-[80px]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10"
            >
              <h1 className="text-5xl font-bold text-[#163d64] mb-12">Privacy Policy</h1>
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">1. Information We Collect</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-[#163d64]">1.1 Personal Information</h3>
                  <p className="text-[#163d64]/80">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Name and email address when you create an account</li>
                    <li>Company information if provided</li>
                    <li>Usage data and calculation history</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">2. How We Use Your Information</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <p className="text-[#163d64]/80">We use the collected information to:</p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process and store your calculations</li>
                    <li>Send important notifications about our service</li>
                    <li>Respond to your comments and questions</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">3. Data Security</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <p className="text-[#163d64]/80">
                    We implement appropriate security measures to protect your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication measures</li>
                    <li>Secure data storage practices</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">4. Data Retention</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. You can request deletion of your account and associated data at any time.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">5. Your Rights</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <p className="text-[#163d64]/80">You have the right to:</p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to data processing</li>
                    <li>Export your data</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">6. Updates to This Policy</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">7. Contact Us</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    If you have any questions about this privacy policy or our practices, please contact us at:
                    <br />
                    <a href="mailto:support@compactnesscalculator.com" className="text-[#fa4516] hover:text-[#fa4516]/80 transition-colors duration-300">
                    mangeshp@manshaprotech.com
                    </a>
                  </p>
                </div>
              </section>

              <div className="text-sm text-[#163d64]/60 mt-12">
                Last Updated: {new Date().toLocaleDateString()}
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default PrivacyPolicy;