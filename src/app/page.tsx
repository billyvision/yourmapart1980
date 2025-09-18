import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="h-16 flex items-center justify-center">
              <div className="text-muted-foreground">
                {/* Logo placeholder */}
                <div className="w-48 h-12 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                  <span className="text-sm">Your Logo Here</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 py-16">
              <h1 className="text-6xl font-bold tracking-tight">
                Custom Map Art
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your favorite locations into beautiful, personalized artwork
              </p>
              <div className="pt-8">
                <Button size="lg">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
