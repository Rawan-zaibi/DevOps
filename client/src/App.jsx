import { useState } from "react";

const API = "http://localhost:5000/api/auth";

export default function App() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next) {
    setMode(next);
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const body =
      mode === "register" ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`${API}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur");
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Ma najamtech nwasel lel serveur");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setMessage("");
  }

  if (user) {
    return (
      <div className="wrapper">
        <div className="card welcome">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h1>Marhba {user.name}</h1>
          <p className="muted">{user.email}</p>
          <span className="badge">{user.role}</span>
          <button className="btn ghost" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="card">
        <div className="brand">
          <span className="logo">E</span>
          <span className="brand-name">E-Shop</span>
        </div>

        <div className="tabs">
          <button
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => switchMode("login")}
            type="button"
          >
            Connexion
          </button>
          <button
            className={mode === "register" ? "tab active" : "tab"}
            onClick={() => switchMode("register")}
            type="button"
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} key={mode}>
          {mode === "register" && (
            <div className="field">
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                placeholder="Ahmed Ben Ali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="ahmed@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            {mode === "register" && (
              <small className="hint">8 caractères 3al 9al</small>
            )}
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading
              ? "Chwaya..."
              : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </form>

        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
}