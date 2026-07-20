import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, isFirebaseAvailable, disableFirebase } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function getActionMetadata(action: string): { op: OperationType; path: string } {
  const lower = action.toLowerCase();
  let op = OperationType.GET;
  let path = 'unknown';

  if (lower.includes('product')) {
    path = 'products';
  } else if (lower.includes('member')) {
    path = 'ecosystem_members';
  } else if (lower.includes('inquiry')) {
    path = 'buyer_inquiries';
  } else if (lower.includes('trainingprogram') || lower.includes('training_program')) {
    path = 'training_programs';
  } else if (lower.includes('trainingrequest') || lower.includes('training_request')) {
    path = 'training_requests';
  } else if (lower.includes('opportunityapplication') || lower.includes('opportunity_application')) {
    path = 'opportunity_applications';
  } else if (lower.includes('opportunity') || lower.includes('opportunities')) {
    path = 'opportunities';
  } else if (lower.includes('contact')) {
    path = 'contact_messages';
  } else if (lower.includes('announcement')) {
    path = 'announcements';
  } else if (lower.includes('userprofile') || lower.includes('user_profile') || lower.includes('user')) {
    path = 'users';
  }

  if (lower.startsWith('get')) {
    op = lower.includes('all') || lower.endsWith('s') ? OperationType.LIST : OperationType.GET;
  } else if (lower.startsWith('add') || lower.startsWith('create')) {
    op = OperationType.CREATE;
  } else if (lower.startsWith('update')) {
    op = OperationType.UPDATE;
  } else if (lower.startsWith('delete') || lower.startsWith('remove')) {
    op = OperationType.DELETE;
  }

  return { op, path };
}

function handleServiceError(action: string, error: any) {
  const errMsg = error?.message || String(error);
  if (
    errMsg.includes('offline') ||
    errMsg.includes('Failed to get document') ||
    errMsg.includes('unreachable') ||
    errMsg.includes('network') ||
    errMsg.includes('unavailable')
  ) {
    disableFirebase();
    console.warn(`Firebase is offline or unreachable during ${action}. Falling back to LocalStorage simulation.`, errMsg);
  } else if (
    errMsg.includes('permission') ||
    errMsg.includes('Permission') ||
    errMsg.includes('insufficient') ||
    errMsg.includes('denied')
  ) {
    const { op, path } = getActionMetadata(action);
    const errInfo: FirestoreErrorInfo = {
      error: errMsg,
      authInfo: {
        userId: auth?.currentUser?.uid || null,
        email: auth?.currentUser?.email || null,
        emailVerified: auth?.currentUser?.emailVerified || null,
        isAnonymous: auth?.currentUser?.isAnonymous || null,
        tenantId: auth?.currentUser?.tenantId || null,
        providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType: op,
      path: path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.error(`Firebase error during ${action}:`, error);
  }
}
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
  Announcement,
  UserRole,
  MachineryInquiry,
  AppNotification,
  SecurityAuditLog
} from '../types';

// ============================================================================
// MOCK / SEED DATA DEFINITIONS
// ============================================================================

const SEED_USERS: Record<string, UserProfile> = {};
const SEED_PRODUCTS: Product[] = [];
const SEED_MEMBERS: EcosystemMember[] = [];
const SEED_TRAINING: TrainingProgram[] = [];
const SEED_TRAINING_REQUESTS: TrainingRequest[] = [];
const SEED_OPPORTUNITIES: Opportunity[] = [];
const SEED_OPP_APPLICATIONS: OpportunityApplication[] = [];
const SEED_CONTACT_MESSAGES: ContactMessage[] = [];
const SEED_ANNOUNCEMENTS: Announcement[] = [];
const SEED_BUYER_INQUIRIES: BuyerInquiry[] = [];
const SEED_MACHINERY_INQUIRIES: MachineryInquiry[] = [];
const SEED_NOTIFICATIONS: AppNotification[] = [];
const SEED_SECURITY_LOGS: SecurityAuditLog[] = [];

// Local storage backing keys
const LS_PRODUCTS = 'mush_products_v2';
const LS_MEMBERS = 'mush_members_v2';
const LS_INQUIRIES = 'mush_inquiries_v2';
const LS_MACHINERY_INQUIRIES = 'mush_machinery_inquiries_v2';
const LS_TRAINING_REQS = 'mush_training_requests_v2';
const LS_TRAINING_PROGS = 'mush_training_programs_v2';
const LS_OPPORTUNITIES = 'mush_opportunities_v2';
const LS_OPP_APPS = 'mush_opportunity_applications_v2';
const LS_CONTACTS = 'mush_contacts_v2';
const LS_ANNOUNCEMENTS = 'mush_announcements_v2';
const LS_USERS = 'mush_users_v2';
const LS_NOTIFICATIONS = 'mush_notifications_v2';
const LS_SECURITY_LOGS = 'mush_security_logs_v2';

// ============================================================================
// STATE INITIALIZATION & HELPER METHODS
// ============================================================================

const loadStorageData = <T>(key: string, initial: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  } catch {
    return initial;
  }
};

