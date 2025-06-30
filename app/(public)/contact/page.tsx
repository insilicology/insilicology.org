// app/(public)/contact/page.tsx

import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Globe, Users, Award, Zap } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Contact Us - Insilicology',
    description: 'Get in touch with Insilicology for computational biology solutions, consulting, and research collaboration.',
    keywords: [
      "Contact Insilicology",
      "Computational Biology Consulting",
      "Research Collaboration",
      "Bioinformatics Services"
    ],
    metadataBase: new URL('https://insilicology.org'),
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title: 'Contact Us - Insilicology',
      description: 'Get in touch with Insilicology for computational biology solutions, consulting, and research collaboration.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us - Insilicology',
      description: 'Get in touch with Insilicology for computational biology solutions, consulting, and research collaboration.',
    },
  }
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-8">
              <MessageCircle className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Let's Work Together
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to advance your computational biology research? Get in touch with our expert team for 
              consultation, collaboration, or to discuss your next project.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Primary Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're looking for computational biology consulting, research collaboration, 
                or have questions about our services, we're here to help.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-4 rounded-xl flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Mail className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Email Us
                    </h3>
                    <p className="text-gray-600 mb-4">
                      For general inquiries and project discussions
                    </p>
                    <a 
                      href="mailto:insilicology@gmail.com" 
                      className="text-amber-600 hover:text-amber-700 font-semibold text-lg transition-colors"
                    >
                      insilicology@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-4 rounded-xl flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <Phone className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Call Us
                    </h3>
                    <p className="text-gray-600 mb-4">
                      For urgent matters and direct consultation
                    </p>
                    <a 
                      href="tel:+8801617082936" 
                      className="text-green-600 hover:text-green-700 font-semibold text-lg transition-colors"
                    >
                      +880 1617 082936
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-4 rounded-xl flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <MapPin className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Visit Us
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Our office location in Dhaka
                    </p>
                    <p className="text-blue-600 font-semibold">
                      Savar, Dhaka 1340<br />
                      Bangladesh
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-4 rounded-xl flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                    <Clock className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 mb-4">
                      When we're available for consultation
                    </p>
                    <div className="text-purple-600 font-semibold space-y-1">
                      <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Quick Response Guarantee
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                We understand the importance of timely communication in research projects. 
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <Send className="w-4 h-4" />
                <span>Emergency consultations available upon request</span>
              </div>
            </div>
          </div>

          {/* Sidebar - Services & Info */}
          <div className="space-y-8">
            {/* Services We Offer */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Services We Offer</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Computational Biology Consulting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Bioinformatics Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Research Collaboration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Data Analysis & Visualization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Algorithm Development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Training & Workshops</span>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Insilicology?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Team</h4>
                    <p className="text-sm text-gray-600">PhD-level computational biologists</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Global Experience</h4>
                    <p className="text-sm text-gray-600">International research collaborations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Personalized Approach</h4>
                    <p className="text-sm text-gray-600">Tailored solutions for your needs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with our latest research, publications, and computational biology insights.
              </p>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                  <span className="text-gray-700">Facebook</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">in</span>
                  </div>
                  <span className="text-gray-700">LinkedIn</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">X</span>
                  </div>
                  <span className="text-gray-700">Twitter/X</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Our Office</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visit us in Savar, Dhaka for in-person consultations and collaborative meetings
            </p>
          </div>
          <div className="w-full h-96 md:h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430136!2d90.4066373!3d23.7939108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c72ea1b76%3A0x6c369d0b5a7b3b1a!2sBanani%2C%20Dhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Insilicology Office Location"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}