import React, { useState } from 'react';
import { Sprout, Menu, X, LayoutDashboard, LogOut, Globe, User, Bell, Check, Shield } from 'lucide-react';
import { UserProfile, AppNotification } from '../types';
import Logo from './Logo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  language: 'EN' | 'SI';
  setLanguage: (lang: 'EN' | 'SI') => void;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  onOpenAuthModal,
  language,
  setLanguage,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'home', label: language === 'EN' ? 'Home' : 'ප්‍රධාන පිටුව' },
    { id: 'marketplace', label: language === 'EN' ? 'Marketplace' : 'වෙළඳපොළ' },
    { id: 'training', label: language === 'EN' ? 'Training' : 'පුහුණුවීම්' },
    { id: 'opportunities', label: language === 'EN' ? 'Opportunities' : 'අවස්ථා' },
    { id: 'machinery', label: language === 'EN' ? 'Machinery' : 'යන්ත්‍රෝපකරණ' },
    { id: 'about', label: language === 'EN' ? 'About Us' : 'අප ගැන' },
    { id: 'contact', label: language === 'EN' ? 'Contact' : 'සම්බන්ධ වන්න' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Logo & Left-aligned Nav Menu */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Logo & Brand */}
            <div className="flex items-center pr-3 lg:pr-5 shrink-0">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center focus:outline-none text-left"
                id="brand-logo"
              >
                <Logo />
              </button>
            </div>

            {/* Desktop Nav Items (Aligned Left) */}
            <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-grow justify-start ml-1 xl:ml-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-1.5 py-1.5 xl:px-2.5 xl:py-2 rounded-xl text-xs xl:text-sm font-sans font-semibold tracking-wide whitespace-nowrap transition-all duration-200 shrink-0 ${
                    currentTab === item.id
                      ? 'bg-brand-dark-green text-white shadow-sm font-bold scale-[1.02]'
                      : 'text-brand-text/90 hover:bg-brand-cream hover:text-brand-dark-green hover:scale-[1.02]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language & Actions */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 shrink-0 ml-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'SI' : 'EN')}
              className="flex items-center space-x-1 px-2 py-1.5 lg:px-2.5 rounded-xl border border-gray-200 text-brand-text hover:bg-brand-cream hover:text-brand-dark-green text-[11px] lg:text-xs font-sans font-semibold whitespace-nowrap transition-all duration-200"
              id="lang-toggle"
            >
              <Globe className="h-3.5 w-3.5 text-brand-dark-green shrink-0" />
              <span className="hidden 2xl:inline">{language === 'EN' ? 'සිංහල (SI)' : 'English (EN)'}</span>
              <span className="2xl:hidden">{language === 'EN' ? 'SI' : 'EN'}</span>
            </button>

             {currentUser ? (
              <div className="flex items-center space-x-1.5 xl:space-x-2">
                {/* Notification Bell Dropdown */}
                <div className="relative" id="navbar-notifications-container">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-xl transition-all duration-200 ${
                      showNotifications 
                        ? 'bg-brand-dark-green text-white shadow-md' 
                        : 'text-brand-text/80 hover:text-brand-dark-green hover:bg-brand-cream/50'
                    }`}
                    title={language === 'EN' ? 'Alerts' : 'නිවේදන'}
                    id="btn-notifications-bell"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 bg-red-500 border-2 border-white text-white rounded-full flex items-center justify-center font-sans text-[9px] font-black shadow-sm animate-pulse">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl z-50 overflow-hidden animate-fade-in ring-1 ring-black/5" id="notifications-dropdown-menu">
                      <div className="p-4 bg-gradient-to-r from-brand-dark-green to-brand-natural-green text-white flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 opacity-80" />
                          <span className="text-sm font-sans font-bold">
                            {language === 'EN' ? 'Notifications' : 'නිවේදන'}
                          </span>
                        </div>
                        {notifications.filter(n => !n.read).length > 0 && onMarkAllNotificationsAsRead && (
                          <button
                            type="button"
                            onClick={() => {
                              onMarkAllNotificationsAsRead();
                            }}
                            className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors uppercase tracking-wider"
                          >
                            {language === 'EN' ? 'Mark All Read' : 'සියල්ල කියවූ ලෙස'}
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100/50 max-h-[350px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-6 w-6 text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-xs font-medium">
                              {language === 'EN' ? 'You\'re all caught up!' : 'නව නිවේදන කිසිවක් නැත.'}
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 transition-colors flex items-start gap-3 text-xs relative overflow-hidden group ${
                                !notif.read ? 'bg-brand-cream/30 hover:bg-brand-cream/50' : 'hover:bg-gray-50/80'
                              }`}
                            >
                              {!notif.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
                              )}
                              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                                notif.type === 'security' 
                                  ? 'bg-amber-100 text-amber-600 shadow-inner' 
                                  : 'bg-brand-cream border border-brand-border/40 text-brand-dark-green shadow-inner'
                              }`}>
                                {notif.type === 'security' ? <Shield className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 space-y-1 min-w-0 pr-6">
                                <p className={`truncate leading-tight font-sans text-sm ${!notif.read ? 'font-bold text-stone-900' : 'font-semibold text-stone-700'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-stone-500 font-sans text-[11px] leading-relaxed break-words line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-stone-400 font-mono font-medium flex items-center gap-1">
                                  <Clock className="h-3 w-3 opacity-50" />
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {!notif.read && onMarkNotificationAsRead && (
                                <button
                                  type="button"
                                  onClick={() => onMarkNotificationAsRead(notif.id)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-brand-dark-green hover:border-brand-dark-green hover:shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  id="nav-dashboard"
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all duration-200 ${
                    currentTab === 'dashboard'
                      ? 'bg-brand-orange text-white shadow-md'
                      : 'bg-brand-brown text-white hover:bg-brand-dark-green shadow-sm hover:shadow-md'
                  }`}
                  title={language === 'EN' ? 'Dashboard' : 'නියමු පුවරුව'}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span className="hidden 2xl:inline ml-1">
                    {language === 'EN' ? 'Dashboard' : 'නියමු පුවරුව'}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  title="Logout"
                  id="btn-logout"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="hidden xl:inline">{language === 'EN' ? 'Logout' : 'ඉවත් වන්න'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center justify-center space-x-1.5 px-4.5 py-2 bg-gradient-to-r from-brand-orange to-brand-brown hover:from-brand-dark-green hover:to-brand-natural-green text-white text-xs lg:text-sm font-sans font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap transition-all duration-200 cursor-pointer"
                id="btn-login-trigger"
              >
                <User className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span>{language === 'EN' ? 'Sign In' : 'පිවිසෙන්න'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => setLanguage(language === 'EN' ? 'SI' : 'EN')}
              className="p-2 border border-gray-200 text-[#2D2D2A] hover:bg-gray-50 text-xs font-serif font-bold rounded-xl"
              title="Toggle Language"
              id="lang-toggle-mobile"
            >
              {language === 'EN' ? 'SI' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-text hover:text-brand-dark-green rounded-xl focus:outline-none"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-2 pt-2 pb-4 space-y-1 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-xl text-base font-sans font-semibold transition ${
                currentTab === item.id
                  ? 'bg-brand-dark-green text-white border-l-4 border-brand-orange'
                  : 'text-brand-text hover:bg-brand-cream/50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-2 px-4 flex flex-col space-y-2">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <div className="h-8 w-8 rounded-full bg-brand-dark-green/20 flex items-center justify-center text-brand-dark-green font-bold text-sm">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-sans font-bold text-brand-text leading-none">{currentUser.fullName}</p>
                    <p className="text-xs text-brand-text/60 capitalize mt-0.5">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-brown hover:bg-brand-dark-green text-white rounded-xl font-sans font-bold"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{language === 'EN' ? 'My Dashboard' : 'මගේ නියමු පුවරුව'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-sans font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{language === 'EN' ? 'Sign Out' : 'පද්ධතියෙන් ඉවත් වන්න'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-center py-2.5 bg-gradient-to-r from-brand-orange to-brand-brown hover:from-brand-dark-green hover:to-brand-natural-green text-white font-sans font-bold rounded-xl shadow-sm"
              >
                {language === 'EN' ? 'Sign In / Register' : 'ඇතුල්වීම / ලියාපදිංචිය'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
