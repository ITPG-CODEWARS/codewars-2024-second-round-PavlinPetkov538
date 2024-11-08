function Navigation() {
  const token = localStorage.getItem("token");

  const logout = () => {
    if (token) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const navigateHome = () => {
    if (token) {
      window.location.href = "/";
    }
  };

  const navigateMine = () => {
    if (token) {
      window.location.href = "/mine";
    }
  };

  return (
    <>
      <div className="navbar">
        <h1 className="app-title">URL Shortener</h1>
        <div className="nav-links">
          <a onClick={navigateHome}>Home</a>
          <a onClick={navigateMine}>Mine</a>
          <a onClick={logout}>Sign Out</a>
        </div>
      </div>
    </>
  );
}

export default Navigation;
