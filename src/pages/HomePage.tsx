import type { CaseStudy, HeroContent, ProcessStep, SkillArea, Tool } from '../data/portfolio';
import CollaborationSection from '../components/sections/CollaborationSection';
import ExpertiseSection from '../components/sections/ExpertiseSection';
import FeaturedWorkSection from '../components/sections/FeaturedWorkSection';
import HeroSection from '../components/sections/HeroSection';
import ProcessSection from '../components/sections/ProcessSection';
import ToolkitSection from '../components/sections/ToolkitSection';

interface HomePageProps {
  hero: HeroContent;
  work: CaseStudy[];
  expertise: SkillArea[];
  toolkit: Tool[];
  process: ProcessStep[];
  email: string;
}

const HomePage = ({ hero, work, expertise, toolkit, process, email }: HomePageProps) => {
  return (
    <main className="space-y-0">
      <HeroSection hero={hero} />
      <FeaturedWorkSection work={work} />
      <ExpertiseSection expertise={expertise} />
      <ToolkitSection tools={toolkit} />
      <ProcessSection steps={process} />
      <CollaborationSection email={email} />
    </main>
  );
};

export default HomePage;