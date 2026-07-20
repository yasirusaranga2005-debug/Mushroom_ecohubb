import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, CheckCircle2, User, Phone, Send, Inbox, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { Opportunity } from '../types';
import { dataService } from '../lib/dataService';
import { DISTRICTS } from './JoinEcosystem';

interface OpportunitiesProps {
  language: 'EN' | 'SI';
}

export default function Opportunities({ language }: OpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Application states
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [appData, setAppData] = useState({
    name: '',
    phone: '',
    role: 'Grower',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const data = await dataService.getOpportunities();
      setOpportunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleOpenApply = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setAppData({
      name: '',
      phone: '',
      role: 'Grower',
      message: ''
    });
    setSuccess(false);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    if (!appData.name || !appData.phone || !appData.role || !appData.message) {
      setError(language === 'EN' ? 'Please fill in all fields.' : 'කරුණාකර සියලුම ක්ෂේත්‍ර පුරවන්න.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await dataService.addOpportunityApplication({
        name: appData.name,
        phone: appData.phone,
        role: appData.role,
        message: appData.message,
        opportunityId: selectedOpp.id,
        opportunityTitle: selectedOpp.title,
        status: 'New'
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(language === 'EN' ? 'Application failed. Please try again.' : 'අයදුම් කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="opportunities-page">
      {/* Header */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-serif font-bold text-[#2D2D2A] tracking-tight">
          {language === 'EN' ? 'Ecosystem Opportunity Board' : 'ව්‍යාපාරික සහ සමුපකාර අවස්ථා පුවරුව'}
        </h1>
        <p className="mt-1.5 text-[#2D2D2A]/70 text-sm font-sans">
          {language === 'EN'
            ? 'Explore active purchase requirements, community partnerships, subsidy programs, and trainee vacancies on our live notice board.'
            : 'මිලදී ගැනීමේ අවශ්‍යතා, ප්‍රජා හවුල්කාරීත්වයන්, සහනාධාර වැඩසටහන් සහ අනෙකුත් සක්‍රීය ව්‍යාපාරික අවස්ථා සොයා බලන්න.'}
        </p>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-10 h-10 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#2D2D2A]/60 text-sm font-sans">
            {language === 'EN' ? 'Loading opportunity notices...' : 'අවස්ථා ලැයිස්තුව පූරණය වෙමින් පවතී...'}
          </p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white border border-[#5A5A40]/10 rounded-[32px] py-16 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <Inbox className="h-12 w-12 text-[#2D2D2A]/40 mx-auto" />
          <h3 className="font-serif font-bold text-[#2D2D2A] text-lg">
            {language === 'EN' ? 'No Opportunities Active' : 'කිසිදු අවස්ථාවක් ලැයිස්තුගත කර නැත'}
          </h3>
          <p className="text-[#2D2D2A]/70 text-xs px-6 font-sans">
            Check back shortly. The admin or partners will post new crop purchase requirements and partnerships.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="opportunities-grid">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white border border-[#5A5A40]/10 rounded-[32px] p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              id={`opp-card-${opp.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    opp.type === 'Requirement' ? 'bg-[#8B4513]/10 text-[#8B4513] border border-[#8B4513]/25' :
                    opp.type === 'Partnership' ? 'bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/25' :
                    'bg-[#2D2D2A]/10 text-[#2D2D2A] border border-[#2D2D2A]/25'
                  }`}>
                    {opp.type}
                  </span>
                  <span className="flex items-center text-xs text-[#2D2D2A]/55 font-sans font-medium">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-[#2D2D2A]/40" />
                    {new Date(opp.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-[#2D2D2A] text-lg leading-snug mb-3">
                  {opp.title}
                </h3>

                <p className="text-[#2D2D2A]/80 text-xs leading-relaxed mb-6 font-sans">
                  {opp.details}
                </p>
              </div>

              <div className="pt-4 border-t border-[#5A5A40]/10 flex items-center justify-between font-sans">
                <span className="flex items-center text-xs font-bold text-[#2D2D2A]/80">
                  <MapPin className="h-4 w-4 text-[#8B4513] mr-1" />
                  {opp.district}
                </span>

                {opp.status === 'Closed' ? (
                  <span className="text-xs text-[#2D2D2A]/40 font-serif font-bold uppercase">
                    {language === 'EN' ? 'Closed' : 'වසා ඇත'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApply(opp)}
                    className="px-4 py-2 bg-[#8B4513] hover:bg-[#733A0F] text-white text-xs font-serif font-bold rounded-xl transition"
                    id={`btn-apply-opp-${opp.id}`}
                  >
                    {language === 'EN' ? 'Apply / Express Interest' : 'අයදුම් කරන්න / කැමැත්ත පළකරන්න'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Popup Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-[#2D2D2A]/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="opp-apply-modal">
          <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl relative">
            <div className="bg-[#5A5A40] text-white p-6 relative">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5F5F0_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif font-bold tracking-tight">
                  {language === 'EN' ? 'Apply for Opportunity' : 'අවස්ථාව සඳහා අයදුම් කිරීම'}
                </h3>
                <p className="text-[#F5F5F0]/85 text-xs mt-1">
                  Your application details will be forwarded directly to the poster.
                </p>
              </div>
            </div>

            {success ? (
              <div className="p-8 text-center space-y-4" id="opp-success-view">
                <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-full text-[#8B4513]">
                  <CheckCircle2 className="h-10 w-10 text-[#8B4513]" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#2D2D2A]">
                  {language === 'EN' ? 'Application Submitted!' : 'අයදුම්පත සාර්ථකව යොමු විය!'}
                </h4>
                <p className="text-[#2D2D2A]/70 text-sm font-sans">
                  {language === 'EN'
                    ? `Your interest in "${selectedOpp.title}" has been registered. The poster or administrator will contact you soon.`
                    : `ඔබගේ අයදුම්පත සාර්ථකව ලැබී ඇත. මේ පිළිබඳව ළඟදීම ඔබ හා සම්බන්ධ වනු ඇත.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white text-sm font-serif font-bold rounded-xl"
                  >
                    {language === 'EN' ? 'Close Window' : 'වසා දමන්න'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start space-x-2 text-red-800 text-xs">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Selected Opportunity title summary */}
                <div className="bg-[#F5F5F0] border border-[#5A5A40]/10 p-3 rounded-xl">
                  <span className="block text-[10px] uppercase font-serif font-bold text-[#2D2D2A]/60 tracking-wider">
                    {language === 'EN' ? 'Target Opportunity' : 'අදාළ අවස්ථාව'}
                  </span>
                  <span className="block font-serif font-bold text-[#2D2D2A] text-sm leading-tight">
                    {selectedOpp.title}
                  </span>
                  <span className="block text-xs text-[#2D2D2A]/75 font-sans">
                    {selectedOpp.type} • {selectedOpp.district}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Your Name' : 'ඔබගේ නම'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D2D2A]/40" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={appData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sunil Shantha"
                      className="w-full pl-9 pr-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Phone Number' : 'දුරකථන අංකය'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D2D2A]/40" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={appData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0773334445"
                      className="w-full pl-9 pr-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Your Role / Title' : 'ඔබගේ වෘත්තීය භූමිකාව'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <select
                    name="role"
                    required
                    value={appData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  >
                    <option value="Grower">{language === 'EN' ? 'Mushroom Grower' : 'හතු වගාකරු'}</option>
                    <option value="Buyer">{language === 'EN' ? 'Buyer / Wholesale Retailer' : 'ගැනුම්කරු / තොග වෙළෙන්දා'}</option>
                    <option value="Partner">{language === 'EN' ? 'Ecosystem Partner / Processor' : 'පරිසර හවුල්කරු / අගය එකතු කරන්නා'}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Your Statement / Proposal' : 'ඔබගේ යෝජනාව / පණිවිඩය'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={appData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder={language === 'EN' ? 'State your capacity, experience, or terms of proposal...' : 'ඔබගේ ධාරිතාවය සහ පළපුරුද්ද මෙහි සඳහන් කරන්න...'}
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-3 border-t border-[#5A5A40]/10">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-serif font-bold rounded-xl transition"
                  >
                    {language === 'EN' ? 'Cancel' : 'අවලංගු කරන්න'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-[#8B4513] hover:bg-[#733A0F] disabled:bg-[#8B4513]/40 text-white text-sm font-serif font-bold rounded-xl transition flex items-center justify-center space-x-1"
                    id="btn-submit-opp-apply"
                  >
                    {submitting ? (
                      <span>{language === 'EN' ? 'Submitting...' : 'යවමින්...'}</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-white/80" />
                        <span>{language === 'EN' ? 'Apply Now' : 'අයදුම් කරන්න'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
