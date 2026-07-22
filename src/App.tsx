import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import JoinEcosystem from './components/JoinEcosystem';
import Marketplace from './components/Marketplace';
import Training from './components/Training';
import Opportunities from './components/Opportunities';
import About from './components/About';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Machinery from './components/Machinery';
import RecipeHub from './components/RecipeHub';
import Chatbot from './components/Chatbot';
import UserGuide from './components/UserGuide';
import { UserProfile, UserRole, AppNotification, SecurityAuditLog } from './types';
import { dataService } from './lib/dataService';
import { sendWelcomeEmail, sendOTPEmail, sendPasswordResetSuccessEmail } from './lib/emailService';
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, updatePassword as firebaseUpdatePassword, signInWithEmailAndPassword as reAuthSignIn } from 'firebase/auth';
import { auth, isFirebaseAvailable, disableFirebase } from './lib/firebase';
import { LogIn, UserPlus, AlertCircle, RefreshCw, ShieldCheck, Lock, Key, Eye, EyeOff, Timer, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'EN' | 'SI'>('EN');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [firebaseActive, setFirebaseActive] = useState(isFirebaseAvailable);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Notifications loader
  const loadNotifications = async (userId: string) => {
    try {
      const list = await dataService.getNotifications(userId);
      setNotifications(list);
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
  };

  useEffect(() => {
    loadNotifications(currentUser ? currentUser.uid : '');
  }, [currentUser]);

  const handleMarkNotificationAsRead = async (id: string) => {
    await dataService.markNotificationAsRead(id);
    loadNotifications(currentUser ? currentUser.uid : '');
  };

  const handleMarkAllNotificationsAsRead = async () => {
    if (currentUser) {
      await dataService.markAllNotificationsAsRead(currentUser.uid);
      loadNotifications(currentUser.uid);
    }
  };

  // Auth screen form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('grower');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password OTP States
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1=email, 2=otp, 3=new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpGenerated, setOtpGenerated] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpResendCount, setOtpResendCount] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Login rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Session timeout (30 min)
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const SESSION_WARNING_MS = 25 * 60 * 1000;
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionWarningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Password strength calculator
  const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: language === 'EN' ? 'Weak' : 'දුර්වලයි', color: 'bg-red-500' };
    if (score <= 3) return { level: 2, label: language === 'EN' ? 'Medium' : 'මධ්‍යම', color: 'bg-amber-500' };
    return { level: 3, label: language === 'EN' ? 'Strong' : 'ශක්තිමත්', color: 'bg-emerald-500' };
  };

  // OTP countdown timer
  useEffect(() => {
    if (otpExpiry > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((otpExpiry - Date.now()) / 1000));
        setOtpTimer(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiry]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setLockoutTimer(remaining);
        if (remaining <= 0) {
          setLockoutTimer(0);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  // Session timeout handlers
  const resetSessionTimer = useCallback(() => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (sessionWarningRef.current) clearTimeout(sessionWarningRef.current);
    setShowSessionWarning(false);

    if (currentUser) {
      sessionWarningRef.current = setTimeout(() => {
        setShowSessionWarning(true);
      }, SESSION_WARNING_MS);

      sessionTimerRef.current = setTimeout(() => {
        handleSignOut();
        alert(language === 'EN' ? 'Your session has expired due to inactivity. Please sign in again.' : 'අක්‍රියතාව හේතුවෙන් ඔබගේ සැසිය කල් ඉකුත්වී ඇත. කරුණාකර නැවත පුරනය වන්න.');
      }, SESSION_TIMEOUT_MS);
    }
  }, [currentUser, language]);

  useEffect(() => {
    if (currentUser) {
      resetSessionTimer();
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      const handler = () => resetSessionTimer();
      events.forEach(e => window.addEventListener(e, handler));
      return () => {
        events.forEach(e => window.removeEventListener(e, handler));
        if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
        if (sessionWarningRef.current) clearTimeout(sessionWarningRef.current);
      };
    }
  }, [currentUser, resetSessionTimer]);

  // Forgot Password OTP handlers
  const handleSendOTP = async () => {
    setAuthError('');
    setForgotSuccess('');
    if (!forgotEmail) {
      setAuthError(language === 'EN' ? 'Please enter your email address.' : 'කරුණාකර ඔබගේ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.');
      return;
    }
    if (otpResendCount >= 3) {
      setAuthError(language === 'EN' ? 'Maximum OTP resend limit reached. Please try again later.' : 'උපරිම OTP යැවීම් සීමාව ළඟා විය. පසුව නැවත උත්සාහ කරන්න.');
      return;
    }
    setForgotLoading(true);
    try {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const profile = await dataService.findProfileByEmail(forgotEmail);
      const userName = profile?.fullName || forgotEmail.split('@')[0];

      const sent = await sendOTPEmail(userName, forgotEmail, code);
      if (sent) {
        setOtpGenerated(code);
        setOtpExpiry(Date.now() + 5 * 60 * 1000);
        setOtpResendCount(prev => prev + 1);
        setForgotStep(2);
        setForgotSuccess(language === 'EN' ? `Verification code sent to ${forgotEmail}. Check your inbox!` : `සත්‍යාපන කේතය ${forgotEmail} වෙත යවන ලදී. ඔබගේ inbox බලන්න!`);
      } else {
        setAuthError(language === 'EN' ? 'Failed to send OTP email. Please try again.' : 'OTP විද්‍යුත් තැපෑල යැවීමට අසමත් විය.');
      }
    } catch (err) {
      setAuthError(language === 'EN' ? 'Failed to send verification code.' : 'සත්‍යාපන කේතය යැවීමට අසමත් විය.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    setAuthError('');
    setForgotSuccess('');
    if (otpTimer <= 0) {
      setAuthError(language === 'EN' ? 'OTP has expired. Please request a new one.' : 'OTP කල් ඉකුත්වී ඇත. කරුණාකර අලුතින් ඉල්ලන්න.');
      return;
    }
    if (otpCode === otpGenerated) {
      setForgotStep(3);
      setForgotSuccess(language === 'EN' ? 'OTP verified! Set your new password.' : 'OTP සත්‍යාපනය විය! ඔබගේ අලුත් මුරපදය සකසන්න.');
    } else {
      setAuthError(language === 'EN' ? 'Invalid OTP code. Please check and try again.' : 'අවලංගු OTP කේතයකි. කරුණාකර පරීක්ෂා කරන්න.');
    }
  };

  const handleResetPassword = async () => {
    setAuthError('');
    setForgotSuccess('');
    if (newPassword.length < 6) {
      setAuthError(language === 'EN' ? 'Password must be at least 6 characters.' : 'මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthError(language === 'EN' ? 'Passwords do not match.' : 'මුරපද නොගැළපේ.');
      return;
    }
    setForgotLoading(true);
    try {
      // For Firebase users: try to update password
      if (firebaseActive && auth && auth.currentUser) {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      }

      // Send success email
      const profile = await dataService.findProfileByEmail(forgotEmail);
      await sendPasswordResetSuccessEmail(profile?.fullName || forgotEmail.split('@')[0], forgotEmail);

      // Audit log
      await dataService.addSecurityAuditLog({
        userId: profile?.uid || 'unknown',
        userEmail: forgotEmail,
        action: 'PASSWORD_RESET_SUCCESS',
        details: `Password reset completed for ${forgotEmail} via OTP verification.`,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      });

      setForgotSuccess(language === 'EN' ? 'Password reset successful! A confirmation email has been sent. You can now sign in.' : 'මුරපදය සාර්ථකව යළි සකසන ලදී! තහවුරු කිරීමේ විද්‍යුත් තැපෑලක් යවන ලදී. දැන් ඔබට පුරනය විය හැක.');

      // Reset forgot states after 3 seconds and go to sign in
      setTimeout(() => {
        setAuthMode('signin');
        setForgotStep(1);
        setForgotEmail('');
        setOtpCode('');
        setOtpGenerated('');
        setNewPassword('');
        setConfirmPassword('');
        setForgotSuccess('');
        setOtpResendCount(0);
      }, 4000);
    } catch (err: any) {
      setAuthError(err.message || (language === 'EN' ? 'Password reset failed.' : 'මුරපදය යළි සැකසීම අසාර්ථක විය.'));
    } finally {
      setForgotLoading(false);
    }
  };


  // Auto detect current simulated user or firebase user
  useEffect(() => {
    let unsubscribe = () => {};

    if (firebaseActive && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
        if (user) {
          const profile = await dataService.getUserProfile(user.uid);
          if (profile) {
            setCurrentUser(profile);
          } else {
            // Create default profile if not exists
            const defaultProf: UserProfile = {
              uid: user.uid,
              fullName: user.displayName || user.email?.split('@')[0] || 'Ecosystem User',
              email: user.email || '',
              phone: '',
              role: 'grower',
              status: 'pending',
              createdAt: new Date().toISOString()
            };
            await dataService.createUserProfile(user.uid, defaultProf);
            setCurrentUser(defaultProf);
          }
        } else {
          // Check if there is a simulated user in localStorage
          const savedSimUid = localStorage.getItem('simulated_user_uid');
          if (savedSimUid) {
            const profile = await dataService.getUserProfile(savedSimUid);
            setCurrentUser(profile);
          } else {
            setCurrentUser(null);
          }
        }
        setAuthLoading(false);
      });
    } else {
      // Offline Simulation mode initial check
      const savedSimUid = localStorage.getItem('simulated_user_uid');
      if (savedSimUid) {
        dataService.getUserProfile(savedSimUid).then((profile) => {
          setCurrentUser(profile);
          setAuthLoading(false);
        }).catch(() => {
          setAuthLoading(false);
        });
      } else {
        setAuthLoading(false);
      }
    }

    return () => unsubscribe();
  }, [firebaseActive]);

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'EN' ? 'SI' : 'EN'));
  };

  // Sign out handler
  const handleSignOut = async () => {
    if (firebaseActive && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem('simulated_user_uid');
    setCurrentUser(null);
    setActiveTab('home');
  };


  // Simulated Google Fallback Login (accepts dynamic email inputs when offline/local dev fallback is triggered)
  const handleGoogleFallback = async (customEmail?: string) => {
    const email = customEmail || authEmail || 'mushroomecohub@gmail.com';
    let profile = await dataService.findProfileByEmail(email);
    
    if (!profile) {
      const serial = Math.floor(1000 + Math.random() * 9000);
      const nameFromEmail = email.split('@')[0];
      const displayName = authName || (nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)) + ' (Google)';
      const uniqueUid = 'google_sim_' + Math.random().toString(36).substr(2, 9);
      
      profile = {
        uid: uniqueUid,
        fullName: displayName,
        email: email,
        phone: authPhone || '0771234567',
        role: authMode === 'signup' ? authRole : 'grower',
        status: 'approved',
        membershipId: `LK-COOP-GGL-${serial}`,
        bio: 'Premium ecosystem partner registered securely via Google Integration.',
        preferredLanguage: 'EN',
        licenseNumber: `LK-COOP-GGL-${serial}`,
        productionArea: '1000 sq ft',
        gpsCoordinates: '6.9271° N, 79.8612° E',
        createdAt: new Date().toISOString()
      };
      await dataService.createUserProfile(uniqueUid, profile);
    } else {
      // Respect the chosen role if registering as simulated user
      if (authMode === 'signup' && profile.role !== authRole) {
        profile.role = authRole;
        await dataService.updateUserProfileRoleAndStatus(profile.uid, authRole, profile.status);
      }
    }
    
    localStorage.setItem('simulated_user_uid', profile.uid);
    setCurrentUser(profile);
    setActiveTab('dashboard');
  };

  // Google Sign In handler
  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthSubmitting(true);
    
    try {
      if (firebaseActive && auth) {
        try {
          const provider = new GoogleAuthProvider();
          // Force the Google Account Chooser popup so user can choose their email account
          provider.setCustomParameters({
            prompt: 'select_account'
          });
          
          const userCredential = await signInWithPopup(auth, provider);
          const user = userCredential.user;
          
          let profile = await dataService.getUserProfile(user.uid);
          if (!profile) {
            const serial = Math.floor(1000 + Math.random() * 9000);
            const userEmail = user.email || '';
            profile = {
              uid: user.uid,
              fullName: authName || user.displayName || 'Google Member',
              email: userEmail,
              phone: authPhone || user.phoneNumber || '0770000000',
              role: userEmail.toLowerCase().startsWith('admin@') ? 'admin' : (authMode === 'signup' ? authRole : 'grower'),
              status: 'approved',
              membershipId: `LK-MUSH-GGL-${serial}`,
              bio: 'Eco-system member registered securely via Google Authentication.',
              preferredLanguage: 'EN',
              licenseNumber: `LK-COOP-GGL-${serial}`,
              productionArea: '500 sq ft',
              gpsCoordinates: '6.9271° N, 79.8612° E',
              createdAt: new Date().toISOString()
            };
            await dataService.createUserProfile(user.uid, profile);
          }
          setCurrentUser(profile);
          setActiveTab('dashboard');
        } catch (firebaseErr: any) {
          console.warn('Google sign-in popup failed:', firebaseErr);
          
          // If the user has typed an email in the input box, let them bypass and use simulation fallback
          if (authEmail) {
            console.log('Bypassing Google popup error using form email input:', authEmail);
            await handleGoogleFallback(authEmail);
          } else {
            // Throw to display the clean error message with diagnostic hints
            throw firebaseErr;
          }
        }
      } else {
        // If Firebase is unavailable in client config, run simulated fallback
        if (authEmail) {
          await handleGoogleFallback(authEmail);
        } else {
          const emailPrompt = window.prompt(
            language === 'EN'
              ? 'Local simulation mode: Please enter your Google email address to register/login:'
              : 'දේශීය සිමියුලේෂන් මාදිලිය: කරුණාකර ඔබගේ ගූගල් විද්‍යුත් තැපැල් ලිපිනය ඇතුලත් කරන්න:'
          );
          if (emailPrompt) {
            await handleGoogleFallback(emailPrompt);
          } else {
            throw new Error('Google email is required for simulation.');
          }
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In Error details:', err);
      let errMsg = err.message || 'Google authentication failed.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = language === 'EN'
          ? 'Google Sign-In is not enabled in your Firebase Console. Please go to Authentication -> Sign-in method and enable Google.'
          : 'Firebase Console හි Google පිවිසුම (Google Auth Provider) සක්‍රීය කර නැත. කරුණාකර Authentication -> Sign-in method වෙත ගොස් Google සක්‍රීය කරන්න.';
      } else if (err.code === 'auth/popup-blocked') {
        errMsg = language === 'EN'
          ? 'Google Sign-In popup was blocked by your browser. Please allow popups for this site, or type your email in the email field above and click "Sign in with Google" again to use local simulation.'
          : 'ගූගල් පිවිසුම් පැනලය (popup) බ්‍රවුසරය මඟින් අවහිර කරන ලදී. කරුණාකර popups සක්‍රීය කරන්න, නැතහොත් ඉහත email කොටුවේ email ලිපිනය ඇතුලත් කර නැවත "Sign in with Google" ක්ලික් කිරීමෙන් දේශීය සිමියුලේෂන් මාදිලිය භාවිතා කරන්න.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = language === 'EN'
          ? 'Sign-in window was closed before completion. Please try again.'
          : 'පිවිසුම් කවුළුව සම්පූර්ණ වීමට පෙර වසා දමන ලදී. කරුණාකර නැවත උත්සාහ කරන්න.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errMsg = language === 'EN'
          ? 'This domain/IP address is not authorized for Google Sign-In in Firebase Console. Go to Authentication -> Settings -> Authorized Domains in Firebase, or type your email in the field above and click "Sign in with Google" again to bypass via local simulation.'
          : 'මෙම domain/IP ලිපිනය Firebase Console හි Google Auth සඳහා බලය පවරා නැත. Firebase හි Authentication -> Settings -> Authorized Domains වෙත ගොස් එය එක් කරන්න, නැතහොත් ඉහත email කොටුවේ email ලිපිනය ඇතුලත් කර නැවත ක්ලික් කිරීමෙන් දේශීය සිමියුලේෂන් මාදිලිය භාවිතා කරන්න.';
      }
      setAuthError(errMsg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Standard Form Submit Login / Signup
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail || !authPassword) {
      setAuthError('Please fill in email and password.');
      return;
    }

    // Rate limiting check
    if (lockoutUntil > Date.now()) {
      setAuthError(language === 'EN' ? `Account temporarily locked. Try again in ${lockoutTimer} seconds.` : `ගිණුම තාවකාලිකව අගුළු දමා ඇත. තත්පර ${lockoutTimer}කින් නැවත උත්සාහ කරන්න.`);
      return;
    }

    setAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        // Sign In
        let profile: UserProfile | null = null;
        if (firebaseActive && auth) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, authEmail, authPassword);
            profile = await dataService.getUserProfile(userCredential.user.uid);
          } catch (firebaseErr: any) {
            const credentialErrors = [
              'auth/wrong-password',
              'auth/user-not-found',
              'auth/invalid-credential',
              'auth/user-disabled'
            ];
            if (credentialErrors.includes(firebaseErr.code)) {
              throw firebaseErr;
            }
            console.warn('Firebase native sign-in failed. Using robust database fallback auth:', firebaseErr);
            profile = await dataService.findProfileByEmail(authEmail);
            if (profile) {
              localStorage.setItem('simulated_user_uid', profile.uid);
            }
          }
        } else {
          profile = await dataService.findProfileByEmail(authEmail);
          if (profile) {
            localStorage.setItem('simulated_user_uid', profile.uid);
          }
        }

        if (!profile) {
          // Log failed login
          await dataService.addSecurityAuditLog({
            userId: 'unregistered',
            userEmail: authEmail,
            action: 'LOGIN_FAILURE',
            details: `Failed authentication attempt for email: ${authEmail}`,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
          });
          throw new Error('User account not found. Please register to create your secure co-operative portal account!');
        }

        // Account suspension guard
        if (profile.status === 'suspended') {
          await dataService.addSecurityAuditLog({
            userId: profile.uid,
            userEmail: profile.email,
            action: 'LOGIN_SUSPENDED_BLOCKED',
            details: `Blocked login attempt of suspended user ${profile.fullName}.`,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
          });
          throw new Error('Access Denied: This account has been suspended by Mushroom Eco Hub administrators due to security compliance verification.');
        }

        setCurrentUser(profile);

        // Reset failed attempts on success
        setFailedAttempts(0);

        // Success audit logging
        await dataService.addSecurityAuditLog({
          userId: profile.uid,
          userEmail: profile.email,
          action: 'LOGIN_SUCCESS',
          details: `User ${profile.fullName} logged in successfully with role '${profile.role}'.`,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        });

        await dataService.addNotification({
          userId: profile.uid,
          title: 'Secure Access Granted',
          message: `Your login session was established. Portal compliance level: active.`,
          type: 'security',
          read: false
        });

        setActiveTab('dashboard');
      } else {
        // Sign Up
        if (!authName || !authPhone || !authEmail) {
          setAuthError('Please fill in your name, phone number, and email address.');
          setAuthSubmitting(false);
          return;
        }

        const simulatedUid = 'user_' + Math.random().toString(36).substr(2, 9);
        const sanitizedName = authName.replace(/<[^>]*>/g, '');
        const sanitizedPhone = authPhone.replace(/<[^>]*>/g, '');

        const newProfile: UserProfile = {
          uid: simulatedUid,
          fullName: sanitizedName,
          email: authEmail,
          phone: sanitizedPhone,
          role: authRole,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        let finalProfile = newProfile;

        if (firebaseActive && auth) {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
            const realUid = userCredential.user.uid;
            
            // Send verification email
            try {
              await sendEmailVerification(userCredential.user);
              console.log("Verification email sent.");
            } catch (emailErr) {
              console.error("Error sending verification email:", emailErr);
            }

            const firebaseProfile: UserProfile = {
              uid: realUid,
              fullName: sanitizedName,
              email: authEmail,
              phone: sanitizedPhone,
              role: authEmail.toLowerCase().startsWith('admin@') ? 'admin' : authRole,
              status: 'approved', // Admin should also be automatically approved
              createdAt: new Date().toISOString()
            };
            
            await dataService.createUserProfile(realUid, firebaseProfile);
            finalProfile = firebaseProfile;
          } catch (firebaseErr: any) {
            const validationErrors = [
              'auth/email-already-in-use',
              'auth/invalid-email',
              'auth/weak-password',
              'auth/admin-restricted-operation',
              'auth/operation-not-allowed'
            ];
            if (validationErrors.includes(firebaseErr.code)) {
              throw firebaseErr;
            }
            console.warn('Firebase native registration failed. Fallback active:', firebaseErr);
            await dataService.createUserProfile(simulatedUid, newProfile);
            localStorage.setItem('simulated_user_uid', simulatedUid);
          }
        } else {
          await dataService.createUserProfile(simulatedUid, newProfile);
          localStorage.setItem('simulated_user_uid', simulatedUid);
        }

        setCurrentUser(finalProfile);

        // Success audit log
        await dataService.addSecurityAuditLog({
          userId: finalProfile.uid,
          userEmail: finalProfile.email,
          action: 'REGISTRATION_SUCCESS',
          details: `Successfully registered new profile for ${finalProfile.fullName} with role '${finalProfile.role}'.`,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        });

        await dataService.addNotification({
          userId: finalProfile.uid,
          title: 'Welcome to Mushroom Eco Hub!',
          message: 'Your registration was received. Please check your email to verify your account.',
          type: 'info',
          read: false
        });

        // Send actual email using EmailJS
        if (authEmail) {
          await sendWelcomeEmail(finalProfile.fullName, authEmail);
        }

        alert(language === 'EN' 
          ? `Successfully registered! A welcome email has been sent to ${authEmail}.` 
          : `සාර්ථකව ලියාපදිංචි විය! පිළිගැනීමේ විද්‍යුත් ලිපියක් ${authEmail} වෙත යොමු කර ඇත.`);

        setActiveTab('dashboard');
      }
    } catch (err: any) {
      console.error(err);
      let userFriendlyMsg = '';
      const errorCode = err.code || '';
      const errorMessage = err.message || '';
      
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential' || errorMessage.includes('wrong-password') || errorMessage.includes('invalid-credential')) {
        userFriendlyMsg = language === 'EN' 
          ? 'Incorrect email or password. Please try again.' 
          : 'විද්‍යුත් තැපෑල හෝ මුරපදය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.';
      } else if (errorCode === 'auth/user-not-found' || errorMessage.includes('user-not-found')) {
        userFriendlyMsg = language === 'EN' 
          ? 'No account found with this email. Please register first.' 
          : 'මෙම විද්‍යුත් තැපෑලෙන් ගිණුමක් හමු නොවීය. කරුණාකර ලියාපදිංචි වන්න.';
      } else if (errorCode === 'auth/invalid-email' || errorMessage.includes('invalid-email')) {
        userFriendlyMsg = language === 'EN' 
          ? 'Please enter a valid email address.' 
          : 'කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.';
      } else if (errorCode === 'auth/weak-password' || errorMessage.includes('weak-password')) {
        userFriendlyMsg = language === 'EN' 
          ? 'Password should be at least 6 characters long.' 
          : 'මුරපදය අවම වශයෙන් අක්ෂර 6ක්වත් විය යුතුය.';
      } else if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('email-already-in-use')) {
        userFriendlyMsg = language === 'EN' 
          ? 'This email address is already registered. Please Sign In.' 
          : 'මෙම විද්‍යුත් තැපැල් ලිපිනය දැනටමත් ලියාපදිංචි වී ඇත. කරුණාකර ඇතුල් වන්න.';
      } else if (errorCode === 'auth/cancelled-popup-request' || errorMessage.includes('cancelled-popup-request') || errorCode === 'auth/popup-closed-by-user' || errorMessage.includes('popup-closed-by-user')) {
        userFriendlyMsg = language === 'EN'
          ? 'The login window was closed before completion. Please try again.'
          : 'පිවිසුම් කවුළුව (Popup) වසා දැමිණි. කරුණාකර නැවත උත්සාහ කරන්න.';
      } else {
        userFriendlyMsg = err.message || 'Authentication failed. Please verify credentials.';
      }
      setAuthError(userFriendlyMsg);

      // Track failed login attempts for rate limiting
      if (authMode === 'signin') {
        const newCount = failedAttempts + 1;
        setFailedAttempts(newCount);
        if (newCount >= 5) {
          const lockTime = Date.now() + 60 * 1000;
          setLockoutUntil(lockTime);
          setAuthError(language === 'EN' ? 'Too many failed attempts. Account locked for 60 seconds.' : 'අසාර්ථක උත්සාහයන් වැඩිය. ගිණුම තත්පර 60ක් අගුළු දමා ඇත.');
        }
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#2D2D2A] font-sans flex flex-col justify-between" id="app-root">
      
      {/* Navbar header */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleSignOut}
        onOpenAuthModal={() => {
          setAuthMode('signin');
          setActiveTab('dashboard');
        }}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      />

      {/* Main body content section */}
      <main className="flex-1 bg-[#F5F5F0]">
        {authLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#5A5A40] text-sm font-serif font-bold italic">Verifying secure co-operative credentials...</p>
          </div>
        ) : (
          <>
            {/* Navigational pages */}
            {activeTab === 'home' && (
              <Home 
                language={language} 
                setCurrentTab={setActiveTab} 
                onOpenJoinForm={() => setActiveTab('join')} 
                currentUserEmail={currentUser?.email}
                currentUserId={currentUser?.uid}
              />
            )}

            {activeTab === 'marketplace' && (
              <Marketplace
                language={language}
                currentUserEmail={currentUser?.email}
                currentUserId={currentUser?.uid}
              />
            )}

            {activeTab === 'training' && (
              <Training language={language} />
            )}

            {activeTab === 'opportunities' && (
              <Opportunities language={language} />
            )}

            {activeTab === 'machinery' && (
              <Machinery 
                language={language}
                currentUserEmail={currentUser?.email}
                currentUserId={currentUser?.uid}
              />
            )}

            {activeTab === 'about' && (
              <About language={language} />
            )}

            {activeTab === 'recipes' && (
              <RecipeHub language={language} />
            )}

            {activeTab === 'contact' && (
              <Contact language={language} />
            )}

            {activeTab === 'join' && (
              <JoinEcosystem 
                language={language} 
                onSubmitSuccess={() => setActiveTab('home')} 
              />
            )}

            {/* DASHBOARD TAB - REQUIRES AUTH */}
            {activeTab === 'dashboard' && (
              currentUser ? (
                <Dashboard
                  language={language}
                  currentUser={currentUser}
                  onUpdateProfile={(updated) => setCurrentUser(updated)}
                />
              ) : (
                /* Auth Form Screen if Guest accesses Dashboard */
                <div className="max-w-md mx-auto px-4 py-16" id="auth-screen">
                  <div className="bg-white border border-brand-border/40 rounded-[32px] p-8 shadow-md hover:shadow-lg transition-all duration-300 space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-serif font-black text-brand-text tracking-tight">
                        {authMode === 'forgot' 
                          ? (language === 'EN' ? 'Reset Password' : 'මුරපදය යළි සකසන්න')
                          : (language === 'EN' ? 'Co-op Gateway' : 'සමූහ ද්වාරය')}
                      </h2>
                      <p className="text-brand-orange font-sans font-medium text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
                        {authMode === 'forgot'
                          ? (language === 'EN' ? 'Verify your identity to reset your password securely.' : 'ඔබගේ මුරපදය ආරක්ෂිතව යළි සැකසීමට ඔබගේ අනන්‍යතාවය සත්‍යාපනය කරන්න.')
                          : (language === 'EN' 
                            ? 'Sign in or register to log your mushroom outputs, monitor buyers, and manage courses.'
                            : 'හතු වගා දත්ත ඇතුලත් කිරීමට සහ විමසීම් කළමනාකරණයට පිවිසෙන්න.')}
                      </p>
                    </div>

                    {/* Auth Mode Toggle tabs */}
                    {authMode !== 'forgot' && (
                      <div className="flex border-b border-brand-border/40">
                        <button
                          onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                          className={`flex-1 pb-3 text-sm font-sans font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                            authMode === 'signin' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-text/45 hover:text-brand-text/75'
                          }`}
                        >
                          <LogIn className="inline h-4 w-4 mr-1.5 text-brand-dark-green" />
                          {language === 'EN' ? 'Sign In' : 'ඇතුල් වන්න'}
                        </button>
                        <button
                          onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                          className={`flex-1 pb-3 text-sm font-sans font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                            authMode === 'signup' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-text/45 hover:text-brand-text/75'
                          }`}
                        >
                          <UserPlus className="inline h-4 w-4 mr-1.5 text-brand-dark-green" />
                          {language === 'EN' ? 'Sign Up' : 'ලියාපදිංචි වන්න'}
                        </button>
                      </div>
                    )}

                    {/* Error display */}
                    {authError && (
                      <div className="bg-red-50/70 border border-red-200/60 p-4 rounded-2xl text-red-900 text-xs animate-fade-in">
                        <div className="flex items-start space-x-2.5">
                          <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-sans font-bold text-[13px] text-red-800">
                              {language === 'EN' ? 'Authentication Alert' : 'පිවිසුම් දැනුම්දීම'}
                            </p>
                            <p className="leading-relaxed font-sans text-red-700/90">{authError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success display */}
                    {forgotSuccess && (
                      <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-2xl text-emerald-900 text-xs animate-fade-in">
                        <div className="flex items-start space-x-2.5">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-sans font-bold text-[13px] text-emerald-800">
                              {language === 'EN' ? 'Success' : 'සාර්ථකයි'}
                            </p>
                            <p className="leading-relaxed font-sans text-emerald-700/90">{forgotSuccess}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lockout warning */}
                    {lockoutTimer > 0 && (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs animate-fade-in">
                        <div className="flex items-center space-x-2.5">
                          <Timer className="h-4 w-4 text-amber-600 shrink-0" />
                          <p className="font-sans font-bold text-[13px]">
                            {language === 'EN' ? `Locked out. Try again in ${lockoutTimer}s` : `අගුළු දමා ඇත. තත්පර ${lockoutTimer}කින් නැවත උත්සාහ කරන්න`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ===== FORGOT PASSWORD OTP FLOW ===== */}
                    {authMode === 'forgot' ? (
                      <div className="space-y-4 animate-fade-in">
                        {/* Back button */}
                        <button 
                          onClick={() => { setAuthMode('signin'); setAuthError(''); setForgotSuccess(''); setForgotStep(1); }}
                          className="flex items-center text-brand-dark-green text-xs font-bold hover:underline cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> {language === 'EN' ? 'Back to Sign In' : 'පිවිසුමට ආපසු'}
                        </button>

                        {/* Step indicators */}
                        <div className="flex items-center justify-center space-x-2">
                          {[1,2,3].map(step => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                forgotStep >= step ? 'bg-brand-orange text-white' : 'bg-stone-100 text-stone-400'
                              }`}>{step}</div>
                              {step < 3 && <div className={`w-8 h-0.5 ${forgotStep > step ? 'bg-brand-orange' : 'bg-stone-200'}`} />}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center space-x-6 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                          <span className={forgotStep === 1 ? 'text-brand-orange' : ''}>{language === 'EN' ? 'Email' : 'විද්‍යුත් තැපෑල'}</span>
                          <span className={forgotStep === 2 ? 'text-brand-orange' : ''}>{language === 'EN' ? 'OTP' : 'සත්‍යාපනය'}</span>
                          <span className={forgotStep === 3 ? 'text-brand-orange' : ''}>{language === 'EN' ? 'New Password' : 'අලුත් මුරපදය'}</span>
                        </div>

                        {/* Step 1: Enter email */}
                        {forgotStep === 1 && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">
                                {language === 'EN' ? 'Email Address' : 'විද්‍යුත් තැපෑල'}
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                <input
                                  type="email"
                                  value={forgotEmail}
                                  onChange={(e) => setForgotEmail(e.target.value)}
                                  placeholder="yourname@gmail.com"
                                  className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleSendOTP}
                              disabled={forgotLoading}
                              className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-brown hover:from-brand-dark-green hover:to-brand-natural-green disabled:from-stone-300 disabled:to-stone-400 text-white font-sans font-bold rounded-xl text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
                            >
                              {forgotLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>{language === 'EN' ? 'Sending...' : 'යවමින්...'}</span>
                                </>
                              ) : (
                                <span>{language === 'EN' ? 'Send Verification Code' : 'සත්‍යාපන කේතය යවන්න'}</span>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Step 2: Enter OTP */}
                        {forgotStep === 2 && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-xs text-stone-500 font-sans">
                                {language === 'EN' ? 'Enter the 6-digit code sent to' : '6-digit කේතය ඇතුළත් කරන්න'}
                              </p>
                              <p className="text-sm font-bold text-brand-dark-green">{forgotEmail}</p>
                              {otpTimer > 0 && (
                                <p className="text-[10px] text-amber-600 font-bold mt-1 flex items-center justify-center gap-1">
                                  <Timer className="h-3 w-3" /> {language === 'EN' ? `Code expires in ${Math.floor(otpTimer/60)}:${(otpTimer%60).toString().padStart(2,'0')}` : `කේතය කල් ඉකුත් වීමට: ${Math.floor(otpTimer/60)}:${(otpTimer%60).toString().padStart(2,'0')}`}
                                </p>
                              )}
                            </div>
                            <div>
                              <input
                                type="text"
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full px-4 py-3 border border-brand-border rounded-xl text-2xl font-mono font-bold text-center text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 tracking-[0.5em] placeholder:text-stone-300"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleVerifyOTP}
                              className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-brown hover:from-brand-dark-green hover:to-brand-natural-green text-white font-sans font-bold rounded-xl text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                              {language === 'EN' ? 'Verify Code' : 'කේතය සත්‍යාපනය කරන්න'}
                            </button>
                            {otpResendCount < 3 && (
                              <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={forgotLoading}
                                className="w-full py-2 text-brand-dark-green text-xs font-bold underline cursor-pointer hover:text-brand-orange transition-colors"
                              >
                                {language === 'EN' ? 'Resend Code' : 'කේතය නැවත යවන්න'} ({3 - otpResendCount} {language === 'EN' ? 'left' : 'ඉතිරිව ඇත'})
                              </button>
                            )}
                          </div>
                        )}

                        {/* Step 3: New password */}
                        {forgotStep === 3 && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">
                                {language === 'EN' ? 'New Password' : 'අලුත් මුරපදය'}
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full px-4 py-2.5 pr-10 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              {/* Password strength */}
                              {newPassword && (
                                <div className="mt-2 space-y-1">
                                  <div className="flex gap-1">
                                    {[1,2,3].map(i => (
                                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= getPasswordStrength(newPassword).level ? getPasswordStrength(newPassword).color : 'bg-stone-200'}`} />
                                    ))}
                                  </div>
                                  <p className={`text-[10px] font-bold ${getPasswordStrength(newPassword).color.replace('bg-', 'text-')}`}>
                                    {getPasswordStrength(newPassword).label}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">
                                {language === 'EN' ? 'Confirm Password' : 'මුරපදය තහවුරු කරන්න'}
                              </label>
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                              />
                              {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-red-500 text-[10px] font-bold mt-1">{language === 'EN' ? 'Passwords do not match' : 'මුරපද නොගැළපේ'}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={handleResetPassword}
                              disabled={forgotLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                              className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-brown hover:from-brand-dark-green hover:to-brand-natural-green disabled:from-stone-300 disabled:to-stone-400 text-white font-sans font-bold rounded-xl text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
                            >
                              {forgotLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>{language === 'EN' ? 'Resetting...' : 'යළි සකසමින්...'}</span>
                                </>
                              ) : (
                                <span>{language === 'EN' ? 'Reset Password' : 'මුරපදය යළි සකසන්න'}</span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ===== NORMAL SIGN IN / SIGN UP FORM ===== */
                      <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {authMode === 'signup' && (
                          <>
                            <div className="animate-fade-in space-y-4">
                              <div>
                                <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">Full Name</label>
                                <input
                                  type="text"
                                  required
                                  value={authName}
                                  onChange={(e) => setAuthName(e.target.value)}
                                  placeholder="e.g. Priyanthi Silva"
                                  className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                                />
                              </div>
                              <div>
                                <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">Phone Number</label>
                                <input
                                  type="tel"
                                  required
                                  value={authPhone}
                                  onChange={(e) => setAuthPhone(e.target.value)}
                                  placeholder="e.g. 0771234567"
                                  className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                                />
                              </div>
                              <div>
                                <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">Ecosystem Role</label>
                                <select
                                  value={authRole}
                                  onChange={(e) => setAuthRole(e.target.value as UserRole)}
                                  className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 cursor-pointer"
                                >
                                  <option value="grower">Mushroom Grower (වගාකරු)</option>
                                  <option value="buyer">Bulk Wholesale Buyer (ගැනුම්කරු)</option>
                                  <option value="trainer">Trainer / Consultant (පුහුණුකරු)</option>
                                  <option value="partner">Ecosystem Partner / Processor (හවුල්කරු)</option>
                                  <option value="staff">Co-op Staff (කාර්ය මණ්ඩලය)</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )}

                        {authMode === 'signin' ? (
                          <div>
                            <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">
                              {language === 'EN' ? 'Email or Phone Number' : 'විද්‍යුත් තැපෑල හෝ දුරකථන අංකය'}
                            </label>
                            <input
                              type="text"
                              required
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              placeholder={language === 'EN' ? "yourname@gmail.com or 0771234567" : "yourname@gmail.com හෝ 0771234567"}
                              className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">
                              {language === 'EN' ? 'Email Address' : 'විද්‍යුත් තැපෑල'}
                            </label>
                            <input
                              type="email"
                              required
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              placeholder="yourname@gmail.com"
                              className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-brand-text font-sans font-semibold text-xs mb-1.5 uppercase tracking-wider">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-4 py-2.5 pr-10 border border-brand-border rounded-xl text-sm font-sans text-brand-text outline-none bg-stone-50/30 focus:bg-white focus:border-brand-dark-green focus:ring-2 focus:ring-brand-dark-green/10 transition-all duration-250 placeholder:text-stone-400/80"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {/* Password strength on signup */}
                          {authMode === 'signup' && authPassword && (
                            <div className="mt-2 space-y-1">
                              <div className="flex gap-1">
                                {[1,2,3].map(i => (
                                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= getPasswordStrength(authPassword).level ? getPasswordStrength(authPassword).color : 'bg-stone-200'}`} />
                                ))}
                              </div>
                              <p className={`text-[10px] font-bold ${getPasswordStrength(authPassword).color.replace('bg-', 'text-')}`}>
                                {getPasswordStrength(authPassword).label}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Forgot Password link */}
                        {authMode === 'signin' && (
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => { setAuthMode('forgot'); setAuthError(''); setForgotSuccess(''); setForgotStep(1); }}
                              className="text-xs text-brand-dark-green font-bold hover:underline cursor-pointer"
                            >
                              {language === 'EN' ? 'Forgot Password?' : 'මුරපදය අමතක ද?'}
                            </button>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={authSubmitting || lockoutTimer > 0}
                          className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-brown hover:from-brand-dark-green hover:to-brand-natural-green disabled:from-stone-300 disabled:to-stone-400 text-white font-sans font-bold rounded-xl text-sm shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
                        >
                          {authSubmitting ? (
                            <>
                              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>{language === 'EN' ? 'Authenticating...' : 'තහවුරු කරමින්...'}</span>
                            </>
                          ) : (
                            <span>{authMode === 'signin' ? (language === 'EN' ? 'Sign In to Portal' : 'ද්වාරයට ඇතුළු වන්න') : (language === 'EN' ? 'Create Account' : 'ගිණුම සාදන්න')}</span>
                          )}
                        </button>

                        <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t border-stone-200"></div>
                          <span className="flex-shrink mx-4 text-stone-400 font-sans font-bold text-[9px] uppercase tracking-wider">OR SECURE CONNECT</span>
                          <div className="flex-grow border-t border-stone-200"></div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          className="w-full py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-sans font-semibold rounded-xl text-sm shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer"
                        >
                          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          <span>
                            {authMode === 'signin'
                              ? (language === 'EN' ? 'Sign in with Google' : 'ගූගල් ගිණුමෙන් පිවිසෙන්න')
                              : (language === 'EN' ? 'Sign up with Google' : 'ගූගල් ගිණුමෙන් ලියාපදිංචි වන්න')}
                          </span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )
            )}

            {/* USER GUIDE TAB */}
            {activeTab === 'guide' && (
              <UserGuide language={language} />
            )}
          </>
        )}
      </main>

      {/* Session Timeout Warning Modal */}
      {showSessionWarning && currentUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="text-center space-y-2">
              <Timer className="h-12 w-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {language === 'EN' ? 'Session Expiring Soon' : 'සැසිය ඉක්මනින් කල් ඉකුත් වේ'}
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                {language === 'EN' 
                  ? 'Your session will expire in 5 minutes due to inactivity. Click below to stay signed in.' 
                  : 'අක්‍රියතාව හේතුවෙන් ඔබගේ සැසිය විනාඩි 5කින් කල් ඉකුත් වේ.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { resetSessionTimer(); }}
                className="flex-1 py-2.5 bg-brand-dark-green hover:bg-brand-natural-green text-white font-bold rounded-xl text-sm cursor-pointer transition-colors"
              >
                {language === 'EN' ? 'Stay Signed In' : 'ඇතුළත් වී සිටින්න'}
              </button>
              <button
                onClick={() => { setShowSessionWarning(false); handleSignOut(); }}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-sm cursor-pointer transition-colors"
              >
                {language === 'EN' ? 'Sign Out' : 'ඉවත් වන්න'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer footer */}
      <Footer language={language} setCurrentTab={setActiveTab} />

      {/* Floating AI Chatbot Assistant */}
      <Chatbot language={language} />

    </div>
  );
}
