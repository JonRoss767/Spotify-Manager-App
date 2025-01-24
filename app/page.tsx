import Head from "next/head";

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
          </section>
        </main>
      </div>
    </>
  );
}
