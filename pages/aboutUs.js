import Navbar from "../src/components/Navbar";

export default function AboutUs() {
  return (
    <>
      <div className="fixed inset-0 z-0 animate-bg-pan bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%]"></div>
      <Navbar />
      <main className="relative max-w-2xl mx-auto mt-8 p-6 min-h-screen pt-20 z-10 text-foreground">
        <div className="bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-xl border border-blue-200/60 dark:border-blue-900/60 p-8">
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 text-center">À propos de Breezy</h1>
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-2">L&apos;intérêt du site</h2>
            <p className="text-gray-800 dark:text-gray-200 mb-2">
              Breezy est un réseau social moderne pensé pour favoriser l&apos;échange, la créativité et la bienveillance. Notre objectif est de proposer une plateforme simple, fluide et agréable pour partager vos idées, vos passions et interagir avec une communauté dynamique.
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              Ici, chaque utilisateur peut publier, commenter, suivre d&apos;autres membres et personnaliser son profil dans un environnement sécurisé et respectueux.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-2">Notre histoire</h2>
            <p className="text-gray-800 dark:text-gray-200">
              Breezy a été imaginé et développé en 2025 par cinq étudiants de l&apos;école d&apos;ingénieurs CESI, passionnés de développement web et d&apos;innovation numérique. Ce projet est né d&apos;une volonté commune de créer un espace social plus humain, accessible et respectueux de la vie privée.
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>Projet réalisé dans le cadre du cursus CESI</li>
              <li>Stack technique : React, Next.js, Node.js, MongoDB, Tailwind CSS</li>
              <li>Design et fonctionnalités pensés pour l&apos;expérience utilisateur</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-2">Conditions Générales d&apos;Utilisation (CGU)</h2>
            <p className="text-gray-800 dark:text-gray-200 mb-2">
              L&apos;utilisation de Breezy implique l&apos;acceptation des règles suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-sm mb-2">
              <li>Respect d&apos;autrui : tout propos haineux, discriminatoire ou illégal est strictement interdit.</li>
              <li>Protection des données : vos informations personnelles ne sont jamais revendues à des tiers.</li>
              <li>Modération : l&apos;équipe se réserve le droit de supprimer tout contenu inapproprié.</li>
              <li>Utilisation responsable : chaque utilisateur est responsable de ses publications.</li>
            </ul>
            <p className="text-gray-800 dark:text-gray-200 text-xs">
              Pour toute question ou signalement, contactez l&apos;équipe via le formulaire de contact.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Politique de cookies</h2>
            <p className="text-gray-800 dark:text-gray-200 mb-2">
              Breezy utilise uniquement des cookies essentiels au bon fonctionnement du site (authentification, sécurité, préférences de thème). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-xs">
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
