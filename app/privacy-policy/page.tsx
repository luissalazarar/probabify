// app/privacy-policy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 24px",
        lineHeight: 1.6,
      }}
    >
      <h1>Privacy Policy</h1>

      <p>
        Probabify uses the Spotify API to analyze a user’s top tracks and generate
        entertainment content.
      </p>

      <p>
        We do not store, sell, or share personal data. All data is used only
        temporarily to generate results.
      </p>

      <p>
        Probabify may use third-party services such as Google AdSense, which may
        use cookies to serve ads based on previous visits to this website.
      </p>

      <p>
        By using this website, you agree to this Privacy Policy.
      </p>
    </main>
  );
}
