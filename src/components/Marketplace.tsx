import React, { useState, useEffect } from 'react';
import { Search, MapPin, Inbox, Filter, Send, CheckCircle2, ShoppingCart, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Product, BuyerInquiry } from '../types';
import { dataService } from '../lib/dataService';
import { DISTRICTS } from './JoinEcosystem';

interface MarketplaceProps {
  language: 'EN' | 'SI';
  currentUserEmail?: string;
  currentUserId?: string;
}

const CATEGORIES = [
  'All Categories',
  'Fresh Oyster Mushroom',
  'Fresh Button Mushroom',
  'Dried Mushroom',
  'Mushroom Powder',
  'Mushroom Meatballs',
  'Mushroom Sausages',
  'Spawn',
  'Grow Bags',
  'Compost',
  'Training Package'
];

export default function Marketplace({ language, currentUserEmail, currentUserId }: MarketplaceProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  // Expanded View details state
  const [expandedProduct, setExpandedProduct] = useState<Product | null>(null);

  // Inquiry form states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryData, setInquiryData] = useState({
    buyerName: '',
    phone: '',
    email: currentUserEmail || '',
    requiredQuantity: '',
    deliveryLocation: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await dataService.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenInquiry = (product: Product) => {
    setSelectedProduct(product);
    setInquiryData({
      buyerName: '',
      phone: '',
      email: currentUserEmail || '',
      requiredQuantity: '',
      deliveryLocation: '',
      message: ''
    });
    setInquirySuccess(false);
    setInquiryError('');
  };

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!inquiryData.buyerName || !inquiryData.phone || !inquiryData.email || !inquiryData.requiredQuantity || !inquiryData.deliveryLocation) {
      setInquiryError(language === 'EN' ? 'Please fill in all required fields.' : 'කරුණාකර සියලුම අත්‍යවශ්‍ය ක්ෂේත්‍ර පුරවන්න.');
      return;
    }

    setSubmittingInquiry(true);
    setInquiryError('');

    try {
      await dataService.addInquiry({
        buyerName: inquiryData.buyerName,
        phone: inquiryData.phone,
        email: inquiryData.email,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        requiredQuantity: inquiryData.requiredQuantity,
        deliveryLocation: inquiryData.deliveryLocation,
        message: inquiryData.message,
        status: 'New',
        supplierId: selectedProduct.supplierId,
        buyerId: currentUserId
      });

      setInquirySuccess(true);
    } catch (err) {
      console.error(err);
      setInquiryError(language === 'EN' ? 'Could not submit inquiry. Please try again.' : 'විමසීම යොමු කිරීමට නොහැකි විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All Districts' || p.district === selectedDistrict;
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="marketplace-page">
      {/* Header */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#2D2D2A] tracking-tight">
          {language === 'EN' ? 'Ecosystem Marketplace' : 'හතු සහ අනුබද්ධ නිෂ්පාදන වෙළඳපොළ'}
        </h1>
        <p className="mt-1.5 text-[#2D2D2A]/70 text-sm font-sans">
          {language === 'EN'
            ? 'Browse organic oyster mushrooms, spawn seed bottles, sterilized grow bags, value-added meatballs/sausages directly from verified growers.'
            : 'සහතිකලත් දේශීය වගාකරුවන්ගෙන් සෘජුවම නැවුම් හතු, බීජ බෝතල්, වගා බෑග් සහ අගය එකතු කල නිෂ්පාදන මිලදී ගන්න.'}
        </p>
      </div>

      {/* Filters & Search Grid */}
      <div className="bg-white border border-[#5A5A40]/10 p-5 rounded-[24px] shadow-sm mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 font-sans" id="marketplace-filters">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D2D2A]/40" />
          <input
            type="text"
            placeholder={language === 'EN' ? 'Search products, suppliers...' : 'නිෂ්පාදන හෝ සපයන්නන් සොයන්න...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F0] border border-[#5A5A40]/25 rounded-xl text-[#2D2D2A] text-sm outline-none focus:ring-2 focus:ring-[#8B4513]/10 focus:border-[#8B4513] transition"
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-60">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D2D2A]/40" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#F5F5F0] border border-[#5A5A40]/25 rounded-xl text-[#2D2D2A] text-sm outline-none focus:ring-2 focus:ring-[#8B4513]/10 focus:border-[#8B4513] transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All Categories' && language === 'SI' ? 'සියලුම වර්ගයන්' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="relative w-full md:w-48">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D2D2A]/40" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#F5F5F0] border border-[#5A5A40]/25 rounded-xl text-[#2D2D2A] text-sm outline-none focus:ring-2 focus:ring-[#8B4513]/10 focus:border-[#8B4513] transition"
          >
            <option value="All Districts">{language === 'EN' ? 'All Districts' : 'සියලුම දිස්ත්‍රික්ක'}</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={fetchProducts}
          className="p-2.5 bg-[#5A5A40]/10 hover:bg-[#5A5A40]/20 text-[#5A5A40] rounded-xl transition self-stretch flex items-center justify-center cursor-pointer"
          title="Refresh products"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-10 h-10 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#2D2D2A]/60 text-sm font-sans font-semibold">
            {language === 'EN' ? 'Loading marketplace products...' : 'නිෂ්පාදන ලැයිස්තුව පූරණය වෙමින් පවතී...'}
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#5A5A40]/10 rounded-[32px] py-16 text-center max-w-md mx-auto space-y-4 shadow-sm font-sans">
          <Inbox className="h-12 w-12 text-[#2D2D2A]/40 mx-auto" />
          <h3 className="font-serif font-bold text-[#2D2D2A] text-lg">
            {language === 'EN' ? 'No Products Found' : 'නිෂ්පාදන කිසිවක් හමු නොවීය'}
          </h3>
          <p className="text-[#2D2D2A]/70 text-xs px-6">
            {language === 'EN'
              ? 'Try widening your search terms or choosing a different district or category filter.'
              : 'කරුණාකර වෙනත් දිස්ත්‍රික්කයක් හෝ කාණ්ඩයක් තෝරා නැවත උත්සාහ කරන්න.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setSelectedDistrict('All Districts');
            }}
            className="px-4 py-1.5 bg-[#5A5A40] text-white text-xs font-serif font-bold rounded-lg hover:bg-[#4E4E37] transition"
          >
            {language === 'EN' ? 'Reset Filters' : 'පෙරහන් ඉවත් කරන්න'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="products-grid font-sans">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setExpandedProduct(product)}
              className="bg-white border border-[#5A5A40]/10 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md hover:border-[#8B4513]/40 transition duration-300 flex flex-col justify-between cursor-pointer group"
              id={`prod-card-${product.id}`}
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-[#F5F5F0] overflow-hidden shrink-0">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400'}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400';
                  }}
                  className="w-full h-full object-cover transition transform group-hover:scale-105 duration-300"
                />
                <span className="absolute top-3 right-3 bg-[#2D2D2A]/85 text-[#F5F5F0] text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="absolute bottom-3 left-3 bg-[#8B4513]/95 text-white text-[10px] font-serif font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                  <MapPin className="h-3 w-3 text-white/80" />
                  <span>{product.district}</span>
                </span>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-[#2D2D2A] text-base leading-tight mb-1.5 group-hover:text-[#8B4513] transition">
                    {product.name}
                  </h3>
                  <p className="text-[#2D2D2A]/70 text-xs line-clamp-2 mb-3 leading-relaxed font-sans">
                    {product.description}
                  </p>

                  <div className="space-y-1 text-xs border-t border-[#5A5A40]/10 pt-3 mb-4 font-sans">
                    <p className="text-[#2D2D2A]/80">
                      <span className="font-bold text-[#2D2D2A]">
                        {language === 'EN' ? 'Min Order: ' : 'අවම ඇණවුම: '}
                      </span>
                      {product.minimumOrder}
                    </p>
                    <p className="text-[#2D2D2A]/80">
                      <span className="font-bold text-[#2D2D2A]">
                        {language === 'EN' ? 'Monthly Supply: ' : 'මාසික සැපයුම: '}
                      </span>
                      {product.monthlyCapacity}
                    </p>
                    <p className="text-[#2D2D2A]/60">
                      <span className="font-semibold text-[#2D2D2A]/80">
                        {language === 'EN' ? 'Supplier: ' : 'සපයන්නා: '}
                      </span>
                      {product.supplierName}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#5A5A40]/10 flex items-center justify-between font-sans">
                  <div>
                    <span className="block text-[10px] text-[#2D2D2A]/50 font-bold uppercase tracking-wider">
                      {language === 'EN' ? 'Est. Price' : 'ඇස්තමේන්තුගත මිල'}
                    </span>
                    <span className="text-[#8B4513] font-serif font-bold text-sm">
                      {product.priceRange}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInquiry(product);
                    }}
                    className="px-3.5 py-2 bg-[#8B4513] hover:bg-[#733A0F] text-white text-xs font-serif font-bold rounded-xl shadow-sm transition flex items-center space-x-1"
                    id={`btn-inquire-${product.id}`}
                  >
                    <Send className="h-3 w-3 text-white/80" />
                    <span>{language === 'EN' ? 'Inquire' : 'මිල විමසන්න'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buyer Inquiry Modal Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#2D2D2A]/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="inquiry-modal">
          <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="bg-[#5A5A40] text-white p-6 relative">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5F5F0_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif font-bold tracking-tight">
                  {language === 'EN' ? 'Submit Product Inquiry' : 'නිෂ්පාදන මිල විමසීම'}
                </h3>
                <p className="text-[#F5F5F0]/85 text-xs mt-1 font-sans">
                  {language === 'EN' 
                    ? 'Your direct request will be visible immediately to the supplier.' 
                    : 'ඔබේ ඉල්ලීම සෘජුවම අදාළ සැපයුම්කරු වෙත යොමු කරනු ලැබේ.'}
                </p>
              </div>
            </div>

            {inquirySuccess ? (
              <div className="p-8 text-center space-y-4 font-sans" id="inquiry-success-view">
                <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-full text-[#8B4513]">
                  <CheckCircle2 className="h-10 w-10 text-[#8B4513]" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#2D2D2A]">
                  {language === 'EN' ? 'Inquiry Submitted!' : 'විමසීම සාර්ථකව යොමු කරන ලදී!'}
                </h4>
                <p className="text-[#2D2D2A]/70 text-sm">
                  {language === 'EN'
                    ? `Your inquiry for "${selectedProduct.name}" has been sent to ${selectedProduct.supplierName}. They will contact you shortly.`
                    : `ඔබේ විමසීම සාර්ථකව සපයන්නා වෙත ලැබී ඇත. ඔවුන් ළඟදීම ඔබව සම්බන්ධ කර ගනු ඇත.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white text-sm font-serif font-bold rounded-xl"
                  >
                    {language === 'EN' ? 'Close Window' : 'වසා දමන්න'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="p-6 space-y-4 font-sans">
                {inquiryError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start space-x-2 text-red-800 text-xs">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                {/* Selected Product info */}
                <div className="bg-[#F5F5F0] border border-[#5A5A40]/10 p-3 rounded-xl">
                  <span className="block text-[10px] uppercase font-serif font-bold text-[#2D2D2A]/60 tracking-wider">
                    {language === 'EN' ? 'Inquiring Product' : 'විමසන නිෂ්පාදනය'}
                  </span>
                  <span className="block font-serif font-bold text-[#2D2D2A] text-sm">
                    {selectedProduct.name}
                  </span>
                  <span className="block text-xs text-[#2D2D2A]/70 font-sans">
                    {language === 'EN' ? 'Supplier: ' : 'සපයන්නා: '} {selectedProduct.supplierName} ({selectedProduct.district})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Buyer Name */}
                  <div>
                    <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                      {language === 'EN' ? 'Your Name' : 'ඔබගේ නම'} <span className="text-[#8B4513] font-sans">*</span>
                    </label>
                    <input
                      type="text"
                      name="buyerName"
                      required
                      value={inquiryData.buyerName}
                      onChange={handleInquiryChange}
                      placeholder="e.g. Saman Kumara"
                      className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                      {language === 'EN' ? 'Phone Number' : 'දුරකථන අංකය'} <span className="text-[#8B4513] font-sans">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={inquiryData.phone}
                      onChange={handleInquiryChange}
                      placeholder="e.g. 0771234567"
                      className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                      {language === 'EN' ? 'Email Address' : 'විද්‍යුත් තැපෑල'} <span className="text-[#8B4513] font-sans">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={inquiryData.email}
                      onChange={handleInquiryChange}
                      placeholder="e.g. buyer@gmail.com"
                      className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>

                  {/* Required Quantity */}
                  <div>
                    <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                      {language === 'EN' ? 'Required Quantity (e.g. 100kg)' : 'අවශ්‍ය ප්‍රමාණය'} <span className="text-[#8B4513] font-sans">*</span>
                    </label>
                    <input
                      type="text"
                      name="requiredQuantity"
                      required
                      value={inquiryData.requiredQuantity}
                      onChange={handleInquiryChange}
                      placeholder="e.g. 50kg weekly"
                      className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                    />
                  </div>
                </div>

                {/* Delivery Location */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Delivery Location / City' : 'ලැබිය යුතු ස්ථානය / නගරය'} <span className="text-[#8B4513] font-sans">*</span>
                  </label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    required
                    value={inquiryData.deliveryLocation}
                    onChange={handleInquiryChange}
                    placeholder="e.g. Pettah Warehouse, Colombo"
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[#2D2D2A] font-serif font-bold text-xs mb-1">
                    {language === 'EN' ? 'Message / Special Instructions' : 'විශේෂ පණිවිඩය'}
                  </label>
                  <textarea
                    name="message"
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    rows={3}
                    placeholder={language === 'EN' ? 'State payment preferences, timing or queries...' : 'ගෙවීම් ක්‍රම සහ කාලසීමාවන් පිළිබඳ සඳහන් කරන්න...'}
                    className="w-full px-3 py-2 border border-[#5A5A40]/25 rounded-lg text-sm text-[#2D2D2A] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none bg-white transition"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-3 border-t border-[#5A5A40]/10">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-serif font-bold rounded-xl transition"
                  >
                    {language === 'EN' ? 'Cancel' : 'අවලංගු කරන්න'}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="flex-1 py-2.5 bg-[#8B4513] hover:bg-[#733A0F] disabled:bg-[#8B4513]/40 text-white text-sm font-serif font-bold rounded-xl transition flex items-center justify-center space-x-1"
                    id="btn-submit-inquiry"
                  >
                    {submittingInquiry ? (
                      <span>{language === 'EN' ? 'Sending...' : 'යවමින්...'}</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-white/80" />
                        <span>{language === 'EN' ? 'Send Inquiry' : 'විමසීම යොමු කරන්න'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Expanded Product Details Modal Popup */}
      {expandedProduct && (() => {
        const related = products
          .filter((p) => p.id !== expandedProduct.id)
          .filter((p) => p.category === expandedProduct.category)
          .slice(0, 3);
        const relatedList = related.length > 0 
          ? related 
          : products.filter((p) => p.id !== expandedProduct.id).slice(0, 3);

        return (
          <div className="fixed inset-0 bg-[#2D2D2A]/70 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in" id="expanded-product-modal">
            <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-4xl w-full overflow-hidden shadow-2xl relative my-8 flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
              {/* Close Button */}
              <button
                onClick={() => {
                  setExpandedProduct(null);
                  setInquirySuccess(false);
                  setInquiryError('');
                }}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md border border-stone-100 transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Column: Image & Related Items */}
              <div className="w-full md:w-1/2 bg-[#F5F5F0]/50 border-r border-[#5A5A40]/10 p-6 flex flex-col justify-between overflow-y-auto h-1/2 md:h-full">
                <div className="space-y-6">
                  {/* Category & Status badges */}
                  <div className="flex items-center justify-between">
                    <span className="bg-[#5A5A40] text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {expandedProduct.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      expandedProduct.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {expandedProduct.status === 'Available' ? (language === 'EN' ? 'Available' : 'ලබාගත හැක') : (language === 'EN' ? 'Out of Stock' : 'තොග අවසන්')}
                    </span>
                  </div>

                  {/* Main Image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-[#5A5A40]/15 bg-white shrink-0">
                    <img
                      src={expandedProduct.imageUrl || 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600'}
                      alt={expandedProduct.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 text-stone-800 text-xs font-serif font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm">
                      <MapPin className="h-3.5 w-3.5 text-[#8B4513]" />
                      <span>{expandedProduct.district} {language === 'EN' ? 'District' : 'දිස්ත්‍රික්කය'}</span>
                    </div>
                  </div>

                  {/* Cultivation standard guidelines */}
                  <div className="bg-stone-50 border border-stone-200/60 p-4 rounded-2xl space-y-2">
                    <h5 className="text-[#8B4513] font-serif font-bold text-xs uppercase tracking-wider">
                      {language === 'EN' ? 'Grower Standard Parameters' : 'වගාකරුගේ ප්‍රමිති පරාමිතීන්'}
                    </h5>
                    <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-4 font-sans">
                      <li><strong>{language === 'EN' ? 'Substrate Base' : 'මාධ්‍ය පදනම'}:</strong> {language === 'EN' ? '100% steam-pasteurized sawdust, rice bran, CaCO3' : '100% වාෂ්පයෙන් ජීවානුහරණය කළ ලී කුඩු, සහල් නිවුඩු'}</li>
                      <li><strong>{language === 'EN' ? 'Quality Standard' : 'ගුණත්ව ප්‍රමිතිය'}:</strong> {language === 'EN' ? 'Pesticide-free, 100% natural, hygienic farm gate processing' : 'පළිබෝධනාශක නොමැති, 100% ස්වභාවික, සනීපාරක්ෂක වගාවන්'}</li>
                      <li><strong>{language === 'EN' ? 'Optimal Shelf Life' : 'නිරෝගී ආයු කාලය'}:</strong> {
                        expandedProduct.category.toLowerCase().includes('dried') || expandedProduct.category.toLowerCase().includes('powder')
                          ? (language === 'EN' ? '12 months (Keep airtight in cool dark place)' : 'මාස 12 ක් (සිසිල් වියළි ස්ථානයක තබන්න)')
                          : expandedProduct.category.toLowerCase().includes('spawn') || expandedProduct.category.toLowerCase().includes('bags')
                          ? (language === 'EN' ? '30-45 days (Store under 25°C)' : 'දින 30-45 ක් (සෙල්සියස් 25 ට අඩුවෙන් තබන්න)')
                          : (language === 'EN' ? '5-7 days (Keep refrigerated)' : 'දින 5-7 ක් (ශීතකරණයේ තබන්න)')
                      }</li>
                    </ul>
                  </div>
                </div>

                {/* More Like This panel */}
                <div className="mt-6 pt-6 border-t border-[#5A5A40]/10">
                  <h4 className="text-stone-800 font-serif font-bold text-xs uppercase tracking-wider mb-3">
                    {language === 'EN' ? 'More Like This' : 'මේ හා සමාන තවත් භාණ්ඩ'}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {relatedList.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setExpandedProduct(p);
                          setInquirySuccess(false);
                          setInquiryError('');
                        }}
                        className="bg-white border border-stone-200 hover:border-[#8B4513]/40 rounded-xl p-1.5 cursor-pointer text-center group transition"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-1">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=200';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <p className="text-[9px] font-serif font-bold text-stone-800 line-clamp-1 group-hover:text-[#8B4513] transition">{p.name}</p>
                        <p className="text-[8px] font-mono font-bold text-stone-500">{p.priceRange.split('/')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Details, Description, and Inquiry form */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-1/2 md:h-full font-sans text-[#2D2D2A]">
                {/* Scrollable details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800 leading-tight">
                      {expandedProduct.name}
                    </h2>
                    <p className="text-xs text-[#8B4513] font-mono mt-1 font-bold">
                      {language === 'EN' ? 'Ecosystem verified item' : 'පද්ධතිය මඟින් සත්‍යාපනය කළ භාණ්ඩයක්'}
                    </p>
                  </div>

                  {/* Quick specs grid */}
                  <div className="grid grid-cols-2 gap-4 border-y border-stone-100 py-4 text-xs">
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">{language === 'EN' ? 'Supplier Name' : 'සපයන්නා'}</span>
                      <span className="font-serif font-bold text-stone-800">{expandedProduct.supplierName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">{language === 'EN' ? 'Price Range' : 'මිල පරාසය'}</span>
                      <span className="font-serif font-bold text-[#8B4513] text-sm">{expandedProduct.priceRange}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">{language === 'EN' ? 'Minimum Order' : 'අවම ඇණවුම'}</span>
                      <span className="font-medium text-stone-700">{expandedProduct.minimumOrder}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">{language === 'EN' ? 'Monthly Supply' : 'මාසික සැපයුම'}</span>
                      <span className="font-medium text-stone-700">{expandedProduct.monthlyCapacity}</span>
                    </div>
                  </div>

                  {/* Description text */}
                  <div className="space-y-2">
                    <h4 className="text-stone-800 font-serif font-bold text-xs uppercase tracking-wider">
                      {language === 'EN' ? 'Product Description' : 'නිෂ්පාදන විස්තරය'}
                    </h4>
                    <p className="text-stone-600 text-xs leading-relaxed whitespace-pre-line bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                      {expandedProduct.description}
                    </p>
                    {/* Additional details for rich experience */}
                    <p className="text-stone-500 text-[11px] leading-relaxed italic">
                      {language === 'EN' 
                        ? 'All products are monitored under the Mushroom Eco Hub Quality Management guidelines. If you send an inquiry, the supplier will instantly receive your contact info to call or message you back.'
                        : 'සියලුම නිෂ්පාදන හතු ඉකෝ හබ් තත්ත්ව පාලන මාර්ගෝපදේශ යටතේ නිරීක්ෂණය කෙරේ. ඔබ මිල විමසීමක් යොමු කළ විට, සපයන්නාට ඔබේ තොරතුරු ලැබී වහාම ඔබව සම්බන්ධ කර ගනු ඇත.'}
                    </p>
                  </div>
                </div>

                {/* Send inquiry action or inline inquiry form */}
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <button
                    onClick={() => {
                      // Open standard inquiry form directly with this product selected
                      setExpandedProduct(null); // Close this details modal
                      handleOpenInquiry(expandedProduct); // Open inquiry modal
                    }}
                    className="w-full py-3 bg-[#8B4513] hover:bg-[#733A0F] text-white font-serif font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>{language === 'EN' ? 'Inquire & Request Quote' : 'මිල විමසා ඇණවුම් කරන්න'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
