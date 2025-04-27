export async function getServerSideProps({ res }) {
  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conditions Générales d'Utilisation – PoutineMania.ca</title>
        <meta name="robots" content="noindex, nofollow">
        <meta name="googlebot" content="noindex, nofollow">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.5;
          }
          h1 {
            text-align: center;
            margin-bottom: 1.5rem;
          }
          h2 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
          }
          section {
            margin-bottom: 1.5rem;
          }
          a {
            color: #0066cc;
          }
          footer {
            margin-top: 2rem;
            font-size: 0.875rem;
            color: #666;
          }
        </style>
    </head>
    <body>
      <main>
        <h1>Conditions générales d'utilisation et Politique de confidentialité – PoutineMania.ca</h1>

        <article>
          <section>
            <h2>1. Acceptation des Conditions</h2>
            <p>
              En créant un compte sur PoutineMania.ca (« le Site »), vous
              acceptez sans réserve les présentes Conditions Générales
              d'Utilisation. Si vous n'acceptez pas ces conditions,
              veuillez ne pas vous inscrire ou utiliser nos services.
            </p>
          </section>

          <section>
            <h2>2. Description du Service</h2>
            <p>
              PoutineMania.ca est un site permettant à ses utilisateurs de noter
              des poutines, publier des avis et interagir avec la communauté
              d'utilisateurs inscrits.
            </p>
          </section>

          <section>
            <h2>3. Création et Gestion de Compte</h2>
            <p>
              Lors de votre inscription, vous devez fournir une adresse e-mail
              valide et choisir un mot de passe sécurisé. Vous êtes responsable
              de la confidentialité de vos informations de connexion.
            </p>
            <p>
              Vous pouvez à tout moment supprimer votre compte en vous rendant
              sur votre profil utilisateur. En supprimant votre compte, vos
              données personnelles seront immédiatement effacées. Cependant, vos
              avis et autres contributions publiques resteront visibles sur le
              site. Si vous souhaitez supprimer définitivement vos avis ou
              contributions, veuillez nous contacter à l'adresse
              info@poutinemania.ca, et nous procéderons à leur suppression dans
              les meilleurs délais.
            </p>
          </section>

          <section>
            <h2>4. Confidentialité et Protection des Données Personnelles</h2>
            <p>
              PoutineMania.ca collecte et utilise votre adresse e-mail
              uniquement pour gérer votre compte, vous identifier de manière
              unique et communiquer avec vous concernant votre compte ou pour
              des communications promotionnelles ponctuelles. Nous nous
              engageons à ne pas vendre, échanger ou partager vos informations
              personnelles avec des tiers sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h2>5. Contenu Généré par les Utilisateurs</h2>
            <p>
              En publiant un avis ou tout autre contenu sur le site, vous
              comprenez et acceptez que celui-ci devienne public et puisse
              apparaître sur les moteurs de recherche, être partagé via des
              liens ou diffusé sur des plateformes sociales.
            </p>
            <p>
              Vous garantissez être l'auteur original de vos publications
              et que celles-ci ne portent atteinte à aucun droit d'auteur
              ou autre droit protégé par la loi.
            </p>
          </section>

          <section>
            <h2>6. Comportement des Utilisateurs</h2>
            <p>
              Vous vous engagez à respecter les autres utilisateurs et à ne
              publier aucun contenu offensant, diffamatoire, discriminatoire,
              violent, ou illégal. PoutineMania.ca se réserve le droit de
              modérer ou supprimer tout contenu jugé inapproprié ou contraire
              aux présentes conditions générales, ainsi que de suspendre ou
              fermer votre compte sans préavis.
            </p>
          </section>

          <section>
            <h2>7. Communications et Marketing</h2>
            <p>
              En vous inscrivant, vous acceptez de recevoir occasionnellement
              des communications par e-mail concernant votre compte ou des
              offres promotionnelles. Vous pouvez vous désabonner à tout moment
              en cliquant sur le lien prévu à cet effet dans chaque e-mail
              envoyé ou en modifiant vos préférences dans votre profil
              utilisateur.
            </p>
          </section>

          <section>
            <h2>8. Limitation de Responsabilité</h2>
            <p>
              PoutineMania.ca décline toute responsabilité en cas
              d'interruption ou de dysfonctionnement du site, de perte ou
              corruption des données ou tout dommage direct ou indirect
              résultant de l'utilisation du site ou de l'incapacité à
              l'utiliser.
            </p>
          </section>

          <section>
            <h2>9. Modifications des Conditions Générales</h2>
            <p>
              PoutineMania.ca se réserve le droit de modifier ces conditions
              générales à tout moment. Les utilisateurs seront informés des
              modifications par e-mail ou par notification sur le site. La
              poursuite de l'utilisation du site après modification
              constitue une acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2>10. Loi applicable et Juridiction</h2>
            <p>
              Ces conditions générales sont régies par les lois applicables au
              Québec, Canada. Tout litige relatif à l'utilisation du site
              sera soumis à la juridiction exclusive des tribunaux compétents de
              Montréal, Québec.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              Pour toute question ou demande concernant ces conditions
              générales, veuillez nous contacter à l'adresse suivante :
              <a href="mailto:info@poutinemania.ca">info@poutinemania.ca</a>
            </p>
          </section>
        </article>

        <footer>
          <p>Date de dernière mise à jour : 27 avril 2025.</p>
        </footer>
      </main>
    </body>
  </html>`;

  res.setHeader("Content-Type", "text/html");
  res.write(html);
  res.end();

  return {
    props: {},
  };
}

export default function Terms() {
  return null;
}
