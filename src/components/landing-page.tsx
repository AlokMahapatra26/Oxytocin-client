'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
            {/* Hero Section */}
            <div className="container mx-auto px-6 pt-32 pb-24">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}

                    {/* Headline */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-fade-in-up">
                        Test your APIs with
                        <br />
                        <span className="bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent">
                            Oxytocin
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
                        A clean, powerful API testing tool which is 100% free and always will be.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-200">
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg group"
                            onClick={() => router.push('/sign-up')}
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg"
                            onClick={() => router.push('/sign-in')}
                        >
                            Sign In
                        </Button>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32">
                    <div className="group p-8 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:border-accent/30">

                        <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Test your endpoints instantly with our optimized proxy architecture.
                        </p>
                    </div>

                    <div className="group p-8 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:border-accent/30">

                        <h3 className="text-xl font-semibold mb-3">Organized</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Keep your requests structured with collections and folders.
                        </p>
                    </div>

                    <div className="group p-8 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:border-accent/30">

                        <h3 className="text-xl font-semibold mb-3">Secure</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data stays private with client-side storage and secure auth.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border mt-32">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>© 2025 Oxytosin. Crafted with care.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-foreground transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="hover:text-foreground transition-colors">
                                Terms
                            </a>
                            <a href="#" className="hover:text-foreground transition-colors">
                                Docs
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
