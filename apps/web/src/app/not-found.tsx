import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página não encontrada</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
