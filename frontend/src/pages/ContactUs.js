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

        <main className="flex-grow p-8 mt-[80px] mb-[80px] flex items-center justify-center">
          <div className="max-w-6xl mx-auto w-full">
            <div className="space-y-12">
              <h1 className="text-6xl font-bold text-[#163d64] text-center mb-12">Contact Us</h1>

              <div className="flex justify-center">
                {/* Contact Information */}
                <div className="max-w-2xl w-full">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10 space-y-8">
                    <h2 className="text-4xl font-bold text-[#163d64] text-center">Get in Touch</h2>
                    <p className="text-2xl text-[#163d64]/80 text-center">
                      Have questions about our services? We're here to help.
                    </p>
                    
                    <div className="space-y-8">
                      <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-semibold text-[#163d64]">Email</h3>
                        <p>
                          <a href="mailto:mangeshp@manshaprotech.com" className="text-xl text-[#fa4516] hover:text-[#fa4516]/80 transition-colors duration-300">
                            mangeshp@manshaprotech.com
                          </a>
                        </p>
                      </div>

                      <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-semibold text-[#163d64]">Location</h3>
                        <p className="text-xl text-[#163d64]/80">Pune, India</p>
                      </div>

                      <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-semibold text-[#163d64]">Hours</h3>
                        <p className="text-xl text-[#163d64]/80">
                          Monday - Friday<br />
                          9:00 AM - 6:00 PM IST
                        </p>
                      </div>
                    </div>
                  </div>
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