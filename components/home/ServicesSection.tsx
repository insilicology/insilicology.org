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
} from 'lucide-react';

const services = [
  {
    title: "Molecular Docking",
    description: "Advanced molecular docking simulations for drug-target interactions and binding affinity predictions.",
    icon: Atom,
    color: "amber"
  },
  {
    title: "Molecular Dynamic Simulation",
    description: "Comprehensive MD simulations for protein dynamics, stability analysis, and conformational studies.",
    icon: Cpu,
    color: "blue"
  },
  {
    title: "DFT Analysis",
    description: "Density Functional Theory calculations for electronic structure analysis and quantum chemical properties.",
    icon: Database,
    color: "green"
  },
  {
    title: "QSAR",
    description: "Quantitative Structure-Activity Relationship modeling for drug design and optimization.",
    icon: FlaskConical,
    color: "purple"
  },
  {
    title: "Network Pharmacology",
    description: "Systems biology approach for understanding drug-target networks and pathway analysis.",
    icon: Network,
    color: "red"
  },
  {
    title: "ADMET Analysis",
    description: "Absorption, Distribution, Metabolism, Excretion, and Toxicity prediction for drug candidates.",
    icon: Pill,
    color: "indigo"
  },
  {
    title: "Vaccine Design",
    description: "Computational vaccine design including epitope prediction and immunogenicity analysis.",
    icon: Shield,
    color: "pink"
  },
  {
    title: "Bioinformatics",
    description: "Comprehensive bioinformatics services including sequence analysis and genomic data processing.",
    icon: FileCode,
    color: "teal"
  },
  {
    title: "CADD",
    description: "Computer-Aided Drug Design for rational drug discovery and lead compound optimization.",
    icon: Search,
    color: "orange"
  },
  {
    title: "3D Protein Modelling",
    description: "High-quality 3D protein structure prediction and homology modeling services.",
    icon: Box,
    color: "cyan"
  }
];

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
    amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
    pink: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
    teal: { bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-200" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
    cyan: { bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-200" }
  };
  return colorMap[color] || colorMap.amber;
};

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full text-amber-700 text-sm font-medium mb-6">
            <Dna className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive
            <span className="text-amber-500 block">Computational Biology</span>
            Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From molecular docking to vaccine design, we provide cutting-edge computational biology 
            solutions to accelerate your research and drug discovery projects.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = getColorClasses(service.color);
            const IconComponent = service.icon;
            
            return (
              <div 
                key={index}
                className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} ${colors.border} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {IconComponent && <IconComponent className={`w-8 h-8 ${colors.text}`} />}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Hover Effect */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-amber-600 font-medium">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Accelerate Your Research?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get in touch with our team of computational biology experts to discuss your project 
              requirements and discover how we can help you achieve breakthrough results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Your Project
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a 
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
              >
                View All Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 