"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useConnectomeState } from "@/lib/connectomeState";
import {
  TRACTS,
  TRACT_ORDER,
  tractsForRegion,
  type Tract,
} from "@/lib/tracts";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { anchorFor } from "@/lib/brainAnchors";
import { Body, Caption, Mono } from "@/components/typography/Typography";
import type { RegionId } from "@/lib/regions";
import { citations } from "@/lib/citations";

/**
 * Atlas-page Connectome panel.
 *
 *   - Lists the tracts that have this region as an endpoint, with a
 *     toggle per tract.
 *   - Offers a "Show all" toggle that surfaces every tract in the
 *     visible set at once.
 *   - When any tract is visible, the persistent brain takes a
 *     "focus" transform — repositioned and scaled up so the tracts
 *     are actually readable. The original Atlas anchor is restored
 *     when the user clears the visible set.
 *   - On unmount, clears the visible tract set so the next page
 *     starts clean.
 *
 * The component is a leaf — it does not render the brain itself.
 * Tracts.tsx (inside BrainAnatomy's group) reads the same
 * connectome store and adjusts opacity per tract.
 */
export default function ConnectomePanel({ regionId }: { regionId: RegionId }) {
  const t = useTranslations("atlas");
  const connected = tractsForRegion(regionId);
  const visibleTracts = useConnectomeState((s) => s.visibleTracts);
  const toggleTract = useConnectomeState((s) => s.toggleTract);
  const setAllTracts = useConnectomeState((s) => s.setAllTracts);
  const clearTracts = useConnectomeState((s) => s.clearTracts);
  const focusMode = useConnectomeState((s) => s.focusMode);

  const setTransform = useBrainStageStore((s) => s.setTransform);

  // Focus mode: override the small upper-right Atlas anchor when
  // tracts are being shown, so they are actually visible. Restore
  // on clear and on unmount.
  useEffect(() => {
    if (focusMode) {
      setTransform({
        position: [-0.45, -0.05, 0],
        scale: 1.15,
        rotation: [0, 0.2, 0],
      });
    } else {
      const a = anchorFor("atlas");
      setTransform({
        position: a.position,
        scale: a.scale,
        rotation: a.rotation,
      });
    }
  }, [focusMode, setTransform]);

  // Clear visible tracts on unmount so the next page is clean.
  useEffect(() => {
    return () => {
      clearTracts();
    };
  }, [clearTracts]);

  // If this region has no canonical tracts, the panel still renders
  // the "Show all" toggle so the user can still see the connectome
  // from this page.
  const hasConnected = connected.length > 0;
  const allTractIds = new Set(TRACT_ORDER);
  const allVisible =
    visibleTracts.size === allTractIds.size &&
    [...allTractIds].every((id) => visibleTracts.has(id));

  return (
    <div>
      <Caption uppercase className="text-brass tracking-[0.18em]">
        {t("sidebar.connectome")}
      </Caption>
      <Caption className="text-bone-cream/85 mt-2 block max-w-[18rem]">
        {hasConnected
          ? t("connectome.connectedIntro")
          : t("connectome.unconnectedIntro")}
      </Caption>

      {hasConnected && (
        <ul className="mt-4 space-y-2">
          {connected.map((tract) => {
            const isOn = visibleTracts.has(tract.id);
            return (
              <li key={tract.id}>
                <button
                  type="button"
                  onClick={() => toggleTract(tract.id)}
                  data-hover
                  className={`border-bone-cream/15 hover:border-brass/60 group block w-full rounded-sm border px-3 py-2 text-left transition-colors duration-150 ${
                    isOn ? "border-brass/70 bg-brass/10" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      aria-hidden
                      className={`inline-block h-2 w-2 shrink-0 rounded-full transition-opacity duration-150 ${
                        isOn ? "opacity-100" : "opacity-30"
                      }`}
                      style={{ backgroundColor: "#c9a961" }}
                    />
                    <Caption
                      className={`flex-1 ${
                        isOn ? "text-brass" : "text-bone-cream/80"
                      }`}
                    >
                      {tract.displayName}
                    </Caption>
                  </div>
                  {isOn && <TractDetail tract={tract} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => (allVisible ? clearTracts() : setAllTracts(allTractIds))}
          data-hover
          className="text-brass/80 hover:text-brass inline-flex items-center gap-2 transition-colors duration-150"
        >
          <Caption uppercase className="tracking-[0.18em]">
            {allVisible ? t("connectome.hideAll") : t("connectome.showAll")}
          </Caption>
        </button>
        {visibleTracts.size > 0 && !allVisible && (
          <button
            type="button"
            onClick={() => clearTracts()}
            data-hover
            className="text-bone-cream/85 hover:text-brass inline-flex items-center gap-2 transition-colors duration-150"
          >
            <Caption uppercase className="tracking-[0.18em]">
              {t("connectome.clear")}
            </Caption>
          </button>
        )}
      </div>

      <Caption className="text-bone-cream/80 mt-5 block max-w-[20rem] italic">
        {t("connectome.disclosure")}
      </Caption>
    </div>
  );
}

function TractDetail({ tract }: { tract: Tract }) {
  const c = tract.citationId ? citations[tract.citationId] : undefined;
  return (
    <div className="mt-3 space-y-2 pl-4">
      <Body className="text-bone-cream/75 max-w-[22rem]">
        {tract.description}
      </Body>
      {tract.discoveredBy && (
        <Caption className="text-bone-cream/50 block">
          <Mono variant="label" className="text-bone-cream/70 mr-2">
            CREDIT
          </Mono>
          {tract.discoveredBy}
        </Caption>
      )}
      {c?.doi && (
        <a
          href={`https://doi.org/${c.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="text-brass/70 hover:text-brass inline-flex items-center gap-2 transition-colors duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <Caption className="block italic">
            {c.authors} ({c.year}). {c.title}
          </Caption>
        </a>
      )}
    </div>
  );
}
