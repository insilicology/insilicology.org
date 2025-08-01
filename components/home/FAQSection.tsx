'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is computational biology and how can it benefit my research?",
    answer: "Computational biology combines computer science, mathematics, and biology to analyze biological data and model biological systems. It can accelerate your research by predicting drug interactions, analyzing protein structures, and identifying potential drug candidates before expensive laboratory experiments."
  },
  {
    question: "How accurate are molecular docking predictions?",
    answer: "Molecular docking predictions typically achieve 70-80% accuracy when using advanced algorithms and proper validation methods. Our team uses state-of-the-art software and multiple validation approaches to ensure the highest possible accuracy for your drug discovery projects."
  },
  {
    question: "What types of projects do you typically work on?",
    answer: "We work on diverse projects including drug discovery, protein structure prediction, vaccine design, ADMET analysis, and bioinformatics research. Our clients range from pharmaceutical companies to academic research institutions and biotech startups."
  },
  {
    question: "How long does a typical computational biology project take?",
    answer: "Project timelines vary depending on complexity. Simple molecular docking studies can be completed in 1-2 weeks, while comprehensive drug discovery projects may take 2-3 months. We provide detailed timelines during project planning and regular updates throughout the process."
  },
  {
    question: "Do you provide support for manuscript preparation and publication?",
    answer: "Yes, we offer comprehensive support including data analysis, figure preparation, and manuscript writing assistance. Our team has extensive experience publishing in peer-reviewed journals and can help you prepare your findings for publication."
  },
  {
    question: "What software and tools do you use for your analyses?",
    answer: "We use industry-standard software including AutoDock, GROMACS, Schrödinger Suite, PyMOL, and custom scripts. Our team stays updated with the latest tools and methodologies to provide cutting-edge computational biology solutions."
  },
  {
    question: "Can you work with confidential or proprietary data?",
    answer: "Absolutely. We maintain strict confidentiality protocols and can sign NDAs. All data is handled securely, and we can work with your existing data management systems to ensure complete privacy and security of your research."
  },
  {
    question: "What makes your computational biology services different from others?",
    answer: "Our team combines deep expertise in both computational methods and biological applications. We provide personalized solutions, comprehensive documentation, ongoing support, and ensure our results are biologically relevant and actionable for your research goals."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg mb-6">
            <MessageCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-700">
            Get answers to common questions about our computational biology services and processes.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 relative"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-green-50/50 transition-all duration-300 relative"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-gray-800 transition-colors">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <ChevronUp className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300">
                      <ChevronDown className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6 relative">
                  <div className="border-t border-green-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-white mb-4">
                Still Have Questions?
              </h3>
              <p className="text-white/90 mb-8 text-lg">
                Our team of computational biology experts is here to help. 
                Get in touch with us for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Contact Us
                  <Zap className="w-5 h-5" />
                </a>
                <a 
                  href="/services"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 