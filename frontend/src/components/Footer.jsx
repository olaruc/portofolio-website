export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const firstName = profile.name.split(" ")[0] || profile.name;
  return (
    <footer className="footer">
      <div className="container">
        <div className="logo">
          {firstName}
          <span className="dot">.</span>
        </div>
        <p>
          © {year} {profile.name} — {profile.role}. Built with React & FastAPI.
        </p>
      </div>
    </footer>
  );
}
