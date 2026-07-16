/**
 * ---------------------------------------------------------------------------
 * EDIT YOUR STORY HERE
 * ---------------------------------------------------------------------------
 * Change the words, dates, image paths and video paths in this file only.
 * Put replacement photos in /public/images and MP4 files in /public/videos,
 * then update the matching path below (paths always begin with a forward slash).
 */

export type TimelineEvent = {
  date: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type VideoMemory = {
  src: string;
  poster: string;
  caption: string;
  description: string;
};

export const anniversaryContent = {
  couple: {
    initials: "A + J", // CHANGE: your initials
    dateRange: "OUR FIRST YEAR · 2025—2026", // CHANGE: your anniversary years
  },
  hero: {
    title: "Happy One-Year Anniversary, My Love ❤️",
    subtitle: "365 days of love, laughter and beautiful memories.",
    featuredImage: "/images/hero-memory.webp", // CHANGE: featured photo
    featuredImageAlt: "A warm placeholder for your favourite photo together",
    note: "my favourite place is beside you",
  },
  letter: {
    eyebrow: "From my heart",
    title: "A letter for you",
    greeting: "My love,",
    // CHANGE: replace this placeholder letter with your own words.
    paragraphs: [
      "This past year with you has made ordinary days feel rare and beautiful. Thank you for every quiet laugh, every unexpected adventure, and every kindness that became part of our story.",
      "I love the way you make the world feel softer, the way your smile changes a room, and the way even the smallest moments become memories when I am with you.",
      "This is only the beginning. I cannot wait for all the places we will go, the dreams we will build, and the versions of us we have yet to meet.",
    ],
    signOff: "Forever yours, always.", // CHANGE: your sign-off
  },
  timeline: [
    {
      date: "16 JULY 2025", // CHANGE: real date
      title: "The day we met",
      text: "The little moment that quietly changed everything. Replace this with where you met and what you first noticed about her.",
      image: "/images/timeline-met.webp",
      imageAlt: "Placeholder for a photo from the day we met",
    },
    {
      date: "02 AUGUST 2025",
      title: "Our first date",
      text: "The conversation that lasted too long, the smile I kept replaying, and the beginning of something wonderful.",
      image: "/images/timeline-date.webp",
      imageAlt: "Placeholder for a photo from our first date",
    },
    {
      date: "18 OCTOBER 2025",
      title: "Our first trip",
      text: "New roads, shared playlists, and the feeling that anywhere could feel like home with you beside me.",
      image: "/images/timeline-trip.webp",
      imageAlt: "Placeholder for a photo from our first trip",
    },
    {
      date: "14 FEBRUARY 2026",
      title: "A favourite memory",
      text: "Add the private joke, the ordinary afternoon, or the magical night you both still talk about.",
      image: "/images/timeline-favourite.webp",
      imageAlt: "Placeholder for a favourite memory together",
    },
    {
      date: "16 JULY 2026",
      title: "One year of us",
      text: "Twelve months, countless memories, and a love that feels more like home with every passing day.",
      image: "/images/timeline-anniversary.webp",
      imageAlt: "Placeholder for our one-year anniversary photo",
    },
  ] satisfies TimelineEvent[],
  gallery: [
    { src: "/images/gallery-01.webp", alt: "Placeholder for a candid couple photo", caption: "the laugh I never want to forget" },
    { src: "/images/gallery-02.webp", alt: "Placeholder for a sunset memory", caption: "golden hour, with you" },
    { src: "/images/gallery-03.webp", alt: "Placeholder for a cosy memory", caption: "our softest kind of happy" },
    { src: "/images/gallery-04.webp", alt: "Placeholder for a travel photo", caption: "a little farther, together" },
    { src: "/images/gallery-05.webp", alt: "Placeholder for a date-night photo", caption: "still choosing you" },
    { src: "/images/gallery-06.webp", alt: "Placeholder for an anniversary photo", caption: "only the beginning" },
  ] satisfies GalleryPhoto[],
  videos: [
    {
      src: "/videos/memory-01.mp4", // CHANGE: your first MP4
      poster: "/images/video-poster-01.webp",
      caption: "The way this day felt",
      description: "Replace this with a favourite short video memory.",
    },
    {
      src: "/videos/memory-02.mp4", // CHANGE: your second MP4
      poster: "/images/video-poster-02.webp",
      caption: "A moment worth replaying",
      description: "Replace this with another favourite short video memory.",
    },
  ] satisfies VideoMemory[],
  reasons: [
    "You make ordinary days feel special.",
    "Your laugh is still my favourite sound.",
    "You see the best in me, even when I forget to.",
    "You are both my calm and my greatest adventure.",
    "Every version of the future is brighter with you in it.",
    "With you, love feels like home.",
  ],
  finalSurprise: {
    title: "If I could choose again…",
    message: "I would find you sooner, love you longer, and choose you in every lifetime. Happy one year, my love. Here is to forever beginning with us. ❤️", // CHANGE: final message
    media: "/images/final-memory.webp", // CHANGE: final photo or video poster
    mediaAlt: "Placeholder for one final favourite photo together",
  },
} as const;

export type AnniversaryContent = typeof anniversaryContent;
