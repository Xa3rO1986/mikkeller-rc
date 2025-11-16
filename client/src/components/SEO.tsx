import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  keywords?: string;
}

export function SEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  keywords,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const metaNames = ['description', 'keywords', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    const metaProperties = ['og:title', 'og:description', 'og:type', 'og:image', 'og:url'];

    metaNames.forEach(name => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) existing.remove();
    });

    metaProperties.forEach(property => {
      const existing = document.querySelector(`meta[property="${property}"]`);
      if (existing) existing.remove();
    });

    const metaTags: Array<{ name?: string; property?: string; content: string }> = [
      { name: 'description', content: description },
    ];

    if (keywords) {
      metaTags.push({ name: 'keywords', content: keywords });
    }

    metaTags.push({ property: 'og:title', content: ogTitle || title });
    metaTags.push({ property: 'og:description', content: ogDescription || description });
    metaTags.push({ property: 'og:type', content: 'website' });

    if (ogImage) {
      const imageUrl = ogImage.startsWith('http') 
        ? ogImage 
        : `${window.location.origin}${ogImage}`;
      metaTags.push({ property: 'og:image', content: imageUrl });
    }

    metaTags.push({ property: 'og:url', content: ogUrl || window.location.href });

    metaTags.push({ name: 'twitter:card', content: 'summary_large_image' });
    metaTags.push({ name: 'twitter:title', content: ogTitle || title });
    metaTags.push({ name: 'twitter:description', content: ogDescription || description });
    
    if (ogImage) {
      const imageUrl = ogImage.startsWith('http') 
        ? ogImage 
        : `${window.location.origin}${ogImage}`;
      metaTags.push({ name: 'twitter:image', content: imageUrl });
    }

    metaTags.forEach(({ name, property, content }) => {
      const element = document.createElement('meta');
      if (name) element.setAttribute('name', name);
      if (property) element.setAttribute('property', property);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    });
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, keywords]);

  return null;
}
