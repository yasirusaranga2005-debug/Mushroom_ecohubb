import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Clock, Calendar, CheckCircle2, User, Phone, MapPin, Send, AlertCircle, RefreshCw } from 'lucide-react';
import { TrainingProgram } from '../types';
import { dataService } from '../lib/dataService';
import { DISTRICTS } from './JoinEcosystem';

interface TrainingProps {
  language: 'EN' | 'SI';
}

export default function Training({ language }: TrainingProps) {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  // Training Request states
  const [selectedProg, setSelectedProg] = useState<TrainingProgram | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reqData, setReqData] = useState({
    name: '',
    phone: '',
    district: 'Colombo',
    preferredFormat: 'In-person Practical Session',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await dataService.getTrainingPrograms();
      setPrograms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenRequest = (prog: TrainingProgram) => {
    setSelectedProg(prog);
    setReqData({
      name: '',
      phone: '',
      district: 'Colombo',
      preferredFormat: prog.format,
      message: ''
    });
    setShowBookingForm(false);
    setSuccess(false);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReqData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProg) return;

    if (!reqData.name || !reqData.phone || !reqData.district) {
      setError(language === 'EN' ? 'Please fill in all required fields.' : 'කරුණාකර සියලුම අත්‍යවශ්‍ය ක්ෂේත්‍ර පුරවන්න.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await dataService.addTrainingRequest({
        name: reqData.name,
        phone: reqData.phone,
        district: reqData.district,
        trainingInterest: selectedProg.title,
        preferredFormat: reqData.preferredFormat,
        message: reqData.message,
        status: 'New'
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(language === 'EN' ? 'Submission failed. Please try again.' : 'ඇතුළත් කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="training-page">
      {/* Header */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-serif font-bold text-[#2D2D2A] tracking-tight">
          {language === 'EN' ? 'Knowledge & Practical Training' : 'හතු වගා පුහුණුවීම් සහ උපදේශනය'}
        </h1>
        <p className="mt-1.5 text-[#2D2D2A]/70 text-sm font-sans">
          {language === 'EN'
            ? 'Access our certification modules. Learn commercial cultivation, substrate preparation, spawn breeding, and organic value-add creation.'
            : 'ප්‍රායෝගික පුහුණු වැඩසටහන් සමඟ එක්වන්න. නිවැරදි වගා තාක්ෂණය, බීජ නිෂ්පාදනය සහ අගය එකතු කල නිෂ්පාදන සකසන අයුරු ඉගෙන ගන්න.'}
        </p>
      </div>

      {/* Program list */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-10 h-10 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#2D2D2A]/60 text-sm font-sans">
            {language === 'EN' ? 'Loading training programs...' : 'පුහුණු පාඨමාලා පූරණය වෙමින් පවතී...'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="training-grid">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white border border-[#5A5A40]/10 rounded-[32px] p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              id={`train-card-${prog.id}`}
            >
              <div>
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="p-2.5 bg-[#5A5A40]/10 rounded-xl text-[#5A5A40]">
                    <GraduationCap className="h-6 w-6 text-[#5A5A40]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2D2D2A] text-lg leading-snug">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[#2D2D2A]/70 text-xs mb-4 min-h-[40px] leading-relaxed font-sans">
                  <span className="font-bold text-[#2D2D2A]/90">{language === 'EN' ? 'For: ' : 'සඳහා: '}</span>
                  {prog.whoItIsFor}
                </p>

                <div className="space-y-2 border-t border-[#5A5A40]/10 pt-4 text-xs text-[#2D2D2A]/80 mb-6 font-sans">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-[#8B4513] shrink-0" />
                    <span>
                      <strong className="text-[#2D2D2A]">{language === 'EN' ? 'Duration: ' : 'කාලසීමාව: '}</strong>
                      {prog.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[#8B4513] shrink-0" />
                    <span>
                      <strong className="text-[#2D2D2A]">{language === 'EN' ? 'Format: ' : 'ක්‍රමය: '}</strong>
                      {prog.format}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenRequest(prog)}
                className="w-full py-3 bg-[#8B4513] hover:bg-[#733A0F] text-white font-serif font-bold rounded-xl text-xs transition"
                id={`btn-request-train-${prog.id}`}
              >
                {language === 'EN' ? 'View Details' : 'වැඩිදුර විස්තර'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Training Request Form Popup Modal */}
      {selectedProg && (
        <div className="fixed inset-0 bg-[#2D2D2A]/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="training-request-modal">
          <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl relative">
            <div className="bg-[#5A5A40] text-white p-6 relative">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5F5F0_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif font-bold tracking-tight">
                  {language === 'EN' ? 'Apply for Training Program' : 'පුහුණු පාඨමාලාවට අයදුම් කිරීම'}
                </h3>
                <p className="text-[#F5F5F0]/85 text-xs mt-1">
                  {language === 'EN' 
                    ? 'Submit your details to receive scheduling coordinates from trainers.' 
                    : 'පුහුණු සැසිවාර වල විස්තර ලබාගැනීමට ඔබගේ තොරතුරු ඉදිරිපත් කරන්න.'}
                </p>
              </div>
            </div>

            {success ? (
              <div className="p-8 text-center space-y-4" id="train-success-view">
                <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-full text-[#8B4513]">
                  <CheckCircle2 className="h-10 w-10 text-[#8B4513]" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#2D2D2A]">
                  {language === 'EN' ? 'Application Received!' : 'අයදුම්පත ලැබුණි!'}
                </h4>
                <p className="text-[#2D2D2A]/70 text-sm font-sans">
                  {language === 'EN'
                    ? `Thank you. Your request for "${selectedProg.title}" has been received. Our coordination desk will email or call you shortly.`
                    : `බොහෝම ස්තුතියි. ඔබගේ අයදුම්පත අප වෙත ලැබී ඇත. පුහුණු අංශය ළඟදීම ඔබ හා සම්බන්ධ වනු ඇත.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSelectedProg(null)}
                    className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white text-sm font-serif font-bold rounded-xl"
                  >
                    {language === 'EN' ? 'Close Window' : 'වසා දමන්න'}
                  </button>
                </div>
              </div>
            ) : !showBookingForm ? (
              <div className="p-6 space-y-5 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif font-bold text-[#2D2D2A] text-lg">{selectedProg.title}</h4>
                    <p className="text-[#2D2D2A]/80 text-sm mt-2 leading-relaxed">
                      {selectedProg.whoItIsFor}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-[#5A5A40]/10 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#2D2D2A]/50 tracking-wider">
                        {language === 'EN' ? 'Duration' : 'කාලසීමාව'}
                      </span>
                      <span className="text-sm font-semibold text-[#2D2D2A] flex items-center space-x-1.5">
                        <Clock className="h-4 w-4 text-[#8B4513]" />
                        <span>{selectedProg.duration}</span>
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#2D2D2A]/50 tracking-wider">
                        {language === 'EN' ? 'Format' : 'ක්‍රමය'}
                      </span>
                      <span className="text-sm font-semibold text-[#2D2D2A] flex items-center space-x-1.5">
                        <Calendar className="h-4 w-4 text-[#8B4513]" />
                        <span>{selectedProg.format}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-[#F5F5F0] rounded-xl p-4">
                    <p className="text-xs text-[#2D2D2A]/70 leading-relaxed font-sans italic">
                      {language === 'EN' 
                        ? 'This program covers practical, hands-on techniques designed to elevate your mushroom farming output and quality.' 
                        : 'ඔබගේ හතු වගාවේ අස්වැන්න සහ ගුණාත්මක බව වැඩිදියුණු කිරීම සඳහා අවශ්‍ය ප්‍රායෝගික දැනුම මෙම පාඨමාලාවෙන් ලබා දේ.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setSelectedProg(null)}
                    className="flex-1 py-3 bg-white hover:bg-stone-50 border border-[#D5DAD0] text-[#2D2D2A] text-sm font-serif font-bold rounded-xl transition"
                  >
                    {language === 'EN' ? 'Cancel' : 'අවලංගු කරන්න'}
                  </button>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="flex-1 py-3 bg-[#8B4513] hover:bg-[#733A0F] text-white text-sm font-serif font-bold rounded-xl transition"
                  >
                    {language === 'EN' ? 'Book a Slot' : 'අයදුම් කරන්න'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start space-x-2 text-red-800 text-xs">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Selected Program summary */}
                <div className="bg-[#F5F5F0] border border-[#5A5A40]/10 p-3 rounded-xl">
                  <span className="block text-[10px] uppercase font-serif font-bold text-[#2D2D2A]/60 tracking-wider">
                    {language === 'EN' ? 'Selected Course' : 'තෝරාගත් පාඨමාලාව'}
                  </span>
                  <span className="block font-serif font-bold text-[#2D2D2A] text-sm">
                    {selectedProg.title}
                  </span>
                  <span className="block text-xs text-[#2D2D2A]/70 font-sans">
                    {selectedProg.duration} • {selectedProg.format}
                  </span>
                </div>

                {/* Your Name */}
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
                      value={reqData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Priyanthi Silva"
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
                      value={reqData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0771234567"
                      className="w-full pl-9 pr-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Your District' : 'දිස්ත්‍රික්කය'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D2D2A]/40" />
                    <select
                      name="district"
                      required
                      value={reqData.district}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Format */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Preferred Format' : 'කැමති ක්‍රමවේදය'}
                  </label>
                  <select
                    name="preferredFormat"
                    value={reqData.preferredFormat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  >
                    <option value="In-person Practical Session">{language === 'EN' ? 'In-person Practical Session' : 'ප්‍රායෝගික පුහුණුව (පැමිණ)'}</option>
                    <option value="Online Video Webinar">{language === 'EN' ? 'Online Video Webinar' : 'සබැඳි වීඩියෝ පුහුණුව (Online)'}</option>
                    <option value="Hybrid (Theory + Site Visit)">{language === 'EN' ? 'Hybrid (Theory + Site Visit)' : 'මිශ්‍ර ක්‍රමවේදය (Hybrid)'}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Message' : 'පණිවිඩය'}
                  </label>
                  <textarea
                    name="message"
                    value={reqData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={language === 'EN' ? 'Tell us about your previous experience or nursery size...' : 'ඔබගේ පෙර අත්දැකීම් හෝ වගා ප්‍රමාණයන් පිළිබඳ සටහන් කරන්න...'}
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-3 border-t border-[#5A5A40]/10">
                  <button
                    type="button"
                    onClick={() => setSelectedProg(null)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-serif font-bold rounded-xl transition"
                  >
                    {language === 'EN' ? 'Cancel' : 'අවලංගු කරන්න'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-[#8B4513] hover:bg-[#733A0F] disabled:bg-[#8B4513]/40 text-white text-sm font-serif font-bold rounded-xl transition flex items-center justify-center space-x-1"
                    id="btn-submit-training-req"
                  >
                    {submitting ? (
                      <span>{language === 'EN' ? 'Submitting...' : 'අයදුම් කරමින්...'}</span>
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
