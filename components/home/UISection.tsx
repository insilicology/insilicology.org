'use client';

import Image from 'next/image';
import MarqueeTags from './MarqueeTags';

export default function UISection() {
  return (
    <section className="pb-16">
      <div className="mt-8 max-w-xs md:max-w-2xl mb-4 md:mb-0 mx-auto">
          <MarqueeTags />
        </div>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="overflow-hidden max-w-4xl mx-auto">
        <Image
            src="/images/ui-demo.webp"
            alt="Platform UI"
            width={1200}
            height={800}
            className="w-full object-cover"
        />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-20">
          আপনার শেখার যাত্রা এখান থেকেই শুরু
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          দক্ষতা অর্জনের জন্য আর অপেক্ষা নয়। আধুনিক UI, এক্সাম সিস্টেম, প্রোগ্রেস ট্র্যাকিং – সব একসাথে একটি প্ল্যাটফর্মে।
        </p>
      </div>
    </section>
  );
}
