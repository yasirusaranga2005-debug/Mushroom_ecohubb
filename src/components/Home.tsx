import React from 'react';
import { Product } from '../types';
import { dataService } from '../lib/dataService';
const heroBg = "https://firebasestorage.googleapis.com/v0/b/oval-team-6fdq2.firebasestorage.app/o/Hero-final.webp?alt=media&token=8ff45da8-56dd-43ce-b3f9-9f72bb124f38";
import { 
  Sprout, 
  ArrowRight, 
  Award, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  ShoppingBag,
  Cpu,
  Smile,
  ShieldCheck,
  Percent,
  GraduationCap,
  Handshake,
  Globe,
  Factory,
  Truck,
  Cog,
  Package,
  ShoppingCart,
  BarChart3,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';

interface HomeProps {
  language: 'EN' | 'SI';
  setCurrentTab: (tab: string) => void;
  onOpenJoinForm: () => void;
  currentUserEmail?: string;
  currentUserId?: string;
}

export default function Home({ 
  language, 
  setCurrentTab, 
  onOpenJoinForm,
  currentUserEmail,
  currentUserId
}: HomeProps) {
  const [heroImg, setHeroImg] = React.useState("https://firebasestorage.googleapis.com/v0/b/oval-team-6fdq2.firebasestorage.app/o/Hero-final.webp?alt=media&token=8ff45da8-56dd-43ce-b3f9-9f72bb124f38");
  const [aboutImg, setAboutImg] = React.useState("https://firebasestorage.googleapis.com/v0/b/oval-team-6fdq2.firebasestorage.app/o/What-is-Mashroom-Eco-Hub.webp?alt=media&token=7303cfea-7e37-405d-9ad2-2a892ef5d5fa");

  // Featured Products and Inquiry states
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [expandedProduct, setExpandedProduct] = React.useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [inquiryData, setInquiryData] = React.useState({
    buyerName: '',
    phone: '',
    email: currentUserEmail || '',
    requiredQuantity: '',
    deliveryLocation: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = React.useState(false);
  const [inquirySuccess, setInquirySuccess] = React.useState(false);

  // Native browser preloading via index.html and native img attributes handles this more efficiently.
  // Fetch trending products (top 4)
  React.useEffect(() => {
    let active = true;
    const fetchTrending = async () => {
      try {
        const data = await dataService.getProducts();
        if (active) {
          setAllProducts(data);
          // Take the top 4 products
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading featured products on home page:", err);
      } finally {
        if (active) setProductsLoading(false);
      }
    };
    fetchTrending();
    return () => {
      active = false;
    };
  }, []);

  // Prefill email if currentUser changes
  React.useEffect(() => {
    if (currentUserEmail) {
      setInquiryData(prev => ({ ...prev, email: currentUserEmail }));
    }
  }, [currentUserEmail]);

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
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmittingInquiry(true);

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
        buyerId: currentUserId || ''
      });
      setInquirySuccess(true);
    } catch (err) {
      console.error("Error submitting product inquiry:", err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="bg-brand-cream/20 min-h-screen text-brand-text" id="home-page">
      {/* Hero Section */}
      <section 
        id="hero-section"
        className="relative overflow-hidden bg-[#FFFDF7] md:bg-cover md:bg-[center_right] md:bg-no-repeat border-b border-brand-border/40 min-h-screen md:min-h-[760px] flex items-center pt-24 pb-12 md:py-0"
      >
        {/* Absolute Background Image for desktop with standard inline style for robust rendering */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            #hero-section {
              background-image: url("${heroImg}");
            }
          }
        `}} />

        {/* Subtle organic textured background overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#5A5A40_1.5px,transparent_1.5px)] [background-size:24px_24px] z-10"></div>
        
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 relative z-20 w-full flex flex-col justify-center">
          
          {/* Left Content Column - taking exactly ~44% to 50% width on desktop to leave the right products untouched */}
          <div className="relative z-30 space-y-6 sm:space-y-8 text-left w-full md:w-[50%] lg:w-[46%] xl:w-[44%] md:max-w-[600px] md:my-16">
            
            {/* National Ecosystem Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#EAECE1] border border-[#D5DAD0] px-4 py-1.5 rounded-full text-[#384C2F] text-xs font-semibold tracking-wide shadow-xs">
              <Sprout className="h-4 w-4 text-[#A57C3E]" />
              <span className="font-serif">
                {language === 'EN' ? 'National Mushroom Ecosystem' : 'ජාතික හතු පරිසර පද්ධතිය'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#1C1F17] leading-[1.1] tracking-tight">
              {language === 'EN' ? (
                <>
                  Build the Mushroom <br />
                  <span className="text-[#A57C3E] italic">Value-Added Economy</span> <br />
                  Together
                </>
              ) : (
                <>
                  හතු වගාවෙන් <br className="hidden sm:inline" />
                  <span className="text-[#A57C3E] italic">අගය එකතු කළ</span> <br />
                  <span className="text-[#A57C3E] italic">ආර්ථිකයක්</span> එක්ව <br className="hidden sm:inline" />
                  ගොඩනඟමු
                </>
              )}
            </h1>

            {/* Description Paragraph */}
            <p className="text-[#4D5341] text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              {language === 'EN'
                ? 'Connect growers, processors, buyers, trainers, and partners through one organized ecosystem for premium mushroom-based products.'
                : 'ප්‍රිමියම් හතු ආශ්‍රිත නිෂ්පාදන සඳහා එක් සංවිධානාත්මක පරිසර පද්ධතියක් හරහා වගාකරුවන්, සකසන්නන්, ගැනුම්කරුවන්, පුහුණුකරුවන් සහ හවුල්කරුවන් සම්බන්ධ කරන්න.'}
            </p>

            {/* Call to Actions Button Row */}
            <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3 pt-2 w-full sm:w-auto relative z-30">
              <button
                onClick={onOpenJoinForm}
                className="bg-[#0D3E26] hover:bg-[#072415] text-white text-xs lg:text-sm font-semibold px-7 py-3 sm:py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap w-full sm:w-auto shrink-0"
                id="hero-cta-join"
              >
                <span>{language === 'EN' ? 'Join the Ecosystem' : 'පරිසර පද්ධතියට එක්වන්න'}</span>
                <ArrowRight className="h-4 w-4 text-white/80 shrink-0" />
              </button>
              <button
                onClick={() => setCurrentTab('marketplace')}
                className="bg-white hover:bg-slate-50 text-[#1C1F17] text-xs lg:text-sm font-semibold px-7 py-3 sm:py-3.5 rounded-xl border border-[#D5DAD0] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap w-full sm:w-auto shrink-0"
                id="hero-cta-marketplace"
              >
                <span>{language === 'EN' ? 'View Product Lineup' : 'නිෂ්පාදන පෙළ නැරඹීමට'}</span>
                <ArrowRight className="h-4 w-4 text-[#A57C3E] shrink-0" />
              </button>
              <button
                onClick={() => setCurrentTab('training')}
                className="bg-white hover:bg-slate-50 text-[#1C1F17] text-xs lg:text-sm font-semibold px-7 py-3 sm:py-3.5 rounded-xl border border-[#D5DAD0] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap w-full sm:w-auto shrink-0"
                id="hero-cta-training"
              >
                <span>{language === 'EN' ? 'Request Training' : 'පුහුණුවීම් ලබාගැනීමට'}</span>
                <ArrowRight className="h-4 w-4 text-[#A57C3E] shrink-0" />
              </button>
            </div>

            {/* Subtle Divider Slogan */}
            <div className="flex items-center space-x-3 pt-4 border-t border-[#D5DAD0]/50">
              <div className="p-1.5 bg-[#EAECE1] rounded-full text-[#384C2F] flex items-center justify-center shrink-0">
                <Sprout className="h-3.5 w-3.5 text-[#A57C3E]" />
              </div>
              <span className="text-xs text-[#5D6352] font-semibold tracking-wide font-serif">
                {language === 'EN' 
                  ? 'From cultivation to branded value-added products.' 
                  : 'වගාවේ සිට සන්නාමගත අගය එකතු කළ නිෂ්පාදන දක්වා.'}
              </span>
            </div>

            {/* Status Bar - Clean single-line layout replacing the ecosystem pillars */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 pt-6 border-t border-[#D5DAD0]/40 w-full">
              {[
                { icon: Sprout, textEN: 'Sustainable Sourcing', textSI: 'තිරසාර සැපයුම' },
                { icon: ShieldCheck, textEN: 'Quality Assured', textSI: 'ගුණාත්මක බව සහතිකයි' },
                { icon: TrendingUp, textEN: 'Market Ready', textSI: 'වෙළඳපලට සූදානම්' },
                { icon: Globe, textEN: 'Scalable Impact', textSI: 'පරිමාණීය බලපෑම' }
              ].map((pill, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 shrink-0">
                  <pill.icon className="h-4.5 w-4.5 text-[#0D3E26] shrink-0" />
                  <span className="text-xs font-semibold text-[#1C1F17] tracking-wide whitespace-nowrap">
                    {language === 'EN' ? pill.textEN : pill.textSI}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Mobile-only image representation - stacked beautifully below the text on mobile */}
          <div className="block md:hidden mt-8 w-full relative z-30">
            <img
              src={heroImg}
              alt="Mushroom Eco Hub Premium Product Showcase"
              className="w-full h-auto object-contain rounded-2xl border border-[#E4DDC8]/60 shadow-md"
              referrerPolicy="no-referrer"
              onError={() => setHeroImg("https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=1600")}
            />
          </div>

        </div>
      </section>

      {/* Core Philosophy Banner */}
      <section className="bg-brand-cream border-y border-brand-border py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-orange rounded-xl text-white shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-brand-text font-serif font-bold text-sm sm:text-base">
                {language === 'EN' ? 'Eco-Hub Co-operative Philosophy' : 'පරිසර කේන්ද්‍රීය සමුපකාර දර්ශනය'}
              </h4>
              <p className="text-brand-text/80 text-xs sm:text-sm">
                {language === 'EN' 
                  ? 'Our mission is organized shared growth. Not isolation or hostile price cuts.' 
                  : 'අපගේ අරමුණ සංවිධානාත්මක පොදු වර්ධනයයි. හුදකලා වීම හෝ අහිතකර ලෙස මිල අඩු කිරීම් නොවේ.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('about')}
            className="text-brand-orange border border-brand-orange/30 hover:bg-brand-orange/10 px-4 py-1.5 rounded-xl text-xs font-serif font-bold transition shrink-0"
          >
            {language === 'EN' ? 'Read Mission' : 'අපගේ මෙහෙවර'}
          </button>
        </div>
      </section>

      {/* What is Mushroom Eco Hub */}
      <section className="py-16 px-4 max-w-7xl mx-auto" id="what-is-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-text tracking-tight">
              {language === 'EN' ? 'What is Mushroom Eco Hub?' : 'හතු පරිසර කේන්ද්‍රය යනු කුමක්ද?'}
            </h2>
            <div className="h-1 w-20 bg-brand-orange"></div>
            <p className="text-brand-text/90 leading-relaxed text-base">
              {language === 'EN'
                ? 'Mushroom Eco Hub is a complete digital ecosystem platform designed specifically for the mushroom cultivation supply chain. By bringing together mushroom growers, bulk buyers, processing partners, and trainers, we eliminate supply mismatches and provide farmers with stable, guaranteed pricing.'
                : 'හතු පරිසර කේන්ද්‍රය යනු හතු වගා සැපයුම් දාමය සඳහාම විශේෂයෙන් සකස් කරන ලද ඩිජිටල් පරිසර පද්ධතියකි. හතු වගාකරුවන්, තොග ගැනුම්කරුවන්, අගය එකතු කරන සකසන්නන් සහ පුහුණුකරුවන් එකම වේදිකාවකට ගෙන ඒම මඟින්, අපි සැපයුම් අසමතුලිතතාවය මඟහැර වගාකරුවන්ට සිරස්තල සහ සහතික මිලක් ලබා දෙන්නෙමු.'}
            </p>
            <p className="text-brand-text/90 leading-relaxed text-base">
              {language === 'EN'
                ? 'Instead of acting in competition, growers can register their collective production capacity, allowing bulk supermarket orders to be consolidated and distributed among the smallholders. This creates steady employment and income growth.'
                : 'වගාකරුවන් එකිනෙකා සමඟ තරඟ වදිනු වෙනුවට, ඔවුන්ගේ පොදු නිෂ්පාදන ධාරිතාවය ලියාපදිංචි කළ හැක. එමඟින් සුපිරි වෙළඳසැල් ජාල වලින් ලැබෙන විශාල ඇණවුම් සුළු පරිමාණ වගාකරුවන් අතර බෙදා හැරීමට ඉඩ සලසයි.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Card 1 */}
              <div className="bg-white border border-brand-border p-5 rounded-[24px] shadow-sm flex items-start space-x-4">
                <div className="h-12 w-12 bg-[#0D3E26]/10 text-[#0D3E26] rounded-full flex items-center justify-center shrink-0">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-3xl font-serif font-extrabold text-[#0D3E26] leading-none mb-1.5">100%</span>
                  <span className="text-xs text-brand-text font-bold block">{language === 'EN' ? 'Eco-Focused & Organic' : 'පරිසර හිතකාමී වගාව'}</span>
                  <span className="text-[11px] text-brand-text/70 block mt-1">
                    {language === 'EN' ? 'Sustainable organic practices for healthy yields.' : 'තිරසාර සහ කාබනික පරිසර හිතකාමී ක්‍රමවේද.'}
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-brand-border p-5 rounded-[24px] shadow-sm flex items-start space-x-4">
                <div className="h-12 w-12 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center shrink-0">
                  <Smile className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-3xl font-serif font-extrabold text-brand-orange leading-none mb-1.5">Zero Cost</span>
                  <span className="text-xs text-brand-text font-bold block">{language === 'EN' ? 'Free Registration' : 'නොමිලේ ලියාපදිංචිය'}</span>
                  <span className="text-[11px] text-brand-text/70 block mt-1">
                    {language === 'EN' ? 'Absolutely no fees to join and participate.' : 'කිසිදු ගාස්තුවකින් තොරව අප හා සම්බන්ධ වන්න.'}
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-brand-border p-5 rounded-[24px] shadow-sm flex items-start space-x-4">
                <div className="h-12 w-12 bg-[#A57C3E]/10 text-[#A57C3E] rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-3xl font-serif font-extrabold text-[#A57C3E] leading-none mb-1.5">500+</span>
                  <span className="text-xs text-brand-text font-bold block">{language === 'EN' ? 'Active Smallholders' : 'සක්‍රීය වගාකරුවන්'}</span>
                  <span className="text-[11px] text-brand-text/70 block mt-1">
                    {language === 'EN' ? 'A large consolidated supply base.' : 'විශාල ඒකාබද්ධ සැපයුම් ජාලයක්.'}
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-brand-border p-5 rounded-[24px] shadow-sm flex items-start space-x-4">
                <div className="h-12 w-12 bg-[#0D3E26]/10 text-[#0D3E26] rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-3xl font-serif font-extrabold text-[#0D3E26] leading-none mb-1.5">Stable</span>
                  <span className="text-xs text-brand-text font-bold block">{language === 'EN' ? 'Guaranteed Pricing' : 'ස්ථාවර සහතික මිල'}</span>
                  <span className="text-[11px] text-brand-text/70 block mt-1">
                    {language === 'EN' ? 'Eliminate market fluctuations completely.' : 'වෙළඳපල මිල උච්චාවචනයන් මුළුමනින්ම මඟහරවන්න.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative">
              <img
                src={aboutImg}
                alt="Mushroom Cultivation"
                referrerPolicy="no-referrer"
                className="rounded-[40px] shadow-xl border-4 border-white object-cover w-full h-[350px]"
                onError={() => setAboutImg("https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1200")}
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-dark-green text-white p-5 rounded-[24px] max-w-sm shadow-lg hidden sm:flex items-center space-x-4 border border-white/10 z-10">
                <div className="h-12 w-12 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-white font-serif font-bold text-sm mb-0.5 italic">
                    {language === 'EN' ? 'Stronger Together' : 'ජාතික අරමුණ'}
                  </p>
                  <p className="text-xs text-white/85 leading-relaxed">
                    {language === 'EN' 
                      ? 'Connecting people, creating prosperity.' 
                      : 'හතු වගාව ග්‍රාමීය පවුල් සඳහා ඉහළ ආදායම් උපදවන ක්ෂුද්‍ර ව්‍යාපාරයක් ලෙස ප්‍රවර්ධනය කිරීම.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Flow Section */}
      <section className="bg-brand-cream/35 py-16 px-4 border-y border-brand-border" id="ecosystem-flow-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-brand-text">
              {language === 'EN' ? 'Ecosystem Flow & Supply Chain' : 'පරිසර පද්ධති ගලායාම සහ සැපයුම් දාමය'}
            </h2>
            <p className="mt-2 text-brand-text/80 max-w-2xl mx-auto text-sm">
              {language === 'EN'
                ? 'Our unified framework channels mushroom farming outputs directly from local soil to premium market buyers.'
                : 'අපගේ ඒකාබද්ධ ක්‍රමවේදය මඟින් දේශීය මට්ටමින් වගාකෙරෙන හතු නිෂ්පාදන සෘජුවම ඉහළ වෙළඳපල ගැනුම්කරුවන් වෙත යොමු කරයි.'}
            </p>
          </div>

          {/* Flow Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { title: language === 'EN' ? 'Growers' : 'වගාකරුවන්', subtitle: 'Farmers', color: 'bg-[#384C2F]', step: '01', icon: Sprout },
              { title: language === 'EN' ? 'Collection' : 'එකතු කිරීම', subtitle: 'Consolidate', color: 'bg-[#384C2F]', step: '02', icon: Truck },
              { title: language === 'EN' ? 'Processing' : 'සැකසීම', subtitle: 'Value Add', color: 'bg-[#384C2F]', step: '03', icon: Cog },
              { title: language === 'EN' ? 'Branding' : 'සන්නාමකරණය', subtitle: 'Packaging', color: 'bg-[#384C2F]', step: '04', icon: Package },
              { title: language === 'EN' ? 'Buyers' : 'ගැනුම්කරුවන්', subtitle: 'Supermarkets', color: 'bg-[#384C2F]', step: '05', icon: ShoppingCart },
              { title: language === 'EN' ? 'Income Growth' : 'ආදායම් වර්ධනය', subtitle: 'Prosperity', color: 'bg-[#384C2F]', step: '06', icon: BarChart3 }
            ].map((step, idx) => (
              <div key={idx} className="bg-white pt-8 pb-5 px-4 rounded-[24px] border border-brand-border relative shadow-sm hover:shadow-md transition flex flex-col items-center">
                <span className={`absolute top-3 right-3 w-5 h-5 rounded-full ${step.color} text-white text-[10px] font-bold flex items-center justify-center`}>
                  {step.step}
                </span>
                <div className="h-12 w-12 bg-[#F0F2EB] hover:bg-[#E4E8DC] text-[#384C2F] rounded-full flex items-center justify-center transition shadow-xs mb-3">
                  <step.icon className="h-6 w-6 text-[#0D3E26]" />
                </div>
                <p className="font-serif font-bold text-brand-text text-sm sm:text-base leading-tight">{step.title}</p>
                <p className="text-[11px] text-[#5D6352] font-semibold mt-1">{step.subtitle}</p>
                {idx < 5 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-brand-dark-green/40">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Marketplace Products Section */}
      <section className="bg-white py-16 px-4 border-b border-brand-border" id="trending-products-section">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-block bg-brand-orange/15 text-brand-orange text-xs font-serif font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
                {language === 'EN' ? 'Trending Produce' : 'ජනප්‍රිය නිෂ්පාදන'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-brand-text">
                {language === 'EN' ? 'Trending Marketplace Items' : 'ජනප්‍රිය වෙළඳපල අයිතම'}
              </h2>
              <p className="mt-2 text-brand-text/75 max-w-2xl text-sm leading-relaxed">
                {language === 'EN'
                  ? 'Explore premium mushroom-based products, spawn, and cultivation tools directly from our local growers and partners.'
                  : 'අපගේ දේශීය වගාකරුවන් සහ හවුල්කරුවන්ගෙන් සෘජුවම ලබාගත් උසස් තත්ත්වයේ හතු නිෂ්පාදන, බීජ සහ වගා මෙවලම් මෙතැනින් මිලදී ගන්න.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="group text-sm font-serif font-bold text-[#8B4513] hover:text-brand-orange flex items-center space-x-1.5 shrink-0 transition"
            >
              <span>{language === 'EN' ? 'Explore Full Marketplace' : 'මුළු වෙළඳපලම ගවේෂණය කරන්න'}</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Loading state */}
          {productsLoading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-brand-text/60 text-sm font-sans font-semibold">
                {language === 'EN' ? 'Loading trending products...' : 'නිෂ්පාදන පූරණය වෙමින් පවතී...'}
              </p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-brand-text/50 text-sm font-sans">
              {language === 'EN' ? 'No marketplace items available.' : 'වෙළඳපල අයිතම කිසිවක් නොමැත.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setExpandedProduct(product)}
                  className="bg-[#F5F5F0]/45 border border-[#5A5A40]/10 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md hover:border-[#8B4513]/40 transition duration-300 flex flex-col justify-between cursor-pointer group"
                  id={`home-prod-card-${product.id}`}
                >
                  {/* Image container */}
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
                    <span className="absolute top-3 right-3 bg-brand-text/90 text-brand-cream text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-[#8B4513]/95 text-white text-[10px] font-serif font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                      <MapPin className="h-3 w-3 text-white/80" />
                      <span>{product.district}</span>
                    </span>
                  </div>

                  {/* Details container */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-brand-text text-base leading-tight mb-1.5 min-h-[44px] line-clamp-2 group-hover:text-[#8B4513] transition">
                        {product.name}
                      </h3>
                      <p className="text-brand-text/75 text-xs line-clamp-2 mb-3 leading-relaxed font-sans min-h-[32px]">
                        {product.description}
                      </p>

                      <div className="space-y-1 text-xs border-t border-brand-border/60 pt-3 mb-4 font-sans">
                        <p className="text-brand-text/80">
                          <span className="font-bold text-brand-text">
                            {language === 'EN' ? 'Min Order: ' : 'අවම ඇණවුම: '}
                          </span>
                          {product.minimumOrder}
                        </p>
                        <p className="text-brand-text/80">
                          <span className="font-bold text-brand-text">
                            {language === 'EN' ? 'Monthly Supply: ' : 'මාසික සැපයුම: '}
                          </span>
                          {product.monthlyCapacity}
                        </p>
                        <p className="text-brand-text/60">
                          <span className="font-semibold text-brand-text/80">
                            {language === 'EN' ? 'Supplier: ' : 'සපයන්නා: '}
                          </span>
                          {product.supplierName}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between font-sans">
                      <div>
                        <span className="block text-[10px] text-brand-text/50 font-bold uppercase tracking-wider">
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
                        id={`btn-home-inquire-${product.id}`}
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

          {/* Mobile view all link */}
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="w-full py-3 bg-[#8B4513] hover:bg-[#733A0F] text-white text-sm font-serif font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
            >
              <span>{language === 'EN' ? 'Explore Full Marketplace' : 'මුළු වෙළඳපලම ගවේෂණය කරන්න'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="py-16 px-4 max-w-7xl mx-auto" id="who-can-join">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-brand-text">
            {language === 'EN' ? 'Who Can Join the Hub?' : 'පද්ධතියට සම්බන්ධ විය හැක්කේ කාටද?'}
          </h2>
          <p className="mt-2 text-brand-text/80 max-w-2xl mx-auto text-sm">
            {language === 'EN'
              ? 'Every role has a dedicated workspace and custom utilities. We welcome all stakeholders.'
              : 'සෑම භූමිකාවකටම වෙන්වූ සේවා ස්ථානයක් සහ විශේෂිත මෙවලම් ඇත. අපි සැවොම සාදරයෙන් පිළිගනිමු.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            {
              role: language === 'EN' ? 'Mushroom Growers' : 'හතු වගාකරුවන්',
              desc: language === 'EN' ? 'Register crop capacities, list fresh/dried mushrooms, receive direct supermarket inquiries.' : 'වගා ධාරිතාවයන් ලියාපදිංචි කරන්න, හතු වෙළඳපලට ඉදිරිපත් කරන්න, සෘජු ඇණවුම් ලබාගන්න.',
              icon: Sprout,
              color: 'sage'
            },
            {
              role: language === 'EN' ? 'Bulk Buyers' : 'තොග ගැනුම්කරුවන්',
              desc: language === 'EN' ? 'Access regional production calendars, search by district, send custom bulk purchase inquiries.' : 'ප්‍රාදේශීය නිෂ්පාදන දින දර්ශන පරිශීලනය කරන්න, තොග මිලදීගැනීම් ඇණවුම් යොමු කරන්න.',
              icon: ShoppingBag,
              color: 'terracotta'
            },
            {
              role: language === 'EN' ? 'Ecosystem Partners' : 'හවුල්කරුවන්',
              desc: language === 'EN' ? 'Provide raw materials, run compost supply depots, or purchase fresh mushrooms to process into value-added sausages/meatballs.' : 'අමුද්‍රව්‍ය සැපයීම, වගා මාධ්‍ය නිෂ්පාදනය, හෝ හතු අගය එකතු කල නිෂ්පාදන බවට සැකසීම සිදු කරන්න.',
              icon: Layers,
              color: 'dark'
            },
            {
              role: language === 'EN' ? 'Trainers / Experts' : 'පුහුණුකරුවන්',
              desc: language === 'EN' ? 'Upload certification packages, register training workshops, and manage trainee lists.' : 'පුහුණු පැකේජ ඉදිරිපත් කරන්න, ප්‍රායෝගික වැඩමුළු පවත්වන්න, පුහුණු වන්නන් කළමනාකරණය කරන්න.',
              icon: BookOpen,
              color: 'sage'
            },
            {
              role: language === 'EN' ? 'Ecosystem Admin' : 'පරිපාලක',
              desc: language === 'EN' ? 'Oversee operations, approve members, moderate inquiries, edit training slots, and update opportunity boards.' : 'සමස්ත පද්ධතිය නිරීක්ෂණය කරන්න, සාමාජිකයින් අනුමත කරන්න, පුහුණු වැඩමුළු සහ අවස්ථා පාලනය කරන්න.',
              icon: Users,
              color: 'terracotta'
            }
          ].map((card, idx) => (
            <div key={idx} className="bg-white border border-brand-border hover:border-brand-orange/40 p-6 rounded-[32px] shadow-sm hover:shadow transition flex flex-col justify-between">
              <div>
                <div className={`p-3 rounded-xl inline-block mb-4 ${
                  card.color === 'sage' ? 'bg-brand-dark-green/10 text-brand-dark-green' :
                  card.color === 'terracotta' ? 'bg-brand-orange/10 text-brand-orange' :
                  'bg-brand-brown/10 text-brand-brown'
                }`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-brand-text text-lg mb-2 leading-snug">{card.role}</h3>
                <p className="text-brand-text/80 text-xs leading-relaxed">{card.desc}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border/60">
                <button 
                  onClick={onOpenJoinForm}
                  className="text-xs font-serif font-bold text-brand-brown hover:text-brand-orange flex items-center space-x-1"
                >
                  <span>{language === 'EN' ? 'Register as this role' : 'මෙම භූමිකාවෙන් එක්වන්න'}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Mushrooms as a Business */}
      <section className="bg-brand-dark-green text-brand-cream py-16 px-4" id="why-mushrooms">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white">
              {language === 'EN' ? 'Why Mushrooms are a Massive Opportunity' : 'හතු වගාව දැවැන්ත ව්‍යාපාරික අවස්ථාවක් වන්නේ ඇයි?'}
            </h2>
            <p className="mt-2 text-brand-cream/80 max-w-2xl mx-auto text-sm">
              {language === 'EN'
                ? 'From fresh culinary sales to processed value-added superfoods, the mushroom industry has a quick cash-flow turnover.'
                : 'නැවුම් පරිභෝජනයේ සිට අගය එකතු කරන ලද සෞඛ්‍ය ආහාර දක්වා, හතු කර්මාන්තයට වේගවත් මුදල් ප්‍රවාහ පිරිවැටුමක් ඇත.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: language === 'EN' ? 'Fresh Mushrooms' : 'නැවුම් හතු වගාව',
                desc: language === 'EN' ? 'Oyster and Button mushrooms have a short cropping cycle of 21-28 days with rapid, year-round harvest cycles.' : 'පිදුරු සහ බොත්තම් හතු සති 3-4 ක් වැනි කෙටි කාලයකදී අස්වැන්න ලබා දෙයි. වසර පුරාම අඛණ්ඩ ආදායම.',
                tag: 'Fresh Oyster/Button'
              },
              {
                title: language === 'EN' ? 'Dehydrated / Dried' : 'වියළි හතු',
                desc: language === 'EN' ? 'Drying mushrooms preserves shelf life up to a year, removing perishability barriers and opening logistics to remote areas.' : 'හතු වියළීම මඟින් මාස 12ක් දක්වා කල් තබාගත හැකි අතර, නරක් වීමේ අවදානම නැති කර දුර බැහැර ප්‍රදේශවලට යැවිය හැක.',
                tag: 'Dried'
              },
              {
                title: language === 'EN' ? 'Value-Added Processing' : 'අගය එකතු කල නිෂ්පාදන',
                desc: language === 'EN' ? 'Convert fresh excess into high-value meatless meatballs, sausages, soup mixes and pickles, doubling profit margins.' : 'අතිරික්ත හතු මීට්බෝල්ස්, සොසේජස්, සුප් මිශ්‍රණ සහ අච්චාරු බවට හැරවීමෙන් ලාභය දෙගුණ කරගත හැක.',
                tag: 'Processed'
              },
              {
                title: language === 'EN' ? 'Spawn & Grow Bags' : 'බීජ සහ මාධ්‍ය බෑග්',
                desc: language === 'EN' ? 'Specialize in pure cultures, compost preparation, and sterilized substrate grow bags. Act as a B2B supplier.' : 'හතු බීජ (Spawn) බෝතල් සහ වන්ධ්‍යාකරණය කළ sawdust වගා බෑග් සකසා වෙනත් වගාකරුවන්ට තොග වශයෙන් විකිණීම.',
                tag: 'B2B Supplies'
              }
            ].map((opp, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-brand-orange/40 text-white text-[10px] font-mono px-2 py-1 rounded-md uppercase tracking-wider mb-3">
                    {opp.tag}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white mb-2 leading-tight">{opp.title}</h3>
                  <p className="text-brand-cream/80 text-xs leading-relaxed">{opp.desc}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-white">LKR High Margins</span>
                  <button 
                    onClick={() => setCurrentTab('marketplace')} 
                    className="text-brand-cream/90 hover:text-white flex items-center space-x-1 font-serif"
                  >
                    <span>{language === 'EN' ? 'Browse' : 'නරඹන්න'}</span>
                    <ArrowRight className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainee Banner Call to Action */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-serif font-bold text-brand-text">
            {language === 'EN' ? 'Ready to Learn Mushroom Farming?' : 'ප්‍රායෝගිකව හතු වගාව ඉගෙන ගැනීමට සූදානම්ද?'}
          </h2>
          <p className="text-brand-text/80 text-base max-w-2xl mx-auto">
            {language === 'EN'
              ? 'We conduct hands-on practical training on nursery setup, spawn culture, temperature control, pest management, and export readiness.'
              : 'අපි තවාන් සැකසීම, බීජ නිෂ්පාදනය, උෂ්ණත්ව පාලනය, කෘමි පාලනය සහ අපනයන සූදානම පිළිබඳව ප්‍රායෝගික පුහුණුවීම් පවත්වන්නෙමු.'}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentTab('training')}
              className="px-6 py-3 bg-brand-dark-green hover:bg-brand-natural-green text-white font-serif font-bold rounded-xl shadow-sm transition"
            >
              {language === 'EN' ? 'View Available Courses' : 'පවතින පාඨමාලා නැරඹීමට'}
            </button>
            <button
              onClick={onOpenJoinForm}
              className="px-6 py-3 bg-white text-brand-dark-green hover:bg-brand-cream border border-brand-dark-green/30 font-serif font-bold rounded-xl transition"
            >
              {language === 'EN' ? 'Request Consultation' : 'උපදෙස් ඉල්ලා සිටින්න'}
            </button>
          </div>
        </div>
      </section>

      {/* Buyer Inquiry Modal Popup on Home */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-brand-text/65 flex items-center justify-center p-4 z-50 animate-fade-in" id="home-inquiry-modal">
          <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="bg-brand-dark-green text-white p-6 relative">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5F5F0_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold tracking-tight">
                    {language === 'EN' ? 'Submit Product Inquiry' : 'නිෂ්පාදන මිල විමසීම'}
                  </h3>
                  <p className="text-brand-cream/85 text-xs mt-1 font-sans">
                    {language === 'EN' 
                      ? 'Your direct request will be visible immediately to the supplier.' 
                      : 'ඔබේ ඉල්ලීම සෘජුවම අදාළ සැපයුම්කරු වෙත යොමු කරනු ලැබේ.'}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {inquirySuccess ? (
              <div className="p-8 text-center space-y-4 font-sans" id="home-inquiry-success-view">
                <div className="inline-flex p-3 bg-[#0D3E26]/10 rounded-full text-brand-dark-green">
                  <CheckCircle2 className="h-10 w-10 text-[#0D3E26]" />
                </div>
                <h4 className="text-lg font-serif font-bold text-brand-text">
                  {language === 'EN' ? 'Inquiry Submitted!' : 'විමසීම සාර්ථකව යොමු කරන ලදී!'}
                </h4>
                <p className="text-xs text-brand-text/75 max-w-sm mx-auto leading-relaxed">
                  {language === 'EN'
                    ? `Your inquiry for "${selectedProduct.name}" has been sent successfully. The supplier (${selectedProduct.supplierName}) will reach out to you soon.`
                    : `"${selectedProduct.name}" සඳහා ඔබේ විමසීම සාර්ථකව යොමු කරන ලදී. සැපයුම්කරු (${selectedProduct.supplierName}) ඉක්මනින් ඔබ හා සම්බන්ධ වනු ඇත.`}
                </p>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-2 bg-brand-dark-green text-white text-xs font-serif font-bold rounded-xl hover:bg-brand-natural-green transition"
                >
                  {language === 'EN' ? 'Close' : 'වසන්න'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="p-6 space-y-4 font-sans text-brand-text">
                <div className="bg-[#F5F5F0] p-4 rounded-2xl border border-brand-border/40">
                  <span className="block text-[10px] text-brand-text/50 font-bold uppercase tracking-wider mb-1">
                    {language === 'EN' ? 'Inquiring For' : 'විමසීම් කරන භාණ්ඩය'}
                  </span>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400'} 
                      alt={selectedProduct.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400';
                      }}
                      className="w-10 h-10 object-cover rounded-lg border border-brand-border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-text leading-tight">{selectedProduct.name}</h4>
                      <p className="text-[10px] text-brand-text/60 mt-0.5">
                        {language === 'EN' ? 'Supplier: ' : 'සපයන්නා: '}{selectedProduct.supplierName} • {selectedProduct.priceRange}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-brand-text/80">
                      {language === 'EN' ? 'Your Name *' : 'ඔබේ නම *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryData.buyerName}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, buyerName: e.target.value }))}
                      placeholder={language === 'EN' ? 'e.g., Priyantha' : 'උදා: ප්‍රියන්ත'}
                      className="w-full px-3.5 py-2 text-xs bg-[#F5F5F0] border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-dark-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-brand-text/80">
                      {language === 'EN' ? 'Phone Number *' : 'දුරකථන අංකය *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g., 0771234567"
                      className="w-full px-3.5 py-2 text-xs bg-[#F5F5F0] border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-dark-green"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-brand-text/80">
                    {language === 'EN' ? 'Email Address *' : 'විද්‍යුත් තැපෑල *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g., buyer@gmail.com"
                    className="w-full px-3.5 py-2 text-xs bg-[#F5F5F0] border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-dark-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-brand-text/80">
                      {language === 'EN' ? 'Required Quantity *' : 'අවශ්‍ය ප්‍රමාණය *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryData.requiredQuantity}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, requiredQuantity: e.target.value }))}
                      placeholder={language === 'EN' ? 'e.g., 20 Packs' : 'උදා: පැකට් 20'}
                      className="w-full px-3.5 py-2 text-xs bg-[#F5F5F0] border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-dark-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-brand-text/80">
                      {language === 'EN' ? 'Delivery Location *' : 'බෙදා හැරීමේ ස්ථානය *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryData.deliveryLocation}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                      placeholder={language === 'EN' ? 'e.g., Colombo' : 'උදා: කොළඹ'}
                      className="w-full px-3.5 py-2 text-xs bg-[#F5F5F0] border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-dark-green"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-brand-text/80">
                    {language === 'EN' ? 'Special Notes / Requirements' : 'විශේෂ අවශ්‍යතා'}
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={language === 'EN' ? 'Describe your requirements...' : 'ඔබේ අවශ්‍යතා විස්තර කරන්න...'}
                    className="w-full px-3.5 py-2 text-xs bg-[#F5F5F0] border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-dark-green resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 border border-brand-border text-brand-text/85 text-xs font-serif font-bold rounded-xl hover:bg-brand-cream transition"
                  >
                    {language === 'EN' ? 'Cancel' : 'අවලංගු කරන්න'}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="px-5 py-2 bg-[#8B4513] hover:bg-[#733A0F] text-white text-xs font-serif font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {submittingInquiry ? (
                      <RefreshCw className="h-3 w-3 animate-spin text-white" />
                    ) : (
                      <Send className="h-3 w-3 text-white" />
                    )}
                    <span>
                      {submittingInquiry 
                        ? (language === 'EN' ? 'Submitting...' : 'යොමු වෙමින්...') 
                        : (language === 'EN' ? 'Send Inquiry' : 'මිල විමසන්න')}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Expanded Product Details Modal Popup */}
      {expandedProduct && (() => {
        const related = allProducts
          .filter((p) => p.id !== expandedProduct.id)
          .filter((p) => p.category === expandedProduct.category)
          .slice(0, 3);
        const relatedList = related.length > 0 
          ? related 
          : allProducts.filter((p) => p.id !== expandedProduct.id).slice(0, 3);

        return (
          <div className="fixed inset-0 bg-[#2D2D2A]/70 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in" id="home-expanded-product-modal">
            <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-4xl w-full overflow-hidden shadow-2xl relative my-8 flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
              {/* Close Button */}
              <button
                onClick={() => {
                  setExpandedProduct(null);
                  setInquirySuccess(false);
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
                    <span className="bg-brand-dark-green text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
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
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-1/2 md:h-full font-sans text-brand-text">
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

                {/* Send inquiry action */}
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
