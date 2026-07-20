import React, { useState } from 'react';
import { Sprout, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { dataService } from '../lib/dataService';
import { UserRole } from '../types';

interface JoinEcosystemProps {
  language: 'EN' | 'SI';
  onSubmitSuccess?: () => void;
}

export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara',
  'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Kilinochchi',
  'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam',
  'Anuradhapura', 'Polonnaruwa',
  'Badulla', 'Moneragala',
  'Ratnapura', 'Kegalle'
];

export default function JoinEcosystem({ language, onSubmitSuccess }: JoinEcosystemProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: 'Colombo',
    city: '',
    role: 'grower' as UserRole,
    experienceLevel: 'Beginner',
    interestedArea: 'Fresh mushroom growing',
    monthlyCapacity: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.city) {
      setError(language === 'EN' ? 'Please fill in all required fields.' : 'කරුණාකර සියලුම අත්‍යවශ්‍ය ක්ෂේත්‍ර පුරවන්න.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await dataService.addMember({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        district: formData.district,
        city: formData.city,
        role: formData.role,
        experienceLevel: formData.experienceLevel,
        interestedArea: formData.interestedArea,
        monthlyCapacity: formData.monthlyCapacity || '0',
        message: formData.message,
        status: 'pending' // Default status is pending
      });

      setSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (e: any) {
      console.error(e);
      setError(language === 'EN' ? 'Failed to submit. Please try again.' : 'ඇතුළත් කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" id="join-ecosystem-page">
      {success ? (
        <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] p-8 text-center space-y-4 shadow-sm" id="join-success-msg">
          <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-full text-[#5A5A40]">
            <CheckCircle2 className="h-12 w-12 text-[#8B4513]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2A]">
            {language === 'EN' ? 'Registration Successful!' : 'ලියාපදිංචිය සාර්ථකයි!'}
          </h2>
          <p className="text-[#2D2D2A]/80 text-base max-w-lg mx-auto font-sans">
            {language === 'EN'
              ? 'Thank you for joining Mushroom Eco Hub. Our team will contact you soon to verify your production capacities and activate your dashboard access.'
              : 'හතු පරිසර කේන්ද්‍රය සමඟ සම්බන්ධ වීම ගැන ස්තුතියි. ඔබේ නිෂ්පාදන ධාරිතාවයන් තහවුරු කර නියමු පුවරුව සක්‍රිය කිරීමට අපගේ කණ්ඩායම ළඟදීම ඔබව සම්බන්ධ කර ගනු ඇත.'}
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  fullName: '',
                  phone: '',
                  email: '',
                  district: 'Colombo',
                  city: '',
                  role: 'grower',
                  experienceLevel: 'Beginner',
                  interestedArea: 'Fresh mushroom growing',
                  monthlyCapacity: '',
                  message: ''
                });
              }}
              className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white font-serif font-bold rounded-xl text-sm transition"
            >
              {language === 'EN' ? 'Submit Another Registration' : 'තවත් ලියාපදිංචියක් ඉදිරිපත් කරන්න'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] overflow-hidden shadow-sm">
          <div className="bg-[#5A5A40] text-white p-8 relative">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5F5F0_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                {language === 'EN' ? 'Join the Mushroom Ecosystem' : 'හතු පරිසර පද්ධතියට එක්වන්න'}
              </h1>
              <p className="mt-2 text-[#F5F5F0]/80 text-sm">
                {language === 'EN'
                  ? 'Register your farming capacity, list items on the marketplace, apply for training batches and bulk buyer contracts.'
                  : 'ඔබේ වගා ධාරිතාවය ලියාපදිංචි කරන්න, වෙළඳපොලේ භාණ්ඩ ලැයිස්තුගත කරන්න, සහ තොග ඇණවුම් සඳහා ඉල්ලුම් කරන්න.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6" id="join-form">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start space-x-2 text-red-800 text-sm">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'Full Name' : 'සම්පූර්ණ නම'} <span className="text-[#8B4513] font-sans">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Nimal Perera"
                  required
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'Phone Number' : 'දුරකථන අංකය'} <span className="text-[#8B4513] font-sans">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0771234567"
                  required
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'Email Address' : 'විද්‍යුත් තැපෑල'} <span className="text-[#8B4513] font-sans">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. nimal@gmail.com"
                  required
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'District' : 'දිස්ත්‍රික්කය'} <span className="text-[#8B4513] font-sans">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl bg-white focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'City' : 'නගරය'} <span className="text-[#8B4513] font-sans">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Gampola"
                  required
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'Ecosystem Role' : 'පද්ධති භූමිකාව'} <span className="text-[#8B4513] font-sans">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl bg-white focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] capitalize transition"
                >
                  <option value="grower">{language === 'EN' ? 'Mushroom Grower' : 'හතු වගාකරු'}</option>
                  <option value="buyer">{language === 'EN' ? 'Buyer / Wholesaler' : 'ගැනුම්කරු / තොග වෙළෙන්දා'}</option>
                  <option value="trainer">{language === 'EN' ? 'Trainer / Consultant' : 'පුහුණුකරු / උපදේශක'}</option>
                  <option value="partner">{language === 'EN' ? 'Ecosystem Partner / Processor' : 'පරිසර සහකරු / අගය එකතු කරන්නා'}</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'Experience Level' : 'පළපුරුද්ද'}
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl bg-white focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                >
                  <option value="Beginner">{language === 'EN' ? 'Beginner / No Experience' : 'ආධුනික / කිසිදු පළපුරුද්දක් නොමැති'}</option>
                  <option value="Intermediate">{language === 'EN' ? 'Intermediate (1 - 3 Years)' : 'මධ්‍යම (වසර 1 - 3)'}</option>
                  <option value="Advanced">{language === 'EN' ? 'Advanced / Commercial (3+ Years)' : 'ප්‍රවීණ / වාණිජ මට්ටමේ (වසර 3+)'}</option>
                </select>
              </div>

              {/* Monthly Production Capacity */}
              <div>
                <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                  {language === 'EN' ? 'Est. Monthly Capacity (kg / bags)' : 'මාසික ඇස්තමේන්තුගත ධාරිතාවය'}
                </label>
                <input
                  type="text"
                  name="monthlyCapacity"
                  value={formData.monthlyCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 150kg fresh / 1000 bags"
                  className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
                />
              </div>
            </div>

            {/* Interested Area */}
            <div>
              <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                {language === 'EN' ? 'Primary Interest Area' : 'ප්‍රධාන උනන්දුවක් දක්වන ක්ෂේත්‍රය'}
              </label>
              <select
                name="interestedArea"
                value={formData.interestedArea}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl bg-white focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
              >
                <option value="Fresh mushroom growing">{language === 'EN' ? 'Fresh Mushroom Growing' : 'නැවුම් හතු වගාව'}</option>
                <option value="Value-added products">{language === 'EN' ? 'Value-Added Products (Meatballs, Sausages)' : 'අගය එකතු කළ නිෂ්පාදන'}</option>
                <option value="Spawn production">{language === 'EN' ? 'Spawn (Seed) Production' : 'හතු බීජ නිෂ්පාදනය'}</option>
                <option value="Training">{language === 'EN' ? 'Training / Consultation' : 'පුහුණුවීම් ලබා ගැනීම'}</option>
                <option value="Buying mushrooms">{language === 'EN' ? 'Buying Mushrooms (Retail/Wholesale)' : 'හතු මිලදී ගැනීම'}</option>
                <option value="Supplying materials">{language === 'EN' ? 'Supplying Raw Materials / Compost' : 'අමුද්‍රව්‍ය සැපයීම'}</option>
                <option value="Investment or partnership">{language === 'EN' ? 'Investment or Cooperative Partnership' : 'ආයෝජන සහ හවුල්කාරීත්වයන්'}</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[#2D2D2A] font-serif font-bold text-sm mb-1.5">
                {language === 'EN' ? 'Introduce Yourself / Message' : 'හඳුන්වාදීම / පණිවිඩය'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder={language === 'EN' ? 'Tell us about your farm setup, goals or what you wish to supply...' : 'ඔබේ වගාව, අරමුණු හෝ ඔබ සැපයීමට බලාපොරොත්තු වන දෑ පිළිබඳ කෙටි හැඳින්වීමක්...'}
                className="w-full px-4 py-2.5 border border-[#5A5A40]/25 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none text-[#2D2D2A] transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#8B4513] hover:bg-[#733A0F] disabled:bg-[#8B4513]/40 text-white font-serif font-bold rounded-2xl shadow transition flex items-center justify-center space-x-2 text-base"
              id="btn-submit-member"
            >
              {loading ? (
                <span>{language === 'EN' ? 'Submitting...' : 'ඇතුළත් කරමින්...'}</span>
              ) : (
                <>
                  <span>{language === 'EN' ? 'Submit Registration' : 'ලියාපදිංචිය ඉදිරිපත් කරන්න'}</span>
                  <ChevronRight className="h-5 w-5 text-white/80" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
