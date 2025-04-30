'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-900 text-white">
      <h1 className="text-5xl font-extrabold tracking-wide text-blue-400 drop-shadow-lg">
        TASK MANAGER
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-md">
        Organiza tus tareas de manera eficiente y mantente al día con tus objetivos.
      </p>
      <div className="flex gap-4">
        <button
          className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
          onClick={() => router.push('/register')}
        >
          Get Started
        </button>
        <button
          className="px-8 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
          onClick={() => router.push('/login')}
        >
          Login
        </button>
      </div>
    </div>
  );
}
