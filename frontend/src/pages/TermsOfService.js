import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function TermsOfService() {
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
              <h1 className="text-5xl font-bold text-[#163d64] mb-12">Terms of Service</h1>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">1. Acceptance of Terms</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    By accessing and using Compactness Calculator, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">2. Use of Service</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <p className="text-[#163d64]/80">You agree to:</p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Provide accurate and complete information when using our service</li>
                    <li>Use the service only for lawful purposes</li>
                    <li>Not interfere with or disrupt the service or servers</li>
                    <li>Not attempt to gain unauthorized access to any part of the service</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">3. Account Responsibilities</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <p className="text-[#163d64]/80">Users are responsible for:</p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Maintaining the confidentiality of their account credentials</li>
                    <li>All activities that occur under their account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring their account information is accurate and up-to-date</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">4. Intellectual Property</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    All content, features, and functionality of the Compactness Calculator service, including but not limited to text, graphics, logos, and software, are the exclusive property of Compactness Calculator and are protected by intellectual property laws.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">5. Limitation of Liability</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    Compactness Calculator shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. The service is provided "as is" without any warranties of any kind.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">6. Service Modifications</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will make reasonable efforts to provide notice of significant changes.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">7. Termination</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6 space-y-4">
                  <p className="text-[#163d64]/80">We may terminate or suspend your account if you:</p>
                  <ul className="list-disc pl-6 text-[#163d64]/80 space-y-2">
                    <li>Violate these Terms of Service</li>
                    <li>Provide false information</li>
                    <li>Engage in unauthorized use of the service</li>
                    <li>Fail to comply with applicable laws or regulations</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">8. Governing Law</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#163d64] mb-4">9. Contact Information</h2>
                <div className="bg-[#163d64]/5 rounded-xl p-6">
                  <p className="text-[#163d64]/80">
                    For any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;