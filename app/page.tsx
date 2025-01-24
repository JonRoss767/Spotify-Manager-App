import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Spotify Account Manager</title>
      </Head>
      <div className="h-full bg-S-Black text-white">
        {/* Main Content */}
        <main className="flex flex-col items-center justify-center py-10 px-4">
          <section className="text-center mb-8">
            <h2 className="text-6xl font-semibold text-S-Green mb-4">
              Welcome!
            </h2>
            <p className="text-3xl my-4">
              Manage your liked songs, albums, and artists all in one place.
            </p>
            <p className="text-lg my-4">
              Check out our About Page for more details!
            </p>
            {
              <div className="p-6 mt-40 bg-gray-100 rounded-lg">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                  IMPORTANT NOTE!
                </h1>
                <h3 className="text-lg text-gray-800 mb-2">
                  Due to the web app being in development, Spotify requires that
                  I give your account authorization manually!
                </h3>
                <h3 className="text-lg text-gray-800 mb-4">
                  If you want to try the app for yourself, contact me to get
                  permission at:
                </h3>
                <ul className="list-none pl-5">
                  <li className="text-gray-700">
                    Email:{" "}
                    <Link
                      href="mailto:Jhross767@gmail.com"
                      className="text-blue-500 hover:underline"
                    >
                      Jhross767@gmail.com
                    </Link>
                  </li>
                  <li className="text-gray-700">
                    LinkedIn:{" "}
                    <Link
                      href="https://www.linkedin.com/in/jonathon-ross-249932297"
                      className="text-blue-500 hover:underline"
                    >
                      www.linkedin.com/in/jonathon-ross-249932297
                    </Link>
                  </li>
                </ul>
              </div>
            }
          </section>
        </main>
      </div>
    </>
  );
}
