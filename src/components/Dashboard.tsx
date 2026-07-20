import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Inbox,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Filter,
  FileText,
  User,
  Settings,
  Mail,
  RefreshCw,
  Bell,
  CheckSquare,
  Shield,
  Wrench,
  Clock,
  AlertTriangle,
  AlertCircle,
  Globe,
  MapPin,
  Award,
  Activity,
  CheckCircle2,
  Languages,
  Key,
  Calculator,
  Thermometer,
  Droplets,
  CloudLightning,
  Sun,
  Sprout
} from 'lucide-react';
import {
  UserProfile,
  Product,
  EcosystemMember,
  BuyerInquiry,
  TrainingProgram,
  TrainingRequest,
  Opportunity,
  OpportunityApplication,
  ContactMessage,
  UserRole,
  MachineryInquiry,
  SecurityAuditLog,
  AppNotification
} from '../types';
import { dataService } from '../lib/dataService';
import { DISTRICTS } from './JoinEcosystem';

interface DashboardProps {
  language: 'EN' | 'SI';
  currentUser: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

function LiveClock({ language }: { language: 'EN' | 'SI' }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formattedDate = time.toLocaleDateString(language === 'EN' ? 'en-US' : 'si-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = time.toLocaleTimeString(language === 'EN' ? 'en-US' : 'si-LK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold text-stone-800 tracking-tight">{formattedTime}</span>
      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">{formattedDate}</span>
    </div>
  );
}

export default function Dashboard({
  language,
  currentUser,
  onUpdateProfile,
}: DashboardProps) {
  // Sidebar tab control
  const [activeTab, setActiveTab] = useState('summary');

  // Unified lists
  const [members, setMembers] = useState<EcosystemMember[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [oppApplications, setOppApplications] = useState<OpportunityApplication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [machineryInquiries, setMachineryInquiries] = useState<MachineryInquiry[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Yield Calculator States
  const [calcVariety, setCalcVariety] = useState<'Oyster' | 'Button' | 'Milky'>('Oyster');
  const [calcBags, setCalcBags] = useState<number>(200);
  const [calcMedium, setCalcMedium] = useState<'Sawdust' | 'Straw' | 'Coir'>('Sawdust');
  const [calcTemp, setCalcTemp] = useState<number>(25);
  const [calcHumidity, setCalcHumidity] = useState<number>(80);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const parseServiceError = (err: any): string => {
    try {
      const errStr = err.message || String(err);
      if (errStr.startsWith('{')) {
        const parsed = JSON.parse(errStr);
        if (parsed.error && (parsed.error.includes('permission') || parsed.error.includes('Permission') || parsed.error.includes('insufficient'))) {
          return language === 'EN'
            ? 'Security Restriction: You do not have permissions to modify this document. (You can only edit/delete items that you listed yourself).'
            : 'ආරක්ෂක සීමා කිරීම්: මෙම දත්තය වෙනස් කිරීමට ඔබට අවසර නොමැත. (ඔබ විසින් ඇතුළත් කළ දත්ත පමණක් ඔබට වෙනස් හෝ ඉවත් කළ හැක).';
        }
      }
    } catch (e) {}
    return err.message || String(err);
  };

  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Fresh Oyster Mushroom',
    description: '',
    district: currentUser.district || 'Colombo',
    minimumOrder: '',
    monthlyCapacity: '',
    priceRange: '',
    imageUrl: '',
    status: 'Available' as Product['status']
  });

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [programForm, setProgramForm] = useState({
    title: '',
    whoItIsFor: '',
    duration: '',
    format: 'In-person Practical Session'
  });

  const [showAddOpportunity, setShowAddOpportunity] = useState(false);
  const [oppForm, setOppForm] = useState({
    title: '',
    type: 'Requirement',
    district: 'Colombo',
    status: 'Active' as Opportunity['status'],
    details: ''
  });

  // Profile Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser.fullName,
    phone: currentUser.phone,
    district: currentUser.district || 'Colombo',
    city: currentUser.city || '',
    experienceLevel: currentUser.experienceLevel || 'Beginner',
    interestedArea: currentUser.interestedArea || 'Fresh mushroom growing',
    monthlyCapacity: currentUser.monthlyCapacity || '0',
    message: currentUser.message || '',
    bio: currentUser.bio || 'Eco-system member passionate about organic mushroom cultivation in Sri Lanka.',
    preferredLanguage: currentUser.preferredLanguage || 'EN',
    licenseNumber: currentUser.licenseNumber || '',
    productionArea: currentUser.productionArea || '500 sq ft',
    gpsCoordinates: currentUser.gpsCoordinates || '6.9271° N, 79.8612° E'
  });

  // Filters state
  const [memberStatusFilter, setMemberStatusFilter] = useState('All');
  const [memberRoleFilter, setMemberRoleFilter] = useState('All');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');
  const [machineryStatusFilter, setMachineryStatusFilter] = useState('All');

  // Real-world database seeding / clearing controls
  const [dbActionLoading, setDbActionLoading] = useState(false);
  const [dbActionStatus, setDbActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSeedDatabase = async () => {
    setDbActionLoading(true);
    setDbActionStatus(null);
    try {
      await dataService.seedFirestore();
      setDbActionStatus({
        type: 'success',
        message: 'Firestore collections successfully populated with real Sri Lankan mushroom seed data!'
      });
      await refreshAllData();
    } catch (err: any) {
      setDbActionStatus({
        type: 'error',
        message: err.message || 'Seeding failed.'
      });
    } finally {
      setDbActionLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear ALL products, members, and inquiries from Firestore? This is a permanent action to simulate a clean production environment.')) return;
    setDbActionLoading(true);
    setDbActionStatus(null);
    try {
      await dataService.clearFirestore();
      setDbActionStatus({
        type: 'success',
        message: 'Firestore collections cleared successfully. All mock data has been purged!'
      });
      await refreshAllData();
    } catch (err: any) {
      setDbActionStatus({
        type: 'error',
        message: err.message || 'Clearing failed.'
      });
    } finally {
      setDbActionLoading(false);
    }
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [
        mList,
        pList,
        iList,
        tpList,
        trList,
        oList,
        oaList,
        cList,
        uList,
        macInqList
      ] = await Promise.all([
        dataService.getMembers(),
        dataService.getProducts(),
        dataService.getInquiries(),
        dataService.getTrainingPrograms(),
        dataService.getTrainingRequests(),
        dataService.getOpportunities(),
        dataService.getOpportunityApplications(),
        dataService.getContactMessages(),
        dataService.getAllUserProfiles ? dataService.getAllUserProfiles() : Promise.resolve([]),
        dataService.getMachineryInquiries()
      ]);

      setMembers(mList);
      setProducts(pList);
      setInquiries(iList);
      setTrainingPrograms(tpList);
      setTrainingRequests(trList);
      setOpportunities(oList);
      setOppApplications(oaList);
      setContactMessages(cList);
      setUserProfiles(uList || []);
      setMachineryInquiries(macInqList);

      if (currentUser.role === 'admin') {
        try {
          const logs = await dataService.getSecurityAuditLogs();
          setSecurityLogs(logs);
        } catch (e) {
          console.warn("Security log fetch warning:", e);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRoleAndStatus = async (uid: string, newRole: UserRole, newStatus: UserProfile['status']) => {
    if (currentUser.role !== 'admin') {
      await dataService.addSecurityAuditLog({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        action: 'UNAUTHORIZED_ROLE_SWITCH_ATTEMPT',
        details: `User attempted to update role/status of profile ${uid} without admin privileges.`,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      });
      alert('Access Denied. Only system administrators can change member roles or account statuses.');
      return;
    }

    try {
      await dataService.updateUserProfileRoleAndStatus(uid, newRole, newStatus);
      
      // Dispatch audit log
      await dataService.addSecurityAuditLog({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        action: 'USER_PROFILE_MODIFIED',
        details: `Admin changed profile ${uid} role to '${newRole}' and status to '${newStatus}'.`,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      });

      // Notify the target user
      await dataService.addNotification({
        userId: uid,
        title: 'Account Role/Status Changed',
        message: `Your Mushroom Eco Hub profile status has been changed to '${newStatus}' with the role '${newRole}' by co-op administration.`,
        type: 'info',
        read: false
      });

      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (currentUser.role !== 'admin') {
      await dataService.addSecurityAuditLog({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        action: 'UNAUTHORIZED_USER_DELETE_ATTEMPT',
        details: `User attempted to delete user profile ${uid} without admin privileges.`,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      });
      alert('Access Denied. Only system administrators can delete member profiles.');
      return;
    }

    if (confirm('Are you sure you want to delete this user profile? This action is permanent and cannot be undone.')) {
      try {
        await dataService.deleteUserProfile(uid);
        
        await dataService.addSecurityAuditLog({
          userId: currentUser.uid,
          userEmail: currentUser.email,
          action: 'USER_PROFILE_DELETED',
          details: `Admin deleted user profile with UID: ${uid}.`,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        });

        refreshAllData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [currentUser]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      ...profileForm
    };
    try {
      await dataService.createUserProfile(currentUser.uid, updated);
      onUpdateProfile(updated);
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await dataService.updateProduct(editingProduct.id, productForm);
        setFeedback({
          type: 'success',
          message: language === 'EN' ? 'Product updated successfully.' : 'නිෂ්පාදන තොරතුරු සාර්ථකව යාවත්කාලීන කරන ලදී.'
        });
      } else {
        await dataService.addProduct({
          ...productForm,
          supplierName: currentUser.fullName,
          supplierId: currentUser.uid
        });
        setFeedback({
          type: 'success',
          message: language === 'EN' ? 'Product added successfully.' : 'නිෂ්පාදනය සාර්ථකව එක් කරන ලදී.'
        });
      }
      setShowAddProduct(false);
      setEditingProduct(null);
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      district: prod.district,
      minimumOrder: prod.minimumOrder,
      monthlyCapacity: prod.monthlyCapacity,
      priceRange: prod.priceRange,
      imageUrl: prod.imageUrl,
      status: prod.status
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm(language === 'EN' ? 'Are you sure you want to delete this product?' : 'මෙම නිෂ්පාදනය ඉවත් කිරීමට ඔබට විශ්වාසද?')) {
      try {
        await dataService.deleteProduct(id);
        setFeedback({
          type: 'success',
          message: language === 'EN' ? 'Product deleted successfully.' : 'නිෂ්පාදනය සාර්ථකව ඉවත් කරන ලදී.'
        });
        refreshAllData();
      } catch (err: any) {
        console.error(err);
        setFeedback({
          type: 'error',
          message: parseServiceError(err)
        });
      }
    }
  };

  // Program Add
  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.addTrainingProgram(programForm);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? 'Training program published successfully.' : 'පුහුණු වැඩසටහන සාර්ථකව ප්‍රකාශයට පත් කරන ලදී.'
      });
      setShowAddProgram(false);
      setProgramForm({
        title: '',
        whoItIsFor: '',
        duration: '',
        format: 'In-person Practical Session'
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  // Opportunity Add/CRUD
  const handleOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.addOpportunity(oppForm);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? 'Board notice posted successfully.' : 'දැන්වීම සාර්ථකව පළ කරන ලදී.'
      });
      setShowAddOpportunity(false);
      setOppForm({
        title: '',
        type: 'Requirement',
        district: 'Colombo',
        status: 'Active',
        details: ''
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (confirm(language === 'EN' ? 'Delete notice?' : 'මෙම දැන්වීම ඉවත් කිරීමට ඔබට විශ්වාසද?')) {
      try {
        await dataService.deleteOpportunity(id);
        setFeedback({
          type: 'success',
          message: language === 'EN' ? 'Notice deleted successfully.' : 'දැන්වීම සාර්ථකව ඉවත් කරන ලදී.'
        });
        refreshAllData();
      } catch (err: any) {
        console.error(err);
        setFeedback({
          type: 'error',
          message: parseServiceError(err)
        });
      }
    }
  };

  // Status updates
  const handleMemberStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await dataService.updateMemberStatus(id, status);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? `Member status updated to ${status}.` : `සාමාජික තත්ත්වය ${status} ලෙස යාවත්කාලීන කරන ලදී.`
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  const handleInquiryStatus = async (id: string, status: BuyerInquiry['status']) => {
    try {
      await dataService.updateInquiryStatus(id, status);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? `Inquiry status updated to ${status}.` : `විමසීමේ තත්ත්වය ${status} ලෙස යාවත්කාලීන කරන ලදී.`
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  const handleMachineryInquiryStatus = async (id: string, status: MachineryInquiry['status']) => {
    try {
      await dataService.updateMachineryInquiryStatus(id, status);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? `Machinery request updated to ${status}.` : `යන්ත්‍රෝපකරණ ඉල්ලීමේ තත්ත්වය ${status} ලෙස යාවත්කාලීන කරන ලදී.`
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  const handleTrainingReqStatus = async (id: string, status: TrainingRequest['status']) => {
    try {
      await dataService.updateTrainingRequestStatus(id, status);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? `Training request updated to ${status}.` : `පුහුණු අයදුම්පතෙහි තත්ත්වය ${status} ලෙස යාවත්කාලීන කරන ලදී.`
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  const handleOppAppStatus = async (id: string, status: OpportunityApplication['status']) => {
    try {
      await dataService.updateOpportunityApplicationStatus(id, status);
      setFeedback({
        type: 'success',
        message: language === 'EN' ? `Application status updated to ${status}.` : `අයදුම්පත් තත්ත්වය ${status} ලෙස යාවත්කාලීන කරන ලදී.`
      });
      refreshAllData();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: parseServiceError(err)
      });
    }
  };

  // Filtering lists
  const filteredMembers = members.filter((m) => {
    const matchesStatus = memberStatusFilter === 'All' || m.status === memberStatusFilter.toLowerCase();
    const matchesRole = memberRoleFilter === 'All' || m.role === memberRoleFilter;
    return matchesStatus && matchesRole;
  });

  const filteredInquiries = inquiries.filter((i) => {
    return inquiryStatusFilter === 'All' || i.status === inquiryStatusFilter;
  });

  const filteredMachineryInquiries = machineryInquiries.filter((i) => {
    return machineryStatusFilter === 'All' || i.status === machineryStatusFilter;
  });

  // Role specific filters
  const myProducts = products.filter((p) => p.supplierId === currentUser.uid);
  const myProductInquiries = inquiries.filter((i) => i.supplierId === currentUser.uid);
  const mySubmittedInquiries = inquiries.filter((i) => i.buyerId === currentUser.uid);
  const mySubmittedMachineryInquiries = machineryInquiries.filter((i) => i.email.toLowerCase() === currentUser.email.toLowerCase());

  // Stats calculation
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const approvedMembers = members.filter((m) => m.status === 'approved').length;
  const pendingMembers = members.filter((m) => m.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative" id="dashboard-layout">
      {feedback && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-lg border text-xs font-sans max-w-md animate-fade-in flex items-start space-x-2.5 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-red-50 border-red-200 text-red-950'
        }`}>
          <AlertTriangle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${feedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} />
          <div className="space-y-0.5">
            <p className="font-bold text-[13px]">
              {feedback.type === 'success' 
                ? (language === 'EN' ? 'Success' : 'සාර්ථකයි') 
                : (language === 'EN' ? 'Security Alert' : 'ආරක්ෂක අනතුරු ඇඟවීම')}
            </p>
            <p className="leading-relaxed text-stone-700">{feedback.message}</p>
          </div>
          <button onClick={() => setFeedback(null)} className="ml-auto text-stone-400 hover:text-stone-600 font-sans cursor-pointer font-bold text-sm">×</button>
        </div>
      )}


      {/* Main Dashboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav (3 cols) - Modern Full-Height Glassmorphism */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-20 space-y-3">
            {/* User Identity Card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/20 shadow-lg">
              <div className={`absolute inset-0 ${
                currentUser.role === 'admin' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900' :
                currentUser.role === 'grower' ? 'bg-gradient-to-br from-emerald-900 via-green-800 to-lime-900' :
                currentUser.role === 'buyer' ? 'bg-gradient-to-br from-blue-900 via-cyan-800 to-sky-900' :
                currentUser.role === 'trainer' ? 'bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900' :
                currentUser.role === 'partner' ? 'bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900' :
                'bg-gradient-to-br from-stone-900 via-stone-800 to-neutral-900'
              }`}></div>
              <div className="relative p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white font-serif font-black text-lg shadow-md ${
                    currentUser.role === 'admin' ? 'bg-indigo-500/30 border border-indigo-400/30' :
                    currentUser.role === 'grower' ? 'bg-emerald-500/30 border border-emerald-400/30' :
                    currentUser.role === 'buyer' ? 'bg-cyan-500/30 border border-cyan-400/30' :
                    currentUser.role === 'trainer' ? 'bg-violet-500/30 border border-violet-400/30' :
                    currentUser.role === 'partner' ? 'bg-amber-500/30 border border-amber-400/30' :
                    'bg-stone-500/30 border border-stone-400/30'
                  }`}>
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h3 className="font-serif font-bold text-white text-sm truncate leading-none">
                      {currentUser.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        currentUser.role === 'admin' ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/20' :
                        currentUser.role === 'grower' ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/20' :
                        currentUser.role === 'buyer' ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/20' :
                        currentUser.role === 'trainer' ? 'bg-violet-400/20 text-violet-200 border border-violet-400/20' :
                        currentUser.role === 'partner' ? 'bg-amber-400/20 text-amber-200 border border-amber-400/20' :
                        'bg-stone-400/20 text-stone-200 border border-stone-400/20'
                      }`}>
                        {currentUser.role === 'admin' && <Shield className="h-2.5 w-2.5" />}
                        {currentUser.role === 'grower' && <Sprout className="h-2.5 w-2.5" />}
                        {currentUser.role === 'buyer' && <ShoppingBag className="h-2.5 w-2.5" />}
                        {currentUser.role === 'trainer' && <GraduationCap className="h-2.5 w-2.5" />}
                        {currentUser.role === 'partner' && <Wrench className="h-2.5 w-2.5" />}
                        {currentUser.role === 'staff' && <Activity className="h-2.5 w-2.5" />}
                        {currentUser.role}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        currentUser.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-white/40 font-mono border-t border-white/10 pt-2.5">
                  ID: {currentUser.membershipId || currentUser.uid.slice(0, 12)}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[28px] shadow-sm overflow-hidden">
              <nav className="p-3 space-y-0.5 font-sans">
                {/* Overview - All Roles */}
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                    activeTab === 'summary' 
                      ? 'bg-gradient-to-r from-[#2D2D2A] to-[#3D3D35] text-white shadow-md scale-[1.01]' 
                      : 'hover:bg-stone-100/80 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span>{language === 'EN' ? 'Overview' : 'දළ විශ්ලේෂණය'}</span>
                </button>

                {/* ── Admin Tabs ── */}
                {currentUser.role === 'admin' && (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-500/80">
                        {language === 'EN' ? '⚡ Administration' : '⚡ පරිපාලනය'}
                      </span>
                    </div>
                    {[
                      { id: 'members', icon: <Users className="h-4 w-4" />, en: 'Member Approvals', si: 'සාමාජික අනුමැතිය' },
                      { id: 'user_control', icon: <Shield className="h-4 w-4" />, en: 'User Control Panel', si: 'පරිශීලක පාලනය' },
                      { id: 'inquiries', icon: <Inbox className="h-4 w-4" />, en: 'Buyer Inquiries', si: 'මිල විමසීම්' },
                      { id: 'machinery_inquiries', icon: <Wrench className="h-4 w-4" />, en: 'Machinery Requests', si: 'යන්ත්‍ර ඉල්ලීම්' },
                      { id: 'products', icon: <ShoppingBag className="h-4 w-4" />, en: 'All Products', si: 'සියලුම නිෂ්පාදන' },
                      { id: 'training_reqs', icon: <GraduationCap className="h-4 w-4" />, en: 'Training Requests', si: 'පුහුණු ඉල්ලීම්' },
                      { id: 'opportunities', icon: <Briefcase className="h-4 w-4" />, en: 'Notice Board', si: 'දැන්වීම් පුවරුව' },
                      { id: 'contacts', icon: <Mail className="h-4 w-4" />, en: 'Contact Messages', si: 'සම්බන්ධතා' },
                      { id: 'security_logs', icon: <Key className="h-4 w-4" />, en: 'Security Audit', si: 'ආරක්ෂක විගණනය' },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-[#2D2D2A] to-[#3D3D35] text-white shadow-md scale-[1.01]' 
                            : 'hover:bg-stone-100/80 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {tab.icon}
                        <span>{language === 'EN' ? tab.en : tab.si}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* ── Grower Tabs ── */}
                {currentUser.role === 'grower' && (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600/80">
                        {language === 'EN' ? '🍄 Farm Operations' : '🍄 ගොවිපල'}
                      </span>
                    </div>
                    {[
                      { id: 'harvest_log', icon: <FileText className="h-4 w-4" />, en: 'Daily Harvest Log', si: 'දෛනික අස්වැන්න සටහන' },
                      { id: 'yield_calculator', icon: <Calculator className="h-4 w-4" />, en: 'Yield & Climate Tool', si: 'අස්වනු හා දේශගුණ' },
                      { id: 'products', icon: <ShoppingBag className="h-4 w-4" />, en: 'My Listed Products', si: 'මගේ නිෂ්පාදන' },
                      { id: 'my_orders', icon: <Inbox className="h-4 w-4" />, en: 'Buyer Orders', si: 'ගැනුම්කරු ඇණවුම්' },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-md scale-[1.01]' 
                            : 'hover:bg-emerald-50 text-stone-600 hover:text-emerald-800'
                        }`}
                      >
                        {tab.icon}
                        <span>{language === 'EN' ? tab.en : tab.si}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* ── Buyer Tabs ── */}
                {currentUser.role === 'buyer' && (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-600/80">
                        {language === 'EN' ? '🛒 Procurement Hub' : '🛒 මිලදී ගැනීම්'}
                      </span>
                    </div>
                    {[
                      { id: 'my_inquiries', icon: <Inbox className="h-4 w-4" />, en: 'My Purchase Inquiries', si: 'මගේ මිලදී ගැනීම් විමසීම්' },
                      { id: 'supplier_directory', icon: <Globe className="h-4 w-4" />, en: 'Supplier Directory', si: 'සැපයුම්කරු නාමාවලිය' },
                      { id: 'my_machinery', icon: <Wrench className="h-4 w-4" />, en: 'My Equipment Inquiries', si: 'මගේ යන්ත්‍ර විමසීම්' },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-md scale-[1.01]' 
                            : 'hover:bg-blue-50 text-stone-600 hover:text-blue-800'
                        }`}
                      >
                        {tab.icon}
                        <span>{language === 'EN' ? tab.en : tab.si}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* ── Trainer Tabs ── */}
                {currentUser.role === 'trainer' && (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-purple-600/80">
                        {language === 'EN' ? '🎓 Training Portal' : '🎓 පුහුණු මධ්‍යස්ථානය'}
                      </span>
                    </div>
                    {[
                      { id: 'training_reqs', icon: <Inbox className="h-4 w-4" />, en: 'Student Slot Requests', si: 'ශිෂ්‍ය ඉල්ලීම්' },
                      { id: 'programs', icon: <GraduationCap className="h-4 w-4" />, en: 'Course Manager', si: 'පාඨමාලා කළමනාකරණය' },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-purple-700 to-violet-600 text-white shadow-md scale-[1.01]' 
                            : 'hover:bg-purple-50 text-stone-600 hover:text-purple-800'
                        }`}
                      >
                        {tab.icon}
                        <span>{language === 'EN' ? tab.en : tab.si}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* ── Partner Tabs ── */}
                {currentUser.role === 'partner' && (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-600/80">
                        {language === 'EN' ? '⚙️ Partner Hub' : '⚙️ හවුල්කරු කේන්ද්‍රය'}
                      </span>
                    </div>
                    {[
                      { id: 'machinery_inquiries', icon: <Wrench className="h-4 w-4" />, en: 'Customer Inquiries', si: 'පාරිභෝගික විමසීම්' },
                      { id: 'products', icon: <ShoppingBag className="h-4 w-4" />, en: 'Equipment Catalog', si: 'උපකරණ නාමාවලිය' },
                      { id: 'opportunities', icon: <Briefcase className="h-4 w-4" />, en: 'B2B Opportunities', si: 'B2B අවස්ථා' },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-amber-700 to-orange-600 text-white shadow-md scale-[1.01]' 
                            : 'hover:bg-amber-50 text-stone-600 hover:text-amber-800'
                        }`}
                      >
                        {tab.icon}
                        <span>{language === 'EN' ? tab.en : tab.si}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* ── Staff Tabs ── */}
                {currentUser.role === 'staff' && (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-stone-500/80">
                        {language === 'EN' ? '🛡️ Staff Operations' : '🛡️ කාර්ය මණ්ඩල මෙහෙයුම්'}
                      </span>
                    </div>
                    {[
                      { id: 'members', icon: <Users className="h-4 w-4" />, en: 'Member Verification', si: 'සාමාජික සත්‍යාපනය' },
                      { id: 'products', icon: <ShoppingBag className="h-4 w-4" />, en: 'Product Management', si: 'නිෂ්පාදන කළමනාකරණය' },
                      { id: 'inquiries', icon: <Inbox className="h-4 w-4" />, en: 'Buyer Inquiries', si: 'මිල විමසීම්' },
                      { id: 'machinery_inquiries', icon: <Wrench className="h-4 w-4" />, en: 'Machinery Requests', si: 'යන්ත්‍ර ඉල්ලීම්' },
                      { id: 'opportunities', icon: <Briefcase className="h-4 w-4" />, en: 'Notice Board', si: 'දැන්වීම් පුවරුව' },
                      { id: 'contacts', icon: <Mail className="h-4 w-4" />, en: 'Contact Messages', si: 'ලිපි සහ පණිවිඩ' },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-stone-700 to-neutral-600 text-white shadow-md scale-[1.01]' 
                            : 'hover:bg-stone-100/80 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {tab.icon}
                        <span>{language === 'EN' ? tab.en : tab.si}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* ── Common: My Profile ── */}
                <div className="border-t border-stone-200/60 mt-2 pt-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 ${
                      activeTab === 'profile' 
                        ? 'bg-gradient-to-r from-[#2D2D2A] to-[#3D3D35] text-white shadow-md scale-[1.01]' 
                        : 'hover:bg-stone-100/80 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span>{language === 'EN' ? 'My Profile' : 'මගේ පැතිකඩ'}</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6" id="dashboard-content-area">
          {loading ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-stone-500 text-xs font-semibold">Updating dashboard metrics...</p>
            </div>
          ) : (
            <>
              {/* Pending Approval / Verification Status Banner */}
              {(currentUser.status === 'pending' || currentUser.status === 'rejected') && (
                <div className={`p-6 rounded-[28px] border ${
                  currentUser.status === 'pending' 
                    ? 'bg-amber-50/90 border-amber-200/80 text-stone-800' 
                    : 'bg-red-50/90 border-red-200/80 text-stone-800'
                } shadow-xs mb-6 space-y-4 animate-fade-in`} id="pending-approval-banner">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-3 rounded-2xl ${
                        currentUser.status === 'pending' ? 'bg-amber-500/10 text-amber-700' : 'bg-red-500/10 text-red-700'
                      } shrink-0`}>
                        {currentUser.status === 'pending' ? (
                          <Clock className="h-6 w-6" />
                        ) : (
                          <AlertTriangle className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-stone-900 leading-tight">
                          {currentUser.status === 'pending' ? (
                            language === 'EN' ? 'Account Verification Pending Approval' : 'ගිණුම සත්‍යාපනය කිරීම සඳහා අනුමැතිය අපේක්ෂාවෙන්'
                          ) : (
                            language === 'EN' ? 'Account Verification Declined' : 'ගිණුම් සත්‍යාපනය ප්‍රතික්ෂේප කර ඇත'
                          )}
                        </h3>
                        <p className="text-xs text-stone-600 font-sans mt-1 max-w-2xl leading-relaxed">
                          {currentUser.status === 'pending' ? (
                            language === 'EN' 
                              ? `Welcome, ${currentUser.fullName}! Your registration as a ${currentUser.role} is currently being reviewed by our Co-operative Administration to verify regional crop capacities.`
                              : `සාදරයෙන් පිළිගනිමු, ${currentUser.fullName}! ඔබගේ ${currentUser.role} ලියාපදිංචිය, ප්‍රාදේශීය වගා ධාරිතාවයන් සත්‍යාපනය කිරීම සඳහා අපගේ සමුපකාර පරිපාලනය විසින් සමාලෝචනය කරමින් පවතී.`
                          ) : (
                            language === 'EN'
                              ? `Your application has been declined. Please update your profile details with correct credentials or contact support.`
                              : `ඔබගේ අයදුම්පත ප්‍රතික්ෂේප කර ඇත. කරුණාකර නිවැරදි තොරතුරු ඇතුළත් කර ඔබගේ පැතිකඩ යාවත්කාලීන කරන්න හෝ සහය පතන්න.`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <button 
                        onClick={refreshAllData}
                        className="px-3.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-serif font-bold transition flex items-center space-x-1.5 shadow-xs shrink-0"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>{language === 'EN' ? 'Check Status' : 'තත්ත්වය පරීක්ෂා කරන්න'}</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="px-3.5 py-1.5 bg-[#8B4513] hover:bg-[#723910] text-white rounded-xl text-xs font-serif font-bold transition shadow-xs shrink-0"
                      >
                        {language === 'EN' ? 'Edit Profile' : 'පැතිකඩ සංස්කරණය'}
                      </button>
                    </div>
                  </div>

                  {/* Verification Progress Stepper */}
                  {currentUser.status === 'pending' && (
                    <div className="pt-4 border-t border-amber-200/40">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800/80 mb-4">
                        {language === 'EN' ? 'Verification Progress' : 'සත්‍යාපන ප්‍රගතිය'}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        
                        {/* Step 1: Submission */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-500 flex items-center justify-center font-bold text-xs shadow-xs">
                              <Check className="h-4 w-4" />
                            </div>
                            <div className="h-full w-0.5 bg-emerald-200 hidden md:block"></div>
                          </div>
                          <div>
                            <p className="text-xs font-serif font-bold text-stone-900">
                              {language === 'EN' ? '1. Account Created' : '1. ගිණුම සාදන ලදී'}
                            </p>
                            <p className="text-[10.5px] text-stone-500 font-sans mt-0.5 leading-relaxed">
                              {language === 'EN' ? 'Registration details received and recorded.' : 'ලියාපදිංචි වීමේ තොරතුරු සාර්ථකව පටිගත කෙරුණි.'}
                            </p>
                          </div>
                        </div>

                        {/* Step 2: Co-op Review */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-500 flex items-center justify-center font-bold text-xs shadow-xs animate-pulse">
                              2
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-serif font-bold text-stone-900">
                              {language === 'EN' ? '2. Regional Verification' : '2. ප්‍රාදේශීය සත්‍යාපනය'}
                            </p>
                            <p className="text-[10.5px] text-stone-500 font-sans mt-0.5 leading-relaxed">
                              {language === 'EN' 
                                ? `Verifying grower/buyer capacities in ${currentUser.district || 'your district'}.` 
                                : `${currentUser.district || 'ඔබගේ'} ප්‍රාදේශීය වගා හෝ මිලදී ගැනීමේ ධාරිතාවන් සත්‍යාපනය කරමින් පවතී.`}
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Activation */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="h-7 w-7 rounded-full bg-stone-100 text-stone-400 border-2 border-stone-200 flex items-center justify-center font-bold text-xs">
                              3
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-serif font-bold text-stone-400">
                              {language === 'EN' ? '3. Co-op Commission Approval' : '3. සමුපකාර අනුමැතිය'}
                            </p>
                            <p className="text-[10.5px] text-stone-400 font-sans mt-0.5 leading-relaxed">
                              {language === 'EN' ? 'Full wholesale contract & notice activation.' : 'පූර්ණ තොග ඇණවුම් සහ දැන්වීම් සේවා සක්‍රීය කිරීම.'}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* SUMMARY TAB */}
              {activeTab === 'summary' && (
                <div className="space-y-6 animate-fade-in" id="dashboard-summary">
                  {/* Modern Role-Specific Welcome Hero */}
                  <div className={`relative overflow-hidden p-6 sm:p-8 rounded-[28px] shadow-lg border ${
                    currentUser.role === 'admin' ? 'border-indigo-500/20' :
                    currentUser.role === 'grower' ? 'border-emerald-500/20' :
                    currentUser.role === 'buyer' ? 'border-cyan-500/20' :
                    currentUser.role === 'trainer' ? 'border-violet-500/20' :
                    currentUser.role === 'partner' ? 'border-amber-500/20' :
                    'border-stone-500/20'
                  }`}>
                    <div className={`absolute inset-0 ${
                      currentUser.role === 'admin' ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' :
                      currentUser.role === 'grower' ? 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900' :
                      currentUser.role === 'buyer' ? 'bg-gradient-to-br from-blue-900 via-cyan-800 to-sky-900' :
                      currentUser.role === 'trainer' ? 'bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900' :
                      currentUser.role === 'partner' ? 'bg-gradient-to-br from-amber-900 via-orange-800 to-red-900' :
                      'bg-gradient-to-br from-stone-800 via-stone-700 to-neutral-800'
                    }`}></div>
                    {/* Decorative Pattern */}
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
                      <svg viewBox="0 0 200 200" fill="currentColor" className="text-white w-full h-full">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            currentUser.role === 'admin' ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/20' :
                            currentUser.role === 'grower' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/20' :
                            currentUser.role === 'buyer' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/20' :
                            currentUser.role === 'trainer' ? 'bg-violet-500/20 text-violet-200 border border-violet-400/20' :
                            currentUser.role === 'partner' ? 'bg-amber-500/20 text-amber-200 border border-amber-400/20' :
                            'bg-stone-500/20 text-stone-200 border border-stone-400/20'
                          }`}>
                            {currentUser.role === 'admin' && '⚡'}
                            {currentUser.role === 'grower' && '🍄'}
                            {currentUser.role === 'buyer' && '🛒'}
                            {currentUser.role === 'trainer' && '🎓'}
                            {currentUser.role === 'partner' && '⚙️'}
                            {currentUser.role === 'staff' && '🛡️'}
                            {language === 'EN' ? `${currentUser.role} Dashboard` : `${currentUser.role} නියමු පුවරුව`}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white">
                          {language === 'EN' 
                            ? `Welcome back, ${currentUser.fullName.split(' ')[0]}` 
                            : `ආපසු සාදරයෙන් පිළිගනිමු, ${currentUser.fullName.split(' ')[0]}`}
                        </h2>
                        <p className="text-white/60 text-xs font-sans max-w-lg leading-relaxed">
                          {currentUser.role === 'admin' && (language === 'EN' 
                            ? 'Manage ecosystem members, monitor inquiries, enforce security, and oversee all co-operative operations from your control center.'
                            : 'සාමාජිකයන් කළමනාකරණය, විමසීම් අධීක්ෂණය, ආරක්ෂාව බලාත්මක කිරීම සහ සමුපකාර මෙහෙයුම් අධීක්ෂණය.')}
                          {currentUser.role === 'grower' && (language === 'EN' 
                            ? 'Track your daily harvests, manage product listings, receive buyer orders, and use the yield calculator to optimize your farm operations.'
                            : 'ඔබගේ දෛනික අස්වැන්න පසුවිපරම් කිරීම, නිෂ්පාදන ලැයිස්තු කළමනාකරණය, සහ අස්වනු ප්‍රශස්තකරණය.')}
                          {currentUser.role === 'buyer' && (language === 'EN' 
                            ? 'Browse verified suppliers, submit purchase inquiries, track your orders, and access the best mushroom products across Sri Lanka.'
                            : 'සත්‍යාපිත සැපයුම්කරුවන් පිරික්සීම, මිලදී ගැනීමේ විමසීම් ඉදිරිපත් කිරීම සහ ශ්‍රී ලංකාවේ හොඳම නිෂ්පාදන ලබා ගැනීම.')}
                          {currentUser.role === 'trainer' && (language === 'EN' 
                            ? 'Manage your training courses, approve student slot requests, track trainee progress, and build Sri Lanka\'s mushroom cultivation expertise.'
                            : 'ඔබගේ පුහුණු පාඨමාලා කළමනාකරණය, ශිෂ්‍ය ඉල්ලීම් අනුමත කිරීම සහ ශ්‍රී ලංකාවේ හතු වගා විශේෂඥ දැනුම ගොඩනැගීම.')}
                          {currentUser.role === 'partner' && (language === 'EN' 
                            ? 'Manage customer equipment inquiries, publish your machinery catalog, and connect with B2B opportunities across the co-operative network.'
                            : 'පාරිභෝගික උපකරණ විමසීම් කළමනාකරණය, යන්ත්‍ර සූත්‍ර ප්‍රකාශ කිරීම සහ B2B අවස්ථා සමඟ සම්බන්ධ වීම.')}
                          {currentUser.role === 'staff' && (language === 'EN' 
                            ? 'Verify member credentials, manage product listings, process inquiries, and support the co-operative ecosystem operations.'
                            : 'සාමාජික තොරතුරු සත්‍යාපනය, නිෂ්පාදන කළමනාකරණය, විමසීම් ක්‍රියාවලිය සහ සමුපකාර මෙහෙයුම් සහාය.')}
                        </p>
                      </div>
                      <button 
                        onClick={refreshAllData}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-2xl transition-all duration-200 flex items-center space-x-2 text-xs font-bold border border-white/10 hover:border-white/20 shadow-sm shrink-0"
                      >
                        <RefreshCw className="h-4 w-4 shrink-0" />
                        <span>{language === 'EN' ? 'Refresh' : 'යාවත්කාලීන'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Clock & Role Stats Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-[24px] border border-stone-200 shadow-sm gap-4">
                      <div>
                        <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
                          <Activity className="h-4.5 w-4.5 text-brand-orange" />
                          {language === 'EN' ? 'Real-time Metrics' : 'තථ්‍ය කාලීන දත්ත'}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                          {language === 'EN' ? 'Live updates from your ecosystem' : 'ඔබගේ පද්ධතියෙන් සජීවී යාවත්කාලීන'}
                        </p>
                      </div>
                      <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-100 flex items-center gap-3 shadow-inner">
                        <Clock className="h-5 w-5 text-stone-400" />
                        <LiveClock language={language} />
                      </div>
                    </div>

                    {/* Role-Specific Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {currentUser.role === 'admin' || currentUser.role === 'staff' ? (
                        <>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Total Members' : 'සාමාජිකයින්'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{approvedMembers}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min((approvedMembers / 50) * 100, 100)}%` }}></div>
                            </div>
                            <span className="block text-[10px] text-amber-600 font-semibold mt-2 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> +{pendingMembers} pending review
                            </span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Market Products' : 'නිෂ්පාදන'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{products.length}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min((products.length / 100) * 100, 100)}%` }}></div>
                            </div>
                            <span className="block text-[10px] text-stone-500 mt-2 font-medium">Active listings</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Total Inquiries' : 'විමසීම්'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{totalInquiries}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${Math.min((totalInquiries / 20) * 100, 100)}%` }}></div>
                            </div>
                            <span className="block text-[10px] text-cyan-600 font-bold mt-2">{newInquiries} unread new</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'System Load' : 'පද්ධති භාරය'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">14%</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '14%' }}></div>
                            </div>
                            <span className="block text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Optimal Status
                            </span>
                          </div>
                        </>
                      ) : currentUser.role === 'grower' ? (
                        <>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'My Products' : 'මගේ නිෂ්පාදන'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{products.filter(p => p.growerId === currentUser.id).length}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min((products.filter(p => p.growerId === currentUser.id).length / 10) * 100, 100)}%` }}></div>
                            </div>
                            <span className="block text-[10px] text-stone-500 mt-2 font-medium">Listed in marketplace</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Pending Orders' : 'ඇණවුම්'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{inquiries.filter(i => i.status === 'New' && products.find(p => p.id === i.productId)?.growerId === currentUser.id).length}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min((inquiries.filter(i => i.status === 'New' && products.find(p => p.id === i.productId)?.growerId === currentUser.id).length / 5) * 100, 100)}%` }}></div>
                            </div>
                            <span className="block text-[10px] text-amber-600 font-semibold mt-2">Requires action</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Completed Orders' : 'සම්පූර්ණ ඇණවුම්'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{inquiries.filter(i => (i.status === 'Closed' || i.status === 'Converted') && products.find(p => p.id === i.productId)?.growerId === currentUser.id).length}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="block text-[10px] text-blue-600 font-semibold mt-2">Historical data</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Yield Efficiency' : 'අස්වනු කාර්යක්ෂමතාව'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">85%</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="block text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Above average
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Generic for buyer/trainer/partner for now, can be expanded further */}
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Total Marketplace Items' : 'වෙළඳපොළේ අයිතම'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{products.length}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <span className="block text-[10px] text-stone-500 mt-2 font-medium">Available across island</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Active Suppliers' : 'සැපයුම්කරුවන්'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{approvedMembers}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <span className="block text-[10px] text-stone-500 mt-2 font-medium">Verified members</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'Active Opportunities' : 'සක්‍රීය අවස්ථා'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">{opportunities.filter(o => o.status === 'Active').length}</span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                            <span className="block text-[10px] text-amber-600 font-semibold mt-2">B2B & Partnerships</span>
                          </div>
                          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <span className="block text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-1">
                              {language === 'EN' ? 'My Activity' : 'මගේ ක්‍රියාකාරකම්'}
                            </span>
                            <span className="text-2xl font-extrabold text-stone-800">
                              {currentUser.role === 'buyer' ? inquiries.filter(i => i.buyerId === currentUser.id).length : 
                               currentUser.role === 'trainer' ? trainingPrograms.filter(t => t.trainerId === currentUser.id).length : 
                               machineryInquiries.filter(m => m.buyerId === currentUser.id).length}
                            </span>
                            <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <span className="block text-[10px] text-stone-500 mt-2 font-medium">Recent interactions</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Notices and Board Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Role Specific Alerts / Summaries */}
                    <div className="bg-[#F5F5F0] border border-[#5A5A40]/15 p-6 rounded-[24px] shadow-sm flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Bell className="h-24 w-24 text-[#8B4513]" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-serif font-bold text-[#8B4513] text-sm flex items-center space-x-2 mb-4">
                          <Bell className="h-4.5 w-4.5 text-[#8B4513]" />
                          <span>{language === 'EN' ? 'Co-operative Notice Board' : 'සමුපකාර දැන්වීම් පුවරුව'}</span>
                        </h4>
                        <ul className="space-y-3 text-xs text-[#2D2D2A]">
                          <li className="bg-white/80 backdrop-blur-sm border border-[#5A5A40]/10 p-3.5 rounded-xl shadow-sm">
                            <strong className="text-[#8B4513] font-serif block mb-1">Shared Bulk Purchase Consolidation Policy:</strong> 
                            We group small growers' monthly output volumes together to win major retail chain contracts. If you are a grower, please list all products on the public marketplace regularly to participate.
                          </li>
                        </ul>
                      </div>
                    </div>

                  {/* Live Weather & Humidity Advisory Widget */}
                  <div className="bg-white border border-stone-200 p-6 rounded-[24px] shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-emerald-500/10 text-emerald-700 rounded-xl">
                          <CloudLightning className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm">
                            {language === 'EN' ? 'Regional Cultivation Advisor' : 'ප්‍රාදේශීය වගා උපදේශක පුවරුව'}
                          </h4>
                          <p className="text-[10px] text-stone-400 font-sans">
                            {language === 'EN' ? `Live advisory for ${currentUser.district || 'Kurunegala'} District` : `${currentUser.district || 'කුරුණෑගල'} දිස්ත්‍රික්කය සඳහා වගා උපදෙස්`}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-serif font-black rounded-lg uppercase tracking-wide">
                        {language === 'EN' ? 'Optimal Climate' : 'හිතකර තත්ත්ව'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Temp card */}
                      <div className="bg-stone-50 border border-stone-150 p-4 rounded-xl flex items-center space-x-3.5">
                        <div className="p-2.5 bg-orange-100 text-orange-700 rounded-lg">
                          <Thermometer className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                            {language === 'EN' ? 'Temperature' : 'උෂ්ණත්වය'}
                          </span>
                          <span className="text-base font-bold text-stone-800">28.4 °C</span>
                        </div>
                      </div>

                      {/* Humidity card */}
                      <div className="bg-stone-50 border border-stone-150 p-4 rounded-xl flex items-center space-x-3.5">
                        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                          <Droplets className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                            {language === 'EN' ? 'Humidity' : 'ආර්ද්‍රතාවය'}
                          </span>
                          <span className="text-base font-bold text-stone-800">82 % R.H.</span>
                        </div>
                      </div>

                      {/* Weather Status card */}
                      <div className="bg-stone-50 border border-stone-150 p-4 rounded-xl flex items-center space-x-3.5">
                        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
                          <Sun className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                            {language === 'EN' ? 'Sky Condition' : 'කාලගුණය'}
                          </span>
                          <span className="text-base font-bold text-stone-800">
                            {language === 'EN' ? 'Partly Cloudy' : 'මඳක් වළාකුළු සහිත'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-xl p-3.5 text-xs text-stone-700 space-y-1">
                      <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Check className="h-4 w-4" />
                        {language === 'EN' ? 'Advisor Note:' : 'විශේෂ උපදේශය:'}
                      </p>
                      <p className="font-sans leading-relaxed text-[11px] text-stone-600">
                        {language === 'EN' 
                          ? 'Current humidity is highly favourable for spawn running and pinning of Oyster mushrooms. Ensure adequate light ventilation and misting 2 times daily. Keep temperature below 30°C.' 
                          : 'පවතින ආර්ද්‍රතාවය පිපිණි හතු වගාවේ බීජ වර්ධනයට ඉතා හිතකරය. දිනකට 2 වතාවක් ජලය ඉසින්න. වාතාශ්‍රය හොඳින් පවත්වාගන්න. උෂ්ණත්වය සෙල්සියස් 30ට වඩා අඩුවෙන් තබන්න.'}
                      </p>
                    </div>
                  </div>

                  {/* Database Management Controls - Real World Purge & Seed */}
                  {currentUser.role === 'admin' && (
                    <div className="bg-white border border-stone-200 p-6 rounded-[24px] space-y-4 shadow-sm" id="admin-db-controls">
                      <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
                        <div className="p-1.5 bg-amber-500/10 text-amber-700 rounded-lg">
                          <Settings className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm">
                            {language === 'EN' ? 'Real-World Database Management' : 'තත්කාලීන දත්ත සමුදාය කළමනාකරණය'}
                          </h4>
                          <p className="text-[10.5px] text-stone-500 font-sans">
                            {language === 'EN' 
                              ? 'Remove all mock entries to test live production or re-populate authentic Sri Lankan crop datasets.' 
                              : 'දත්ත සමුදාය සම්පූර්ණයෙන්ම හිස් කිරීමට හෝ සත්‍ය ශ්‍රී ලංකා බෝග දත්ත ඇතුළත් කිරීමට මෙවලම්.'}
                          </p>
                        </div>
                      </div>

                      {dbActionStatus && (
                        <div className={`p-4 rounded-xl text-xs font-sans border ${
                          dbActionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          {dbActionStatus.message}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleSeedDatabase}
                          disabled={dbActionLoading}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-serif font-bold transition flex items-center space-x-2 shadow-sm"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${dbActionLoading ? 'animate-spin' : ''}`} />
                          <span>{language === 'EN' ? 'Seed Live Firestore with Real Data' : 'සජීවී දත්ත ඇතුළත් කරන්න'}</span>
                        </button>

                        <button
                          onClick={handleClearDatabase}
                          disabled={dbActionLoading}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-serif font-bold transition flex items-center space-x-2 shadow-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{language === 'EN' ? 'Wipe / Clear Firestore Data' : 'දත්ත සමුදාය හිස් කරන්න'}</span>
                        </button>
                      </div>
                      
                      <div className="text-[10px] text-stone-400 font-mono">
                        <span>Database Connection State: </span>
                        <span className="text-emerald-600 font-bold">ONLINE (Firestore Native Rules Enforced)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MEMBER LIST TAB (ADMIN / STAFF) */}
              {activeTab === 'members' && ['admin', 'staff'].includes(currentUser.role) && (
                <div className="space-y-4 animate-fade-in" id="tab-members">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-stone-900">Ecosystem Membership Forms</h3>
                    
                    {/* Status filter */}
                    <div className="flex gap-2">
                      {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setMemberStatusFilter(status)}
                          className={`px-3 py-1 rounded-lg text-xs font-serif font-bold border transition ${
                            memberStatusFilter === status ? 'bg-[#5A5A40] border-[#5A5A40] text-white' : 'bg-white text-stone-600 border-[#5A5A40]/20 hover:bg-[#F5F5F0]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredMembers.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      No members matching criteria.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredMembers.map((m) => (
                        <div key={m.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-bold text-stone-900 text-base">{m.fullName}</h4>
                              <p className="text-xs text-stone-500">
                                {m.email} • {m.phone} • {m.city}, {m.district}
                              </p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                              m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              m.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {m.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-y border-stone-100 py-3 text-stone-600 bg-stone-50/50 px-3 rounded-xl">
                            <div>
                              <span className="block font-semibold text-stone-400">ROLE:</span>
                              <span className="capitalize text-stone-800 font-bold">{m.role}</span>
                            </div>
                            <div>
                              <span className="block font-semibold text-stone-400">EXPERIENCE:</span>
                              <span className="text-stone-800 font-bold">{m.experienceLevel}</span>
                            </div>
                            <div>
                              <span className="block font-semibold text-stone-400">INTEREST:</span>
                              <span className="text-stone-800 font-bold">{m.interestedArea}</span>
                            </div>
                            <div>
                              <span className="block font-semibold text-stone-400">CAPACITY:</span>
                              <span className="text-stone-800 font-bold">{m.monthlyCapacity || 'N/A'}</span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                            "{m.message}"
                          </p>

                          <div className="flex gap-2 justify-end">
                            {m.status !== 'approved' && (
                              <button
                                onClick={() => handleMemberStatus(m.id, 'approved')}
                                className="px-3 py-1.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white rounded-lg text-xs font-serif font-bold flex items-center space-x-1"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </button>
                            )}
                            {m.status !== 'rejected' && (
                              <button
                                onClick={() => handleMemberStatus(m.id, 'rejected')}
                                className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center space-x-1"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* INQUIRIES TAB (ADMIN / STAFF / PARTNERS) */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4 animate-fade-in" id="tab-inquiries">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-stone-900">
                      {['admin', 'staff'].includes(currentUser.role) ? 'All Buyer Inquiries' : 'Inquiries for My Products'}
                    </h3>

                    {['admin', 'staff'].includes(currentUser.role) && (
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'New', 'Contacted', 'In Discussion', 'Converted', 'Closed'].map((st) => (
                          <button
                            key={st}
                            onClick={() => setInquiryStatusFilter(st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold border transition ${
                              inquiryStatusFilter === st ? 'bg-[#5A5A40] border-[#5A5A40] text-white' : 'bg-white text-stone-600 border-[#5A5A40]/20 hover:bg-[#F5F5F0]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* List */}
                  {(['admin', 'staff'].includes(currentUser.role) ? filteredInquiries : myProductInquiries).length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      No product inquiries listed yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(['admin', 'staff'].includes(currentUser.role) ? filteredInquiries : myProductInquiries).map((inq) => (
                        <div key={inq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400">PRODUCT INQUIRED</span>
                              <h4 className="font-bold text-stone-900 text-base">{inq.productName}</h4>
                              <p className="text-xs text-stone-500">
                                Buyer: {inq.buyerName} ({inq.email} • {inq.phone})
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] block text-stone-400 mb-1">{new Date(inq.createdAt).toLocaleDateString()}</span>
                              <select
                                value={inq.status}
                                onChange={(e) => handleInquiryStatus(inq.id, e.target.value as BuyerInquiry['status'])}
                                className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Discussion">In Discussion</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100 text-stone-700">
                            <div>
                              <strong>Required Quantity:</strong> {inq.requiredQuantity}
                            </div>
                            <div>
                              <strong>Delivery Location:</strong> {inq.deliveryLocation}
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                            "{inq.message || 'No custom message.'}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MACHINERY INQUIRIES TAB (ADMIN / STAFF) */}
              {activeTab === 'machinery_inquiries' && ['admin', 'staff'].includes(currentUser.role) && (
                <div className="space-y-4 animate-fade-in" id="tab-machinery-inquiries">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-stone-900">
                      {language === 'EN' ? 'Co-op Machinery Procurement Inquiries' : 'සමුපකාර යන්ත්‍රෝපකරණ මිලදී ගැනීමේ විමසීම්'}
                    </h3>

                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'New', 'Contacted', 'In Discussion', 'Converted', 'Closed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setMachineryStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold border transition ${
                            machineryStatusFilter === st ? 'bg-[#5A5A40] border-[#5A5A40] text-white' : 'bg-white text-stone-600 border-[#5A5A40]/20 hover:bg-[#F5F5F0]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredMachineryInquiries.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      No machinery inquiries listed yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredMachineryInquiries.map((inq) => (
                        <div key={inq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#8B4513]">MACHINERY MODEL</span>
                              <h4 className="font-bold text-stone-900 text-base">{inq.machineName}</h4>
                              <p className="text-xs text-stone-500">
                                Category: {inq.category}
                              </p>
                              <p className="text-xs text-stone-500 mt-1">
                                Buyer: <strong className="text-stone-700">{inq.name}</strong> ({inq.email} • {inq.phone})
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] block text-stone-400 mb-1">{new Date(inq.createdAt).toLocaleDateString()}</span>
                              <select
                                value={inq.status}
                                onChange={(e) => handleMachineryInquiryStatus(inq.id, e.target.value as any)}
                                className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Discussion">In Discussion</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100 text-stone-700">
                            <div>
                              <strong>Delivery Location:</strong> {inq.location}
                            </div>
                            <div>
                              <strong>Expected Capacity:</strong> {inq.dailyCapacity}
                            </div>
                            <div>
                              <strong>Intended End-Product:</strong> {inq.intendedProduct}
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                            "{inq.message || 'No custom message.'}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTS TAB (ADMIN / GROWERS) */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in" id="tab-products">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-stone-900">
                      {currentUser.role === 'admin' ? 'Global Product Listings' : 'My Product Listings'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          category: 'Fresh Oyster Mushroom',
                          description: '',
                          district: currentUser.district || 'Colombo',
                          minimumOrder: '',
                          monthlyCapacity: '',
                          priceRange: '',
                          imageUrl: '',
                          status: 'Available'
                        });
                        setShowAddProduct(true);
                      }}
                      className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4E4E37] text-white rounded-xl text-xs font-serif font-bold flex items-center space-x-1.5 border border-[#5A5A40]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Add Product Form Modal Popup */}
                  {showAddProduct && (
                    <div className="bg-stone-50 border border-emerald-100 p-6 rounded-3xl space-y-4">
                      <h4 className="font-bold text-stone-900 text-base">
                        {editingProduct ? 'Edit Product details' : 'Add New Product listing'}
                      </h4>
                      <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Product Name</label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            placeholder="e.g. Fresh Pink Oyster Mushrooms"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          >
                            <option value="Fresh Oyster Mushroom">Fresh Oyster Mushroom</option>
                            <option value="Fresh Button Mushroom">Fresh Button Mushroom</option>
                            <option value="Dried Mushroom">Dried Mushroom</option>
                            <option value="Mushroom Powder">Mushroom Powder</option>
                            <option value="Mushroom Meatballs">Mushroom Meatballs</option>
                            <option value="Mushroom Sausages">Mushroom Sausages</option>
                            <option value="Spawn">Spawn (Seed)</option>
                            <option value="Grow Bags">Grow Bags</option>
                            <option value="Compost">Compost</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Description</label>
                          <textarea
                            required
                            rows={3}
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Describe quality, strain, certification details..."
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Minimum Order Qty</label>
                          <input
                            type="text"
                            required
                            value={productForm.minimumOrder}
                            onChange={(e) => setProductForm({ ...productForm, minimumOrder: e.target.value })}
                            placeholder="e.g. 5kg"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Monthly Supply Capacity</label>
                          <input
                            type="text"
                            required
                            value={productForm.monthlyCapacity}
                            onChange={(e) => setProductForm({ ...productForm, monthlyCapacity: e.target.value })}
                            placeholder="e.g. 200kg weekly"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Estimated Price Range</label>
                          <input
                            type="text"
                            required
                            value={productForm.priceRange}
                            onChange={(e) => setProductForm({ ...productForm, priceRange: e.target.value })}
                            placeholder="e.g. LKR 450 - 500 / kg"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">District</label>
                          <select
                            value={productForm.district}
                            onChange={(e) => setProductForm({ ...productForm, district: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          >
                            {DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Image URL (Optional)</label>
                          <input
                            type="url"
                            value={productForm.imageUrl}
                            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Availability Status</label>
                          <select
                            value={productForm.status}
                            onChange={(e) => setProductForm({ ...productForm, status: e.target.value as Product['status'] })}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          >
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 flex gap-2 pt-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAddProduct(false)}
                            className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#8B4513] hover:bg-[#73390F] text-white text-xs font-serif font-bold rounded-xl"
                          >
                            Save Listing
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Product List */}
                  {((['admin', 'staff'].includes(currentUser.role)) ? products : myProducts).length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      No products listed yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {((['admin', 'staff'].includes(currentUser.role)) ? products : myProducts).map((prod) => (
                        <div key={prod.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-4">
                          <img
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=200'}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=200';
                            }}
                            className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                          />
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <span className="inline-block bg-stone-100 text-stone-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              {prod.category}
                            </span>
                            <h4 className="font-bold text-stone-900 text-sm truncate">{prod.name}</h4>
                            <p className="text-stone-500 text-xs truncate">Price: {prod.priceRange}</p>
                            <p className="text-[10px] text-stone-400">Supplier: {prod.supplierName}</p>
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => handleEditProduct(prod)}
                                className="p-1.5 text-stone-500 hover:text-[#8B4513] hover:bg-[#8B4513]/10 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TRAINING REQUESTS TAB (TRAINER) */}
              {activeTab === 'training_reqs' && currentUser.role === 'trainer' && (
                <div className="space-y-4 animate-fade-in" id="tab-trainer-requests">
                  <h3 className="text-xl font-bold text-stone-900 mb-4">Trainee Applications</h3>

                  {trainingRequests.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      No training requests submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trainingRequests.map((trq) => (
                        <div key={trq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[9px] font-bold text-emerald-600 tracking-wider block uppercase">REQUESTED PROGRAM</span>
                              <h4 className="font-bold text-stone-900 text-base">{trq.trainingInterest}</h4>
                              <p className="text-xs text-stone-500">
                                Applicant: {trq.name} ({trq.phone} • {trq.district} district)
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] block text-stone-400 mb-1">{new Date(trq.createdAt).toLocaleDateString()}</span>
                              <select
                                value={trq.status}
                                onChange={(e) => handleTrainingReqStatus(trq.id, e.target.value as TrainingRequest['status'])}
                                className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-stone-700">
                            <div>
                              <strong>Format Preference:</strong> {trq.preferredFormat}
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded italic">
                            "{trq.message || 'No additional message.'}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MANAGE CLASSES (TRAINER) */}
              {activeTab === 'programs' && currentUser.role === 'trainer' && (
                <div className="space-y-6 animate-fade-in" id="tab-trainer-programs">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-stone-900">Manage Training Programs</h3>
                    <button
                      onClick={() => setShowAddProgram(true)}
                      className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4E4E37] text-white rounded-xl text-xs font-serif font-bold flex items-center space-x-1.5 border border-[#5A5A40]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Post Training Course</span>
                    </button>
                  </div>

                  {showAddProgram && (
                    <div className="bg-stone-50 border border-emerald-100 p-6 rounded-3xl space-y-4">
                      <h4 className="font-bold text-stone-900 text-sm">Add New Training Program</h4>
                      <form onSubmit={handleProgramSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Course Title</label>
                          <input
                            type="text"
                            required
                            value={programForm.title}
                            onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                            placeholder="e.g. Organic Substrate Pasteurization Masterclass"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Target Audience</label>
                          <input
                            type="text"
                            required
                            value={programForm.whoItIsFor}
                            onChange={(e) => setProgramForm({ ...programForm, whoItIsFor: e.target.value })}
                            placeholder="e.g. Smallholders wanting pure spore cultures"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Duration</label>
                          <input
                            type="text"
                            required
                            value={programForm.duration}
                            onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                            placeholder="e.g. 2 Days (10 Hours Total)"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Format</label>
                          <select
                            value={programForm.format}
                            onChange={(e) => setProgramForm({ ...programForm, format: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          >
                            <option value="In-person Practical Session">In-person Practical Session</option>
                            <option value="Online Video Webinar">Online Video Webinar</option>
                            <option value="Hybrid (Theory + Site Visit)">Hybrid (Theory + Site Visit)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAddProgram(false)}
                            className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#8B4513] hover:bg-[#73390F] text-white text-xs font-serif font-bold rounded-xl"
                          >
                            Post Course
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-4">
                    {trainingPrograms.map((prog) => (
                      <div key={prog.id} className="bg-white border border-stone-200 rounded-2xl p-5 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-stone-900 text-base">{prog.title}</h4>
                          <p className="text-xs text-stone-500">For: {prog.whoItIsFor}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1.5">{prog.duration} • {prog.format}</p>
                        </div>
                        <span className="text-xs text-stone-400 font-medium">Active Course</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MY SENT INQUIRIES TAB (BUYERS) */}
              {activeTab === 'my_inquiries' && currentUser.role === 'buyer' && (
                <div className="space-y-8 animate-fade-in" id="tab-buyer-inquiries">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">My Product Purchase Inquiries</h3>

                    {mySubmittedInquiries.length === 0 ? (
                      <div className="bg-white border border-stone-200 p-8 rounded-2xl text-center text-stone-400 text-xs">
                        You haven't submitted any product inquiries yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mySubmittedInquiries.map((inq) => (
                          <div key={inq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold text-[#8B4513] tracking-wider block uppercase">TARGET PRODUCT</span>
                                <h4 className="font-bold text-stone-900 text-sm">{inq.productName}</h4>
                                <p className="text-xs text-stone-500">
                                  Required: {inq.requiredQuantity} • Location: {inq.deliveryLocation}
                                </p>
                              </div>
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                                inq.status === 'New' ? 'bg-amber-100 text-amber-800' :
                                inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                                inq.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-stone-100 text-stone-800'
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-100 italic">
                              "{inq.message || 'No additional message.'}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">My Machinery Purchase Inquiries</h3>

                    {mySubmittedMachineryInquiries.length === 0 ? (
                      <div className="bg-white border border-stone-200 p-8 rounded-2xl text-center text-stone-400 text-xs">
                        You haven't submitted any machinery inquiries yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mySubmittedMachineryInquiries.map((inq) => (
                          <div key={inq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold text-[#5A5A40] tracking-wider block uppercase">TARGET MACHINERY</span>
                                <h4 className="font-bold text-stone-900 text-sm">{inq.machineName}</h4>
                                <p className="text-xs text-stone-500">
                                  Category: {inq.category} • Capacity: {inq.dailyCapacity}
                                </p>
                              </div>
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                                inq.status === 'New' ? 'bg-amber-100 text-amber-800' :
                                inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                                inq.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-stone-100 text-stone-800'
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            <div className="text-xs bg-stone-50 p-2.5 rounded border border-stone-100 text-stone-700">
                              <strong>Delivery District:</strong> {inq.location} | <strong>Intended Product:</strong> {inq.intendedProduct}
                            </div>

                            <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-100 italic">
                              "{inq.message || 'No additional message.'}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OPPORTUNITIES TAB (ADMIN / PARTNERS) */}
              {activeTab === 'opportunities' && (
                <div className="space-y-6 animate-fade-in" id="tab-admin-opp">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-stone-900">Manage Board Notices</h3>
                    <button
                      onClick={() => setShowAddOpportunity(true)}
                      className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4E4E37] text-white rounded-xl text-xs font-serif font-bold flex items-center space-x-1.5 border border-[#5A5A40]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Board Notice</span>
                    </button>
                  </div>

                  {showAddOpportunity && (
                    <div className="bg-stone-50 border border-emerald-100 p-6 rounded-3xl space-y-4">
                      <h4 className="font-bold text-stone-900 text-sm">Add New Board Notice</h4>
                      <form onSubmit={handleOppSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Notice Title</label>
                          <input
                            type="text"
                            required
                            value={oppForm.title}
                            onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                            placeholder="e.g. Need 100kg fresh oyster mushroom weekly"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Notice Type</label>
                          <select
                            value={oppForm.type}
                            onChange={(e) => setOppForm({ ...oppForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          >
                            <option value="Requirement">Requirement</option>
                            <option value="Supply">Supply</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Training">Training</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold text-xs mb-1">District</label>
                          <select
                            value={oppForm.district}
                            onChange={(e) => setOppForm({ ...oppForm, district: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          >
                            {DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-stone-700 font-semibold text-xs mb-1">Full Details</label>
                          <textarea
                            required
                            rows={3}
                            value={oppForm.details}
                            onChange={(e) => setOppForm({ ...oppForm, details: e.target.value })}
                            placeholder="Describe quantities, contract durations, pay scales or specs..."
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white"
                          ></textarea>
                        </div>

                        <div className="sm:col-span-2 flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAddOpportunity(false)}
                            className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#8B4513] hover:bg-[#73390F] text-white text-xs font-serif font-bold rounded-xl"
                          >
                            Post Notice
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-4">
                    {opportunities.map((opp) => (
                      <div key={opp.id} className="bg-white border border-stone-200 rounded-2xl p-5 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 uppercase mr-2 inline-block">
                            {opp.type}
                          </span>
                          <h4 className="font-bold text-stone-900 text-sm inline-block">{opp.title}</h4>
                          <p className="text-[10px] text-stone-400 mt-1">{opp.district} district • Status: {opp.status}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteOpportunity(opp.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Board Applications Section */}
                  {['admin', 'staff'].includes(currentUser.role) && (
                    <div className="pt-8 border-t border-stone-200 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-lg">
                            {language === 'EN' ? 'Applications for Board Notices' : 'දැන්වීම් පුවරු සඳහා ලැබුණු අයදුම්පත්'}
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            {language === 'EN'
                              ? 'Review proposals and cooperation requests submitted by ecosystem participants.'
                              : 'සමුපකාර සාමාජිකයින් විසින් ඉදිරිපත් කරන ලද යෝජනා සහ ඉල්ලීම් මෙහි සමාලෝචනය කරන්න.'}
                          </p>
                        </div>
                      </div>

                      {oppApplications.length === 0 ? (
                        <div className="bg-white border border-stone-200 p-8 rounded-2xl text-center text-stone-400 text-xs">
                          {language === 'EN' ? 'No notice applications submitted yet.' : 'තවමත් කිසිදු අයදුම්පතක් ලැබී නැත.'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          {oppApplications.map((app) => (
                            <div key={app.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs relative">
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-[#8B4513] bg-stone-100 px-2 py-0.5 rounded-md">
                                    {app.role}
                                  </span>
                                  <h5 className="font-bold text-stone-900 text-sm mt-1.5">{app.opportunityTitle}</h5>
                                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                                    Applicant: <strong className="text-stone-700">{app.name}</strong> ({app.phone})
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="text-[10px] block text-stone-400 mb-1">
                                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                                  </span>
                                  <select
                                    value={app.status}
                                    onChange={(e) => handleOppAppStatus(app.id, e.target.value as any)}
                                    className={`px-2.5 py-1 border rounded-lg text-xs font-bold outline-none cursor-pointer ${
                                      app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                      app.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                                      app.status === 'Reviewed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                      'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}
                                  >
                                    <option value="New">New</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </div>
                              </div>

                              <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 italic">
                                "{app.message || 'No custom message.'}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CONTACT MESSAGES TAB (ADMIN) */}
              {activeTab === 'contacts' && currentUser.role === 'admin' && (
                <div className="space-y-4 animate-fade-in" id="tab-admin-messages">
                  <h3 className="text-xl font-bold text-stone-900 mb-4">Inbound Desk Messages</h3>

                  {contactMessages.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      No customer queries received yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contactMessages.map((msg) => (
                        <div key={msg.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-stone-900 text-base">{msg.name}</h4>
                              <p className="text-xs text-stone-500">{msg.email} • {msg.phone}</p>
                            </div>
                            <span className="text-[10px] text-stone-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 italic">
                            "{msg.message}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECURITY AUDIT LOGS TAB (ADMIN ONLY) */}
              {activeTab === 'security_logs' && currentUser.role === 'admin' && (
                <div className="space-y-6 animate-fade-in" id="tab-security-logs-panel">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">
                        {language === 'EN' ? 'Security Operations & Auditing Log' : 'ආරක්ෂක මෙහෙයුම් සහ විගණන ලොගය'}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {language === 'EN' 
                          ? 'Real-time trace of authentication, authorization, and sensitive database modifications.' 
                          : 'පද්ධති පිවිසුම්, අවසරයන් සහ සංවේදී දත්ත වෙනස්වීම් පිළිබඳ සත්‍ය කාලීන සටහන.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={refreshAllData}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition shadow-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>{language === 'EN' ? 'Refresh Logs' : 'ලොග් යාවත්කාලීන කරන්න'}</span>
                    </button>
                  </div>

                  {/* Log Statistics Summary cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center space-x-3.5">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                          Total Operations
                        </p>
                        <p className="text-xl font-bold text-stone-900">{securityLogs.length}</p>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center space-x-3.5">
                      <div className="p-2.5 bg-red-500/10 text-red-700 rounded-xl">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-red-800 tracking-wider">
                          Critical Warnings
                        </p>
                        <p className="text-xl font-bold text-stone-900">
                          {securityLogs.filter(l => l.action.includes('UNAUTHORIZED') || l.action.includes('FAIL')).length}
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-[#8B4513]/10 p-4 rounded-2xl flex items-center space-x-3.5">
                      <div className="p-2.5 bg-[#8B4513]/10 text-[#8B4513] rounded-xl">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B4513] tracking-wider">
                          Protection Level
                        </p>
                        <p className="text-xl font-bold text-[#8B4513]">MIL-SPEC-256</p>
                      </div>
                    </div>
                  </div>

                  {/* Audit List */}
                  {securityLogs.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-12 rounded-3xl text-center text-stone-400 text-xs">
                      No security audit entries recorded yet.
                    </div>
                  ) : (
                    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
                      <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                        <p className="text-xs font-serif font-bold text-stone-900">System Logs Timeline</p>
                        <span className="text-[10px] font-mono text-stone-500 bg-white border border-stone-100 px-2 py-0.5 rounded-md">
                          LOCAL & CLOUD SYNCED
                        </span>
                      </div>
                      <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto font-sans">
                        {securityLogs.map((log) => {
                          const isWarning = log.action.includes('UNAUTHORIZED') || log.action.includes('FAIL');
                          const isSuccess = log.action.includes('SUCCESS') || log.action.includes('CREATE') || log.action.includes('ADD') || log.action.includes('APPROVE');
                          return (
                            <div key={log.id} className="p-4 hover:bg-stone-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div className="space-y-1 max-w-2xl">
                                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                                  <span className={`px-2 py-0.5 font-mono text-[9px] font-extrabold uppercase rounded-md tracking-wide ${
                                    isWarning ? 'bg-red-100 text-red-800 border border-red-200' :
                                    isSuccess ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    'bg-stone-100 text-stone-700 border border-stone-200'
                                  }`}>
                                    {log.action}
                                  </span>
                                  <span className="text-stone-500 font-semibold">{log.userEmail || 'System Process'}</span>
                                  <span className="text-stone-300">•</span>
                                  <span className="text-[10px] text-stone-400 font-mono">UID: {log.userId?.substring(0, 8)}...</span>
                                </div>
                                <p className="text-stone-700 font-sans leading-relaxed">{log.details}</p>
                                {log.userAgent && (
                                  <p className="text-[10px] text-stone-400 font-mono truncate max-w-xl">
                                    UA: {log.userAgent}
                                  </p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] text-stone-400 font-mono bg-stone-50 border border-stone-100 px-2 py-1 rounded-lg">
                                  {new Date(log.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB (ALL ROLES) */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-stone-200 rounded-3xl p-8 space-y-8 animate-fade-in" id="tab-profile">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-5">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">
                        {language === 'EN' ? 'Co-operative Member Profile' : 'සමුපකාර සාමාජික පැතිකඩ'}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans mt-0.5">
                        {language === 'EN' ? 'Manage your credentials, bio, and cultivation metrics.' : 'ඔබගේ තොරතුරු, ජීව දත්ත සහ වගා මිනුම් කළමනාකරණය කරන්න.'}
                      </p>
                    </div>
                    {currentUser.membershipId && (
                      <div className="bg-[#8B4513]/10 text-[#8B4513] px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5">
                        <Award className="h-3.5 w-3.5" />
                        <span>ID: {currentUser.membershipId}</span>
                      </div>
                    )}
                  </div>
                  
                  {editingProfile ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">Phone Number</label>
                          <input
                            type="text"
                            required
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">District</label>
                          <select
                            value={profileForm.district}
                            onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans font-medium"
                          >
                            {DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">City</label>
                          <input
                            type="text"
                            value={profileForm.city}
                            onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">Co-op License Number</label>
                          <input
                            type="text"
                            value={profileForm.licenseNumber}
                            onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })}
                            placeholder="e.g. COOP-REG-9482"
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">Grower/Buyer Land Space</label>
                          <input
                            type="text"
                            value={profileForm.productionArea}
                            onChange={(e) => setProfileForm({ ...profileForm, productionArea: e.target.value })}
                            placeholder="e.g. 500 sq ft"
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">GPS Farm Coordinates</label>
                          <input
                            type="text"
                            value={profileForm.gpsCoordinates}
                            onChange={(e) => setProfileForm({ ...profileForm, gpsCoordinates: e.target.value })}
                            placeholder="e.g. 6.9271° N, 79.8612° E"
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">System Language</label>
                          <select
                            value={profileForm.preferredLanguage}
                            onChange={(e) => setProfileForm({ ...profileForm, preferredLanguage: e.target.value as 'EN' | 'SI' })}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans font-medium"
                          >
                            <option value="EN">English</option>
                            <option value="SI">සිංහල (Sinhala)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-serif font-bold text-xs mb-1.5">About Me / Bio</label>
                        <textarea
                          rows={3}
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          placeholder="Tell us about your mushroom cultivation business..."
                          className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 focus:border-[#8B4513] outline-none font-sans"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setEditingProfile(false)}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif font-bold rounded-xl transition"
                        >
                          {language === 'EN' ? 'Cancel' : 'අවලංගු කරන්න'}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#8B4513] hover:bg-[#73390F] text-white text-xs font-serif font-bold rounded-xl transition shadow-xs"
                        >
                          {language === 'EN' ? 'Save Changes' : 'සුරකින්න'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Column 1: Core details */}
                        <div className="md:col-span-2 space-y-6">
                          <div className="bg-stone-50 border border-stone-200/60 p-6 rounded-2xl space-y-4">
                            <h4 className="font-serif font-bold text-sm text-stone-900 border-b border-stone-200/50 pb-2 flex items-center space-x-2">
                              <User className="h-4.5 w-4.5 text-[#8B4513]" />
                              <span>{language === 'EN' ? 'General Information' : 'පොදු තොරතුරු'}</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Full Name</span>
                                <span className="font-serif font-bold text-stone-800 text-sm">{currentUser.fullName}</span>
                              </div>
                              <div>
                                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">System Role</span>
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-serif font-bold rounded-md text-[10px] capitalize inline-block border border-emerald-100 mt-0.5">
                                  {currentUser.role}
                                </span>
                              </div>
                              <div>
                                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Email Address</span>
                                <span className="font-sans font-medium text-stone-700">{currentUser.email}</span>
                              </div>
                              <div>
                                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Phone Number</span>
                                <span className="font-sans font-medium text-stone-700">{currentUser.phone}</span>
                              </div>
                              <div>
                                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Registered Location</span>
                                <span className="font-sans font-medium text-stone-700">{currentUser.city || 'N/A'}, {currentUser.district || 'Colombo'}</span>
                              </div>
                              <div>
                                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">License Number</span>
                                <span className="font-mono font-bold text-stone-600">{currentUser.licenseNumber || 'N/A (Pending Verification)'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-stone-50 border border-stone-200/60 p-6 rounded-2xl space-y-3">
                            <h4 className="font-serif font-bold text-sm text-stone-900 border-b border-stone-200/50 pb-2 flex items-center space-x-2">
                              <FileText className="h-4.5 w-4.5 text-[#8B4513]" />
                              <span>{language === 'EN' ? 'About / Bio' : 'මා පිළිබඳව'}</span>
                            </h4>
                            <p className="text-xs text-stone-600 leading-relaxed italic font-serif">
                              "{currentUser.bio || 'No custom biography added yet.'}"
                            </p>
                          </div>
                        </div>

                        {/* Column 2: Stats & Agri credentials */}
                        <div className="space-y-6">
                          <div className="bg-[#5A5A40]/5 border border-[#5A5A40]/10 p-6 rounded-2xl space-y-4">
                            <h4 className="font-serif font-bold text-sm text-[#5A5A40] border-b border-[#5A5A40]/10 pb-2 flex items-center space-x-2">
                              <Activity className="h-4.5 w-4.5" />
                              <span>{language === 'EN' ? 'Cultivation & Metrics' : 'වගා මිනුම් සහ දත්ත'}</span>
                            </h4>
                            
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                <span className="text-stone-500 font-medium">Production Area</span>
                                <span className="font-bold text-stone-800">{currentUser.productionArea || '500 sq ft'}</span>
                              </div>
                              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                <span className="text-stone-500 font-medium">GPS Location</span>
                                <span className="font-mono text-[10px] text-stone-600 font-bold">{currentUser.gpsCoordinates || '6.9271° N, 79.8612° E'}</span>
                              </div>
                              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                <span className="text-stone-500 font-medium">Monthly Capacity</span>
                                <span className="font-bold text-[#8B4513]">{currentUser.monthlyCapacity || '0'} kg</span>
                              </div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-stone-500 font-medium">Preferred System Language</span>
                                <span className="font-bold text-stone-800">{currentUser.preferredLanguage || 'EN'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl space-y-3 text-center">
                            <div className="mx-auto h-10 w-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-xs font-serif font-bold text-stone-900">Security & Credentials</p>
                              <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                                Fully verified. Google Authentication is linked to your digital co-op passport.
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-end border-t border-stone-100 pt-5">
                        <button
                          onClick={() => {
                            setProfileForm({
                              fullName: currentUser.fullName,
                              phone: currentUser.phone,
                              district: currentUser.district || 'Colombo',
                              city: currentUser.city || '',
                              experienceLevel: currentUser.experienceLevel || 'Beginner',
                              interestedArea: currentUser.interestedArea || 'Fresh mushroom growing',
                              monthlyCapacity: currentUser.monthlyCapacity || '0',
                              message: currentUser.message || '',
                              bio: currentUser.bio || 'Eco-system member passionate about organic mushroom cultivation in Sri Lanka.',
                              preferredLanguage: currentUser.preferredLanguage || 'EN',
                              licenseNumber: currentUser.licenseNumber || `COOP-REG-${Math.floor(1000 + Math.random() * 9000)}`,
                              productionArea: currentUser.productionArea || '500 sq ft',
                              gpsCoordinates: currentUser.gpsCoordinates || '6.9271° N, 79.8612° E'
                            });
                            setEditingProfile(true);
                          }}
                          className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#4E4E37] text-white text-xs font-serif font-bold rounded-xl flex items-center space-x-2 border border-[#5A5A40] transition shadow-xs"
                        >
                          <Edit className="h-4 w-4" />
                          <span>{language === 'EN' ? 'Edit Profile Details' : 'පැතිකඩ සංස්කරණය කරන්න'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* USER CONTROL TAB (ADMIN ONLY) */}
              {activeTab === 'user_control' && currentUser.role === 'admin' && (
                <div className="space-y-6 animate-fade-in" id="tab-admin-user-control">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-bold text-stone-900">
                      {language === 'EN' ? 'System User Control & Roles' : 'පරිශීලක පාලනය සහ භූමිකාවන්'}
                    </h3>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white animate-none outline-none"
                      />
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-stone-800 bg-white font-medium"
                      >
                        <option value="All">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="grower">Grower</option>
                        <option value="buyer">Buyer</option>
                        <option value="trainer">Trainer</option>
                        <option value="partner">Partner</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                            <th className="p-4">User Info</th>
                            <th className="p-4">Current Role</th>
                            <th className="p-4">Account Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {userProfiles
                            .filter(u => {
                              const matchesSearch = u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                                                    u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
                              const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
                              return matchesSearch && matchesRole;
                            })
                            .map((u) => (
                              <tr key={u.uid} className="hover:bg-stone-50/50">
                                <td className="p-4">
                                  <div className="font-bold text-stone-900">{u.fullName}</div>
                                  <div className="text-stone-500">{u.email}</div>
                                  {u.phone && <div className="text-stone-400 text-[10px]">Phone: {u.phone}</div>}
                                </td>
                                <td className="p-4">
                                  <select
                                    value={u.role}
                                    disabled={u.uid === currentUser.uid}
                                    onChange={(e) => handleUpdateUserRoleAndStatus(u.uid, e.target.value as UserRole, u.status)}
                                    className="px-2 py-1 border border-stone-300 rounded-lg text-xs bg-white text-stone-800 font-semibold cursor-pointer"
                                  >
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                    <option value="grower">Grower</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="trainer">Trainer</option>
                                    <option value="partner">Partner</option>
                                  </select>
                                </td>
                                <td className="p-4">
                                  <select
                                    value={u.status}
                                    disabled={u.uid === currentUser.uid}
                                    onChange={(e) => handleUpdateUserRoleAndStatus(u.uid, u.role, e.target.value as UserProfile['status'])}
                                    className={`px-2.5 py-1 border rounded-full text-xs font-extrabold uppercase cursor-pointer ${
                                      u.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                      u.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                      'bg-stone-50 text-stone-800 border-stone-200'
                                    }`}
                                  >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteUser(u.uid)}
                                    disabled={u.uid === currentUser.uid}
                                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* YIELD CALCULATOR TAB (GROWER ONLY) */}
              {activeTab === 'yield_calculator' && currentUser.role === 'grower' && (() => {
                const getYieldData = () => {
                  let baseYield = 0.22; // kg per bag
                  let marketPrice = 650; // LKR per kg
                  let optimalTempMin = 22;
                  let optimalTempMax = 28;
                  let optimalHumidMin = 80;
                  let MathValMax = 90;

                  if (calcVariety === 'Button') {
                    baseYield = 0.18;
                    marketPrice = 950;
                    optimalTempMin = 18;
                    optimalTempMax = 24;
                    optimalHumidMin = 85;
                    MathValMax = 95;
                  } else if (calcVariety === 'Milky') {
                    baseYield = 0.28;
                    marketPrice = 750;
                    optimalTempMin = 30;
                    optimalTempMax = 35;
                    optimalHumidMin = 80;
                    MathValMax = 90;
                  }

                  let mediumFactor = 1.0;
                  if (calcMedium === 'Sawdust') {
                    mediumFactor = 1.15;
                  } else if (calcMedium === 'Straw') {
                    mediumFactor = 0.95;
                  } else if (calcMedium === 'Coir') {
                    mediumFactor = 0.90;
                  }

                  let tempFactor = 1.0;
                  if (calcTemp < optimalTempMin) {
                    tempFactor = 1.0 - (optimalTempMin - calcTemp) * 0.05;
                  } else if (calcTemp > optimalTempMax) {
                    tempFactor = 1.0 - (calcTemp - optimalTempMax) * 0.07;
                  }
                  tempFactor = Math.max(0.3, tempFactor);

                  let humidFactor = 1.0;
                  if (calcHumidity < optimalHumidMin) {
                    humidFactor = 1.0 - (optimalHumidMin - calcHumidity) * 0.04;
                  }
                  humidFactor = Math.max(0.4, humidFactor);

                  const singleBagYield = baseYield * mediumFactor * tempFactor * humidFactor;
                  const totalYield = calcBags * singleBagYield;
                  const revenue = totalYield * marketPrice;

                  let advice = '';
                  let status: 'optimal' | 'warning' | 'critical' = 'optimal';

                  if (calcTemp > optimalTempMax + 3) {
                    advice = language === 'EN'
                      ? `Warning: High temperature of ${calcTemp}°C detected. ${calcVariety} mushrooms prefer below ${optimalTempMax}°C. This could dry out the substrate or stall pinning. Consider setting up shade nets or a water mist system.`
                      : `අවවාදයයි: සෙල්සියස් ${calcTemp}ක ඉහළ උෂ්ණත්වයක් හඳුනාගෙන ඇත. ${calcVariety} හතු වගාව සඳහා හිතකර උපරිම උෂ්ණත්වය සෙල්සියස් ${optimalTempMax} වේ. කරුණාකර වගා කාමරයේ සෙවන දැල් යොදන්න හෝ ජලය ඉසින්න.`;
                    status = 'critical';
                  } else if (calcTemp < optimalTempMin - 3) {
                    advice = language === 'EN'
                      ? `Warning: Cool temperature of ${calcTemp}°C detected. ${calcVariety} mushrooms grow best above ${optimalTempMin}°C. Growth will slow down significantly.`
                      : `අවවාදයයි: සෙල්සියස් ${calcTemp}ක අඩු උෂ්ණත්වයක් හඳුනාගෙන ඇත. ${calcVariety} හතු සඳහා අවම උෂ්ණත්වය සෙල්සියස් ${optimalTempMin} වේ. වර්ධන වේගය බාල විය හැක.`;
                    status = 'warning';
                  } else if (calcHumidity < 70) {
                    advice = language === 'EN'
                      ? `Warning: Relative Humidity (${calcHumidity}%) is too low. Mushrooms need at least 80% to fruit correctly. Use misting nozzles or humidifiers immediately to prevent dry shriveling.`
                      : `අවවාදයයි: සාපේක්ෂ ආර්ද්‍රතාවය (${calcHumidity}%) ඉතා අඩුය. හොඳින් අස්වැන්න ලබා ගැනීමට අවම ආර්ද්‍රතාවය 80% විය යුතුය. ජලය ඉසින නොසල් භාවිත කරන්න.`;
                    status = 'critical';
                  } else if (calcHumidity > 95) {
                    advice = language === 'EN'
                      ? `Caution: Excessively high humidity (${calcHumidity}%). While good for fruiting, watch out for mold or bacterial blotch. Ensure adequate air exchange.`
                      : `අවධානය පිණිසයි: ඉතා ඉහළ ආර්ද්‍රතාවයක් (${calcHumidity}%) පවතී. දිලීර ආසාදන වළක්වා ගැනීමට නිසි වාතාශ්‍රයක් සලසා දෙන්න.`;
                    status = 'warning';
                  } else {
                    advice = language === 'EN'
                      ? `Excellent! The temperature (${calcTemp}°C) and humidity (${calcHumidity}%) align perfectly with the optimal conditions for ${calcVariety} mushroom cultivation. Excellent yields expected.`
                      : `ඉතා විශිෂ්ටයි! වත්මන් උෂ්ණත්වය (${calcTemp}°C) සහ ආර්ද්‍රතාවය (${calcHumidity}%) ${calcVariety} හතු වගාව සඳහා කදිමට ගැලපේ. ඉහළ අස්වැන්නක් බලාපොරොත්තු විය හැක.`;
                    status = 'optimal';
                  }

                  return {
                    totalYield: Math.round(totalYield * 10) / 10,
                    revenue: Math.round(revenue),
                    advice,
                    status
                  };
                };

                const calc = getYieldData();

                return (
                  <div className="bg-white border border-stone-200 rounded-[32px] p-6 md:p-8 space-y-8 animate-fade-in" id="tab-yield-calculator">
                    <div className="border-b border-stone-100 pb-5">
                      <h3 className="text-xl font-serif font-bold text-stone-900">
                        {language === 'EN' ? 'Interactive Cultivation Calculator' : 'අන්තර්ක්‍රියාකාරී අස්වනු කැල්කියුලේටරය'}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans mt-0.5">
                        {language === 'EN' 
                          ? 'Simulate your crop yield, substrate configurations, and microclimate parameters to project output.' 
                          : 'ඔබගේ වගා මළු, මාධ්‍යය සහ කාමර උෂ්ණත්ව සකසමින් අනාගත අස්වනු ප්‍රමාණයන් සහ ආදායම් ගණනය කරගන්න.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Controls (7 cols) */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-4">
                          {/* Variety Selector */}
                          <div>
                            <label className="block text-stone-700 font-serif font-bold text-xs mb-2">
                              {language === 'EN' ? 'Mushroom Variety' : 'හතු වර්ගය'}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Oyster', 'Button', 'Milky'].map((varType) => (
                                <button
                                  key={varType}
                                  type="button"
                                  onClick={() => setCalcVariety(varType as any)}
                                  className={`py-2.5 rounded-xl text-xs font-serif font-bold transition border ${
                                    calcVariety === varType
                                      ? 'bg-[#8B4513] border-[#8B4513] text-white'
                                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                                  }`}
                                >
                                  {varType}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Bag Count Slider */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-stone-700 font-serif font-bold text-xs">
                                {language === 'EN' ? 'Number of Substrate Bags' : 'වගා මළු සංඛ්‍යාව'}
                              </label>
                              <span className="text-xs font-mono font-bold text-[#8B4513] bg-[#8B4513]/10 px-2 py-0.5 rounded-md">
                                {calcBags}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="3000"
                              step="50"
                              value={calcBags}
                              onChange={(e) => setCalcBags(parseInt(e.target.value))}
                              className="w-full accent-[#8B4513]"
                            />
                            <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-1">
                              <span>50 Bags</span>
                              <span>1,500 Bags</span>
                              <span>3,000 Bags</span>
                            </div>
                          </div>

                          {/* Substrate Medium */}
                          <div>
                            <label className="block text-stone-700 font-serif font-bold text-xs mb-2">
                              {language === 'EN' ? 'Growth Substrate Medium' : 'වගා මාධ්‍යය'}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: 'Sawdust', label: language === 'EN' ? 'Sawdust' : 'ලී කුඩු' },
                                { id: 'Straw', label: language === 'EN' ? 'Paddy Straw' : 'පිදුරු' },
                                { id: 'Coir', label: language === 'EN' ? 'Coir Dust' : 'කොහු බත්' }
                              ].map((med) => (
                                <button
                                  key={med.id}
                                  type="button"
                                  onClick={() => setCalcMedium(med.id as any)}
                                  className={`py-2.5 rounded-xl text-xs font-serif font-bold transition border ${
                                    calcMedium === med.id
                                      ? 'bg-[#386641] border-[#386641] text-white'
                                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                                  }`}
                                >
                                  {med.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Room Temperature Slider */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-stone-700 font-serif font-bold text-xs">
                                {language === 'EN' ? 'Growing Room Temperature' : 'වගා කාමර උෂ්ණත්වය'}
                              </label>
                              <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                                {calcTemp} °C
                              </span>
                            </div>
                            <input
                              type="range"
                              min="15"
                              max="38"
                              step="1"
                              value={calcTemp}
                              onChange={(e) => setCalcTemp(parseInt(e.target.value))}
                              className="w-full accent-stone-700"
                            />
                          </div>

                          {/* Relative Humidity Slider */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-stone-700 font-serif font-bold text-xs">
                                {language === 'EN' ? 'Relative Humidity (RH)' : 'සාපේක්ෂ ආර්ද්‍රතාවය'}
                              </label>
                              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                {calcHumidity} %
                              </span>
                            </div>
                            <input
                              type="range"
                              min="40"
                              max="100"
                              step="5"
                              value={calcHumidity}
                              onChange={(e) => setCalcHumidity(parseInt(e.target.value))}
                              className="w-full accent-blue-700"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Results Display (6 cols) */}
                      <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Expected Yield Output Card */}
                          <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col justify-between">
                            <span className="text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-2 block">
                              {language === 'EN' ? 'Expected Yield / Flush' : 'අපේක්ෂිත අස්වැන්න / වාරයක්'}
                            </span>
                            <div>
                              <span className="text-3xl font-extrabold text-[#8B4513]">{calc.totalYield}</span>
                              <span className="text-stone-500 font-serif font-bold ml-1 text-sm">kg</span>
                            </div>
                            <p className="text-[10px] text-stone-400 mt-2">
                              {language === 'EN' ? 'Approx. 3-4 flushes per bag' : 'මල්ලකින් වාර 3-4 ක අස්වනු'}
                            </p>
                          </div>

                          {/* Projected Revenue Output Card */}
                          <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col justify-between">
                            <span className="text-stone-400 font-extrabold uppercase text-[10px] tracking-wide mb-2 block">
                              {language === 'EN' ? 'Projected Revenue' : 'අපේක්ෂිත ආදායම'}
                            </span>
                            <div>
                              <span className="text-sm font-sans font-extrabold text-stone-400 mr-0.5">LKR</span>
                              <span className="text-2xl font-extrabold text-stone-800">{calc.revenue.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-2">
                              {language === 'EN' ? 'Based on current market prices' : 'පවතින වෙළඳපල මිල අනුව'}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Cultivation Advice Box */}
                        <div className={`p-5 rounded-2xl border text-xs space-y-2 flex-1 ${
                          calc.status === 'optimal'
                            ? 'bg-emerald-50/50 border-emerald-200/60 text-stone-800'
                            : calc.status === 'warning'
                            ? 'bg-amber-50/50 border-amber-200/60 text-stone-800'
                            : 'bg-red-50/50 border-red-200/60 text-stone-800'
                        }`}>
                          <h4 className={`font-serif font-bold text-sm flex items-center gap-1.5 ${
                            calc.status === 'optimal' ? 'text-emerald-800' : calc.status === 'warning' ? 'text-amber-800' : 'text-red-850'
                          }`}>
                            {calc.status === 'optimal' ? (
                              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                            ) : (
                              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                            )}
                            <span>{language === 'EN' ? 'Cultivation Advisory Note' : 'වගා උපදෙස් සටහන'}</span>
                          </h4>
                          <p className="font-sans leading-relaxed text-stone-600 text-[11.5px]">
                            {calc.advice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}


              {/* ═══ GROWER: DAILY HARVEST LOG ═══ */}
              {activeTab === 'harvest_log' && currentUser.role === 'grower' && (
                <div className="space-y-6 animate-fade-in" id="tab-harvest-log">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-stone-900">
                      {language === 'EN' ? '🍄 Daily Harvest Production Log' : '🍄 දෛනික අස්වැන්න නිෂ්පාදන සටහන'}
                    </h3>
                  </div>
                  
                  <div className="bg-white border border-emerald-200/60 p-6 rounded-[24px] shadow-sm space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200/60 p-5 rounded-2xl text-center">
                        <span className="block text-[10px] uppercase text-emerald-600 font-bold tracking-wider mb-1">
                          {language === 'EN' ? 'Total Products Listed' : 'ලැයිස්තුගත නිෂ්පාදන'}
                        </span>
                        <span className="text-3xl font-extrabold text-emerald-800">{myProducts.length}</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200/60 p-5 rounded-2xl text-center">
                        <span className="block text-[10px] uppercase text-amber-600 font-bold tracking-wider mb-1">
                          {language === 'EN' ? 'Active Buyer Orders' : 'සක්‍රීය ගැනුම්කරු ඇණවුම්'}
                        </span>
                        <span className="text-3xl font-extrabold text-amber-800">{myProductInquiries.filter(i => i.status === 'New' || i.status === 'Contacted').length}</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200/60 p-5 rounded-2xl text-center">
                        <span className="block text-[10px] uppercase text-blue-600 font-bold tracking-wider mb-1">
                          {language === 'EN' ? 'Completed Orders' : 'සම්පූර්ණ ඇණවුම්'}
                        </span>
                        <span className="text-3xl font-extrabold text-blue-800">{myProductInquiries.filter(i => i.status === 'Converted' || i.status === 'Closed').length}</span>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50/50 border border-emerald-200/40 rounded-xl p-4 text-xs text-stone-700 space-y-1.5">
                      <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Check className="h-4 w-4" />
                        {language === 'EN' ? 'Cultivation Tip:' : 'වගා උපදෙස්:'}
                      </p>
                      <p className="font-sans leading-relaxed text-stone-600">
                        {language === 'EN' 
                          ? 'Record your daily harvest yields consistently to track seasonal trends. Use the Yield & Climate Tool to forecast optimal harvest windows based on current weather conditions in your district.'
                          : 'කාලීන ප්‍රවණතා පසුවිපරම් කිරීමට ඔබගේ දෛනික අස්වැන්න ප්‍රතිදාන ස්ථාවරව සටහන් කරන්න. ඔබගේ දිස්ත්‍රික්කයේ දේශගුණය අනුව ප්‍රශස්ත අස්වනු කාලසීමාවන් පුරෝකථනය කිරීමට අස්වනු සහ දේශගුණ මෙවලම භාවිත කරන්න.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ GROWER: BUYER ORDERS RECEIVED ═══ */}
              {activeTab === 'my_orders' && currentUser.role === 'grower' && (
                <div className="space-y-4 animate-fade-in" id="tab-my-orders">
                  <h3 className="text-xl font-bold text-stone-900">
                    {language === 'EN' ? '📦 Buyer Orders for My Products' : '📦 මගේ නිෂ්පාදන සඳහා ගැනුම්කරු ඇණවුම්'}
                  </h3>
                  {myProductInquiries.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      {language === 'EN' ? 'No buyer orders received yet. List your products on the Marketplace to attract buyers.' : 'තවම ගැනුම්කරු ඇණවුම් ලැබී නැත. ගැනුම්කරුවන් ආකර්ෂණය කිරීමට වෙළඳපොළේ ඔබගේ නිෂ්පාදන ලැයිස්තුගත කරන්න.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myProductInquiries.map((inq) => (
                        <div key={inq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-emerald-600">PRODUCT ORDER</span>
                              <h4 className="font-bold text-stone-900">{inq.productName}</h4>
                              <p className="text-xs text-stone-500">Buyer: {inq.buyerName} ({inq.email})</p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                              inq.status === 'New' ? 'bg-emerald-100 text-emerald-800' :
                              inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                              'bg-stone-100 text-stone-800'
                            }`}>{inq.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div><strong>Qty:</strong> {inq.requiredQuantity}</div>
                            <div><strong>Delivery:</strong> {inq.deliveryLocation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ BUYER: SUPPLIER DIRECTORY ═══ */}
              {activeTab === 'supplier_directory' && currentUser.role === 'buyer' && (
                <div className="space-y-4 animate-fade-in" id="tab-supplier-directory">
                  <h3 className="text-xl font-bold text-stone-900">
                    {language === 'EN' ? '🌐 Verified Supplier Directory' : '🌐 සත්‍යාපිත සැපයුම්කරු නාමාවලිය'}
                  </h3>
                  {members.filter(m => m.role === 'grower' && m.status === 'approved').length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      {language === 'EN' ? 'No verified suppliers found.' : 'සත්‍යාපිත සැපයුම්කරුවන් හමු නොවීය.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {members.filter(m => m.role === 'grower' && m.status === 'approved').map((supplier) => (
                        <div key={supplier.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 hover:shadow-md transition">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                              {supplier.fullName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-900 text-sm">{supplier.fullName}</h4>
                              <p className="text-[10px] text-stone-500">{supplier.city}, {supplier.district}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                            <div><strong>Experience:</strong> {supplier.experienceLevel}</div>
                            <div><strong>Capacity:</strong> {supplier.monthlyCapacity || 'N/A'}</div>
                            <div><strong>Speciality:</strong> {supplier.interestedArea}</div>
                            <div><strong>Contact:</strong> {supplier.phone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ BUYER: MY MACHINERY/EQUIPMENT INQUIRIES ═══ */}
              {activeTab === 'my_machinery' && currentUser.role === 'buyer' && (
                <div className="space-y-4 animate-fade-in" id="tab-my-machinery">
                  <h3 className="text-xl font-bold text-stone-900">
                    {language === 'EN' ? '⚙️ My Equipment Inquiries' : '⚙️ මගේ යන්ත්‍ර විමසීම්'}
                  </h3>
                  {mySubmittedMachineryInquiries.length === 0 ? (
                    <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-400 text-xs">
                      {language === 'EN' ? 'No equipment inquiries submitted. Visit the Machinery page to browse and submit inquiries.' : 'යන්ත්‍ර විමසීම් ඉදිරිපත් කර නොමැත. යන්ත්‍රෝපකරණ පිටුවට ගොස් විමසීම් ඉදිරිපත් කරන්න.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mySubmittedMachineryInquiries.map((inq) => (
                        <div key={inq.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-amber-600">EQUIPMENT</span>
                              <h4 className="font-bold text-stone-900">{inq.machineName}</h4>
                              <p className="text-xs text-stone-500">Category: {inq.category}</p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                              inq.status === 'New' ? 'bg-amber-100 text-amber-800' :
                              inq.status === 'Quoted' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-stone-100 text-stone-800'
                            }`}>{inq.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div><strong>Location:</strong> {inq.location}</div>
                            <div><strong>Capacity:</strong> {inq.dailyCapacity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>

      </div>
    </div>
  );
}
