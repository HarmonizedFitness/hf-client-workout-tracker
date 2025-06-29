
import { useEffect } from 'react';

/**
 * Component to set security headers via meta tags and CSP
 * This provides additional security for the application
 */
const SecurityHeaders = () => {
  useEffect(() => {
    // Set security-related meta tags
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Prevent clickjacking
    setMetaTag('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    setMetaTag('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    setMetaTag('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy (basic)
    setMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://belenmwtnercbjdxbnqa.supabase.co; " +
      "font-src 'self' https:; " +
      "frame-ancestors 'none';"
    );

    // Prevent browser from sending referrer info to external sites
    let referrerMeta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement;
    if (!referrerMeta) {
      referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      document.head.appendChild(referrerMeta);
    }
    referrerMeta.content = 'strict-origin-when-cross-origin';

  }, []);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;
