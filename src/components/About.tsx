import React from 'react';
import { Sprout, Users, TrendingUp, Handshake, Compass, HeartHandshake } from 'lucide-react';

interface AboutProps {
  language: 'EN' | 'SI';
}

export default function About({ language }: AboutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12" id="about-page">
      {/* Visual Header card */}
      <div className="relative bg-[#5A5A40] text-white rounded-[32px] p-8 sm:p-12 overflow-hidden shadow-sm mb-12">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block bg-[#8B4513] text-white text-xs font-serif font-bold px-3 py-1 rounded-xl uppercase tracking-wider">
            {language === 'EN' ? 'Our Mission' : 'අපගේ මෙහෙවර'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            {language === 'EN' ? 'About Mushroom Eco Hub' : 'හතු පරිසර කේන්ද්‍රය පිළිබඳව'}
          </h1>
          <p className="text-[#F5F5F0]/90 text-sm sm:text-base leading-relaxed font-sans">
            {language === 'EN'
              ? 'Organizing local cultivators, processors, and buyers into one synergistic, highly efficient co-operative network.'
              : 'දේශීය වගාකරුවන්, සකසන්නන් සහ ගැනුම්කරුවන් එකම කාර්යක්ෂම සමුපකාර ජාලයකට ඒකාබද්ධ කිරීම.'}
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white border border-[#5A5A40]/10 rounded-[32px] p-8 sm:p-10 space-y-8 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#2D2D2A] flex items-center space-x-2">
            <Compass className="h-6 w-6 text-[#8B4513]" />
            <span>{language === 'EN' ? 'The Collective Growth Concept' : 'පොදු වර්ධන සංකල්පය'}</span>
          </h2>
          <div className="h-1 w-16 bg-[#8B4513]"></div>
          <p className="text-[#2D2D2A]/85 text-sm leading-relaxed sm:text-base font-sans">
            {language === 'EN' ? (
              <>
                <strong>Mushroom Eco Hub</strong> is built to create an income-generating mushroom ecosystem. It connects growers, buyers, trainers, processors, and partners into one organized system.
                <span className="block mt-4 text-[#8B4513] font-serif font-bold italic bg-[#F5F5F0] border-l-4 border-[#8B4513] p-4 rounded-r-xl">
                  "The goal is not competition. The goal is shared growth."
                </span>
              </>
            ) : (
              <>
                <strong>හතු පරිසර කේන්ද්‍රය (Mushroom Eco Hub)</strong> ගොඩනගා ඇත්තේ ස්ථාවර ආදායම් උත්පාදනය කරන පරිසර පද්ධතියක් නිර්මාණය කිරීම සඳහාය. එය වගාකරුවන්, ගැනුම්කරුවන්, පුහුණුකරුවන් සහ සකසන්නන් එකම ක්‍රමානුකූල පද්ධතියකට සම්බන්ධ කරයි.
                <span className="block mt-4 text-[#8B4513] font-serif font-bold italic bg-[#F5F5F0] border-l-4 border-[#8B4513] p-4 rounded-r-xl">
                  "අපගේ අරමුණ තරඟකාරීත්වය නොවේ. අපගේ එකම අරමුණ පොදු සහභාගීත්ව වර්ධනයයි."
                </span>
              </>
            )}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#5A5A40]/10">
          <div className="space-y-2">
            <div className="p-2.5 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl inline-block">
              <Users className="h-5 w-5 text-[#5A5A40]" />
            </div>
            <h4 className="font-serif font-bold text-[#2D2D2A] text-sm">{language === 'EN' ? 'Unified Representation' : 'එකමුතු නියෝජනය'}</h4>
            <p className="text-[#2D2D2A]/70 text-xs leading-relaxed font-sans">
              Consolidating crop volumes under one digital dashboard allows small-scale rural families to negotiate on equal terms with premium supermarkets and wholesale exporters.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-[#8B4513]/10 text-[#8B4513] rounded-xl inline-block">
              <HeartHandshake className="h-5 w-5 text-[#8B4513]" />
            </div>
            <h4 className="font-serif font-bold text-[#2D2D2A] text-sm">{language === 'EN' ? 'No Wastage Guarantee' : 'අපතේ නොයෑමේ සහතිකය'}</h4>
            <p className="text-[#2D2D2A]/70 text-xs leading-relaxed font-sans">
              Excess fresh oyster mushrooms are directly routed to value-added processing depots to manufacture powder, pickles, meatballs and sausages.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-[#2D2D2A]/10 text-[#2D2D2A] rounded-xl inline-block">
              <TrendingUp className="h-5 w-5 text-[#2D2D2A]" />
            </div>
            <h4 className="font-serif font-bold text-[#2D2D2A] text-sm">{language === 'EN' ? 'Knowledge Standard' : 'දැනුම ප්‍රමිතිකරණය'}</h4>
            <p className="text-[#2D2D2A]/70 text-xs leading-relaxed font-sans">
              Providing standardized certification paths for beginners ensures clean, sterilized sawdust grow bags and prevents pest infestations across the region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
