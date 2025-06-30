'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked
            <span className="text-amber-500 block">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our computational biology services and processes.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-amber-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team of computational biology experts is here to help. 
              Get in touch with us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a 
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 