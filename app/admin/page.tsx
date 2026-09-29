"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  property_type: string;
  project_type: string;
  budget: string;
  message: string;
  created_at: string;
};

const menuItems = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Clients", icon: "◉" },
  { label: "Projects", icon: "▣" },
  { label: "Services", icon: "✦" },
  { label: "Testimonials", icon: "♡" },
  { label: "Export", icon: "↓" },
];

export default function AdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/contact/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inquiries");
        }

        const data = await response.json();
        setInquiries(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load inquiries"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="admin-page">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">TL</div>

          <div>
            <h1>TARA LIVING</h1>
            <span>ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className={`admin-nav-item ${
                index === 0 ? "active" : ""
              }`}
              type="button"
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span>© {new Date().getFullYear()} Tara Living</span>
          <span>Interior Design Studio</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="admin-main">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">TARA LIVING</p>
            <h2>Dashboard</h2>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-status-dot" />
            <span>System Online</span>
          </div>
        </header>

        {/* WELCOME */}
        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">OVERVIEW</p>

            <h3>
              Welcome to your
              <br />
              <em>studio dashboard.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Manage client inquiries, projects, services and
            testimonials from one place.
          </p>
        </section>

        {/* STAT CARDS */}
        <section className="admin-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>CLIENTS</span>
              <span>01</span>
            </div>

            <strong>{inquiries.length}</strong>

            <p>Total inquiries received</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>NEW</span>
              <span>02</span>
            </div>

            <strong>{inquiries.length}</strong>

            <p>Awaiting first contact</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>PROJECTS</span>
              <span>03</span>
            </div>

            <strong>4</strong>

            <p>Projects currently displayed</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>SERVICES</span>
              <span>04</span>
            </div>

            <strong>4</strong>

            <p>Service categories</p>
          </article>
        </section>

        {/* RECENT INQUIRIES */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">CLIENTS</p>
              <h3>Recent Client Inquiries</h3>
            </div>

            <button className="admin-text-button" type="button">
              View All <span>↗</span>
            </button>
          </div>

          {loading && (
            <div className="admin-empty-state">
              Loading inquiries...
            </div>
          )}

          {error && (
            <div className="admin-empty-state admin-error">
              {error}
            </div>
          )}

          {!loading && !error && inquiries.length === 0 && (
            <div className="admin-empty-state">
              No inquiries received yet.
            </div>
          )}

          {!loading && !error && inquiries.length > 0 && (
            <div className="admin-inquiries">
              {inquiries.slice(0, 5).map((inquiry) => (
                <article
                  key={inquiry.id}
                  className="admin-inquiry-row"
                >
                  <div className="admin-client-info">
                    <div className="admin-client-avatar">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4>{inquiry.name}</h4>
                      <p>{inquiry.email}</p>
                    </div>
                  </div>

                  <div className="admin-inquiry-location">
                    <span>LOCATION</span>
                    <strong>{inquiry.city}</strong>
                  </div>

                  <div className="admin-inquiry-project">
                    <span>PROJECT</span>
                    <strong>{inquiry.project_type}</strong>
                  </div>

                  <div className="admin-inquiry-budget">
                    <span>BUDGET</span>
                    <strong>{inquiry.budget}</strong>
                  </div>

                  <div className="admin-inquiry-meta">
                    <span className="admin-status new">
                      NEW
                    </span>

                    <small>
                      {formatDate(inquiry.created_at)}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* QUICK ACTIONS */}
        <section className="admin-section admin-actions-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">QUICK ACTIONS</p>
              <h3>Manage your studio</h3>
            </div>
          </div>

          <div className="admin-actions">
            <button className="admin-action-card" type="button">
              <span className="admin-action-number">01</span>

              <div>
                <strong>Add Project</strong>
                <p>
                  Add a new interior project to your portfolio.
                </p>
              </div>

              <span className="admin-action-arrow">↗</span>
            </button>

            <button className="admin-action-card" type="button">
              <span className="admin-action-number">02</span>

              <div>
                <strong>Manage Services</strong>
                <p>
                  Add or update the services offered by Tara Living.
                </p>
              </div>

              <span className="admin-action-arrow">↗</span>
            </button>

            <button className="admin-action-card" type="button">
              <span className="admin-action-number">03</span>

              <div>
                <strong>Testimonials</strong>
                <p>
                  Manage client reviews displayed on the website.
                </p>
              </div>

              <span className="admin-action-arrow">↗</span>
            </button>

            <button className="admin-action-card" type="button">
              <span className="admin-action-number">04</span>

              <div>
                <strong>Export Excel</strong>
                <p>
                  Download client inquiry data as an Excel file.
                </p>
              </div>

              <span className="admin-action-arrow">↓</span>
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="admin-footer">
          <span>TARA LIVING</span>
          <span>Admin Dashboard</span>
        </footer>
      </section>
    </main>
  );
}