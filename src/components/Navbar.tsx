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
            <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-grow justify-start ml-1 xl:ml-3 min-w-0 overflow-hidden">
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
                {/* Desktop User Avatar / Logo Badge */}
                <div className="flex items-center space-x-1.5 bg-brand-cream/40 border border-brand-border/40 py-1 pl-1 pr-2 rounded-xl select-none" id="nav-user-badge">
                  <div className="h-7 w-7 rounded-full bg-brand-dark-green text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs uppercase">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="text-left leading-none hidden 2xl:block">
                    <p className="text-[11px] font-bold text-brand-text truncate max-w-[100px]">{currentUser.fullName}</p>
                    <p className="text-[9px] text-brand-text/50 font-semibold capitalize">{currentUser.role}</p>
                  </div>
                </div>

                {/* Notification Bell Dropdown */}
                <div className="relative" id="navbar-notifications-container">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-brand-text/80 hover:text-brand-dark-green hover:bg-brand-cream/30 rounded-xl transition"
                    title={language === 'EN' ? 'Alerts' : 'නිවේදන'}
                    id="btn-notifications-bell"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-600 text-white rounded-full flex items-center justify-center font-sans text-[9px] font-black animate-pulse shadow-xs">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2.5 w-85 bg-white border border-gray-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in" id="notifications-dropdown-menu">
                      <div className="p-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-brand-dark-green">
                          {language === 'EN' ? 'System Notifications' : 'සමුපකාර නිවේදන'}
                        </span>
                        {notifications.filter(n => !n.read).length > 0 && onMarkAllNotificationsAsRead && (
                          <button
                            type="button"
                            onClick={() => {
                              onMarkAllNotificationsAsRead();
                            }}
                            className="text-[10px] font-extrabold text-brand-orange hover:underline uppercase tracking-wide"
                          >
                            {language === 'EN' ? 'Mark all read' : 'සියල්ල කියවූ ලෙස ලකුණු කරන්න'}
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400 text-xs">
                            {language === 'EN' ? 'No recent alerts.' : 'නව නිවේදන කිසිවක් නැත.'}
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3.5 hover:bg-stone-50 transition flex items-start gap-2.5 text-xs ${
                                !notif.read ? 'bg-brand-cream/15 font-semibold' : ''
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                notif.type === 'security' ? 'bg-amber-100 text-amber-800' : 'bg-brand-cream text-brand-dark-green'
                              }`}>
                                <Bell className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 space-y-0.5 min-w-0">
                                <p className="text-stone-900 truncate leading-tight font-serif font-bold text-[11px]">{notif.title}</p>
                                <p className="text-stone-500 font-sans text-[10.5px] leading-relaxed break-words">{notif.message}</p>
                                <p className="text-[9px] text-stone-400 font-mono">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              {!notif.read && onMarkNotificationAsRead && (
                                <button
                                  type="button"
                                  onClick={() => onMarkNotificationAsRead(notif.id)}
                                  className="p-1 hover:bg-gray-200 rounded-md text-gray-400 hover:text-brand-dark-green shrink-0 transition"
                                  title="Mark read"
                                >
                                  <Check className="h-3.5 w-3.5" />
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
                  className="p-2 text-brand-text/60 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                  title="Logout"
                  id="btn-logout"
                >
                  <LogOut className="h-5 w-5" />
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
