import "./globals.css";

export const metadata = {
  title: "Feranmite | Nigerian Techie Tweet AI",
  description: "AI-powered tweet generator for Nigerian tech lifestyle. Powered by FeranmiteTech.",
  openGraph: {
    title: "Feranmite Tweet AI",
    description: "Unlimited AI-generated tweets for Nigerian techies.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
