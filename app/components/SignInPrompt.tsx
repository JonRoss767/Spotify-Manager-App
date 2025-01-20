"use client";

interface SignInPromptProps {
  onSignIn: () => void;
}

export default function SignInPrompt({ onSignIn }: SignInPromptProps) {
  return (
    <div className="w-full mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Spotify Profile
        </h1>
        <p className="text-gray-600 mb-4">
          You are not signed in. Please authenticate to view your profile.
        </p>
        <button
          onClick={onSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
