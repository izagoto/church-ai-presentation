import { FileText } from "lucide-react";

import {
  usePresentationStore,
} from "../../stores/presentation.store";
import {
  getCurrentPresentationSlide,
  getPresentationSlides,
} from "../../lib/presentation-slides";

export function ProjectorScreen() {
  const {
    items,
    selectedItemId,
    selectedSlideIndex,
    isProjectorBlank,
    serviceInfo,
  } =
    usePresentationStore();

  const selectedIndex = items.findIndex((item) => item.id === selectedItemId);
  const currentItem = selectedIndex >= 0 ? items[selectedIndex] : items[0];
  const slides = getPresentationSlides(currentItem);
  const currentSlide = getCurrentPresentationSlide(currentItem, selectedSlideIndex);

  if (isProjectorBlank) {
    return <div className="h-screen w-screen bg-black" />;
  }

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#040506] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_26%,rgba(0,0,0,0.28))]" />

      <div className="relative flex h-full w-full flex-col px-12 py-10">
        <div className="flex items-center justify-between text-white/50">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">
              {serviceInfo.serviceName}
            </p>
            <p className="mt-2 text-base">{serviceInfo.theme}</p>
          </div>

          <div className="text-right">
            <p className="text-sm">{serviceInfo.serviceDate}</p>
            <p className="mt-2 text-sm">{serviceInfo.preacher}</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="max-w-[1180px] text-center">
            {currentItem?.type === "pdf" && (
              <FileText size={58} className="mx-auto mb-8 text-white/80" />
            )}

            <h1 className="whitespace-pre-line text-[56px] font-bold leading-[1.14] tracking-tight text-white">
              {currentSlide.title}
            </h1>

            <p className="mx-auto mt-6 max-w-[900px] text-[26px] leading-[1.5] text-white/82">
              {currentSlide.body}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-white/40">
          <span>
            Item {selectedIndex >= 0 ? selectedIndex + 1 : 0} / {items.length} •
            Slide {Math.min(selectedSlideIndex + 1, slides.length)} / {slides.length}
          </span>
          <span>B: Blank • Left/Right: Previous/Next Slide</span>
        </div>
      </div>
    </div>
  );
}
