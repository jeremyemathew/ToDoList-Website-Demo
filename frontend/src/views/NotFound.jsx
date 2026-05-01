import NavigationBar from '../components/NavigationBar.jsx';

function NotFound() {
  return (
    <>
      {/* Navigation bar at the top of the page */}
      <NavigationBar />

      {/* Main content container */}
      <main className="container" role="main">
        {/* 404 card */}
        <div className="card">
          <h1>404</h1>
          <p>That page doesn’t exist.</p>

          {/* Button to go back to the Home page */}
          <a className="btn" href="/">
            Go back home
          </a>
        </div>
      </main>
    </>
  );
}

// Export the NotFound component for use in App.jsx
export default NotFound;