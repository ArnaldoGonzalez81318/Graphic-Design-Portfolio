import { useEffect, useState } from 'react';

import { archiveWork, type ArchiveProject } from '../data/portfolio';
import { isFirebaseConfigured } from '../lib/firebase';

type ArchiveSource = 'local' | 'firebase';

export function useArchiveProjects() {
  const [projects, setProjects] = useState<ArchiveProject[]>(archiveWork);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [source, setSource] = useState<ArchiveSource>('local');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      setLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    const loadProjects = async () => {
      try {
        const { fetchArchiveProjects } = await import('../lib/archive');
        const result = await fetchArchiveProjects();

        if (isCancelled) {
          return;
        }

        setProjects(result.projects);
        setSource(result.source);
      } catch {
        if (isCancelled) {
          return;
        }

        setProjects(archiveWork);
        setSource('local');
        setError('Firebase archive sync failed, so the local portfolio content is being used.');
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { projects, loading, source, error };
}