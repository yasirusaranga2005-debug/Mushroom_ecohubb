import React from 'react';
import { Sprout, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  language: 'EN' | 'SI';
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ language, setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D2D2A] text-[#F5F5F0] border-t-4 border-[#8B4513]" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Motto */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo darkBg={true} />
            </div>
            <p className="text-[#F5F5F0]/80 text-sm leading-relaxed mb-4 max-w-sm">
              {language === 'EN'
                ? 'We operate with a No Competition Mentality. By organizing our capacities, sharing knowledge, and selling together, we grow the national mushroom economy as one.'
                : 'අපි තරඟකාරීත්වයෙන් තොර මානසිකත්වයකින් ක්‍රියාත්මක වෙමු. අපගේ ධාරිතාවයන් සංවිධානය කිරීමෙන්, දැනුම බෙදාගැනීමෙන් සහ එක්ව අලෙවි කිරීමෙන්, අපි සමස්ත හතු ආර්ථිකය එකක් ලෙස වර්ධනය කරමු.'}
            </p>
            <div className="flex space-x-2 text-xs bg-[#5A5A40]/30 border border-[#5A5A40]/40 text-[#F5F5F0]/90 p-2.5 rounded-xl max-w-xs items-center">
              <Shield className="h-4 w-4 shrink-0 text-[#8B4513]" />
              <span>
                {language === 'EN' 
                  ? 'No competition mentality. We grow together.' 
                  : 'තරඟයක් නැත. අපි හැමෝම එකට වර්ධනය වෙමු.'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#F5F5F0]/10 pb-2">
              {language === 'EN' ? 'Ecosystem' : 'පරිසර පද්ධතිය'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('marketplace')} className="text-[#F5F5F0]/70 hover:text-[#8B4513] text-left transition">
                  {language === 'EN' ? 'Mushroom Marketplace' : 'හතු වෙළඳපොළ'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('training')} className="text-[#F5F5F0]/70 hover:text-[#8B4513] text-left transition">
                  {language === 'EN' ? 'Farming Training' : 'වගා පුහුණුවීම්'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('opportunities')} className="text-[#F5F5F0]/70 hover:text-[#8B4513] text-left transition">
                  {language === 'EN' ? 'Opportunity Board' : 'අවස්ථා පුවරුව'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="text-[#F5F5F0]/70 hover:text-[#8B4513] text-left transition">
                  {language === 'EN' ? 'Our Mission' : 'අපගේ අරමුණ'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#F5F5F0]/10 pb-2">
              {language === 'EN' ? 'Contact Desk' : 'සම්බන්ධතා පියස'}
            </h3>
            <ul className="space-y-3 text-sm text-[#F5F5F0]/70">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#8B4513] shrink-0 mt-0.5" />
                <span>Mushroom Development Division, Kurunegala, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#8B4513] shrink-0" />
                <span>+94 37 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#8B4513] shrink-0" />
                <span>mushroomecohub@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F5F5F0]/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#F5F5F0]/50">
          <p>© {currentYear} Mushroom Eco Hub. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">
            {language === 'EN'
              ? 'Launch-Ready v1.0 • Designed for Sri Lankan Mushroom Growers'
              : 'දියත් කිරීමට සූදානම් v1.0 • ශ්‍රී ලාංකීය හතු වගාකරුවන් සඳහා විශේෂිතයි'}
          </p>
        </div>
      </div>
    </footer>
  );
}
