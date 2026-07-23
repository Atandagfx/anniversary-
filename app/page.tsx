import { PinGate } from "../components/PinGate";
import { anniversaryContent } from "../data/relationship";

export const dynamic = "force-dynamic";

export default function Home() {
  // The story unlocks only in the current browser view. Refreshing or opening
  // the link again remounts this gate and requires the PIN every time.
  return <PinGate content={anniversaryContent} />;
}