const saveStorageData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('LocalStorage write failed:', error);
  }
};

// Initialize Simulated Database in LocalStorage
if (typeof window !== 'undefined') {
  loadStorageData(LS_PRODUCTS, SEED_PRODUCTS);
  loadStorageData(LS_MEMBERS, SEED_MEMBERS);
  loadStorageData(LS_TRAINING_PROGS, SEED_TRAINING);
  loadStorageData(LS_TRAINING_REQS, SEED_TRAINING_REQUESTS);
  loadStorageData(LS_OPPORTUNITIES, SEED_OPPORTUNITIES);
  loadStorageData(LS_OPP_APPS, SEED_OPP_APPLICATIONS);
  loadStorageData(LS_CONTACTS, SEED_CONTACT_MESSAGES);
  loadStorageData(LS_ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
  loadStorageData(LS_INQUIRIES, SEED_BUYER_INQUIRIES);
  loadStorageData(LS_MACHINERY_INQUIRIES, SEED_MACHINERY_INQUIRIES);
  loadStorageData(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
  loadStorageData(LS_SECURITY_LOGS, SEED_SECURITY_LOGS);
  
  // Make sure seed users are stored
  try {
    const existingUsers = localStorage.getItem(LS_USERS);
    if (!existingUsers) {
      localStorage.setItem(LS_USERS, JSON.stringify(SEED_USERS));
    }
  } catch (e) {
    console.error(e);
  }
}

// ============================================================================
// DATA SERVICE INTERFACE IMPLEMENTATION
// ============================================================================

export const dataService = {
  // General: check database mode
  isFirebase() {
    return isFirebaseAvailable;
  },

  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------
  async getProducts(): Promise<Product[]> {
    let list: Product[] = [];
    if (isFirebaseAvailable) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        // Real-world clean data: return Firestore contents directly if query succeeds
        const cleanedList = list.map((product) => {
          let imageUrl = product.imageUrl || '';
          if (imageUrl.includes('photo-1608797178974-15b35a61d121')) {
            imageUrl = 'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=400';
          } else if (imageUrl.includes('photo-1504198453319-5ce911bafcde')) {
            imageUrl = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400';
          }
          return { ...product, imageUrl };
        });
        return cleanedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getProducts, using local fallback:', e);
        list = loadStorageData<Product>(LS_PRODUCTS, SEED_PRODUCTS);
      }
    } else {
      list = loadStorageData<Product>(LS_PRODUCTS, SEED_PRODUCTS);
    }

    const cleanedList = list.map((product) => {
      let imageUrl = product.imageUrl || '';
      if (imageUrl.includes('photo-1608797178974-15b35a61d121')) {
        imageUrl = 'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=400';
      } else if (imageUrl.includes('photo-1504198453319-5ce911bafcde')) {
        imageUrl = 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400';
      }
      return { ...product, imageUrl };
    });

    return cleanedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'products'), newProduct);
        newProduct.id = docRef.id;
        // update local list to keep in sync for offline viewing
        const local = loadStorageData<Product>(LS_PRODUCTS, SEED_PRODUCTS);
        saveStorageData(LS_PRODUCTS, [newProduct, ...local]);
        return newProduct;
      } catch (e) {
        handleServiceError('addProduct', e);
      }
    }

    const local = loadStorageData<Product>(LS_PRODUCTS, SEED_PRODUCTS);
    const updated = [newProduct, ...local];
    saveStorageData(LS_PRODUCTS, updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, updates);
      } catch (e) {
        handleServiceError('updateProduct', e);
      }
    }
    const local = loadStorageData<Product>(LS_PRODUCTS, SEED_PRODUCTS);
    const updated = local.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveStorageData(LS_PRODUCTS, updated);
  },

  async deleteProduct(id: string): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (e) {
        handleServiceError('deleteProduct', e);
      }
    }
    const local = loadStorageData<Product>(LS_PRODUCTS, SEED_PRODUCTS);
    const updated = local.filter((p) => p.id !== id);
    saveStorageData(LS_PRODUCTS, updated);
  },

  // --------------------------------------------------------------------------
  // ECOSYSTEM MEMBERS
  // --------------------------------------------------------------------------
  async getMembers(): Promise<EcosystemMember[]> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, 'ecosystem_members'));
        const list: EcosystemMember[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as EcosystemMember);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getMembers, using local fallback:', e);
      }
    }
    return loadStorageData<EcosystemMember>(LS_MEMBERS, SEED_MEMBERS)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addMember(member: Omit<EcosystemMember, 'id' | 'createdAt'>): Promise<EcosystemMember> {
    const newMember: EcosystemMember = {
      ...member,
      id: 'member_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'ecosystem_members'), newMember);
        newMember.id = docRef.id;
        const local = loadStorageData<EcosystemMember>(LS_MEMBERS, SEED_MEMBERS);
        saveStorageData(LS_MEMBERS, [newMember, ...local]);
        return newMember;
      } catch (e) {
        handleServiceError('addMember', e);
      }
    }

    const local = loadStorageData<EcosystemMember>(LS_MEMBERS, SEED_MEMBERS);
    saveStorageData(LS_MEMBERS, [newMember, ...local]);
    return newMember;
  },

  async updateMemberStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'ecosystem_members', id), { status });
      } catch (e) {
        handleServiceError('updateMemberStatus', e);
      }
    }
    const local = loadStorageData<EcosystemMember>(LS_MEMBERS, SEED_MEMBERS);
    const updated = local.map((m) => (m.id === id ? { ...m, status } : m));
    saveStorageData(LS_MEMBERS, updated);

    // If approved, create/update corresponding profile status
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    const member = local.find(m => m.id === id);
    if (member) {
      const emailMatch = Object.values(users).find((u: any) => u.email === member.email) as any;
      if (emailMatch) {
        emailMatch.status = status;
        users[emailMatch.uid] = emailMatch;
        localStorage.setItem(LS_USERS, JSON.stringify(users));
        if (isFirebaseAvailable && auth?.currentUser) {
          try {
            await updateDoc(doc(db, 'users', emailMatch.uid), { status });
          } catch {}
        }
      }
    }
  },

  // --------------------------------------------------------------------------
  // BUYER INQUIRIES
  // --------------------------------------------------------------------------
  async getInquiries(): Promise<BuyerInquiry[]> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, 'buyer_inquiries'));
        const list: BuyerInquiry[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as BuyerInquiry);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getInquiries, using local fallback:', e);
      }
    }
    return loadStorageData<BuyerInquiry>(LS_INQUIRIES, SEED_BUYER_INQUIRIES)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addInquiry(inquiry: Omit<BuyerInquiry, 'id' | 'createdAt'>): Promise<BuyerInquiry> {
    const newInquiry: BuyerInquiry = {
      ...inquiry,
      id: 'inq_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'buyer_inquiries'), newInquiry);
        newInquiry.id = docRef.id;
        const local = loadStorageData<BuyerInquiry>(LS_INQUIRIES, SEED_BUYER_INQUIRIES);
        saveStorageData(LS_INQUIRIES, [newInquiry, ...local]);
        return newInquiry;
      } catch (e) {
        handleServiceError('addInquiry', e);
      }
    }

    const local = loadStorageData<BuyerInquiry>(LS_INQUIRIES, SEED_BUYER_INQUIRIES);
    saveStorageData(LS_INQUIRIES, [newInquiry, ...local]);
    return newInquiry;
  },

  async updateInquiryStatus(id: string, status: BuyerInquiry['status']): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'buyer_inquiries', id), { status });
      } catch (e) {
        handleServiceError('updateInquiryStatus', e);
      }
    }
    const local = loadStorageData<BuyerInquiry>(LS_INQUIRIES, SEED_BUYER_INQUIRIES);
    const updated = local.map((i) => (i.id === id ? { ...i, status } : i));
    saveStorageData(LS_INQUIRIES, updated);
  },

  // --------------------------------------------------------------------------
  // TRAINING PROGRAMS
  // --------------------------------------------------------------------------
  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    if (isFirebaseAvailable) {
      try {
        const querySnapshot = await getDocs(collection(db, 'training_programs'));
        const list: TrainingProgram[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as TrainingProgram);
        });
        return list;
      } catch (e) {
        console.warn('Firebase error in getTrainingPrograms, using local fallback:', e);
      }
    }
    return loadStorageData<TrainingProgram>(LS_TRAINING_PROGS, SEED_TRAINING);
  },

  async addTrainingProgram(program: Omit<TrainingProgram, 'id' | 'createdAt'>): Promise<TrainingProgram> {
    const newProg: TrainingProgram = {
      ...program,
      id: 'train_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'training_programs'), newProg);
        newProg.id = docRef.id;
        const local = loadStorageData<TrainingProgram>(LS_TRAINING_PROGS, SEED_TRAINING);
        saveStorageData(LS_TRAINING_PROGS, [newProg, ...local]);
        return newProg;
      } catch (e) {
        handleServiceError('addTrainingProgram', e);
      }
    }

    const local = loadStorageData<TrainingProgram>(LS_TRAINING_PROGS, SEED_TRAINING);
    saveStorageData(LS_TRAINING_PROGS, [newProg, ...local]);
    return newProg;
  },

  // --------------------------------------------------------------------------
  // TRAINING REQUESTS
  // --------------------------------------------------------------------------
  async getTrainingRequests(): Promise<TrainingRequest[]> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, 'training_requests'));
        const list: TrainingRequest[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as TrainingRequest);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getTrainingRequests, using local fallback:', e);
      }
    }
    return loadStorageData<TrainingRequest>(LS_TRAINING_REQS, SEED_TRAINING_REQUESTS)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addTrainingRequest(req: Omit<TrainingRequest, 'id' | 'createdAt'>): Promise<TrainingRequest> {
    const newReq: TrainingRequest = {
      ...req,
      id: 'trq_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'training_requests'), newReq);
        newReq.id = docRef.id;
        const local = loadStorageData<TrainingRequest>(LS_TRAINING_REQS, SEED_TRAINING_REQUESTS);
        saveStorageData(LS_TRAINING_REQS, [newReq, ...local]);
        return newReq;
      } catch (e) {
        handleServiceError('addTrainingRequest', e);
      }
    }

    const local = loadStorageData<TrainingRequest>(LS_TRAINING_REQS, SEED_TRAINING_REQUESTS);
    saveStorageData(LS_TRAINING_REQS, [newReq, ...local]);
    return newReq;
  },

  async updateTrainingRequestStatus(id: string, status: TrainingRequest['status']): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'training_requests', id), { status });
      } catch (e) {
        handleServiceError('updateTrainingRequestStatus', e);
      }
    }
    const local = loadStorageData<TrainingRequest>(LS_TRAINING_REQS, SEED_TRAINING_REQUESTS);
    const updated = local.map((r) => (r.id === id ? { ...r, status } : r));
    saveStorageData(LS_TRAINING_REQS, updated);
  },

  // --------------------------------------------------------------------------
  // OPPORTUNITIES
  // --------------------------------------------------------------------------
  async getOpportunities(): Promise<Opportunity[]> {
    if (isFirebaseAvailable) {
      try {
        const querySnapshot = await getDocs(collection(db, 'opportunities'));
        const list: Opportunity[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Opportunity);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getOpportunities, using local fallback:', e);
      }
    }
    return loadStorageData<Opportunity>(LS_OPPORTUNITIES, SEED_OPPORTUNITIES)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addOpportunity(opportunity: Omit<Opportunity, 'id' | 'createdAt'>): Promise<Opportunity> {
    const newOpp: Opportunity = {
      ...opportunity,
      id: 'opp_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'opportunities'), newOpp);
        newOpp.id = docRef.id;
        const local = loadStorageData<Opportunity>(LS_OPPORTUNITIES, SEED_OPPORTUNITIES);
        saveStorageData(LS_OPPORTUNITIES, [newOpp, ...local]);
        return newOpp;
      } catch (e) {
        handleServiceError('addOpportunity', e);
      }
    }

    const local = loadStorageData<Opportunity>(LS_OPPORTUNITIES, SEED_OPPORTUNITIES);
    saveStorageData(LS_OPPORTUNITIES, [newOpp, ...local]);
    return newOpp;
  },

  async updateOpportunityStatus(id: string, status: 'Active' | 'Closed'): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'opportunities', id), { status });
      } catch (e) {
        handleServiceError('updateOpportunityStatus', e);
      }
    }
    const local = loadStorageData<Opportunity>(LS_OPPORTUNITIES, SEED_OPPORTUNITIES);
    const updated = local.map((o) => (o.id === id ? { ...o, status } : o));
    saveStorageData(LS_OPPORTUNITIES, updated);
  },

  async deleteOpportunity(id: string): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'opportunities', id));
      } catch (e) {
        handleServiceError('deleteOpportunity', e);
      }
    }
    const local = loadStorageData<Opportunity>(LS_OPPORTUNITIES, SEED_OPPORTUNITIES);
    const updated = local.filter((o) => o.id !== id);
    saveStorageData(LS_OPPORTUNITIES, updated);
  },

  // --------------------------------------------------------------------------
  // OPPORTUNITY APPLICATIONS
  // --------------------------------------------------------------------------
  async getOpportunityApplications(): Promise<OpportunityApplication[]> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, 'opportunity_applications'));
        const list: OpportunityApplication[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as OpportunityApplication);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getOpportunityApplications, using local fallback:', e);
      }
    }
    return loadStorageData<OpportunityApplication>(LS_OPP_APPS, SEED_OPP_APPLICATIONS)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addOpportunityApplication(appln: Omit<OpportunityApplication, 'id' | 'createdAt'>): Promise<OpportunityApplication> {
    const newApp: OpportunityApplication = {
      ...appln,
      id: 'oap_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'opportunity_applications'), newApp);
        newApp.id = docRef.id;
        const local = loadStorageData<OpportunityApplication>(LS_OPP_APPS, SEED_OPP_APPLICATIONS);
        saveStorageData(LS_OPP_APPS, [newApp, ...local]);
        return newApp;
      } catch (e) {
        handleServiceError('addOpportunityApplication', e);
      }
    }

    const local = loadStorageData<OpportunityApplication>(LS_OPP_APPS, SEED_OPP_APPLICATIONS);
    saveStorageData(LS_OPP_APPS, [newApp, ...local]);
    return newApp;
  },

  async updateOpportunityApplicationStatus(id: string, status: OpportunityApplication['status']): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'opportunity_applications', id), { status });
      } catch (e) {
        handleServiceError('updateOpportunityApplicationStatus', e);
      }
    }
    const local = loadStorageData<OpportunityApplication>(LS_OPP_APPS, SEED_OPP_APPLICATIONS);
    const updated = local.map((a) => (a.id === id ? { ...a, status } : a));
    saveStorageData(LS_OPP_APPS, updated);
  },

  // --------------------------------------------------------------------------
  // CONTACT MESSAGES
  // --------------------------------------------------------------------------
  async getContactMessages(): Promise<ContactMessage[]> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, 'contact_messages'));
        const list: ContactMessage[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ContactMessage);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getContactMessages, using local fallback:', e);
      }
    }
    return loadStorageData<ContactMessage>(LS_CONTACTS, SEED_CONTACT_MESSAGES)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable) {
      try {
        const docRef = await addDoc(collection(db, 'contact_messages'), newMsg);
        newMsg.id = docRef.id;
        const local = loadStorageData<ContactMessage>(LS_CONTACTS, SEED_CONTACT_MESSAGES);
        saveStorageData(LS_CONTACTS, [newMsg, ...local]);
        return newMsg;
      } catch (e) {
        handleServiceError('addContactMessage', e);
      }
    }

    const local = loadStorageData<ContactMessage>(LS_CONTACTS, SEED_CONTACT_MESSAGES);
    saveStorageData(LS_CONTACTS, [newMsg, ...local]);
    return newMsg;
  },

  // --------------------------------------------------------------------------
  // ANNOUNCEMENTS
  // --------------------------------------------------------------------------
  async getAnnouncements(): Promise<Announcement[]> {
    if (isFirebaseAvailable) {
      try {
        const querySnapshot = await getDocs(collection(db, 'announcements'));
        const list: Announcement[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Announcement);
        });
        return list;
      } catch (e) {
        console.warn('Firebase error in getAnnouncements, using local fallback:', e);
      }
    }
    return loadStorageData<Announcement>(LS_ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
  },

  async addAnnouncement(ann: Omit<Announcement, 'id'>): Promise<Announcement> {
    const newAnn: Announcement = {
      ...ann,
      id: 'ann_' + Math.random().toString(36).substr(2, 9)
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'announcements'), newAnn);
        newAnn.id = docRef.id;
        const local = loadStorageData<Announcement>(LS_ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
        saveStorageData(LS_ANNOUNCEMENTS, [newAnn, ...local]);
        return newAnn;
      } catch (e) {
        handleServiceError('addAnnouncement', e);
      }
    }

    const local = loadStorageData<Announcement>(LS_ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    saveStorageData(LS_ANNOUNCEMENTS, [newAnn, ...local]);
    return newAnn;
  },

  // --------------------------------------------------------------------------
  // MACHINERY INQUIRIES
  // --------------------------------------------------------------------------
  async getMachineryInquiries(): Promise<MachineryInquiry[]> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, 'machinery_inquiries'));
        const list: MachineryInquiry[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as MachineryInquiry);
        });
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (e) {
        console.warn('Firebase error in getMachineryInquiries, using local fallback:', e);
      }
    }
    return loadStorageData<MachineryInquiry>(LS_MACHINERY_INQUIRIES, SEED_MACHINERY_INQUIRIES)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addMachineryInquiry(inquiry: Omit<MachineryInquiry, 'id' | 'createdAt'>): Promise<MachineryInquiry> {
    const newInquiry: MachineryInquiry = {
      ...inquiry,
      id: 'mac_inq_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'machinery_inquiries'), newInquiry);
        newInquiry.id = docRef.id;
        const local = loadStorageData<MachineryInquiry>(LS_MACHINERY_INQUIRIES, SEED_MACHINERY_INQUIRIES);
        saveStorageData(LS_MACHINERY_INQUIRIES, [newInquiry, ...local]);
        return newInquiry;
      } catch (e) {
        console.warn('Firebase addMachineryInquiry error, falling back to local storage:', e);
      }
    }

    const local = loadStorageData<MachineryInquiry>(LS_MACHINERY_INQUIRIES, SEED_MACHINERY_INQUIRIES);
    saveStorageData(LS_MACHINERY_INQUIRIES, [newInquiry, ...local]);
    return newInquiry;
  },

  async updateMachineryInquiryStatus(id: string, status: MachineryInquiry['status']): Promise<void> {
    if (isFirebaseAvailable && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'machinery_inquiries', id), { status });
      } catch (e) {
        console.warn('Firebase updateMachineryInquiryStatus error, falling back to local storage:', e);
      }
    }
    const local = loadStorageData<MachineryInquiry>(LS_MACHINERY_INQUIRIES, SEED_MACHINERY_INQUIRIES);
    const updated = local.map((i) => (i.id === id ? { ...i, status } : i));
    saveStorageData(LS_MACHINERY_INQUIRIES, updated);
  },

  // --------------------------------------------------------------------------
  // USER PROFILES & AUTHENTICATION (DUAL-MODE)
  // --------------------------------------------------------------------------
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    // Immediate local bypass for sandbox seed quick-logins to guarantee instant role access
    if (uid === 'admin-uid' || uid === 'grower-uid' || uid === 'buyer-uid' || uid === 'trainer-uid' || uid === 'partner-uid' || uid === 'staff-uid') {
      const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
      return users[uid] || SEED_USERS[uid] || null;
    }

    if (isFirebaseAvailable) {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (e) {
        console.warn('Firebase error fetching user profile, falling back to local simulation:', e);
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    return users[uid] || null;
  },

  async createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<UserProfile> {
    const serial = Math.floor(1000 + Math.random() * 9000);
    const newProfile: UserProfile = {
      bio: 'Eco-system member passionate about organic mushroom cultivation in Sri Lanka.',
      preferredLanguage: 'EN',
      membershipId: `LK-MUSH-${serial}`,
      licenseNumber: `COOP-REG-${serial}`,
      productionArea: '500 sq ft',
      gpsCoordinates: '6.9271° N, 79.8612° E',
      ...profile,
      uid,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable && auth?.currentUser && auth.currentUser.uid === uid) {
      try {
        await setDoc(doc(db, 'users', uid), newProfile);
      } catch (e) {
        handleServiceError('createUserProfile', e);
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    users[uid] = newProfile;
    localStorage.setItem(LS_USERS, JSON.stringify(users));

    // Also if they register as an ecosystem member automatically
    if (profile.role !== 'admin') {
      await this.addMember({
        fullName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
        district: profile.district || 'Colombo',
        city: profile.city || '',
        role: profile.role,
        experienceLevel: profile.experienceLevel || 'Beginner',
        interestedArea: profile.interestedArea || 'Fresh mushroom growing',
        monthlyCapacity: profile.monthlyCapacity || '0kg',
        message: profile.message || 'Auto-registered during user sign up.',
        status: profile.status
      });
    }

    return newProfile;
  },

  async findProfileByEmail(email: string): Promise<UserProfile | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data() as UserProfile;
        }
      } catch (e) {
        console.warn('Firebase query where email failed, retrieving all profiles to scan:', e);
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          let found: UserProfile | null = null;
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as UserProfile;
            if (data.email && data.email.trim().toLowerCase() === cleanEmail) {
              found = data;
            }
          });
          if (found) return found;
        } catch (err) {
          console.error('All profile scan failed:', err);
        }
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    const matched = Object.values(users).find(
      (u: any) => u.email && u.email.trim().toLowerCase() === cleanEmail
    ) as UserProfile | undefined;
    if (matched) return matched;

    // Check seed profiles
    const matchedSeed = Object.values(SEED_USERS).find(
      (u: any) => u.email && u.email.trim().toLowerCase() === cleanEmail
    ) as UserProfile | undefined;
    return matchedSeed || null;
  },

  async findProfileByPhone(phone: string): Promise<UserProfile | null> {
    const cleanPhone = phone.trim();
    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'users'), where('phone', '==', cleanPhone));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data() as UserProfile;
        }
      } catch (e) {
        console.warn('Firebase query where phone failed, retrieving all profiles to scan:', e);
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          let found: UserProfile | null = null;
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as UserProfile;
            if (data.phone && data.phone.trim() === cleanPhone) {
              found = data;
            }
          });
          if (found) return found;
        } catch (err) {
          console.error('All profile scan failed:', err);
        }
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    const matched = Object.values(users).find(
      (u: any) => u.phone && u.phone.trim() === cleanPhone
    ) as UserProfile | undefined;
    if (matched) return matched;

    // Check seed profiles
    const matchedSeed = Object.values(SEED_USERS).find(
      (u: any) => u.phone && u.phone.trim() === cleanPhone
    ) as UserProfile | undefined;
    return matchedSeed || null;
  },

  async getAllUserProfiles(): Promise<UserProfile[]> {
    if (isFirebaseAvailable) {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const list: UserProfile[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        });
        return list;
      } catch (e) {
        handleServiceError('getAllUserProfiles', e);
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    return Object.values(users);
  },

  async updateUserProfileRoleAndStatus(uid: string, role: UserRole, status: UserProfile['status']): Promise<void> {
    if (isFirebaseAvailable) {
      try {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { role, status });
      } catch (e) {
        handleServiceError('updateUserProfileRoleAndStatus', e);
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    if (users[uid]) {
      users[uid].role = role;
      users[uid].status = status;
      localStorage.setItem(LS_USERS, JSON.stringify(users));
    }
  },

  async deleteUserProfile(uid: string): Promise<void> {
    if (isFirebaseAvailable) {
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (e) {
        handleServiceError('deleteUserProfile', e);
      }
    }
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
    delete users[uid];
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  },

  // Seed / Reset the mock local database
  resetToSeeds() {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(LS_MEMBERS, JSON.stringify(SEED_MEMBERS));
    localStorage.setItem(LS_TRAINING_PROGS, JSON.stringify(SEED_TRAINING));
    localStorage.setItem(LS_TRAINING_REQS, JSON.stringify(SEED_TRAINING_REQUESTS));
    localStorage.setItem(LS_OPPORTUNITIES, JSON.stringify(SEED_OPPORTUNITIES));
    localStorage.setItem(LS_OPP_APPS, JSON.stringify(SEED_OPP_APPLICATIONS));
    localStorage.setItem(LS_CONTACTS, JSON.stringify(SEED_CONTACT_MESSAGES));
    localStorage.setItem(LS_ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem(LS_INQUIRIES, JSON.stringify(SEED_BUYER_INQUIRIES));
    localStorage.setItem(LS_USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(LS_NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(LS_SECURITY_LOGS, JSON.stringify(SEED_SECURITY_LOGS));
  },

  // --------------------------------------------------------------------------
  // FIRESTORE DATABASE INITIAL SEEDING & CLEARING METHODS (REAL WORLD MANAGEMENT)
  // --------------------------------------------------------------------------
  async seedFirestore(): Promise<void> {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase services are offline or not configured. Cannot seed Firestore.");
    }

    const seedCollection = async (collName: string, items: any[]) => {
      const collRef = collection(db, collName);
      const snap = await getDocs(collRef);
      if (snap.empty) {
        console.log(`Seeding Firestore collection: ${collName} (${items.length} items)`);
        for (const item of items) {
          const { id, ...data } = item;
          if (id) {
            await setDoc(doc(db, collName, id), data);
          } else {
            await addDoc(collRef, data);
          }
        }
      }
    };

    // Seed primary business collections
    await seedCollection('products', SEED_PRODUCTS);
    await seedCollection('ecosystem_members', SEED_MEMBERS);
    await seedCollection('buyer_inquiries', SEED_BUYER_INQUIRIES);
    await seedCollection('training_programs', SEED_TRAINING);
    await seedCollection('training_requests', SEED_TRAINING_REQUESTS);
    await seedCollection('opportunities', SEED_OPPORTUNITIES);
    await seedCollection('opportunity_applications', SEED_OPP_APPLICATIONS);
    await seedCollection('contact_messages', SEED_CONTACT_MESSAGES);
    await seedCollection('announcements', SEED_ANNOUNCEMENTS);
    await seedCollection('machinery_inquiries', SEED_MACHINERY_INQUIRIES);

    // Seed user profiles for demo accounts
    for (const [uid, profile] of Object.entries(SEED_USERS)) {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, profile);
      }
    }
  },

  async clearFirestore(): Promise<void> {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase is offline. Cannot clear Firestore.");
    }

    const collectionsToClear = [
      'products',
      'ecosystem_members',
      'buyer_inquiries',
      'training_programs',
      'training_requests',
      'opportunities',
      'opportunity_applications',
      'contact_messages',
      'announcements',
      'machinery_inquiries',
      'notifications',
      'security_logs'
    ];

    for (const collName of collectionsToClear) {
      const snap = await getDocs(collection(db, collName));
      for (const docSnap of snap.docs) {
        await deleteDoc(docSnap.ref);
      }
    }
  },

  // --- NOTIFICATIONS SERVICE LAYER ---
  async getNotifications(userId: string): Promise<AppNotification[]> {
    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: AppNotification[] = [];
        querySnapshot.forEach((docSnap) => {
          const item = { id: docSnap.id, ...docSnap.data() } as AppNotification;
          if (item.userId === 'public' || item.userId === userId) {
            list.push(item);
          }
        });
        return list;
      } catch (e) {
        console.warn('Firebase getNotifications failed, falling back to local storage:', e);
      }
    }
    const local = loadStorageData<AppNotification>(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
    return local
      .filter(n => n.userId === 'public' || n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addNotification(notif: Omit<AppNotification, 'id' | 'createdAt'>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable) {
      try {
        const docRef = await addDoc(collection(db, 'notifications'), newNotif);
        newNotif.id = docRef.id;
        const local = loadStorageData<AppNotification>(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
        saveStorageData(LS_NOTIFICATIONS, [newNotif, ...local]);
        return newNotif;
      } catch (e) {
        console.warn('Firebase addNotification error, falling back to local storage:', e);
      }
    }

    const local = loadStorageData<AppNotification>(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
    saveStorageData(LS_NOTIFICATIONS, [newNotif, ...local]);
    return newNotif;
  },

  async markNotificationAsRead(id: string): Promise<void> {
    if (isFirebaseAvailable) {
      try {
        await updateDoc(doc(db, 'notifications', id), { read: true });
      } catch (e) {
        console.warn('Firebase markNotificationAsRead failed:', e);
      }
    }
    const local = loadStorageData<AppNotification>(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
    const updated = local.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveStorageData(LS_NOTIFICATIONS, updated);
  },

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const local = loadStorageData<AppNotification>(LS_NOTIFICATIONS, SEED_NOTIFICATIONS);
    if (isFirebaseAvailable) {
      try {
        const batchUpdates = local
          .filter(n => (n.userId === 'public' || n.userId === userId) && !n.read)
          .map(async (n) => {
            try {
              await updateDoc(doc(db, 'notifications', n.id), { read: true });
            } catch (err) {
              // ignore
            }
          });
        await Promise.all(batchUpdates);
      } catch (e) {
        console.warn('Firebase markAllNotificationsAsRead failed:', e);
      }
    }
    const updated = local.map((n) => 
      (n.userId === 'public' || n.userId === userId) ? { ...n, read: true } : n
    );
    saveStorageData(LS_NOTIFICATIONS, updated);
  },

  // --- SECURITY AUDIT LOGGING SERVICE LAYER ---
  async getSecurityAuditLogs(): Promise<SecurityAuditLog[]> {
    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'security_logs'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: SecurityAuditLog[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as SecurityAuditLog);
        });
        return list;
      } catch (e) {
        console.warn('Firebase getSecurityAuditLogs failed, falling back to local storage:', e);
      }
    }
    return loadStorageData<SecurityAuditLog>(LS_SECURITY_LOGS, SEED_SECURITY_LOGS)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addSecurityAuditLog(log: Omit<SecurityAuditLog, 'id' | 'createdAt'>): Promise<SecurityAuditLog> {
    const newLog: SecurityAuditLog = {
      ...log,
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable) {
      try {
        const docRef = await addDoc(collection(db, 'security_logs'), newLog);
        newLog.id = docRef.id;
        const local = loadStorageData<SecurityAuditLog>(LS_SECURITY_LOGS, SEED_SECURITY_LOGS);
        saveStorageData(LS_SECURITY_LOGS, [newLog, ...local]);
        return newLog;
      } catch (e) {
        console.warn('Firebase addSecurityAuditLog error:', e);
      }
    }

    const local = loadStorageData<SecurityAuditLog>(LS_SECURITY_LOGS, SEED_SECURITY_LOGS);
    saveStorageData(LS_SECURITY_LOGS, [newLog, ...local]);
    return newLog;
  }
};
