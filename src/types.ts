export type UserRole = 'admin' | 'grower' | 'buyer' | 'trainer' | 'partner' | 'staff';

export interface UserProfile {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  district?: string;
  city?: string;
  experienceLevel?: string;
  interestedArea?: string;
  monthlyCapacity?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  // Enriched real-world attributes
  membershipId?: string;
  bio?: string;
  preferredLanguage?: 'EN' | 'SI';
  licenseNumber?: string;
  productionArea?: string;
  gpsCoordinates?: string;
  password?: string;
}

export interface EcosystemMember {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  role: UserRole;
  experienceLevel: string;
  interestedArea: string;
  monthlyCapacity: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  district: string;
  supplierName: string;
  supplierId: string;
  minimumOrder: string;
  monthlyCapacity: string;
  priceRange: string;
  imageUrl: string;
  status: 'Available' | 'Out of Stock';
  createdAt: string;
}

export interface BuyerInquiry {
  id: string;
  buyerName: string;
  phone: string;
  email: string;
  productId: string;
  productName: string;
  requiredQuantity: string;
  deliveryLocation: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Converted' | 'Closed';
  createdAt: string;
  supplierId: string;
  buyerId?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  whoItIsFor: string;
  duration: string;
  format: string; // 'Online' | 'In-person' | 'Hybrid'
  createdAt: string;
}

export interface TrainingRequest {
  id: string;
  name: string;
  phone: string;
  district: string;
  trainingInterest: string; // training program ID or custom name
  preferredFormat: string;
  message: string;
  status: 'New' | 'Contacted' | 'Scheduled' | 'Completed';
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: string; // 'Requirement' | 'Supply' | 'Partnership' | 'Training'
  district: string;
  status: 'Active' | 'Closed';
  details: string;
  createdAt: string;
}

export interface OpportunityApplication {
  id: string;
  name: string;
  phone: string;
  role: string;
  message: string;
  opportunityId: string;
  opportunityTitle: string;
  status: 'New' | 'Reviewed' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'Info' | 'Urgent' | 'Success';
  date: string;
}

export interface MachineryInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  machineName: string;
  category: string;
  intendedProduct: string;
  dailyCapacity: string;
  location: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Quoted' | 'Closed';
  createdAt: string;
}

export interface MachineItem {
  id: string;
  category?: 'powders' | 'culinary' | 'snacks';
  nameEN: string;
  nameSI: string;
  descriptionEN: string;
  descriptionSI: string;
  featuresEN: string[];
  featuresSI: string[];
  specs: {
    capacity: string;
    power: string;
    material: string;
    weight: string;
  };
  priceRange: string;
  imageUrl: string;
  tags: string[];
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // 'public' or specific user's uid
  title: string;
  message: string;
  type: 'info' | 'security' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}


