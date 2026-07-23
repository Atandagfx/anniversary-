# Our One-Year Anniversary ❤️

A romantic, mobile-first anniversary website built with Next.js and Tailwind CSS. It includes a server-checked PIN gate, editable love letter, relationship timeline, Polaroid gallery with a lightbox, four lazy-loaded video memories, animated reasons cards, a personalised illustrated page transition, and a final surprise reveal.

## Page-by-page navigation

The story is presented as seven interactive chapters instead of one long scrolling page:

1. Welcome
2. Love letter
3. Relationship timeline
4. Photo gallery
5. Video memories
6. Reasons I love you
7. Final surprise

Visitors can move between chapters with the persistent **Back** and **Next** buttons, the progress markers at the top, the left/right keyboard arrows, or a horizontal swipe on a phone. The timeline, gallery, and reasons chapters have their own controls for moving through individual memories.

Every forward page change shows a short custom animation of Atanda and Ajoke. The illustration is stored at `public/images/muslim-couple-kiss.webp` and is based on the supplied couple photograph.

## Set the private PIN

The PIN is checked on the server and is never included in the browser code or committed to GitHub. A successful unlock lasts only in the current page view: refreshing, reopening, or opening the link in another tab always returns to the PIN screen.

For local development, copy `.env.example` to `.env.local`, then replace the placeholder value:

```bash
cp .env.example .env.local
```

```text
ANNIVERSARY_PIN=your-numeric-pin
```

For Vercel, add `ANNIVERSARY_PIN` under **Project Settings → Environment Variables** for Production, Preview, and Development, then redeploy.

## The one file to edit

All relationship text and media paths live in:

```text
data/relationship.ts
```

That file is deliberately labelled with `CHANGE:` comments. Edit it to update:

- initials and anniversary years
- hero text and featured photo
- love-letter paragraphs and sign-off
- timeline dates, stories, and photos
- gallery captions and image paths
- video files, posters, and captions
- “Reasons I Love You” messages
- the final-surprise message and photo

You do not need to edit the page component for normal personalisation.

## Replace the photos

1. Prepare each photo as `.webp`, `.jpg`, or `.png`. WebP is recommended because it is usually much smaller.
2. Put the files in `public/images/`.
3. Open `data/relationship.ts` and replace the relevant path, for example:

```ts
featuredImage: "/images/our-favourite-photo.webp"
```

The included placeholders show the intended aspect ratios. For the best crop:

- hero photo: portrait, around `1200 × 1500`
- timeline photos: landscape, around `1200 × 900`
- gallery photos: portrait, around `1200 × 1500`
- video posters: landscape, `16:10` or `16:9`
- final photo: landscape, around `1200 × 900`

Always update the matching `alt` or `imageAlt` description so the site remains accessible.

## Replace the videos

1. Export short videos as H.264 `.mp4` files for the broadest iPhone compatibility.
2. Keep the original aspect ratio; the cards use `object-fit: contain` and will not stretch the video.
3. Put the videos in `public/videos/`.
4. Add a poster image for each video to `public/images/`.
5. Update both paths in `data/relationship.ts`:

```ts
{
  src: "/videos/our-trip.mp4",
  poster: "/images/our-trip-poster.webp",
  caption: "Our first trip",
  description: "A short description of this memory.",
}
```

Videos do not autoplay. The full MP4 is only inserted after the visitor taps a video card, reducing initial data use on mobile.

The current site uses four independent MP4 files:

- `public/videos/memory-01.mp4`
- `public/videos/memory-02.mp4`
- `public/videos/memory-03.mp4`
- `public/videos/memory-04.mp4`

## Image optimisation tips

- Export photos as WebP at roughly 75–85% quality.
- Resize large phone photos to a maximum width of about 1600px before adding them.
- Keep the hero image below about 500KB and gallery images below about 300KB when possible.
- Keep `public/og.png`; it is the link-preview image used by iMessage and social apps.

The included placeholder images are already compressed WebP files. Gallery and timeline images use native lazy loading so they are requested only as the visitor approaches them.

## Run locally

Use Node.js 22 or newer.

```bash
pnpm install
pnpm dev
```

Then open the local address shown in the terminal.

## Production checks

```bash
pnpm build
pnpm test
```

`pnpm build` creates the production site. `pnpm test` rebuilds and checks that the key anniversary sections render correctly.

## Deploy to Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repository.
2. Leave the detected framework as **Next.js** and keep the default build settings.
3. Add `ANNIVERSARY_PIN` as an environment variable before deploying.
4. Deploy, then visit the generated Vercel URL and enter the PIN.

The Vercel URL is publicly reachable, but the anniversary content is server-gated behind the PIN. The repository does not contain the PIN.

## Project map

```text
app/
  api/unlock/route.ts  server-side PIN verification
  globals.css        colours, typography, layout, and animations
  layout.tsx         page metadata and social sharing
  page.tsx           page entry
components/
  AnniversarySite.tsx  sections and interactions
  PinGate.tsx          PIN entry screen
data/
  relationship.ts    all personal content and media paths
public/
  images/             photos, posters, favicon, and social image
  videos/             local MP4 memories
lib/
  access.ts           server-side PIN helper
```

## Accessibility and motion

- All meaningful photos have editable alt text.
- The gallery lightbox closes with the Escape key and uses a labelled dialog.
- Videos use native accessible controls and never autoplay.
- Buttons include clear labels and large touch targets.
- Animations automatically reduce when the visitor has “Reduce Motion” enabled.
