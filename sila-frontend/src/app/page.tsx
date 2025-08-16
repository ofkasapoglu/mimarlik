import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Yazılarım</h1>
        <div className="grid gap-6">
          {/* Örnek blog yazıları */}
          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href="/blog/1" className="hover:text-blue-600">
                İlk Blog Yazım
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>12 Mart 2024</span>
              <span className="mx-2">•</span>
              <span>5 dakika okuma</span>
            </div>
          </article>

          <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href="/blog/2" className="hover:text-blue-600">
                Web Geliştirme İpuçları
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>10 Mart 2024</span>
              <span className="mx-2">•</span>
              <span>8 dakika okuma</span>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
} 