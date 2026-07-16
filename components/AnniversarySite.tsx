"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AnniversaryContent, GalleryPhoto, VideoMemory } from "../data/relationship";

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ number, eyebrow, title, intro }: { number: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <Reveal className="section-heading">
      <span className="section-number" aria-hidden="true">{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
    </Reveal>
  );
}

function Lightbox({ photo, onClose }: { photo: GalleryPhoto; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.caption} onClick={onClose}>
      <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close enlarged photo">×</button>
      <figure className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-image">
          <img src={photo.src} alt={photo.alt} loading="eager" />
        </div>
        <figcaption>{photo.caption}</figcaption>
      </figure>
    </div>
  );
}

function VideoCard({ memory, index }: { memory: VideoMemory; index: number }) {
  const [selected, setSelected] = useState(false);

  return (
    <Reveal className="video-card" delay={index * 100}>
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
            <span className="video-hint">Tap to load memory</span>
          </button>
        )}
      </div>
      <div className="video-copy">
        <p className="eyebrow">Memory {String(index + 1).padStart(2, "0")}</p>
        <h3>{memory.caption}</h3>
        <p>{memory.description}</p>
      </div>
    </Reveal>
  );
}

export function AnniversarySite({ content }: { content: AnniversaryContent }) {
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [surpriseOpen, setSurpriseOpen] = useState(false);

  const scrollToStory = () => document.getElementById("love-letter")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="paper-grain" aria-hidden="true" />
        <div className="floating-hearts hero-hearts" aria-hidden="true">
          <span>♥</span><span>♥</span><span>♥</span><span>♥</span>
        </div>
        <nav className="hero-nav" aria-label="Anniversary story">
          <span className="initials">{content.couple.initials}</span>
          <span>{content.couple.dateRange}</span>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">365 days · our first chapter</p>
            <h1 id="hero-title">{content.hero.title}</h1>
            <p className="hero-subtitle">{content.hero.subtitle}</p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={scrollToStory}>
                Relive Our Story <span aria-hidden="true">↓</span>
              </button>
              <span className="handwritten">only the beginning</span>
            </div>
          </div>
          <div className="hero-photo-stage" aria-label="Featured memory">
            <div className="tape tape-top" aria-hidden="true" />
            <figure className="hero-polaroid">
              <div className="hero-image">
                <img src={content.hero.featuredImage} alt={content.hero.featuredImageAlt} loading="eager" fetchPriority="high" />
              </div>
              <figcaption>{content.hero.note}</figcaption>
            </figure>
            <div className="mini-polaroid mini-polaroid-one" aria-hidden="true"><span>365</span><small>days</small></div>
            <div className="mini-polaroid mini-polaroid-two" aria-hidden="true"><span>♥</span><small>us, always</small></div>
          </div>
        </div>
        <div className="hero-curve" aria-hidden="true" />
      </section>

      <section className="love-letter section-shell" id="love-letter" aria-labelledby="letter-title">
        <SectionHeading number="01" eyebrow={content.letter.eyebrow} title={content.letter.title} intro="Some feelings deserve more than a caption." />
        <Reveal className="letter-card">
          <span className="letter-heart" aria-hidden="true">♡</span>
          <p className="letter-greeting">{content.letter.greeting}</p>
          {content.letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="letter-signoff">— {content.letter.signOff}</p>
        </Reveal>
      </section>

      <section className="timeline-section section-shell" aria-labelledby="timeline-title">
        <SectionHeading number="02" eyebrow="Our story, in moments" title="Where it began" intro="Five little chapters that brought us here." />
        <div className="timeline" id="timeline-title">
          {content.timeline.map((event, index) => (
            <Reveal className={`timeline-event ${index % 2 ? "timeline-right" : ""}`} key={event.title}>
              <div className="timeline-dot" aria-hidden="true"><span>♥</span></div>
              <div className="timeline-photo">
                <img src={event.image} alt={event.imageAlt} loading="lazy" />
              </div>
              <div className="timeline-copy">
                <p className="timeline-date">{event.date}</p>
                <h3>{event.title}</h3>
                <p>{event.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="section-shell">
          <SectionHeading number="03" eyebrow="A little archive of us" title="The moments between" intro="Tap any photo to see it closer." />
          <div className="polaroid-grid" id="gallery-title">
            {content.gallery.map((photo, index) => (
              <Reveal className={`gallery-reveal gallery-${index + 1}`} delay={index * 60} key={photo.src}>
                <button className="polaroid-card" type="button" onClick={() => setLightboxPhoto(photo)} aria-label={`Enlarge photo: ${photo.caption}`}>
                  <span className="gallery-image"><img src={photo.src} alt={photo.alt} loading="lazy" /></span>
                  <span className="polaroid-caption">{photo.caption}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="video-section section-shell" aria-labelledby="video-title">
        <SectionHeading number="04" eyebrow="Press play" title="Memories in motion" intro="Videos stay light and fast until you choose one." />
        <div className="video-grid" id="video-title">
          {content.videos.map((memory, index) => <VideoCard memory={memory} index={index} key={memory.src} />)}
        </div>
      </section>

      <section className="reasons-section" aria-labelledby="reasons-title">
        <div className="section-shell">
          <SectionHeading number="05" eyebrow="Just a few of many" title="Reasons I love you" intro="The list keeps growing." />
          <div className="reasons-grid" id="reasons-title">
            {content.reasons.map((reason, index) => (
              <Reveal className="reason-card" delay={(index % 3) * 90} key={reason}>
                <span className="reason-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="reason-heart" aria-hidden="true">♡</span>
                <p>{reason}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`surprise-section ${surpriseOpen ? "surprise-open" : ""}`} aria-labelledby="surprise-title">
        <div className="surprise-stars" aria-hidden="true">✦ · ✦ · ✦</div>
        {!surpriseOpen ? (
          <Reveal className="surprise-prompt">
            <p className="eyebrow">Before you go</p>
            <h2 id="surprise-title">There is one more page.</h2>
            <button className="cream-button" type="button" onClick={() => setSurpriseOpen(true)}>One Last Thing…</button>
          </Reveal>
        ) : (
          <div className="surprise-reveal" aria-live="polite">
            <div className="surprise-hearts" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, index) => <span key={index}>♥</span>)}
            </div>
            <Reveal className="surprise-message">
              <p className="eyebrow">Always, in all ways</p>
              <h2 id="surprise-title">{content.finalSurprise.title}</h2>
              <p>{content.finalSurprise.message}</p>
              <figure>
                <div className="final-photo"><img src={content.finalSurprise.media} alt={content.finalSurprise.mediaAlt} loading="lazy" /></div>
                <figcaption>one year down · forever to go</figcaption>
              </figure>
            </Reveal>
          </div>
        )}
      </section>

      <footer><p>Made with love, just for you ❤️</p></footer>
      {lightboxPhoto ? <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} /> : null}
    </main>
  );
}
