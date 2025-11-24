import { StackClientApp } from "@stackframe/stack";

export const stackApp = new StackClientApp({
    tokenStore: "nextjs-cookie",
    urls: {
        signIn: "/sign-in",
        signUp: "/sign-up",
        afterSignIn: "/",
        afterSignUp: "/",
        afterSignOut: "/sign-in",
    },
});
