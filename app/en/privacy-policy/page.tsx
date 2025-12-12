import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 24px",
        lineHeight: 1.6,
        position: "relative",
      }}
    >
      {/* Close button */}
      <Link
        href="/"
        aria-label="Back to home"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 18,
          textDecoration: "none",
          color: "#64748B",
        }}
      >
        ✕
      </Link>

      <h1>Privacy Policy</h1>

      <p>
        Probabify uses the Spotify API to analyze the user&apos;s most-played
        songs and generate content for entertainment purposes.
      </p>

      <p>
        Probabify does not store, sell, or share personal data. Information is
        used only temporarily to generate the results you see in the app.
      </p>

      <p>
        This site may use third-party services such as Google AdSense, which may
        use cookies to show ads based on previous visits to this or other
        websites.
      </p>

      <p>By using this website, you agree to this Privacy Policy.</p>
    </main>
  );
}
