"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);    ;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/contact/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();

        setClients(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load clients"
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
      : clients.filter((client) => client.status === filter);

const updateStatus = async (
  clientId: number,
  status: ClientStatus
) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/contact/${clientId}/status?status=${encodeURIComponent(
        status
      )}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update client status");
    }

    const data = await response.json();

    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientId
          ? { ...client, status: data.status as ClientStatus }
          : client
      )
    );
  } catch (error) {
    console.error("Status update failed:", error);
    alert("Unable to update client status. Please try again.");
  }
};

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
          <Link href="/admin" className="admin-nav-item">
            <span className="admin-nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/clients"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">◉</span>
            <span>Clients</span>
          </Link>

          <Link
            href="/admin/projects"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">▣</span>
            <span>Projects</span>
          </Link>

          <button className="admin-nav-item" type="button">
            <span className="admin-nav-icon">✦</span>
            <span>Services</span>
          </button>

          <button className="admin-nav-item" type="button">
            <span className="admin-nav-icon">♡</span>
            <span>Testimonials</span>
          </button>

          <button className="admin-nav-item" type="button">
            <span className="admin-nav-icon">↓</span>
            <span>Export</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>© {new Date().getFullYear()} Tara Living</span>
          <span>Interior Design Studio</span>
        </div>
      </aside>

      {/* MAIN */}
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">TARA LIVING</p>
            <h2>Clients</h2>
          </div>
        </header>

        {/* INTRO */}
        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">CLIENT MANAGEMENT</p>

            <h3>
              Every inquiry,
              <br />
              <em>one place.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Track consultation requests and move each client
            through the project journey.
          </p>
        </section>

        {/* CLIENT COUNTS */}
        <section className="admin-client-summary">
          <button
            type="button"
            className={`admin-filter-card ${
              filter === "All" ? "active" : ""
            }`}
            onClick={() => setFilter("All")}
          >
            <span>ALL CLIENTS</span>
            <strong>{clients.length}</strong>
          </button>

          {statusOptions.map((status) => {
            const count = clients.filter(
              (client) => client.status === status
            ).length;

            return (
              <button
                key={status}
                type="button"
                className={`admin-filter-card ${
                  filter === status ? "active" : ""
                }`}
                onClick={() => setFilter(status)}
              >
                <span>{status.toUpperCase()}</span>
                <strong>{count}</strong>
              </button>
            );
          })}
        </section>

        {/* CLIENT LIST */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">
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
          </div>

          {loading && (
            <div className="admin-empty-state">
              Loading clients...
            </div>
          )}

          {error && (
            <div className="admin-empty-state admin-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filteredClients.length === 0 && (
              <div className="admin-empty-state">
                No clients found in this category.
              </div>
            )}

          {!loading &&
            !error &&
            filteredClients.length > 0 && (
              <div className="admin-client-table">
                {filteredClients.map((client) => (
                  <article
                    key={client.id}
                    className="admin-client-row"
                  >
                    <div className="admin-client-main">
                      <div className="admin-client-avatar">
                        {client.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h4>{client.name}</h4>
                        <p>{client.email}</p>
                      </div>
                    </div>

                    <div className="admin-client-detail">
                      <span>CONTACT</span>
                      <strong>{client.phone}</strong>
                    </div>

                    <div className="admin-client-detail">
                      <span>LOCATION</span>
                      <strong>{client.city}</strong>
                    </div>

                    <div className="admin-client-detail">
                      <span>PROJECT</span>
                      <strong>{client.project_type}</strong>
                    </div>

                    <div className="admin-client-detail">
                      <span>BUDGET</span>
                      <strong>{client.budget}</strong>
                    </div>

                    <div className="admin-client-status">
                     <select
                       value={client.status}
                       onChange={(event) =>
                         updateStatus(
                           client.id,
                           event.target.value as ClientStatus
                         )
                       }
                     >
                       {statusOptions.map((status) => (
                         <option
                           key={status}
                           value={status}
                         >
                           {status}
                         </option>
                       ))}
                     </select>
                   
                     <small>
                       {formatDate(client.created_at)}
                     </small>
                   
                     <button
                      type="button"
                      className="admin-client-view"
                      onClick={() => setSelectedClient(client)}
                     >
                       View <span>↗</span>
                     </button>                     
                    </div>                   
                  </article>
                ))}
              </div>
            )}
        </section>

        {selectedClient && (
  <div
    className="admin-modal-overlay"
    onClick={() => setSelectedClient(null)}
  >
    <div
      className="admin-client-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="admin-modal-header">
        <div>
          <p className="admin-eyebrow">CLIENT INQUIRY</p>
          <h3>{selectedClient.name}</h3>
        </div>

        <button
          type="button"
          className="admin-modal-close"
          onClick={() => setSelectedClient(null)}
        >
          ×
        </button>
      </div>

      <div className="admin-modal-status">
        <span>STATUS</span>

        <select
          value={selectedClient.status}
          onChange={async (event) => {
            const newStatus =
              event.target.value as ClientStatus;

            await updateStatus(
              selectedClient.id,
              newStatus
            );

            setSelectedClient({
              ...selectedClient,
              status: newStatus,
            });
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-modal-grid">
        <div>
          <span>EMAIL</span>
          <strong>{selectedClient.email}</strong>
        </div>

        <div>
          <span>PHONE</span>
          <strong>{selectedClient.phone}</strong>
        </div>

        <div>
          <span>LOCATION</span>
          <strong>{selectedClient.city}</strong>
        </div>

        <div>
          <span>PROPERTY TYPE</span>
          <strong>{selectedClient.property_type}</strong>
        </div>

        <div>
          <span>PROJECT TYPE</span>
          <strong>{selectedClient.project_type}</strong>
        </div>

        <div>
          <span>BUDGET</span>
          <strong>{selectedClient.budget}</strong>
        </div>
      </div>

      <div className="admin-modal-message">
        <span>CLIENT MESSAGE</span>
        <p>{selectedClient.message}</p>
      </div>

      <div className="admin-modal-footer">
        <span>
          Inquiry received{" "}
          {formatDate(selectedClient.created_at)}
        </span>

        <button
          type="button"
          onClick={() => setSelectedClient(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {/* FOOTER */}
        <footer className="admin-footer">
          <span>TARA LIVING</span>
          <span>Client Management</span>
        </footer>
      </section>
    </main>
  );
}