import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update page title
    document.title = config.title;

    // Update meta description
    updateMetaTag('description', config.description);

    // Update keywords if provided
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }

    // Update Open Graph tags
    updateMetaProperty('og:title', config.title);
    updateMetaProperty('og:description', config.description);
    updateMetaProperty('og:type', config.type || 'website');
    
    if (config.image) {
      updateMetaProperty('og:image', config.image);
    }
    
    if (config.url) {
      updateMetaProperty('og:url', config.url);
      updateLinkTag('canonical', config.url);
    }

    // Update Twitter Card tags
    updateMetaProperty('twitter:title', config.title);
    updateMetaProperty('twitter:description', config.description);
    
    if (config.image) {
      updateMetaProperty('twitter:image', config.image);
    }

  }, [config]);
};

const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
};