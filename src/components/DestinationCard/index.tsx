import { motion } from "framer-motion";
import type { Destination } from "@/types/destination";
import StickerBadge from "../StickerBadge";
import ReactionsPanel from "../ReactionsPanel";
import DestPhoto from "./DestPhoto";
import DestHighlights from "./DestHighlights";
import DestMetrics from "./DestMetrics";
import CostBreakdown from "./CostBreakdown";
import ProsCons from "./ProsCons";
import BoyActivityList from "./BoyActivityList";
import VoteRow from "./VoteRow";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { reverse } = destination;
  return (
    <section
      id={`dest-${destination.id}`}
      className="relative px-6 md:px-12 lg:pr-[240px] py-16 md:py-24 border-t-hard-lg border-void"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className={reverse ? "lg:order-2" : ""}>
            <DestPhoto
              heroSceneId={destination.heroSceneId}
              activitySceneIds={destination.activitySceneIds}
              alt={destination.name}
            />
          </div>
          <div className={reverse ? "lg:order-1" : ""}>
            <div className="flex items-center gap-3 mb-3">
              <StickerBadge rotation={-4} variant="volt" size="sm">
                {destination.rankBadge}
              </StickerBadge>
              <StickerBadge rotation={2} variant="chalk" size="sm">
                {destination.flag} {destination.country}
              </StickerBadge>
            </div>
            <h2 className="font-display text-hero-sm md:text-hero-md lg:text-hero-md text-chalk text-shadow-brutal leading-[0.85]">
              {destination.name}
            </h2>
            <p className="mt-4 font-mono text-mono-md uppercase tracking-widest text-volt font-bold">
              {destination.tagline}
            </p>
            <p className="mt-5 font-body text-lg text-chalk/85 max-w-2xl">
              {destination.description}
            </p>

            <div className="mt-6">
              <DestHighlights items={destination.highlights} />
            </div>

            <div className="mt-6">
              <DestMetrics items={destination.metrics} />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CostBreakdown cost={destination.cost} />
          <ProsCons pros={destination.pros} cons={destination.cons} />
        </div>

        <div className="mt-12">
          <BoyActivityList items={destination.activities} />
        </div>

        <div className="mt-10">
          <VoteRow destId={destination.id} label={destination.voteButtonLabel} />
        </div>

        <ReactionsPanel destId={destination.id} />
      </motion.div>
    </section>
  );
}
