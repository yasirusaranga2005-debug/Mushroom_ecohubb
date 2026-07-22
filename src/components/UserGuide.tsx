import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  UserCheck, 
  Sprout, 
  ShoppingBag, 
  Wrench, 
  HelpCircle,
  Sparkles,
  Lock
} from 'lucide-react';

interface UserGuideProps {
  language: 'EN' | 'SI';
}

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  titleEN: string;
  titleSI: string;
  descriptionEN: string;
  descriptionSI: string;
  topics: {
    titleEN: string;
    titleSI: string;
    contentEN: string[];
    contentSI: string[];
  }[];
}

export default function UserGuide({ language }: UserGuideProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'getting-started': true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      icon: <UserCheck className="h-5 w-5 text-brand-dark-green" />,
      titleEN: '1. Getting Started & Account Registration',
      titleSI: '1. පද්ධතියට පිවිසීම සහ ලියාපදිංචිය',
      descriptionEN: 'Learn how to join Mushroom Eco Hub, manage your profile, and secure your credentials.',
      descriptionSI: 'Mushroom Eco Hub වෙත එකතු වන ආකාරය, ඔබගේ ගිණුම සකසා ගන්නා ආකාරය සහ ආරක්ෂා කරගන්නා ආකාරය.',
      topics: [
        {
          titleEN: 'Creating an Account (ලියාපදිංචි වීම)',
          titleSI: 'ගිණුමක් සෑදීම (Registration)',
          contentEN: [
            'Click "Sign In / Register" in the top navigation bar or access the Co-op Gateway.',
            'Switch to the "Sign Up" tab and enter your Full Name, Phone Number, and Email.',
            'Select your Ecosystem Role (Grower, Buyer, Trainer, Partner, Staff).',
            'Set a strong password (check the password strength indicator: green = strong).',
            'Click "Create Account". A welcome verification email will be sent via EmailJS.'
          ],
          contentSI: [
            'ඉහළ මෙනුවේ ඇති "Sign In / Register" හෝ Co-op Gateway වෙත යන්න.',
            '"Sign Up" ටැබ් එක තෝරා ඔබගේ සම්පූර්ණ නම, දුරකථන අංකය සහ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.',
            'ඔබට අදාළ භූමිකාව (වගාකරු, ගැනුම්කරු, පුහුණුකරු, හවුල්කරු, කාර්ය මණ්ඩලය) තෝරන්න.',
            'ශක්තිමත් මුරපදයක් (Password) යොදන්න.',
            '"Create Account" ක්ලික් කරන්න. පිළිගැනීමේ විද්‍යුත් ලිපියක් ඔබගේ email එකට පැමිණෙනු ඇත.'
          ]
        },
        {
          titleEN: 'Google Authentication (Google මගින් පිවිසීම)',
          titleSI: 'ගූගල් ගිණුමෙන් පිවිසීම (Google Login)',
          contentEN: [
            'Click "Sign in with Google" on the login modal.',
            'Choose your Google email account in the popup window.',
            'If popup is blocked or offline simulation is active, enter your Google email in the prompt to log in safely.'
          ],
          contentSI: [
            'පිවිසුම් පුවරුවේ ඇති "Sign in with Google" ක්ලික් කරන්න.',
            'විවර වන කවුළුවෙන් ඔබගේ Google ගිණුම තෝරන්න.',
            'Popup අවහිර වී ඇත්නම් හෝ දේශීය මාදිලියේ ඇත්නම්, ඉල්ලන තැන email එක ඇතුළත් කර පිවිසෙන්න.'
          ]
        }
      ]
    },
    {
      id: 'security-forgot-password',
      icon: <Lock className="h-5 w-5 text-brand-dark-green" />,
      titleEN: '2. Security & Forgot Password OTP Flow',
      titleSI: '2. ආරක්ෂක පහසුකම් සහ මුරපදය අමතක වූ විට (OTP)',
      descriptionEN: 'How password recovery, rate limiting, and session security work.',
      descriptionSI: 'මුරපදය නැවත සකසන ආකාරය (OTP) සහ පද්ධති ආරක්ෂාව.',
      topics: [
        {
          titleEN: 'Forgot Password OTP Reset Process',
          titleSI: 'OTP මගින් මුරපදය නැවත සැකසීම',
          contentEN: [
            'Step 1: Click "Forgot Password?" on the Sign In tab.',
            'Enter your registered email address and click "Send Verification Code".',
            'Step 2: Check your email inbox for a 6-digit OTP code sent via EmailJS.',
            'Enter the 6-digit OTP code before the 5-minute countdown expires.',
            'Step 3: Once verified, enter your new password, confirm it, and click "Reset Password".',
            'A confirmation email will be sent to your inbox confirming the password reset.'
          ],
          contentSI: [
            'පියවර 1: Sign In ටැබ් එකේ ඇති "Forgot Password?" ක්ලික් කරන්න.',
            'ඔබගේ ලියාපදිංචි email එක ඇතුළත් කර "Send Verification Code" ක්ලික් කරන්න.',
            'පියවර 2: ඔබගේ email එකට පැමිණි ඉලක්කම් 6ක OTP කේතය පරීක්ෂා කරන්න.',
            'විනාඩි 5ක් ඇතුළත එම OTP කේතය පද්ධතියට ඇතුළත් කර Verify කරන්න.',
            'පියවර 3: සත්‍යාපනය වූ පසු අලුත් මුරපදය ඇතුළත් කර තහවුරු කරන්න.',
            'මුරපදය සාර්ථකව වෙනස් වූ බවට තහවුරු කිරීමේ email එකක් ඔබට ලැබෙනු ඇත.'
          ]
        },
        {
          titleEN: 'Security Rate Limiting & Session Protection',
          titleSI: 'ආරක්ෂක සීමාවන් සහ සැසි ආරක්ෂාව',
          contentEN: [
            'Failed Login Lockout: Entering incorrect credentials 5 consecutive times temporarily locks the form for 60 seconds to protect against brute-force attacks.',
            'Session Timeout: For your security, after 30 minutes of inactivity, you will be automatically logged out. A warning dialog appears at 25 minutes allowing you to extend your session.'
          ],
          contentSI: [
            'අසාර්ථක උත්සාහයන් සීමා කිරීම: පේළියට 5 වතාවක් වැරදි මුරපද ඇතුළත් කළහොත් තත්පර 60කට පද්ධතිය අගුළු වැටේ.',
            'අක්‍රියතා කාලය: විනාඩි 30ක් පද්ධතියේ කිසිදු ක්‍රියාවක් නොකළහොත් ආරක්ෂාව සඳහා ස්වයංක්‍රීයව Log Out වේ. විනාඩි 25දී අනතුරු ඇඟවීමේ පණිවිඩයක් ලැබේ.'
          ]
        }
      ]
    },
    {
      id: 'grower-guide',
      icon: <Sprout className="h-5 w-5 text-brand-dark-green" />,
      titleEN: '3. Mushroom Grower Guide (වගාකරුවන් සඳහා)',
      titleSI: '3. හතු වගාකරුවන් සඳහා මාර්ගෝපදේශය',
      descriptionEN: 'Managing harvests, stock updates, listing products, and viewing analytics.',
      descriptionSI: 'අස්වැන්න සටහන් කිරීම, තොග වෙනස් කිරීම, නිෂ්පාදන එකතු කිරීම සහ විශ්ලේෂණ.',
      topics: [
        {
          titleEN: 'Managing Harvests & Quick Stock Updates',
          titleSI: 'අස්වැන්න සහ තොග යාවත්කාලීන කිරීම (Stock Updates)',
          contentEN: [
            'Go to Dashboard -> Products section.',
            'Use the "Quick Stock Update" toggle on any of your listed products to instantly switch between "Available" and "Out of Stock".',
            'View live daily production capacity and harvest metrics tailored for growers.'
          ],
          contentSI: [
            'Dashboard -> Products කොටස වෙත යන්න.',
            'ඔබගේ නිෂ්පාදනයේ ඇති "Quick Stock Update" බොත්තම මගින් "Available" සහ "Out of Stock" තත්ත්වයන් ලබා දෙන්න.',
            'දිනපතා අස්වැන්න ප්‍රමාණයන් සහ වගා අස්වැන්න විශ්ලේෂණ සටහන් බලන්න.'
          ]
        }
      ]
    },
    {
      id: 'buyer-guide',
      icon: <ShoppingBag className="h-5 w-5 text-brand-dark-green" />,
      titleEN: '4. Buyer & Wholesale Guide (ගැනුම්කරුවන් සඳහා)',
      titleSI: '4. තොග ගැනුම්කරුවන් සඳහා මාර්ගෝපදේශය',
      descriptionEN: 'Finding products, bulk inquiries, and supplier connection.',
      descriptionSI: 'නිෂ්පාදන සෙවීම, තොග ඇණවුම් විමසීම් සහ වගාකරුවන් හා සම්බන්ධ වීම.',
      topics: [
        {
          titleEN: 'Browsing Marketplace & Sending Inquiries',
          titleSI: 'වෙළඳපොළ සෙවීම සහ විමසීම් යැවීම',
          contentEN: [
            'Navigate to the "Marketplace" tab.',
            'Filter products by district, category (Fresh Oyster, Button, Spawn, Processed).',
            'Click "Inquire / Order" on any product to send a direct message to the supplier.',
            'Track all your submitted buyer inquiries inside your Dashboard under "My Inquiries".'
          ],
          contentSI: [
            '"Marketplace" ටැබ් එක වෙත යන්න.',
            'දිස්ත්‍රික්කය සහ හතු වර්ගය (ඔයිස්ටර්, බටන්, බීජ, සකසන ලද) අනුව තෝරන්න.',
            '"Inquire / Order" ක්ලික් කර වගාකරු වෙත ඍජු විමසීමක් යවන්න.',
            'ඔබගේ Dashboard හි "My Inquiries" මගින් යැවූ විමසීම් වල තත්ත්වය පරීක්ෂා කරන්න.'
          ]
        }
      ]
    },
    {
      id: 'machinery-guide',
      icon: <Wrench className="h-5 w-5 text-brand-dark-green" />,
      titleEN: '5. Machinery & Equipment Hub',
      titleSI: '5. යන්ත්‍රෝපකරණ සහ උපකරණ මධ්‍යස්ථානය',
      descriptionEN: 'Exploring machinery, requesting quotes, and technical specs.',
      descriptionSI: 'යන්ත්‍රෝපකරණ නරඹීම, මිල ගණන් විමසීම සහ තාක්ෂණික තොරතුරු.',
      topics: [
        {
          titleEN: 'Requesting Machinery Quotes',
          titleSI: 'යන්ත්‍රෝපකරණ සඳහා මිල ගණන් ඉල්ලීම (Inquiry)',
          contentEN: [
            'Open the "Machinery" tab to view available Autoclaves, Bag Fillers, Humidity Controllers, and Dehydrators.',
            'Fill out the machinery inquiry form with your daily processing target.',
            'Co-op engineering team will contact you with custom quotes and installation guidance.'
          ],
          contentSI: [
            '"Machinery" ටැබ් එකෙන් Autoclaves, Bag Fillers, Dehydrators වැනි යන්ත්‍ර බලන්න.',
            'ඔබගේ දෛනික අවශ්‍යතාවය සඳහන් කර විමසීම් පෝරමය පුරවන්න.',
            'ඉංජිනේරු කණ්ඩායම ඔබ හා සම්බන්ධ වී තාක්ෂණික උපදෙස් ලබා දෙනු ඇත.'
          ]
        }
      ]
    }
  ];

  const filteredSections = guideSections.map(sec => {
    const matchingTopics = sec.topics.filter(top => 
      top.titleEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.titleSI.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.contentEN.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      top.contentSI.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...sec, topics: matchingTopics };
  }).filter(sec => 
    searchQuery === '' ||
    sec.titleEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.titleSI.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.topics.length > 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-fade-in" id="user-guide-page">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark-green via-brand-natural-green to-brand-brown rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>{language === 'EN' ? 'Official Documentation' : 'නිල මාර්ගෝපදේශ සංග්‍රහය'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight">
            {language === 'EN' ? 'User Manual & System Guide' : 'පද්ධති භාවිත උපදෙස් මාලාව'}
          </h1>
          <p className="text-stone-100 text-sm sm:text-base font-sans leading-relaxed">
            {language === 'EN'
              ? 'Complete guide on navigating Mushroom Eco Hub, managing your roles, executing quick stock updates, using OTP security, and optimizing sales.'
              : 'Mushroom Eco Hub පද්ධතිය භාවිතා කිරීම, ගිණුම් කළමනාකරණය, තොග යාවත්කාලීන කිරීම, OTP ආරක්ෂාව සහ වෙළඳපොළ භාවිතය පිළිබඳ සම්පූර්ණ උපදෙස්.'}
          </p>

          {/* Search bar */}
          <div className="relative max-w-md pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 mt-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'EN' ? 'Search guide topics (e.g. OTP, stock, grower)...' : 'උපදෙස් සොයන්න (උදා: OTP, තොග, වගාකරු)...'}
              className="w-full pl-12 pr-4 py-3 bg-white text-brand-text rounded-2xl text-sm font-sans shadow-md outline-none focus:ring-4 focus:ring-brand-orange/30 placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Guide Content Sections */}
      <div className="space-y-6">
        {filteredSections.map((sec) => (
          <div key={sec.id} className="bg-white border border-stone-200/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
            <button
              onClick={() => toggleSection(sec.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-brand-cream rounded-xl shrink-0">
                  {sec.icon}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    {language === 'EN' ? sec.titleEN : sec.titleSI}
                  </h3>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    {language === 'EN' ? sec.descriptionEN : sec.descriptionSI}
                  </p>
                </div>
              </div>
              <div className="p-1 text-stone-400 shrink-0">
                {openSections[sec.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </button>

            {/* Accordion Body */}
            {(openSections[sec.id] || searchQuery !== '') && (
              <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/30 space-y-6 animate-fade-in">
                {sec.topics.map((topic, index) => (
                  <div key={index} className="space-y-3 bg-white p-5 rounded-xl border border-stone-100 shadow-2xs">
                    <h4 className="text-sm font-sans font-bold text-brand-dark-green flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-brand-orange shrink-0" />
                      <span>{language === 'EN' ? topic.titleEN : topic.titleSI}</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-700 font-sans leading-relaxed pl-6 list-disc marker:text-brand-orange">
                      {(language === 'EN' ? topic.contentEN : topic.contentSI).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
            <HelpCircle className="h-10 w-10 text-stone-400 mx-auto" />
            <p className="font-serif font-bold text-stone-800">
              {language === 'EN' ? 'No topics found for your search query.' : 'සෙවීමට අදාළ මාතෘකා කිසිවක් හමු නොවීය.'}
            </p>
            <p className="text-xs text-stone-500">
              {language === 'EN' ? 'Try searching for generic terms like "password", "otp", or "role".' : 'වෙනත් වචනයක් යොදා සෙවුම් කර බලන්න.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
