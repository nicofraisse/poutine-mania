export async function getServerSideProps({ res }) {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terms of Use and Privacy Policy – PoutineMania.ca</title>
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
        <h1>Terms of Use and Privacy Policy – PoutineMania.ca</h1>

        <article>
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account on PoutineMania.ca (“the Site”), you unconditionally accept these Terms of Use. If you do not agree to these terms, please do not register or use our services.
            </p>
          </section>

          <section>
            <h2>2. Service Description</h2>
            <p>
              PoutineMania.ca is a website that allows users to rate poutines, post reviews, and engage with the registered user community.
            </p>
          </section>

          <section>
            <h2>3. Account Creation and Management</h2>
            <p>
              When registering, you must provide a valid email address and choose a secure password. You are responsible for keeping your login information confidential.
            </p>
            <p>
              You may delete your account at any time by visiting your user profile. Upon deletion, your personal data will be removed immediately. However, your reviews and other public contributions will remain visible on the site. If you wish to permanently remove your reviews or contributions, please contact us at <a href="mailto:info@poutinemania.ca">info@poutinemania.ca</a>, and we will delete them as soon as possible.
            </p>
          </section>

          <section>
            <h2>4. Privacy and Personal Data Protection</h2>
            <p>
              PoutineMania.ca collects and uses your email address solely to manage your account, uniquely identify you, and communicate with you about your account or occasional promotional offers. We will not sell, trade, or share your personal information with third parties without your explicit consent.
            </p>
          </section>

          <section>
            <h2>5. User-Generated Content</h2>
            <p>
              By posting a review or any other content on the site, you understand and agree that it becomes public and may appear in search engines, be shared via links, or be distributed on social platforms.
            </p>
            <p>
              You warrant that you are the original author of your posts and that they do not infringe any copyright or other legal rights.
            </p>
          </section>

          <section>
            <h2>6. User Conduct</h2>
            <p>
              You agree to respect other users and not post any offensive, defamatory, discriminatory, violent, or illegal content. PoutineMania.ca reserves the right to moderate or remove any content deemed inappropriate or in violation of these terms, and to suspend or terminate your account without notice.
            </p>
          </section>

          <section>
            <h2>7. Communications and Marketing</h2>
            <p>
              By registering, you agree to receive occasional emails about your account or promotional offers. You may unsubscribe at any time by clicking the link in any email we send or by updating your preferences in your user profile.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              PoutineMania.ca is not liable for any interruption or malfunction of the site, loss or corruption of data, or any direct or indirect damages resulting from the use or inability to use the site.
            </p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>
              PoutineMania.ca reserves the right to modify these terms at any time. Users will be notified of changes by email or site notification. Continued use of the site after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2>10. Governing Law and Jurisdiction</h2>
            <p>
              These terms are governed by the laws of Québec, Canada. Any dispute arising from the use of the site will be submitted to the exclusive jurisdiction of the courts of Montréal, Québec.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              For any questions or requests regarding these terms, please contact us at <a href="mailto:info@poutinemania.ca">info@poutinemania.ca</a>.
            </p>
          </section>
        </article>

        <footer>
          <p>Last updated: April 27, 2025.</p>
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
