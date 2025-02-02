import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Create a simple object with the data
      const data = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toISOString()
      };

      console.log('Sending data:', data);

      // Send as URL-encoded form data
      const formBody = Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

      await fetch('https://script.google.com/macros/s/AKfycbykM_iciUVp4jJHnaks_mPyPLnMzhcXjLWfznFurNn5LdlVh2uI6t6Kd6hLrQaZmp8EhQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });

      console.log('Form data sent:', formBody);

      setStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!'
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              <h1 className="text-5xl font-bold text-[#163d64] text-center mb-12">Contact Us</h1>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10 space-y-6">
                    <h2 className="text-2xl font-bold text-[#163d64]">Get in Touch</h2>
                    <p className="text-[#163d64]/80">
                      Have questions about our services? We're here to help.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#163d64]">Email</h3>
                        <p>
                          <a href="mailto:mangeshp@manshaprotech.com" className="text-[#fa4516] hover:text-[#fa4516]/80 transition-colors duration-300">
                            mangeshp@manshaprotech.com
                          </a>
                        </p>
                      </div>


                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#163d64]">Location</h3>
                        <p className="text-[#163d64]/80">Mumbai, India</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#163d64]">Hours</h3>
                        <p className="text-[#163d64]/80">
                          Monday - Friday<br />
                          9:00 AM - 6:00 PM IST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {status.message && (
                      <div className={`p-4 rounded-xl ${
                        status.type === 'success' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {status.message}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#163d64]">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#163d64]">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                        placeholder="Your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#163d64]">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                        placeholder="Message subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#163d64]">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                        placeholder="Your message"
                      ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default ContactUs;