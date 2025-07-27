// components/MarqueeTags.tsx
'use client';

import Marquee from 'react-fast-marquee';

export default function MarqueeTags() {
  const tags = [
    { name: 'Molecular Docking', color: 'from-orange-400 to-red-500' },
    { name: 'DFT Analysis', color: 'from-blue-400 to-cyan-500' },
    { name: 'QSAR Modeling', color: 'from-green-400 to-emerald-500' },
    { name: 'ADMET Analysis', color: 'from-purple-400 to-pink-500' },
    { name: 'Vaccine Design', color: 'from-pink-400 to-rose-500' },
    { name: 'Bioinformatics', color: 'from-teal-400 to-cyan-500' },
    { name: 'CADD', color: 'from-amber-400 to-orange-500' },
    { name: 'Protein Modeling', color: 'from-indigo-400 to-purple-500' },
    { name: 'Network Pharmacology', color: 'from-red-400 to-pink-500' },
    { name: 'Drug Discovery', color: 'from-emerald-400 to-green-500' },
  ];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 py-8">
      <Marquee
        gradient={true}
        gradientWidth={50}
        speed={40}
        className="w-full"
      >
        <div className="flex gap-4 items-center flex-nowrap mr-4">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className={`text-white text-sm whitespace-nowrap px-6 py-3 rounded-full shadow-lg bg-gradient-to-r ${tag.color} hover:scale-105 transition-transform duration-300 font-medium`}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
