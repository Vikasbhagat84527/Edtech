import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroSection from "@/src/components/HeroSection";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <HeroSection />
    </div>
  );
}
