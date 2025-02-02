// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
      {/* Background Pattern */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#163d640a_1px,transparent_1px),linear-gradient(to_bottom,#163d640a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-[#163d64]/5 to-white"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative min-h-[90vh]  flex items-center justify-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 pt-20 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
               
                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  Pioneering
                  <span className="block text-[#fa4516] mt-2">
                  Compactness Calculation
                  </span>
                </h1>
                <p className="text-xl text-[#163d64]/80 mb-10 max-w-2xl mx-auto">
                  Experience the future of engineering decisions with our cutting-edge Compactness Calculator. 
                  Optimize your material choices with precision and confidence.
                </p>
                <div className="flex justify-center gap-6">
                  <a
                    href="/userinput"
                    className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                  >
                    Get Started Now →
                  </a>
                  <a
                    href="#learn-more"
                    className="px-8 py-4 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>

             
              
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Home;