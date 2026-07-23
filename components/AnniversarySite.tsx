"use client";

/* Local WebP assets are pre-sized and compressed before deployment. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnniversaryContent, GalleryPhoto, VideoMemory } from "../data/relationship";

const chapters = [
  { id: "welcome", label: "Welcome" },
  { id: "letter", label: "Love letter" },
  { id: "timeline", label: "Our story" },
  { id: "gallery", label: "Our photos" },
  { id: "videos", label: "Our videos" },
  { id: "reasons", label: "Why I love you" },
  { id: "surprise", label: "One last thing" },
] as const;

function StoryHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 tabIndex={-1}>{title}</h2>
      {intro ? <p className="page-intro">{intro}</p> : null}
    </header>
  );
}

function Lightbox({ photo, onClose }: { photo: GalleryPhoto; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.caption} onClick={onClose}>
      <button ref={closeButtonRef} className="lightbox-close" type="button" onClick={onClose} aria-label="Close enlarged photo">×</button>
      <figure className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-image">
          <img src={photo.src} alt={photo.alt} />
        </div>
        <figcaption>{photo.caption}</figcaption>
      </figure>
    </div>
  );
}

function VideoCard({ memory, index }: { memory: VideoMemory; index: number }) {
  const [selected, setSelected] = useState(false);

  return (
    <article className="video-card">
      <div className="video-stage">
        {selected ? (
          <video controls playsInline preload="metadata" poster={memory.poster} aria-label={memory.caption}>
            <source src={memory.src} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        ) : (
          <button type="button" className="video-poster" onClick={() => setSelected(true)} aria-label={`Play ${memory.caption}`}>
            <img src={memory.poster} alt="" loading="lazy" />
            <span className="play-button" aria-hidden="true">▶</span>
            <span className="video-hint">Tap to play</span>
          </button>
        )}
      </div>
      <div className="video-copy">
        <p className="eyebrow">Memory {String(index + 1).padStart(2, "0")}</p>
        <h3>{memory.caption}</h3>
        <p>{memory.description}</p>
      </div>
    </article>
  );
}

export function AnniversarySite({ content }: { content: AnniversaryContent }) {
  const [page, setPage] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [loveTransitionVisible, setLoveTransitionVisible] = useState(false);
  const [loveTransitionKey, setLoveTransitionKey] = useState(0);
  const pageRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const firstRenderRef = useRef(true);
  const transitioningRef = useRef(false);
  const transitionTimersRef = useRef<number[]>([]);
  const lastPage = chapters.length - 1;

  const goToPage = useCallback((target: number) => {
    const nextPage = Math.max(0, Math.min(lastPage, target));
    setPage(nextPage);
    setLightboxPhoto(null);
    if (nextPage === 0) setSurpriseOpen(false);
  }, [lastPage]);

  const showLoveTransition = useCallback((target: number) => {
    if (transitioningRef.current) return;

    const nextPage = Math.max(0, Math.min(lastPage, target));
    transitioningRef.current = true;
    setLoveTransitionKey((key) => key + 1);
    setLoveTransitionVisible(true);

    const pageTimer = window.setTimeout(() => goToPage(nextPage), 480);
    const finishTimer = window.setTimeout(() => {
      setLoveTransitionVisible(false);
      transitioningRef.current = false;
    }, 1450);

    transitionTimersRef.current = [pageTimer, finishTimer];
  }, [goToPage, lastPage]);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    const frame = requestAnimationFrame(() => {
      pageRef.current?.scrollTo({ top: 0 });
      pageRef.current?.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, video") || lightboxPhoto) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        showLoveTransition(page === lastPage ? 0 : page + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToPage(page - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToPage(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToPage(lastPage);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPage, lastPage, lightboxPhoto, page, showLoveTransition]);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || lightboxPhoto) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    if (deltaX < 0) {
      showLoveTransition(page === lastPage ? 0 : page + 1);
    } else {
      goToPage(page - 1);
    }
  };

  const timelineEvent = content.timeline[timelineIndex];
  const galleryPhoto = content.gallery[galleryIndex];
  const currentReason = content.reasons[reasonIndex];

  return (
    <main className={`story-app chapter-${chapters[page].id}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <header className="story-topbar">
        <button className="story-monogram" type="button" onClick={() => goToPage(0)} aria-label="Return to the beginning">
          {content.couple.initials}
        </button>
        <div className="chapter-progress" aria-label="Story chapters">
          {chapters.map((chapter, index) => (
            <button
              type="button"
              key={chapter.id}
              className={index === page ? "is-current" : index < page ? "is-visited" : ""}
              onClick={() => index > page ? showLoveTransition(index) : goToPage(index)}
              aria-label={`Open ${chapter.label}`}
              aria-current={index === page ? "step" : undefined}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="chapter-count" aria-live="polite">
          <strong>{String(page + 1).padStart(2, "0")}</strong>
          <span>/ {String(chapters.length).padStart(2, "0")}</span>
        </div>
      </header>

      <div className="story-viewport">
        {page === 0 ? (
          <section ref={pageRef} className="story-page hero-page" aria-labelledby="hero-title">
            <div className="paper-grain" aria-hidden="true" />
            <div className="floating-hearts" aria-hidden="true"><span>♥</span><span>♥</span><span>♥</span><span>♥</span></div>
            <div className="hero-layout page-container">
              <div className="hero-copy">
                <p className="eyebrow">Atanda &amp; Ajoke · one beautiful year</p>
                <h1 id="hero-title" tabIndex={-1}>{content.hero.title}</h1>
                <p className="hero-subtitle">{content.hero.subtitle}</p>
                <div className="hero-actions">
                  <button className="primary-button" type="button" onClick={() => showLoveTransition(1)}>
                    Relive Our Story <span aria-hidden="true">→</span>
                  </button>
                  <span className="handwritten">only the beginning</span>
                </div>
              </div>
              <div className="hero-photo-stage" aria-label="Featured memory">
                <span className="tape" aria-hidden="true" />
                <figure className="hero-polaroid">
                  <div className="hero-image"><img src={content.hero.featuredImage} alt={content.hero.featuredImageAlt} fetchPriority="high" /></div>
                  <figcaption>{content.hero.note}</figcaption>
                </figure>
                <div className="memory-stamp stamp-one" aria-hidden="true"><strong>365</strong><span>days</span></div>
                <div className="memory-stamp stamp-two" aria-hidden="true"><strong>♥</strong><span>us, always</span></div>
              </div>
            </div>
          </section>
        ) : null}

        {page === 1 ? (
          <section ref={pageRef} className="story-page letter-page" aria-labelledby="letter-title">
            <div className="page-container letter-layout">
              <StoryHeading eyebrow={content.letter.eyebrow} title={content.letter.title} intro="Some feelings deserve more than a caption." />
              <article className="letter-card">
                <span className="letter-heart" aria-hidden="true">♡</span>
                <p className="letter-greeting">{content.letter.greeting}</p>
                {content.letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p className="letter-signoff">— {content.letter.signOff}</p>
              </article>
            </div>
          </section>
        ) : null}

        {page === 2 ? (
          <section ref={pageRef} className="story-page timeline-page" aria-labelledby="timeline-title">
            <div className="page-container timeline-layout">
              <StoryHeading eyebrow="Our story, in moments" title="Where it began" intro="Move through five little chapters that brought us here." />
              <div className="timeline-feature" aria-live="polite">
                <figure className="timeline-picture" key={timelineEvent.image}>
                  <img src={timelineEvent.image} alt={timelineEvent.imageAlt} />
                  <span className="photo-corner" aria-hidden="true">{String(timelineIndex + 1).padStart(2, "0")}</span>
                </figure>
                <article className="timeline-copy" key={timelineEvent.title}>
                  <p className="timeline-date">{timelineEvent.date}</p>
                  <h3 id="timeline-title">{timelineEvent.title}</h3>
                  <p>{timelineEvent.text}</p>
                </article>
              </div>
              <div className="memory-navigation" aria-label="Timeline memories">
                <button type="button" onClick={() => setTimelineIndex((timelineIndex - 1 + content.timeline.length) % content.timeline.length)} aria-label="Previous timeline memory">←</button>
                <div className="memory-dots">
                  {content.timeline.map((event, index) => (
                    <button type="button" key={event.title} className={index === timelineIndex ? "is-current" : ""} onClick={() => setTimelineIndex(index)} aria-label={`Open ${event.title}`} aria-current={index === timelineIndex ? "true" : undefined}>
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setTimelineIndex((timelineIndex + 1) % content.timeline.length)} aria-label="Next timeline memory">→</button>
              </div>
            </div>
          </section>
        ) : null}

        {page === 3 ? (
          <section ref={pageRef} className="story-page gallery-page" aria-labelledby="gallery-title">
            <div className="page-container gallery-layout">
              <StoryHeading eyebrow="A little archive of us" title="The moments between" intro="Choose a memory, then tap the photograph to see it closer." />
              <div className="gallery-stage">
                <button className="gallery-arrow gallery-arrow-left" type="button" onClick={() => setGalleryIndex((galleryIndex - 1 + content.gallery.length) % content.gallery.length)} aria-label="Previous photograph">←</button>
                <button className="featured-polaroid" type="button" onClick={() => setLightboxPhoto(galleryPhoto)} aria-label={`Enlarge photo: ${galleryPhoto.caption}`} key={galleryPhoto.src}>
                  <span className="featured-gallery-image"><img src={galleryPhoto.src} alt={galleryPhoto.alt} /></span>
                  <span className="featured-caption" id="gallery-title">{galleryPhoto.caption}</span>
                </button>
                <button className="gallery-arrow gallery-arrow-right" type="button" onClick={() => setGalleryIndex((galleryIndex + 1) % content.gallery.length)} aria-label="Next photograph">→</button>
              </div>
              <div className="gallery-filmstrip" aria-label="Choose a photograph">
                {content.gallery.map((photo, index) => (
                  <button type="button" key={photo.src} className={index === galleryIndex ? "is-current" : ""} onClick={() => setGalleryIndex(index)} aria-label={`View ${photo.caption}`} aria-current={index === galleryIndex ? "true" : undefined}>
                    <img src={photo.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {page === 4 ? (
          <section ref={pageRef} className="story-page videos-page" aria-labelledby="video-title">
            <div className="page-container videos-layout">
              <StoryHeading eyebrow="Press play" title="Memories in motion" intro="The videos load only when you choose one." />
              <div className="video-grid" id="video-title">
                {content.videos.map((memory, index) => <VideoCard memory={memory} index={index} key={memory.src} />)}
              </div>
            </div>
          </section>
        ) : null}

        {page === 5 ? (
          <section ref={pageRef} className="story-page reasons-page" aria-labelledby="reasons-title">
            <div className="page-container reasons-layout">
              <StoryHeading eyebrow="Just a few of many" title="Reasons I love you" intro="Tap through the list. It will keep growing." />
              <div className="reason-stage" aria-live="polite">
                <span className="reason-ghost reason-ghost-left" aria-hidden="true" />
                <article className="reason-card" key={currentReason}>
                  <span className="reason-number">{String(reasonIndex + 1).padStart(2, "0")}</span>
                  <span className="reason-heart" aria-hidden="true">♡</span>
                  <p id="reasons-title">{currentReason}</p>
                </article>
                <span className="reason-ghost reason-ghost-right" aria-hidden="true" />
              </div>
              <div className="memory-navigation reason-navigation" aria-label="Reasons I love you">
                <button type="button" onClick={() => setReasonIndex((reasonIndex - 1 + content.reasons.length) % content.reasons.length)} aria-label="Previous reason">←</button>
                <div className="reason-dots">
                  {content.reasons.map((reason, index) => (
                    <button type="button" key={reason} className={index === reasonIndex ? "is-current" : ""} onClick={() => setReasonIndex(index)} aria-label={`Show reason ${index + 1}`} aria-current={index === reasonIndex ? "true" : undefined} />
                  ))}
                </div>
                <button type="button" onClick={() => setReasonIndex((reasonIndex + 1) % content.reasons.length)} aria-label="Next reason">→</button>
              </div>
            </div>
          </section>
        ) : null}

        {page === 6 ? (
          <section ref={pageRef} className={`story-page surprise-page ${surpriseOpen ? "is-open" : ""}`} aria-labelledby="surprise-title">
            <div className="surprise-hearts" aria-hidden="true">
              {Array.from({ length: 14 }).map((_, index) => <span key={index}>♥</span>)}
            </div>
            {!surpriseOpen ? (
              <div className="surprise-prompt">
                <p className="eyebrow">Before you go</p>
                <h2 id="surprise-title" tabIndex={-1}>There is one more page.</h2>
                <p>A final little piece of my heart, saved for you.</p>
                <button className="cream-button" type="button" onClick={() => setSurpriseOpen(true)}>One Last Thing…</button>
              </div>
            ) : (
              <div className="surprise-message" aria-live="polite">
                <div className="surprise-copy">
                  <p className="eyebrow">Always, in all ways</p>
                  <h2 id="surprise-title" tabIndex={-1}>{content.finalSurprise.title}</h2>
                  <p>{content.finalSurprise.message}</p>
                  <span className="handwritten light-script">Atanda + Ajoke · forever to go</span>
                </div>
                <figure className="final-polaroid">
                  <div className="final-photo"><img src={content.finalSurprise.media} alt={content.finalSurprise.mediaAlt} /></div>
                  <figcaption>one year down · forever to go</figcaption>
                </figure>
              </div>
            )}
            <footer><p>Made with love, just for you ❤️</p></footer>
          </section>
        ) : null}
      </div>

      <nav className="story-controls" aria-label="Page navigation">
        <button type="button" className="back-button" onClick={() => goToPage(page - 1)} disabled={page === 0}>
          <span aria-hidden="true">←</span> Back
        </button>
        <p><span>{chapters[page].label}</span><small>Swipe or use the arrows</small></p>
        <button type="button" className="next-button" onClick={() => showLoveTransition(page === lastPage ? 0 : page + 1)}>
          {page === lastPage ? "Begin again" : "Next"} <span aria-hidden="true">→</span>
        </button>
      </nav>

      {loveTransitionVisible ? (
        <div className="kiss-transition" aria-hidden="true" key={loveTransitionKey}>
          <div className="kiss-transition-hearts">
            {Array.from({ length: 10 }).map((_, index) => <span key={index}>♥</span>)}
          </div>
          <figure className="kiss-transition-card">
            <img src="/images/muslim-couple-kiss.webp" alt="" />
            <figcaption>love follows us to the next page</figcaption>
          </figure>
        </div>
      ) : null}

      {lightboxPhoto ? <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} /> : null}
    </main>
  );
}
