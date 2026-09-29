"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type Client = {
  id: number;
  name: string;
  email: string;
  city: string;
  project_type: string;
  budget: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/contact/`
        );

        if (!response.ok) {
          throw new Error("Failed to load clients");
        }

        const data = await response.json();

        setClients(data);
      } catch (error) {
        console.error(
          "Dashboard client loading failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const newClients = clients.filter(
    (client) => client.status === "New"
  ).length;

  const contactedClients = clients.filter(
    (client) => client.status === "Contacted"
  ).length;

  const siteVisitClients = clients.filter(
    (client) => client.status === "Site Visit"
  ).length;

  const completedClients = clients.filter(
    (client) => client.status === "Completed"
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <main className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-mark">
            <img src="/images/logo.png" alt="Tara Living" />
          </div>

          <div>
            <h1>TARA LIVING</h1>
            <span>ADMIN</span>
          </div>

        </div>


        <nav className="admin-nav">

          <Link
            href="/admin"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">
              ⌂
            </span>

            <span>Dashboard</span>
          </Link>


          <Link
            href="/admin/clients"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◉
            </span>

            <span>Clients</span>
          </Link>


          <Link
            href="/admin/projects"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ▣
            </span>

            <span>Projects</span>
          </Link>


          <Link
            href="/admin/services"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ✦
            </span>

            <span>Services</span>
          </Link>


          <Link
            href="/admin/testimonials"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ♡
            </span>

            <span>Testimonials</span>
          </Link>

        </nav>


        <div className="admin-sidebar-footer">

          <span>
            © {new Date().getFullYear()} Tara Living
          </span>

          <span>
            Interior Design Studio
          </span>

        </div>

      </aside>


      {/* MAIN */}

      <section className="admin-main">


        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>

            <p className="admin-eyebrow">
              TARA LIVING / ADMIN
            </p>

            <h2>
              Dashboard
            </h2>

          </div>

          <span className="dashboard-date">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </span>

        </header>


        {/* HERO */}

        <section className="dashboard-hero">

          <div className="dashboard-hero-content">

            <p className="admin-eyebrow">
              STUDIO OVERVIEW
            </p>

            <h1>
              Welcome back,
              <br />
              <em>Tara Living.</em>
            </h1>

            <p>
              Manage your clients, projects,
              services and testimonials from
              one place.
            </p>

          </div>


          <div className="dashboard-hero-circle">

            <span>
              TOTAL
              <br />
              INQUIRIES
            </span>

            <strong>
              {loading
                ? "—"
                : clients.length}
            </strong>

          </div>

        </section>


        {/* STAT CARDS */}

        <section className="dashboard-stats">


          <Link
            href="/admin/clients"
            className="dashboard-stat dashboard-stat-dark"
          >

            <span>
              TOTAL CLIENTS
            </span>

            <strong>
              {loading
                ? "—"
                : clients.length}
            </strong>

            <small>
              All inquiries
            </small>

            <b>↗</b>

          </Link>


          <Link
            href="/admin/clients"
            className="dashboard-stat"
          >

            <span>
              NEW
            </span>

            <strong>
              {loading
                ? "—"
                : newClients}
            </strong>

            <small>
              Needs attention
            </small>

            <b>↗</b>

          </Link>


          <Link
            href="/admin/clients"
            className="dashboard-stat"
          >

            <span>
              SITE VISITS
            </span>

            <strong>
              {loading
                ? "—"
                : siteVisitClients}
            </strong>

            <small>
              In progress
            </small>

            <b>↗</b>

          </Link>


          <Link
            href="/admin/clients"
            className="dashboard-stat"
          >

            <span>
              COMPLETED
            </span>

            <strong>
              {loading
                ? "—"
                : completedClients}
            </strong>

            <small>
              Completed inquiries
            </small>

            <b>↗</b>

          </Link>


        </section>


        {/* MAIN CONTENT */}

        <section className="dashboard-main-grid">


          {/* RECENT CLIENTS */}

          <div className="dashboard-card">

            <div className="dashboard-card-header">

              <div>

                <p className="admin-eyebrow">
                  RECENT INQUIRIES
                </p>

                <h3>
                  Latest clients
                </h3>

              </div>

              <Link
                href="/admin/clients"
                className="dashboard-view-all"
              >
                View all ↗
              </Link>

            </div>


            {loading ? (

              <div className="dashboard-empty">
                Loading clients...
              </div>

            ) : clients.length === 0 ? (

              <div className="dashboard-empty">
                No client inquiries yet.
              </div>

            ) : (

              <div className="dashboard-client-list">

                {clients
                  .slice(0, 6)
                  .map((client, index) => (

                    <div
                      key={client.id}
                      className="dashboard-client-row"
                    >

                      <span className="dashboard-client-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>


                      <div className="dashboard-client-avatar">
                        {client.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>


                      <div className="dashboard-client-details">

                        <strong>
                          {client.name}
                        </strong>

                        <span>
                          {client.project_type ||
                            "Interior Project"}
                        </span>

                      </div>


                      <span className="dashboard-client-city">
                        {client.city || "—"}
                      </span>


                      <span
                        className={`dashboard-status ${
                          client.status
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )
                        }`}
                      >
                        {client.status}
                      </span>


                      <small>
                        {formatDate(
                          client.created_at
                        )}
                      </small>

                    </div>

                  ))}

              </div>

            )}

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-card dashboard-actions-card">

            <p className="admin-eyebrow">
              QUICK ACTIONS
            </p>

            <h3>
              Manage your studio
            </h3>


            <div className="dashboard-actions-list">


              <Link
                href="/admin/projects/add"
                className="dashboard-action"
              >

                <span>
                  01
                </span>

                <div>
                  <strong>
                    Add Project
                  </strong>

                  <small>
                    Add a new portfolio project
                  </small>
                </div>

                <b>
                  ↗
                </b>

              </Link>


              <Link
                href="/admin/services/add"
                className="dashboard-action"
              >

                <span>
                  02
                </span>

                <div>
                  <strong>
                    Add Service
                  </strong>

                  <small>
                    Update your studio services
                  </small>
                </div>

                <b>
                  ↗
                </b>

              </Link>


              <Link
                href="/admin/testimonials/add"
                className="dashboard-action"
              >

                <span>
                  03
                </span>

                <div>
                  <strong>
                    Add Testimonial
                  </strong>

                  <small>
                    Share a client experience
                  </small>
                </div>

                <b>
                  ↗
                </b>

              </Link>


              <Link
                href="/admin/clients"
                className="dashboard-action"
              >

                <span>
                  04
                </span>

                <div>
                  <strong>
                    View Clients
                  </strong>

                  <small>
                    Manage consultation requests
                  </small>
                </div>

                <b>
                  ↗
                </b>

              </Link>


            </div>

          </div>

        </section>


        {/* STATUS OVERVIEW */}

        <section className="dashboard-status-section">

          <div>

            <p className="admin-eyebrow">
              PROJECT JOURNEY
            </p>

            <h3>
              Where your inquiries stand.
            </h3>

          </div>


          <div className="dashboard-status-bar">

            <div className="dashboard-status-item">

              <span>
                NEW
              </span>

              <strong>
                {newClients}
              </strong>

            </div>


            <div className="dashboard-status-item">

              <span>
                CONTACTED
              </span>

              <strong>
                {contactedClients}
              </strong>

            </div>


            <div className="dashboard-status-item">

              <span>
                SITE VISIT
              </span>

              <strong>
                {siteVisitClients}
              </strong>

            </div>


            <div className="dashboard-status-item">

              <span>
                COMPLETED
              </span>

              <strong>
                {completedClients}
              </strong>

            </div>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="admin-footer">

          <span>
            TARA LIVING
          </span>

          <span>
            Studio Dashboard
          </span>

        </footer>

      </section>

    </main>
  );
}