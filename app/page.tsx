import { existsSync } from "node:fs";
import path from "node:path";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Profile from "@/components/profile/Profile";
import CommandPalette from "@/components/home/CommandPalette";
import BugHunter from "@/components/bug-hunter/BugHunter";
import BreakEffect from "@/components/break/BreakEffect";
import { SITE } from "@/lib/data";

const inPublic = (p: string) => existsSync(path.join(process.cwd(), "public", p));

export default function Home() {
  return (
    <>
      {/* #site is what break() splits in two. */}
      <div id="site" className="flex flex-1 flex-col">
        <Header />
        <main className="frame-x mx-auto w-full max-w-[672px] flex-1 pt-14">
          <Profile hasAvatar={inPublic(SITE.avatar)} />
        </main>
        <Footer />
      </div>
      <CommandPalette />
      <BugHunter />
      <BreakEffect />
    </>
  );
}
