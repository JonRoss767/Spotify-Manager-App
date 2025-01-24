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
            <h2 className="text-4xl font-semibold text-S-Green mb-4">
              Welcome Back!
            </h2>
            <p className="text-S-LightGrey text-lg">
              Manage your liked songs, albums, and artists all in one place.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
