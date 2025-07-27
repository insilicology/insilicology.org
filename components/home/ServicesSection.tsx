import { 
  Atom, 
  Cpu, 
  Database, 
  FlaskConical, 
  Network, 
  Pill, 
  Shield, 
  FileCode, 
  Search,
  Box,
  Dna,
  Sparkles,
  Zap,
} from 'lucide-react';

const services = [
  {
    title: "Molecular Docking",
    description: "Advanced molecular docking simulations for drug-target interactions and binding affinity predictions.",
    icon: Atom,
    gradient: "from-orange-400 to-red-500",
    bgGradient: "from-orange-50 to-red-50"
  },
  {
    title: "Molecular Dynamic Simulation",
    description: "Comprehensive MD simulations for protein dynamics, stability analysis, and conformational studies.",
    icon: Cpu,
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    title: "DFT Analysis",
    description: "Density Functional Theory calculations for electronic structure analysis and quantum chemical properties.",
    icon: Database,
    gradient: "from-green-400 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    title: "QSAR",
    description: "Quantitative Structure-Activity Relationship modeling for drug design and optimization.",
    icon: FlaskConical,
    gradient: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    title: "Network Pharmacology",
    description: "Systems biology approach for understanding drug-target networks and pathway analysis.",
    icon: Network,
    gradient: "from-red-400 to-pink-500",
    bgGradient: "from-red-50 to-pink-50"
  },
  {
    title: "ADMET Analysis",
    description: "Absorption, Distribution, Metabolism, Excretion, and Toxicity prediction for drug candidates.",
    icon: Pill,
    gradient: "from-indigo-400 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50"
  },
  {
    title: "Vaccine Design",
    description: "Computational vaccine design including epitope prediction and immunogenicity analysis.",
    icon: Shield,
    gradient: "from-pink-400 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    title: "Bioinformatics",
    description: "Comprehensive bioinformatics services including sequence analysis and genomic data processing.",
    icon: FileCode,
    gradient: "from-teal-400 to-cyan-500",
    bgGradient: "from-teal-50 to-cyan-50"
  },
  {
    title: "CADD",
    description: "Computer-Aided Drug Design for rational drug discovery and lead compound optimization.",
    icon: Search,
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50"
  },
  {
    title: "3D Protein Modelling",
    description: "High-quality 3D protein structure prediction and homology modeling services.",
    icon: Box,
    gradient: "from-cyan-400 to-blue-500",
    bgGradient: "from-cyan-50 to-blue-50"
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Comprehensive
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Computational Biology
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            From molecular docking to vaccine design, we provide cutting-edge computational biology 
            solutions to accelerate your research and drug discovery projects.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${service.gradient} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {IconComponent && <IconComponent className="w-10 h-10" />}
                  <div className="absolute inset-0 bg-white opacity-20 rounded-2xl"></div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center text-purple-600 font-semibold">
                      <span>Learn More</span>
                      <Zap className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Accelerate Your Research?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                Get in touch with our team of computational biology experts to discuss your project 
                requirements and discover how we can help you achieve breakthrough results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Your Project
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a 
                  href="/services"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  View All Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 