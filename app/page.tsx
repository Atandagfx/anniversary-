import { AnniversarySite } from "../components/AnniversarySite";
import { anniversaryContent } from "../data/relationship";

export default function Home() {
  return <AnniversarySite content={anniversaryContent} />;
}
