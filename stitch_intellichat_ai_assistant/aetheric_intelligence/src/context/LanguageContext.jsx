import React, { createContext, useState, useContext, useEffect } from 'react';

export const translations = {
  en: {
    // Onboarding
    experienceFuture: "Experience the Future of Intelligence",
    unlockPower: "Unlock the power of INTELLICORE AI. Your personalized companion for creativity, productivity, and complex problem-solving.",
    getStarted: "Get Started",
    signIn: "Sign In",
    explore: "Explore",
    neuralEngine: "Neural Engine v4.0",
    privacyEncrypted: "Privacy Encrypted",
    
    // Login
    welcomeBack: "Welcome back to the future of intelligence.",
    emailAddress: "EMAIL ADDRESS",
    password: "PASSWORD",
    forgot: "Forgot?",
    orContinueWith: "OR CONTINUE WITH",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    
    // Chat
    askNexus: "Ask IntelliCore anything...",
    processing: "Processing...",
    
    // Profile
    pro: "PRO",
    themePreferences: "Theme Preferences",
    darkModeActive: "Dark mode active",
    aiModelSelection: "AI Model Selection",
    history: "History",
    activeSessions: "24 active sessions recorded",
    logOut: "Log Out",
    securelyEndSession: "Securely end your session",
    deleteAccount: "DELETE ACCOUNT",

    // Explore
    newFeatures: "New features coming soon.",
  },
  hi: {
    // Onboarding
    experienceFuture: "बुद्धिमत्ता के भविष्य का अनुभव करें",
    unlockPower: "INTELLICORE AI की शक्ति को अनलॉक करें। रचनात्मकता, उत्पादकता और जटिल समस्याओं को सुलझाने के लिए आपका व्यक्तिगत साथी।",
    getStarted: "शुरू करें",
    signIn: "साइन इन करें",
    explore: "अन्वेषण करें",
    neuralEngine: "न्यूरल इंजन v4.0",
    privacyEncrypted: "गोपनीयता एन्क्रिप्टेड",
    
    // Login
    welcomeBack: "बुद्धिमत्ता के भविष्य में वापस स्वागत है।",
    emailAddress: "ईमेल पता",
    password: "पासवर्ड",
    forgot: "भूल गए?",
    orContinueWith: "या इसके साथ जारी रखें",
    dontHaveAccount: "क्या आपका खाता नहीं है?",
    signUp: "साइन अप करें",
    
    // Chat
    askNexus: "IntelliCore से कुछ भी पूछें...",
    processing: "प्रोसेसिंग...",
    
    // Profile
    pro: "प्रो",
    themePreferences: "थीम प्राथमिकताएं",
    darkModeActive: "डार्क मोड सक्रिय",
    aiModelSelection: "एआई मॉडल चयन",
    history: "इतिहास",
    activeSessions: "24 सक्रिय सत्र रिकॉर्ड किए गए",
    logOut: "लॉग आउट करें",
    securelyEndSession: "अपना सत्र सुरक्षित रूप से समाप्त करें",
    deleteAccount: "खाता हटाएं",

    // Explore
    newFeatures: "नई सुविधाएँ जल्द ही आ रही हैं।",
  },
  te: {
    // Onboarding
    experienceFuture: "మేధస్సు యొక్క భవిష్యత్తును అనుభవించండి",
    unlockPower: "INTELLICORE AI శక్తిని అన్‌లాక్ చేయండి. సృజనాత్మకత, ఉత్పాదకత మరియు సంక్లిష్ట సమస్యలను పరిష్కరించడానికి మీ వ్యక్తిగత సహచరుడు.",
    getStarted: "ప్రారంభించండి",
    signIn: "సైన్ ఇన్ చేయండి",
    explore: "అన్వేషించండి",
    neuralEngine: "న్యూరల్ ఇంజిన్ v4.0",
    privacyEncrypted: "గోప్యత ఎన్‌క్రిప్ట్ చేయబడింది",
    
    // Login
    welcomeBack: "మేధస్సు యొక్క భవిష్యత్తుకు తిరిగి స్వాగతం.",
    emailAddress: "ఇమెయిల్ చిరునామా",
    password: "పాస్వర్డ్",
    forgot: "మర్చిపోయారా?",
    orContinueWith: "లేదా దీని ద్వారా కొనసాగించండి",
    dontHaveAccount: "ఖాతా లేదా?",
    signUp: "సైన్ అప్ చేయండి",
    
    // Chat
    askNexus: "IntelliCore ని ఏదైనా అడగండి...",
    processing: "ప్రాసెస్ అవుతోంది...",
    
    // Profile
    pro: "ప్రో",
    themePreferences: "థీమ్ ప్రాధాన్యతలు",
    darkModeActive: "డార్క్ మోడ్ యాక్టివ్",
    aiModelSelection: "AI మోడల్ ఎంపిక",
    history: "చరిత్ర",
    activeSessions: "24 సక్రియ సెషన్‌లు రికార్డ్ చేయబడ్డాయి",
    logOut: "లాగ్ అవుట్ చేయండి",
    securelyEndSession: "మీ సెషన్‌ను సురక్షితంగా ముగించండి",
    deleteAccount: "ఖాతాను తొలగించండి",

    // Explore
    newFeatures: "కొత్త ఫీచర్లు త్వరలో రానున్నాయి.",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('intellicoreLanguage');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('intellicoreLanguage', lang);
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
