import { TrendingUp, Users, FileText, Clock } from 'lucide-react';

const stats = [
  {
    number: "500+",
    label: "Projects Completed",
    description: "Successfully delivered computational biology projects",
    icon: TrendingUp,
    color: "amber"
  },
  {
    number: "150+",
    label: "Happy Clients",
    description: "Pharmaceutical companies and research institutions",
    icon: Users,
    color: "blue"
  },
  {
    number: "75+",
    label: "Papers Published",
    description: "Research papers in peer-reviewed journals",
    icon: FileText,
    color: "green"
  },
  {
    number: "8+",
    label: "Years Experience",
    description: "In computational biology and drug discovery",
    icon: Clock,
    color: "purple"
  }
];

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
    amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" }
  };
  return colorMap[color] || colorMap.amber;
};

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Impact in
            <span className="text-amber-500 block">Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering exceptional results through years of expertise in computational biology 
            and drug discovery research.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const colors = getColorClasses(stat.color);
            const IconComponent = stat.icon;
            
            return (
              <div 
                key={index}
                className="text-center group"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 ${colors.bg} ${colors.border} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-10 h-10 ${colors.text}`} />
                </div>

                {/* Number */}
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {stat.number}
                </div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted by Leading Institutions
            </h3>
            <p className="text-gray-600 mb-6">
              Our expertise has been recognized by pharmaceutical companies, research institutions, 
              and universities worldwide. We&apos;re committed to advancing scientific discovery through 
              innovative computational approaches.
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <div className="text-sm font-medium text-gray-500">Pharmaceutical Companies</div>
              <div className="text-sm font-medium text-gray-500">Research Institutions</div>
              <div className="text-sm font-medium text-gray-500">Universities</div>
              <div className="text-sm font-medium text-gray-500">Biotech Startups</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 