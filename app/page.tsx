import { cookies } from "next/headers";
import { AnniversarySite } from "../components/AnniversarySite";
import { PinGate } from "../components/PinGate";
import { anniversaryContent } from "../data/relationship";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "../lib/access";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!verifyAccessToken(accessCookie)) {
    return <PinGate />;
  }

  return <AnniversarySite content={anniversaryContent} />;
}
