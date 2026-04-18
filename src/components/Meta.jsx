import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Meta = ({ 
  title, 
  description, 
  image = "/images/logo-mic.png", 
  type = "website",
  schema = null 
}) => {
  const location = useLocation();
  const url = `https://medicalinformationcenter.com${location.pathname}`;
  const siteName = "Medical Information Center";
  const finalTitle = title ? `${title} | ${siteName}` : siteName;

  useEffect(() => {
    // Update Title
    document.title = finalTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OG Tags
    const ogTags = {
      'og:title': finalTitle,
      'og:description': description,
      'og:url': url,
      'og:type': type,
      'og:image': `https://medicalinformationcenter.com${image}`,
      'og:site_name': siteName,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Update Twitter Tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': finalTitle,
      'twitter:description': description,
      'twitter:image': `https://medicalinformationcenter.com${image}`,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Update Schema
    let scriptTag = document.querySelector('#structured-data');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('id', 'structured-data');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [finalTitle, description, url, type, image, schema]);

  return null;
};

export default Meta;
