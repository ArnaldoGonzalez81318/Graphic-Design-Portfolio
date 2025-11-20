import { useEffect } from 'react';

import {
  featuredWork,
  footer as footerData,
  hero,
  meta,
  navigation,
  process,
  toolkit,
  expertise,
} from './data/portfolio';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CollaborationSection from './components/sections/CollaborationSection';
import ExpertiseSection from './components/sections/ExpertiseSection';
import FeaturedWorkSection from './components/sections/FeaturedWorkSection';
import HeroSection from './components/sections/HeroSection';
import ProcessSection from './components/sections/ProcessSection';
import ToolkitSection from './components/sections/ToolkitSection';

const App = () => {
  useEffect(() => {
    if (meta?.title) {
      document.title = meta.title;
    }

    if (meta?.description) {
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute('content', meta.description);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-night text-soft">
      <Header nav={navigation} hero={hero} />
      <main className="space-y-0">
        <HeroSection hero={hero} />
        <FeaturedWorkSection work={featuredWork} />
        <ExpertiseSection expertise={expertise} />
        <ToolkitSection tools={toolkit} />
        <ProcessSection steps={process} />
        <CollaborationSection email={footerData.contact.email} />
      </main>
      <Footer footer={footerData} />
    </div>
  );
};

export default App;
