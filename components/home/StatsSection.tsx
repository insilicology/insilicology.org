import { TrendingUp, Users, FileText, Clock, Sparkles, Zap } from 'lucide-react';

const stats = [
  {
    number: "500+",
    label: "Projects Completed",
    description: "Successfully delivered computational biology projects",
    icon: TrendingUp,
    gradient: "from-orange-400 to-red-500",
    bgGradient: "from-orange-50 to-red-50"
  },
  {
    number: "150+",
    label: "Happy Clients",
    description: "Pharmaceutical companies and research institutions",
    icon: Users,
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    number: "75+",
    label: "Papers Published",
    description: "Research papers in peer-reviewed journals",
    icon: FileText,
    gradient: "from-green-400 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    number: "8+",
    label: "Years Experience",
    description: "In computational biology and drug discovery",
    icon: Clock,
    gradient: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50"
  }
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-10 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-10 animate-pulse delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Impact in
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Delivering exceptional results through years of expertise in computational biology 
            and drug discovery research.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <div 
                key={index}
                className="text-center group relative"
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${stat.gradient} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <IconComponent className="w-10 h-10" />
                    <div className="absolute inset-0 bg-white opacity-20 rounded-2xl"></div>
                  </div>

                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-500">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {stat.number}
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {stat.description}
                  </p>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-white mb-4">
                Trusted by Leading Institutions
              </h3>
              <p className="text-white/90 mb-8 text-lg">
                Our expertise has been recognized by pharmaceutical companies, research institutions, 
                and universities worldwide. We&apos;re committed to advancing scientific discovery through 
                innovative computational approaches.
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-80">
                <div className="text-sm font-medium text-white/90 bg-white/10 px-4 py-2 rounded-full">Pharmaceutical Companies</div>
                <div className="text-sm font-medium text-white/90 bg-white/10 px-4 py-2 rounded-full">Research Institutions</div>
                <div className="text-sm font-medium text-white/90 bg-white/10 px-4 py-2 rounded-full">Universities</div>
                <div className="text-sm font-medium text-white/90 bg-white/10 px-4 py-2 rounded-full">Biotech Startups</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 