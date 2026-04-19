import { useMemo } from "react";
import VoteProvider from "@/context/VoteContext";
import ReactionsProvider from "@/context/ReactionsContext";
import UiProvider from "@/context/UiContext";
import IntroOverlay from "@/components/IntroOverlay";
import VerticalSidebar from "@/components/VerticalSidebar";
import NavDots from "@/components/NavDots";
import Hero from "@/components/Hero";
import ReactionsControlBar from "@/components/ReactionsControlBar";
import DestinationCard from "@/components/DestinationCard";
import ComparisonSection from "@/components/ComparisonSection";
import FinalVoteResults from "@/components/FinalVoteResults";
import Footer from "@/components/Footer";
import { DESTINATIONS } from "@/data/destinations";
import useSectionObserver from "@/hooks/useSectionObserver";
import useCursor from "@/hooks/useCursor";

function Shell() {
  const sectionIds = useMemo(
    () => [
      "hero",
      "reactions",
      ...DESTINATIONS.map((d) => `dest-${d.id}`),
      "comparison",
      "final",
    ],
    [],
  );
  useSectionObserver(sectionIds);
  useCursor(true);

  return (
    <div className="relative min-h-screen bg-carbon text-chalk">
      <IntroOverlay />
      <VerticalSidebar />
      <NavDots />
      <main>
        <Hero />
        <ReactionsControlBar />
        <section id="destinations" aria-label="destinations">
          {DESTINATIONS.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </section>
        <ComparisonSection />
        <FinalVoteResults />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <UiProvider>
      <VoteProvider>
        <ReactionsProvider>
          <Shell />
        </ReactionsProvider>
      </VoteProvider>
    </UiProvider>
  );
}
