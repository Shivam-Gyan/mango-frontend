"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProfile } from "@/context/page";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useProfile();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background text-foreground px-6 py-10 md:py-20">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600">Mango</h1>
        {user ? (
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button onClick={() => router.push("/auth/login")}>Login</Button>
            <Button onClick={() => router.push("/auth/signup")}>Sign Up</Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl w-full gap-12">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Manage Tasks & Analytics <br /> Effortlessly with Mango
          </h2>
          <p className="text-muted-foreground text-lg">
            Centralize your workflow, track tasks, and gain insights with our modern management dashboard.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button size="lg" onClick={() => router.push(user ? "/dashboard" : "/auth/signup")}>
              {user ? "Go to Dashboard" : "Get Started"}
            </Button>
            {user && (
              <Button size="lg" variant="outline" onClick={() => router.push("/dashboard")}>
                View Tasks
              </Button>
            )}
          </div>
        </div>

        <div className="md:w-1/2 relative w-full h-[300px] md:h-[400px]">
          <Image
            src="https://res.cloudinary.com/dglwzejwk/image/upload/v1752408282/df2b373b-fc0b-4838-befb-5daa7a6ca4fd.png"
            alt="Mango dashboard preview"
            fill
            className="rounded-xl object-cover shadow-xl"
            priority
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-6xl mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-green-600">Task Management</h3>
          <p className="text-muted-foreground text-sm">
            Create, update, and track all your tasks seamlessly with our interactive dashboard.
          </p>
        </div>
        <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-green-600">Analytics Dashboard</h3>
          <p className="text-muted-foreground text-sm">
            Visualize productivity and performance metrics using interactive charts and tables.
          </p>
        </div>
        <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-green-600">Real-time Updates</h3>
          <p className="text-muted-foreground text-sm">
            Tasks and data are updated instantly so your team can stay aligned and productive.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Mango – The Management App. All rights reserved.
      </footer>
    </div>
  );
}
