"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type ClientStatus =
  | "New"
  | "Contacted"
  | "Site Visit"
  | "Completed";

type Client = {
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
  status: ClientStatus;
};

const statusOptions: ClientStatus[] = [
  "New",
  "Contacted",
  "Site Visit",
  "Completed",
];

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState<"All" | ClientStatus>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setError("");

        const response = await fetch(
          `${API_URL}/api/contact/`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();

          console.error(
            "Clients API failed:",
            response.status,
            errorText
          );

          throw new Error(
            `Failed to load clients: ${response.status}`
          );
        }

        const data = await response.json();

        setClients(data);
      } catch (error) {
        console.error(
          "Dashboard client loading failed:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load client inquiries."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients =
    filter === "All"
      ? clients
      : clients.filter(
          (client) => client.status === filter
        );

  const getStatusCount = (status: ClientStatus) =>
    clients.filter(
      (client) => client.status === status
    ).length;

  const updateStatus = async (
    clientId: number,
    status: ClientStatus
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/contact/${clientId}/status?status=${encodeURIComponent(
          status
        )}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update client status"
        );
      }

      const data = await response.json();

      setClients((currentClients) =>
        currentClients.map((client) =>
          client.id === clientId
            ? {
                ...client,
                status: data.status as ClientStatus,
              }
            : client
        )
      );

      setSelectedClient((currentClient) =>
        currentClient &&
        currentClient.id === clientId
          ? {
              ...currentClient,
              status: data.status as ClientStatus,
            }
          : currentClient
      );
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      alert(
        "Unable to update client status. Please try again."
      );
    }
  };

  const exportClientsToExcel = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/contact/export`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Export failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "tara-living-clients.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Client export failed:",
        error
      );

      alert(
        "Unable to export clients. Please try again."
      );
    }
  };

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

  const getStatusClass = (
    status: ClientStatus
  ) => {
    switch (status) {
      case "New":
        return "tl-client-status-new";

      case "Contacted":
        return "tl-client-status-contacted";

      case "Site Visit":
        return "tl-client-status-site";

      case "Completed":
        return "tl-client-status-completed";

      default:
        return "";
    }
  };

  return (
    <main className="admin-page">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-mark">
            <img
              src="/images/logo.png"
              alt="Tara Living"
            />
          </div>

          <div>
            <h1>TARA LIVING</h1>
            <span>ADMIN</span>
          </div>

        </div>

        <nav className="admin-nav">

          <Link
            href="/admin"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ⌂
            </span>

            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/clients"
            className="admin-nav-item active"
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


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="admin-main">

        {/* HEADER */}

        <header className="tl-clients-header">

          <div>

            <p className="tl-small-label">
              TARA LIVING / CLIENT MANAGEMENT
            </p>

            <h2>
              Clients
            </h2>

          </div>

          <div className="tl-header-number">

            <span>ACTIVE DATABASE</span>

            <strong>
              {clients.length}
            </strong>

          </div>

        </header>


        {/* HERO */}

        <section className="tl-client-hero">

          <div className="tl-client-hero-copy">

            <p className="tl-small-label">
              CONSULTATION INQUIRIES
            </p>

            <h1>
              Every inquiry.
              <br />
              <em>One place.</em>
            </h1>

            <p>
              Keep track of every consultation request,
              understand where each client is in their
              journey, and move projects forward.
            </p>

          </div>

          <button
            type="button"
            className="tl-export-button"
            onClick={exportClientsToExcel}
          >
            <span>↓</span>
            Export Excel
          </button>

          <div className="tl-hero-decoration">
            <span>TL</span>
          </div>

        </section>


        {/* SUMMARY */}

        <section className="tl-client-stats">

          <button
            type="button"
            className={`tl-stat-card ${
              filter === "All"
                ? "selected"
                : ""
            }`}
            onClick={() => setFilter("All")}
          >
            <span>ALL CLIENTS</span>
            <strong>{clients.length}</strong>
            <small>Every inquiry</small>
          </button>

          <button
            type="button"
            className={`tl-stat-card ${
              filter === "New"
                ? "selected"
                : ""
            }`}
            onClick={() => setFilter("New")}
          >
            <span>NEW</span>
            <strong>
              {getStatusCount("New")}
            </strong>
            <small>Needs attention</small>
          </button>

          <button
            type="button"
            className={`tl-stat-card ${
              filter === "Contacted"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setFilter("Contacted")
            }
          >
            <span>CONTACTED</span>
            <strong>
              {getStatusCount("Contacted")}
            </strong>
            <small>
              Conversation started
            </small>
          </button>

          <button
            type="button"
            className={`tl-stat-card ${
              filter === "Site Visit"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setFilter("Site Visit")
            }
          >
            <span>SITE VISIT</span>
            <strong>
              {getStatusCount("Site Visit")}
            </strong>
            <small>In progress</small>
          </button>

          <button
            type="button"
            className={`tl-stat-card ${
              filter === "Completed"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setFilter("Completed")
            }
          >
            <span>COMPLETED</span>
            <strong>
              {getStatusCount("Completed")}
            </strong>
            <small>
              Finished inquiries
            </small>
          </button>

        </section>


        {/* CLIENT LIST */}

        <section className="tl-client-list-section">

          <div className="tl-list-header">

            <div>

              <p className="tl-small-label">
                {filter === "All"
                  ? "ALL CLIENTS"
                  : filter.toUpperCase()}
              </p>

              <h3>
                {filteredClients.length}{" "}
                {filteredClients.length === 1
                  ? "Client"
                  : "Clients"}
              </h3>

            </div>

            <div className="tl-list-line" />

          </div>


          {/* LOADING */}

          {loading && (
            <div className="tl-client-empty">

              <div className="tl-loading-circle" />

              <p>
                Loading client inquiries...
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading && error && (
            <div className="tl-client-empty">

              <div className="tl-empty-icon">
                !
              </div>

              <h4>
                Unable to load clients
              </h4>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredClients.length === 0 && (
              <div className="tl-client-empty">

                <div className="tl-empty-icon">
                  ◌
                </div>

                <h4>
                  No inquiries here
                </h4>

                <p>
                  There are no clients in this
                  category yet.
                </p>

              </div>
            )}


          {/* CLIENT CARDS */}

          {!loading &&
            !error &&
            filteredClients.length > 0 && (

              <div className="tl-client-cards">

                {filteredClients.map(
                  (client, index) => (

                    <article
                      key={client.id}
                      className="tl-client-card"
                    >

                      {/* NUMBER */}

                      <div className="tl-client-index">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>


                      {/* PROFILE */}

                      <div className="tl-client-profile">

                        <div className="tl-client-avatar">

                          {client.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <h4>
                            {client.name}
                          </h4>

                          <p>
                            {client.email}
                          </p>

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="tl-client-info">

                        <div>
                          <span>CONTACT</span>

                          <strong>
                            {client.phone || "—"}
                          </strong>
                        </div>

                        <div>
                          <span>LOCATION</span>

                          <strong>
                            {client.city || "—"}
                          </strong>
                        </div>

                        <div>
                          <span>PROJECT</span>

                          <strong>
                            {client.project_type ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>BUDGET</span>

                          <strong>
                            {client.budget || "—"}
                          </strong>
                        </div>

                      </div>


                      {/* ACTION */}

                      <div className="tl-client-actions">

                        <div>

                          <select
                            className={`tl-client-status ${getStatusClass(
                              client.status
                            )}`}
                            value={
                              client.status
                            }
                            onChange={(event) =>
                              updateStatus(
                                client.id,
                                event.target
                                  .value as ClientStatus
                              )
                            }
                          >

                            {statusOptions.map(
                              (status) => (

                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>

                              )
                            )}

                          </select>

                          <small>
                            {formatDate(
                              client.created_at
                            )}
                          </small>

                        </div>


                        <button
                          type="button"
                          className="tl-view-client"
                          onClick={() =>
                            setSelectedClient(
                              client
                            )
                          }
                        >
                          View
                          <span>↗</span>
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

        </section>


        {/* =====================================================
            MODAL
        ====================================================== */}

        {selectedClient && (

          <div
            className="tl-client-modal-overlay"
            onClick={() =>
              setSelectedClient(null)
            }
          >

            <div
              className="tl-client-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="tl-modal-top">

                <div>

                  <p className="tl-small-label">
                    CLIENT INQUIRY
                  </p>

                  <h3>
                    {selectedClient.name}
                  </h3>

                  <span>
                    {selectedClient.email}
                  </span>

                </div>

                <button
                  type="button"
                  className="tl-modal-close"
                  onClick={() =>
                    setSelectedClient(null)
                  }
                >
                  ×
                </button>

              </div>


              <div className="tl-modal-status-row">

                <span>
                  PROJECT STATUS
                </span>

                <select
                  value={
                    selectedClient.status
                  }
                  onChange={(event) =>
                    updateStatus(
                      selectedClient.id,
                      event.target
                        .value as ClientStatus
                    )
                  }
                >

                  {statusOptions.map(
                    (status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="tl-modal-details">

                <div>
                  <span>PHONE</span>

                  <strong>
                    {selectedClient.phone ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>LOCATION</span>

                  <strong>
                    {selectedClient.city ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>PROPERTY TYPE</span>

                  <strong>
                    {selectedClient.property_type ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>PROJECT TYPE</span>

                  <strong>
                    {selectedClient.project_type ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>BUDGET</span>

                  <strong>
                    {selectedClient.budget ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>RECEIVED</span>

                  <strong>
                    {formatDate(
                      selectedClient.created_at
                    )}
                  </strong>
                </div>

              </div>


              <div className="tl-modal-message">

                <span>
                  CLIENT MESSAGE
                </span>

                <p>
                  {selectedClient.message ||
                    "No message was provided with this inquiry."}
                </p>

              </div>


              <div className="tl-modal-footer">

                <span>
                  TARA LIVING / CLIENT MANAGEMENT
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedClient(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


        <footer className="tl-client-footer">

          <span>
            TARA LIVING
          </span>

          <span>
            Client Management
          </span>

        </footer>

      </section>

    </main>
  );
}