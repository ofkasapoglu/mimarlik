{user?.role === 'admin' && (
  <>
    <Link
      to="/admin/dashboard"
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span className="mx-4">Dashboard</span>
    </Link>
    <Link
      to="/admin/users"
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span className="mx-4">Kullanıcılar</span>
    </Link>
    <Link
      to="/admin/blogs"
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span className="mx-4">Blog Yazıları</span>
    </Link>
    <Link
      to="/admin/comments"
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span className="mx-4">Yorumlar</span>
    </Link>
    <Link
      to="/admin/portfolio"
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span className="mx-4">Portföy</span>
    </Link>
  </>
)} 