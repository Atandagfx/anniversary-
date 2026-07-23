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
    yourName: "Atanda", // CHANGE: your name
    partnerName: "Ajoke", // CHANGE: your partner's name
    initials: "A + A", // CHANGE: your initials
    anniversaryDate: "05 AUGUST 2026", // CHANGE: your anniversary date
    dateRange: "OUR FIRST YEAR · 05 AUG 2025—05 AUG 2026", // CHANGE: your anniversary years
  },
  hero: {
    title: "Happy One-Year Anniversary, Ajoke ❤️",
    subtitle: "365 days of choosing you, laughing with you, and building our beautiful story.",
    featuredImage: "/images/hero-memory.webp", // CHANGE: featured photo
    featuredImageAlt: "A collage of Atanda and Ajoke's memories together",
    note: "my favourite story is ours",
  },
  letter: {
    eyebrow: "From my heart",
    title: "A letter for you",
    greeting: "My dearest Ajoke,",
    // CHANGE: replace this placeholder letter with your own words.
    paragraphs: [
      "One year ago, we began a story I never want to stop reading. You have filled my days with laughter, warmth, and the kind of love that makes even ordinary moments feel unforgettable.",
      "Thank you for being my peace, my favourite person, and the smile I look for in every room. Every photograph here holds a moment, but what I treasure most is how it felt to live each one beside you.",
      "Ajoke, this first year is only our opening chapter. I cannot wait for all the adventures, quiet mornings, dreams, and anniversaries still waiting for Atanda and Ajoke.",
    ],
    signOff: "Forever yours, Atanda.", // CHANGE: your sign-off
  },
  timeline: [
    {
      date: "05 AUGUST 2025", // CHANGE: real date
      title: "The day our story began",
      text: "The beginning of us—the moment life quietly started arranging itself into something more beautiful.",
      image: "/images/timeline-met.webp",
      imageAlt: "Ajoke smiling in a favourite early photograph",
    },
    {
      date: "OUR FIRST DATE",
      title: "Our first date",
      text: "The conversation, the little glances, and the feeling that I had just found someone truly special.",
      image: "/images/timeline-date.webp",
      imageAlt: "Ajoke smiling during a date together",
    },
    {
      date: "OUR FIRST TRIP",
      title: "Our first trip",
      text: "A new place, a shared adventure, and the discovery that anywhere feels like home when you are beside me.",
      image: "/images/timeline-trip.webp",
      imageAlt: "Atanda and Ajoke capturing a memory together on their first trip",
    },
    {
      date: "A FAVOURITE DAY",
      title: "A favourite memory",
      text: "One of those moments that still makes me smile—the kind of memory I would happily live all over again.",
      image: "/images/timeline-favourite.webp",
      imageAlt: "A favourite playful memory shared by Atanda and Ajoke",
    },
    {
      date: "05 AUGUST 2026",
      title: "One year of us",
      text: "Twelve months, countless memories, and a love that feels more like home with every passing day. Happy anniversary, Ajoke.",
      image: "/images/timeline-anniversary.webp",
      imageAlt: "Atanda and Ajoke together in an anniversary memory",
    },
  ] satisfies TimelineEvent[],
  gallery: [
    { src: "/images/gallery-01.webp", alt: "A phone capturing a cherished photo of Atanda and Ajoke", caption: "our memories inside our memories" },
    { src: "/images/gallery-02.webp", alt: "Atanda and Ajoke smiling together", caption: "the smile I always choose" },
    { src: "/images/gallery-03.webp", alt: "A playful behind-the-scenes moment on a screen", caption: "our wonderfully unserious moments" },
    { src: "/images/gallery-04.webp", alt: "Atanda and Ajoke relaxing together", caption: "our softest kind of happy" },
    { src: "/images/gallery-05.webp", alt: "A candid moment shared by Atanda and Ajoke", caption: "the beauty in our ordinary days" },
    { src: "/images/gallery-06.webp", alt: "Atanda and Ajoke taking a mirror photograph", caption: "still choosing you, every day" },
  ] satisfies GalleryPhoto[],
  videos: [
    {
      src: "/videos/memory-01.mp4", // CHANGE: first complete video
      poster: "/images/video-poster-01.webp",
      caption: "A moment worth keeping",
      description: "One complete favourite memory from our beautiful first year.",
    },
    {
      src: "/videos/memory-02.mp4", // CHANGE: second complete video
      poster: "/images/video-poster-02.webp",
      caption: "Us, in motion",
      description: "Because some memories deserve to be felt all over again.",
    },
    {
      src: "/videos/memory-03.mp4", // CHANGE: third complete video
      poster: "/images/video-poster-03.webp",
      caption: "The sweetest little moment",
      description: "A short memory, but one that will always make me smile.",
    },
    {
      src: "/videos/memory-04.mp4", // CHANGE: fourth complete video
      poster: "/images/video-poster-04.webp",
      caption: "Another piece of our story",
      description: "One more beautiful second of Atanda and Ajoke, kept with love.",
    },
  ] satisfies VideoMemory[],
  reasons: [
    "Ajoke, you make ordinary days feel special.",
    "Your smile can change the whole direction of my day.",
    "You see the best in me, even when I forget to.",
    "You are both my calm and my favourite adventure.",
    "Every version of the future is brighter with you in it.",
    "With you, love feels like home.",
  ],
  finalSurprise: {
    title: "If I could choose again…",
    message: "I would find you sooner, love you longer, and choose you in every lifetime. Happy one-year anniversary, Ajoke. From your Atanda—with all my heart, today and always. ❤️", // CHANGE: final message
    media: "/images/final-memory.webp", // CHANGE: final photo or video poster
    mediaAlt: "Atanda and Ajoke standing together outdoors",
  },
} as const;

export type AnniversaryContent = typeof anniversaryContent;
