import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    // "/entry/:path*",
    // "/contacts/:path*",
    // "/profile/:path*",
  ],
};
