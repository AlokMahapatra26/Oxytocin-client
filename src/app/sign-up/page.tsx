'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { stackApp } from '@/lib/stack';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signUpWithGithub = async () => {
        setLoading(true);
        try {
            await stackApp.signInWithOAuth('github');
        } catch (error) {
            console.error('Sign up error:', error);
            setLoading(false);
        }
    };

    const signUpWithGoogle = async () => {
        setLoading(true);
        try {
            await stackApp.signInWithOAuth('google');
        } catch (error) {
            console.error('Sign up error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md space-y-8 p-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
                    <p className="mt-2 text-muted-foreground">
                        Sign up to get started with Oxytosin
                    </p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-4">
                    <Button
                        onClick={signUpWithGithub}
                        disabled={loading}
                        className="w-full h-12 text-base"
                        variant="outline"
                    >
                        <Github className="mr-2 h-5 w-5" />
                        Continue with GitHub
                    </Button>

                    <Button
                        onClick={signUpWithGoogle}
                        disabled={loading}
                        className="w-full h-12 text-base"
                        variant="outline"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                        onClick={() => router.push('/sign-in')}
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}
