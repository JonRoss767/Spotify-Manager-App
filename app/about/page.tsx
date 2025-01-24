import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-S-Black text-white p-12 rounded-lg shadow-lg space-y-12">
      {/* Header Section */}
      <h1 className="text-S-Green text-5xl font-bold">About Spotify Manager</h1>
      <p className="text-xl text-center max-w-4xl">
        This is a personal project made by Jonathon Ross. It is a Spotify
        account manager designed to edit and view your liked songs, playlists,
        followed artists, and more!
      </p>

      {/* Future Implementation Section */}
      <h2 className="text-S-Green text-4xl font-semibold">
        Future Implementations
      </h2>
      <p className="text-xl text-center max-w-4xl">
        This project is still under development and has a long way to go! Here
        are some planned features:
      </p>
      <ul className="text-xl list-disc list-inside space-y-4 max-w-3xl">
        <li>
          <strong>Songs Page:</strong>
          <ul className="list-disc list-inside ml-8 space-y-2">
            <li>Adding & Removing Songs</li>
            <li>Search Bar</li>
            <li>Song Ordering</li>
            <li>Drop-down menu for song details</li>
          </ul>
        </li>
        <li>
          <strong>Playlist Page:</strong>
          <ul className="list-disc list-inside ml-8 space-y-2">
            <li>Creating & Deleting playlists</li>
          </ul>
        </li>
        <li>
          <strong>Artists Page:</strong>
          <ul className="list-disc list-inside ml-8 space-y-2">
            <li>Following & Unfollowing Artists</li>
            <li>Recommended artists to follow</li>
          </ul>
        </li>
      </ul>

      {/* App Preview Section */}
      <h2 className="text-S-Green text-4xl font-semibold">App Preview</h2>
      <p className="text-xl text-center max-w-4xl">
        Dont have a Spotify account or want to log in? Here are some screenshots
        of the app in its current state:
      </p>
      <div className="flex flex-col items-center space-y-8">
        <Image
          src="/HomePage.png"
          alt="Home page screenshot"
          width={400}
          height={400}
          className="object-contain border border-S-Grey rounded-md"
        />
        <Image
          src="/LoginPage.png"
          alt="Login page screenshot"
          width={400}
          height={400}
          className="object-contain border border-S-Grey rounded-md"
        />
        <Image
          src="/ProfilePage.png"
          alt="Profile page screenshot"
          width={400}
          height={400}
          className="object-contain border border-S-Grey rounded-md"
        />
        <Image
          src="/SongPage.png"
          alt="Song page screenshot"
          width={400}
          height={400}
          className="object-contain border border-S-Grey rounded-md"
        />
      </div>
    </div>
  );
}
