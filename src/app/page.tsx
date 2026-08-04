"use client";

import { useEffect } from "react";
import siteData from "@/content/site.json";
import type { SiteContent } from "@/lib/types";
import { Rail } from "@/components/layout/Rail";
import { LayerSection, BAND_HEIGHT } from "@/components/layout/LayerSection";
import { useLayerScroll } from "@/lib/useLayerScroll";
import { DocOverlayProvider } from "@/components/overlay/DocOverlayContext";
import { DocOverlay } from "@/components/overlay/DocOverlay";
import { Hero } from "@/components/sections/Hero";
import { WorkSection } from "@/components/sections/WorkSection";
import { RecordSection } from "@/components/sections/RecordSection";
import { BreakSection } from "@/components/sections/BreakSection";
import { StackSection } from "@/components/sections/StackSection";
import { OperatorSection } from "@/components/sections/OperatorSection";
import { ContactSection } from "@/components/sections/ContactSection";

const site = siteData as SiteContent;

const LAYERS = [
  { code: "00 · BASE", name: "The print", zLabel: "0.00", minHeight: 540, background: "ink900" as const, center: true },
  { code: "01 · BUILD", name: "Selected work", zLabel: "0.20", minHeight: 540, background: "ink900" as const, center: false },
  { code: "02 · RECORD", name: "Competition record", zLabel: "0.45", minHeight: 520, background: "ink800" as const, accent: "brass" as const, center: true },
  { code: "03 · BREAK", name: "Disclosure + writeups", zLabel: "0.60", minHeight: 520, background: "ink900" as const, center: false },
  { code: "04 · STACK", name: "Skills + experience", zLabel: "0.75", minHeight: 520, background: "ink900" as const, center: false },
  { code: "05 · OPERATOR", name: "About", zLabel: "0.90", minHeight: 500, background: "ink800" as const, center: false },
  { code: "06 · CONTACT", name: "Email, CV, GitHub", zLabel: "1.00", minHeight: 460, background: "ink900" as const, center: true },
];

const LAYER_ARIA = ["Base", "Build", "Record", "Break", "Stack", "Operator", "Contact"];

const OPERATOR_INDEX = 5;

export default function Home() {
  const { z, active, registerSection, goTo } = useLayerScroll(LAYERS.length, BAND_HEIGHT);

  useEffect(() => {
    if (window.location.hash === "#operator") goTo(OPERATOR_INDEX);
  }, [goTo]);

  return (
    <DocOverlayProvider>
      <div className="layout:pl-18">
        <Rail z={z} active={active} onJump={goTo} />

        <main>
          <LayerSection
            index={0}
            {...LAYERS[0]}
            active={active === 0}
            onBandClick={() => goTo(0)}
            sectionRef={registerSection(0)}
            ariaLabel={LAYER_ARIA[0]}
          >
            <Hero site={site} />
          </LayerSection>

          <LayerSection
            index={1}
            {...LAYERS[1]}
            active={active === 1}
            onBandClick={() => goTo(1)}
            sectionRef={registerSection(1)}
            ariaLabel={LAYER_ARIA[1]}
          >
            <WorkSection />
          </LayerSection>

          <LayerSection
            index={2}
            {...LAYERS[2]}
            active={active === 2}
            onBandClick={() => goTo(2)}
            sectionRef={registerSection(2)}
            ariaLabel={LAYER_ARIA[2]}
          >
            <RecordSection />
          </LayerSection>

          <LayerSection
            index={3}
            {...LAYERS[3]}
            active={active === 3}
            onBandClick={() => goTo(3)}
            sectionRef={registerSection(3)}
            ariaLabel={LAYER_ARIA[3]}
          >
            <BreakSection />
          </LayerSection>

          <LayerSection
            index={4}
            {...LAYERS[4]}
            active={active === 4}
            onBandClick={() => goTo(4)}
            sectionRef={registerSection(4)}
            ariaLabel={LAYER_ARIA[4]}
          >
            <StackSection />
          </LayerSection>

          <LayerSection
            index={5}
            {...LAYERS[5]}
            active={active === 5}
            onBandClick={() => goTo(5)}
            sectionRef={registerSection(5)}
            ariaLabel={LAYER_ARIA[5]}
          >
            <OperatorSection site={site} />
          </LayerSection>

          <LayerSection
            index={6}
            {...LAYERS[6]}
            active={active === 6}
            onBandClick={() => goTo(6)}
            sectionRef={registerSection(6)}
            ariaLabel={LAYER_ARIA[6]}
          >
            <ContactSection site={site} />
          </LayerSection>
        </main>

        <DocOverlay />
      </div>
    </DocOverlayProvider>
  );
}
