import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { dataService } from '../lib/dataService';

interface ContactProps {
  language: 'EN' | 'SI';
}

export default function Contact({ language }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setError(language === 'EN' ? 'Please fill in all fields.' : 'කරුණාකර සියලුම ක්ෂේත්‍ර පුරවන්න.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await dataService.addContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setError(language === 'EN' ? 'Submission failed. Please try again.' : 'පණිවිඩය යැවීමට නොහැකි විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="contact-page">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <h1 className="text-3xl font-serif font-bold text-[#2D2D2A] tracking-tight">
            {language === 'EN' ? 'Contact Our Desk' : 'අප හා සම්බන්ධ වන්න'}
          </h1>
          <div className="h-1 w-16 bg-[#8B4513]"></div>
          
          <p className="text-[#2D2D2A]/80 text-sm leading-relaxed font-sans">
            {language === 'EN'
              ? 'Have queries about co-operative bulk purchases, compost supplies, spawn testing, or local grower registrations? Drop us a line.'
              : 'තොග මිලදී ගැනීම්, අමුද්‍රව්‍ය සැපයුම්, වගා පුහුණුවීම් හෝ වෙනත් ගැටළු සඳහා අපගේ කාර්යාලය හා සම්බන්ධ වන්න.'}
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-white border border-[#5A5A40]/10 rounded-2xl text-[#8B4513] shrink-0 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#2D2D2A] text-sm">{language === 'EN' ? 'Headquarters' : 'ලිපිනය'}</h4>
                <p className="text-[#2D2D2A]/60 text-xs">Mushroom Development Division, Kurunegala, Sri Lanka</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-white border border-[#5A5A40]/10 rounded-2xl text-[#8B4513] shrink-0 shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#2D2D2A] text-sm">{language === 'EN' ? 'Support Hotlines' : 'දුරකථන අංක'}</h4>
                <p className="text-[#2D2D2A]/60 text-xs">+94 37 123 4567 / +94 37 765 4321</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-white border border-[#5A5A40]/10 rounded-2xl text-[#8B4513] shrink-0 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#2D2D2A] text-sm">{language === 'EN' ? 'Email Address' : 'විද්‍යුත් තැපෑල'}</h4>
                <p className="text-[#2D2D2A]/60 text-xs">mushroomecohub@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-white border border-[#5A5A40]/10 rounded-[32px] p-8 shadow-sm">
            {success ? (
              <div className="text-center py-10 space-y-4" id="contact-success-msg">
                <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-full text-[#8B4513]">
                  <CheckCircle2 className="h-10 w-10 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2D2D2A]">
                  {language === 'EN' ? 'Message Sent Successfully!' : 'පණිවිඩය සාර්ථකව ලැබුණි!'}
                </h3>
                <p className="text-[#2D2D2A]/70 text-sm font-sans">
                  {language === 'EN'
                    ? "Thank you for writing to us. Our administrative desk will review your query and respond via email within 24 hours."
                    : 'අප වෙත පණිවිඩයක් එවීම පිළිබඳ ස්තුතියි. පැය 24ක් ඇතුළත අපගේ නිලධාරියෙකු ඔබව සම්බන්ධ කර ගනු ඇත.'}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white font-serif font-bold rounded-xl text-xs transition"
                >
                  {language === 'EN' ? 'Send Another Message' : 'නව පණිවිඩයක් යවන්න'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
                <h3 className="text-xl font-serif font-bold text-[#2D2D2A] mb-4">
                  {language === 'EN' ? 'Send an Instant Message' : 'ක්ෂණික පණිවිඩයක් යොමු කරන්න'}
                </h3>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start space-x-2 text-red-800 text-xs">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Your Name' : 'ඔබගේ නම'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Saman Kumara"
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                      {language === 'EN' ? 'Phone Number' : 'දුරකථන අංකය'} <span className="text-[#8B4513] font-sans">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0771234567"
                      className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                      {language === 'EN' ? 'Email Address' : 'විද්‍යුත් තැපෑල'} <span className="text-[#8B4513] font-sans">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. saman@gmail.com"
                      className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Your Message' : 'පණිවිඩය'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={language === 'EN' ? 'Describe your requirement in detail...' : 'ඔබගේ අවශ්‍යතාවය මෙහි පැහැදිලිව සටහන් කරන්න...'}
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#8B4513] hover:bg-[#733A0F] disabled:bg-[#8B4513]/40 text-white font-serif font-bold rounded-2xl text-xs transition flex items-center justify-center space-x-1"
                  id="btn-submit-contact"
                >
                  {loading ? (
                    <span>{language === 'EN' ? 'Sending...' : 'යවමින්...'}</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-white/80" />
                      <span>{language === 'EN' ? 'Send Message' : 'පණිවිඩය යවන්න'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
