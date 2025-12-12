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
      {/* Botón cerrar */}
      <Link
        href="/"
        aria-label="Volver a inicio"
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

      <h1>Política de Privacidad</h1>

      <p>
        Probabify utiliza la API de Spotify para analizar las canciones más
        escuchadas por el usuario y generar contenido con fines recreativos.
      </p>

      <p>
        Probabify no almacena, vende ni comparte datos personales. La información
        se utiliza únicamente de forma temporal para generar los resultados que
        ves en la aplicación.
      </p>

      <p>
        Este sitio puede utilizar servicios de terceros como Google AdSense, los
        cuales pueden usar cookies para mostrar anuncios basados en visitas
        previas a este u otros sitios web.
      </p>

      <p>
        Al utilizar este sitio web, aceptas esta Política de Privacidad.
      </p>
    </main>
  );
}
