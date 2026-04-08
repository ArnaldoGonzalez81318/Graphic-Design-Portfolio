import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

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
import HomePage from './pages/HomePage';

const ArchivePage = lazy(() => import('./pages/ArchivePage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

const RouteFallback = () => (
  <main className="section-padding">
    <div className="container-grid">
      <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-highlight">Loading</p>
        <p className="mt-4 text-lg text-subtle">Preparing archive content and project detail views.</p>
      </div>
    </div>
  </main>
);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const pageMeta =
      location.pathname.startsWith('/archive')
        ? {
            title: `Archive · ${meta.title}`,
            description:
              'Expanded archive of brand systems, campaign launches, editorial design, and experiential graphics by Laura Rivera.',
          }
        : meta;

    if (pageMeta?.title) {
      document.title = pageMeta.title;
    }

    if (pageMeta?.description) {
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute('content', pageMeta.description);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.replace('#', ''));

      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-night text-soft">
      <Header nav={navigation} hero={hero} />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                hero={hero}
                work={featuredWork}
                expertise={expertise}
                toolkit={toolkit}
                process={process}
                email={footerData.contact.email}
              />
            }
          />
          <Route
            path="/archive"
            element={<ArchivePage email={footerData.contact.email} />}
          />
          <Route
            path="/archive/:slug"
            element={<ProjectDetailPage email={footerData.contact.email} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer footer={footerData} />
    </div>
  );
};

export default App;
