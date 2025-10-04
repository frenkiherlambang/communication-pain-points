import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrismBackground from "@/components/prism-background";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <PrismBackground />
      
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-3xl p-8">
          <Badge variant="outline" className="mb-4 text-red-800  bg-white/80 dark:bg-black/50 dark:text-red-500 ">
            SIRENE Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 drop-shadow-lg">
            SIRENE
            <span className="block text-red-800 dark:text-red-500">Communication Intelligence</span>
          </h1>
          <p className="text-xl text-slate-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Identify and resolve customer communication frustrations across all your products. 
            From pre-purchase inquiries to after-sales support, we strengthen trust and improve brand perception.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button asChild size="lg" className="bg-red-700 hover:bg-red-800">
              <Link href="/login">Access Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className=" text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          
          
          <div className="relative backdrop-blur-sm bg-white/95 dark:bg-neutral-900/95 rounded-3xl  shadow-2xl ">
            <video 
              className="w-full aspect-video h-auto rounded-2xl shadow-lg"
              controls
              autoPlay
              preload="metadata"
              poster="/video_landing.mp4"
            >
              <source src="/video_landing.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-2xl p-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 drop-shadow-lg">
            How SIRENE Works
          </h2>
          <p className="text-lg text-slate-700 dark:text-gray-200 drop-shadow-md">
            Four powerful steps to transform customer feedback into action
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Listen */}
          <SpotlightCard spotlightColor="rgba(139, 0, 0, 0.25)" className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm  hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👂</span>
              <h3 className="text-red-800 dark:text-red-500 font-semibold text-lg">Listen</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-gray-300">
              Pull raw feedback through CSV upload. Collect all customer messages, questions, and concerns from your communication channels in one place.
            </p>
          </SpotlightCard>

          {/* Cluster */}
          <SpotlightCard spotlightColor="rgba(139, 0, 0, 0.25)" className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm  hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔄</span>
              <h3 className="text-red-800 dark:text-red-500 font-semibold text-lg">Cluster</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-gray-300">
              Auto-group messages into themes (e.g., Installment unclear, Preorder delays). AI identifies patterns and common topics across your feedback.
            </p>
          </SpotlightCard>

          {/* Prioritize */}
          <SpotlightCard spotlightColor="rgba(139, 0, 0, 0.25)" className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm  hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📊</span>
              <h3 className="text-red-800 dark:text-red-500 font-semibold text-lg">Prioritize</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-gray-300">
              Score by Frequency × Severity ÷ Fix Cost. Focus your team&apos;s attention on the issues that matter most and deliver the highest impact.
            </p>
          </SpotlightCard>

          {/* Act */}
          <SpotlightCard spotlightColor="rgba(139, 0, 0, 0.25)" className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm  hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚀</span>
              <h3 className="text-red-800 dark:text-red-500 font-semibold text-lg">Act</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-gray-300">
              Spin a Campaign Brief, FAQ/Helpcard, or Fix task from a cluster. Turn insights into concrete actions that improve customer experience.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center max-w-4xl mx-auto  ">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 drop-shadow-md">
            Ready to Transform Customer Communications?
          </h3>
          <p className="text-slate-700 dark:text-gray-200 mb-6">
            Join SIRENE and start identifying communication pain points with advanced intelligence today.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button asChild size="lg" className="bg-red-700 hover:bg-red-800">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className=" text-red-800 hover:bg-red-50 dark:text-red-500  dark:hover:bg-red-950">
              <Link href="/dashboard/customer-feedbacks">Analyze Feedbacks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <div className="backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-xl p-4 inline-block">
          <p className="text-slate-700 dark:text-gray-300 drop-shadow-md">&copy; 2024 SIRENE - Communication Intelligence Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
