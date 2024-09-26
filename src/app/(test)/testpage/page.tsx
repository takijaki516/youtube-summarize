export default function SidebarLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="h-full w-64 overflow-y-auto p-4">
        <h2 className="mb-4 text-lg font-semibold">Sidebar</h2>
        <nav>
          <ul className="space-y-2">
            {[...Array(40)].map((_, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="block rounded px-4 py-2 hover:bg-gray-200"
                >
                  Menu Item {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="mb-6 text-3xl font-bold">Main Content</h1>
        {[...Array(40)].map((_, i) => (
          <p key={i} className="mb-4">
            This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        ))}
      </main>
    </div>
  );
}
