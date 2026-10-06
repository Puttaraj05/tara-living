"use client";

import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "../lib/media";
import { useEffect , useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";
import WelcomeIntro from "./components/WelcomeIntro";
import ProcessSection from "@/app/components/ProcessSection";

const founders = [
  {
    name: "Suma Hiremath",
    role: "Co-Founder",
    image: "/images/founder1.jpg",
    quote: "Beautiful, comfortable spaces with a strong sense of quality.",
    tags: ["Timeless design", "Warmth", "Quality"],
    description:
      "With a keen eye for beauty, detail, and timeless design, she brings warmth and experience to Tara Living. Her passion for creating beautiful, comfortable spaces and her strong sense of quality help shape the brand’s vision and every project we take on.",
  },
  {
    name: "Swathi Hiremath",
    role: "Co-Founder",
    image: "/images/swathi.jpg",
    quote: "Every space should tell a story and feel uniquely its own.",
    tags: ["Creative vision", "Functionality", "Individuality"],
    description:"Driven by a deep passion for design, she believes every space should tell a story and feel uniquely its own. With a strong creative vision and an eye for detail, she brings together aesthetics, functionality, and individuality to create spaces that are not just beautiful, but truly meaningful. At Tara Living, she is dedicated to turning ideas into thoughtfully designed spaces that inspire, comfort, and stand the test of time."
  },
];

type ApiService = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  service_items: string[] | null;
  created_at: string;
};

const defaultServices = [
  {
    number: "01",
    title: "Residential Interiors",
    description:
      "Thoughtfully designed homes that balance comfort, functionality, and timeless aesthetics — from individual rooms to complete home transformations.",
    image: "/images/service-1.jpg",
    services: [
      "Full Home Interiors",
      "Living Room Interiors",
      "Bedroom Interiors",
      "Modular Kitchen",
      "Bathroom Interiors",
      "Dining Areas",
      "Wardrobes & Storage",
      "Custom Furniture",
    ],
  },
  {
    number: "02",
    title: "Commercial Interiors",
    description:
      "Purpose-built spaces that combine functionality, productivity, and a strong visual identity for modern businesses and brands.",
    image: "/images/service-2.jpg",
    services: [
      "Office Interiors",
      "Corporate Workspaces",
      "Reception Areas",
      "Retail Interiors",
      "Shop Interiors",
      "Commercial Spaces",
      "Custom Furniture",
      "Space Planning",
    ],
  },
  {
    number: "03",
    title: "Design & Styling",
    description:
      "The details that bring character and personality to your space, from thoughtful layouts and lighting to beautiful finishes and décor.",
    image: "/images/service-3.jpg",
    services: [
      "Space Planning",
      "Interior Styling",
      "Custom Furniture",
      "False Ceilings",
      "Lighting Design",
      "Wall Treatments",
      "Material Selection",
      "Décor & Accessories",
    ],
  },
  {
    number: "04",
    title: "Renovation & Turnkey",
    description:
      "End-to-end interior solutions managed from the first concept to final handover, ensuring a seamless and carefully executed transformation.",
    image: "/images/service-4.jpg",
    services: [
      "Interior Renovation",
      "Turnkey Interiors",
      "Design & Planning",
      "Material Selection",
      "Civil & Electrical Work",
      "Furniture Installation",
      "Finishing & Styling",
      "Final Handover",
    ],
  },
];



type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  client_review: string;
  image: string | null;
  location: string;
  work_done: string;
  created_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We get to know you, your vision, and how you want to live.",
  },
  {
    number: "02",
    title: "Design",
    description: "We create a considered design that reflects your personality.",
  },
  {
    number: "03",
    title: "Plan",
    description: "Every detail is refined before we bring the vision to life.",
  },
  {
    number: "04",
    title: "Execute",
    description: "We manage the details and collaborate with trusted partners.",
  },
  {
    number: "05",
    title: "Enjoy",
    description: "You move in, settle down, and enjoy a space made for you.",
  },
];

type ApiTestimonial = {
  id: number;
  client_name: string;
  location: string;
  property_type: string;
  rating: number;
  review: string;
  image: string | null;
  created_at: string;
};

export default function Home() {

  const [services, setServices] =
    useState(defaultServices);

  const [testimonials, setTestimonials] =
    useState<ApiTestimonial[]>([]);
  
    

  // PROJECTS
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [, setProjectsLoading] = useState(true);

  const [activeProject, setActiveProject] = useState(0);   

  useEffect(() => {
  console.log("PROJECT FETCH STARTED");

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects`
      );

      console.log("PROJECT API STATUS:", response.status);

      const data = await response.json();

      console.log("PROJECTS FROM API:", data);

      setProjects(data);

    } catch (error) {
      console.error("PROJECT FETCH ERROR:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  fetchProjects();
}, []);

useEffect(() => {
  if (!projects.length) return;

  const interval = setInterval(() => {
    setActiveProject((current) => {
      return (current + 1) % Math.min(projects.length, 5);
    });
  }, 5000);

  return () => clearInterval(interval);
}, [projects.length]);

useEffect(() => {
  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/services/`
      );

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data: ApiService[] =
        await response.json();

      if (data.length === 0) {
        return;
      }

      const formattedServices = data.map(
        (service, index) => ({
          number: String(index + 1).padStart(2, "0"),
          title: service.title,
          description: service.description,
          image: getMediaUrl(service.image),
          services:
            service.service_items || [],
        })
      );

      setServices(formattedServices);
    } catch (error) {
      console.error(
        "Failed to load services:",
        error
      );
    }
  };

    fetchServices();
}, []);

useEffect(() => {
  const servicesSection =
    document.querySelector(".services");

  if (!servicesSection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        servicesSection.classList.add(
          "services-section-visible"
        );

        observer.unobserve(servicesSection);
      }
    },
    {
      threshold: 0.2,
    }
  );

  observer.observe(servicesSection);

  return () => {
    observer.disconnect();
  };
}, []);

useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/testimonials/`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load testimonials"
        );
      }

      const data: ApiTestimonial[] =
        await response.json();

      setTestimonials(data);
    } catch (error) {
      console.error(
        "Failed to load testimonials:",
        error
      );
    }
  };

  fetchTestimonials();
}, []);

// AUTOMATIC TESTIMONIAL SLIDER
const [testimonialIndex, setTestimonialIndex] =
  useState(0);

useEffect(() => {
  if (testimonials.length < 4) {
    return;
  }

  const interval = setInterval(() => {
    setTestimonialIndex((prev) => {
      return (
        (prev + 1) %
        testimonials.length
      );
    });
  }, 4500);

  return () => clearInterval(interval);
}, [testimonials.length]);

useEffect(() => {
  const section = document.querySelector(".final-cta");

  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("cta-visible");
        observer.unobserve(section);
      }
    },
    {
      threshold: 0.2,
    }
  );

  observer.observe(section);

  return () => observer.disconnect();
}, []);



// TESTIMONIAL SLIDER


const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    property_type: "",
    project_type: "",
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_URL}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setSubmitMessage("Your inquiry has been submitted successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        property_type: "",
        project_type: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your inquiry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  return () => {
    observer.disconnect();
  };
}, [projects]);

const getProjectImage = (
  image: string | null | undefined
) => {
  const url = getMediaUrl(image);
  return url || "/images/service-1.jpg";
};


  return (
    <>
    <WelcomeIntro/>
    <main className="site-main">
      {/* NAVIGATION */}
      {/* NAVIGATION */}
          <header className="site-header">
            <div className="nav-inner">
              <a href="#home" className="brand">
                <Image
                  src="/images/logo1.png"
                  alt="Tara Living Logo"
                  width={462}
                  height={410}
                  priority
                  className="logo"
                  style={{
                    width: "50px",
                    height: "auto",
                  }}
                />

                <span className="brand-text">
                <strong>TARA</strong>
                <small> LIVING</small>
              </span>
              </a>

            
          

          <nav className="desktop-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#process">Process</a>
            <a href="#journal">Journal</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="nav-cta">
            Book a Consultation
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-image">
          <Image
            src="/images/hero1.jpg"
            alt="Beautiful Tara Living interior"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="eyebrow hero-reveal">
            THOUGHTFUL INTERIORS · TARA LIVING
          </p>

          <h1 className="hero-title hero-reveal delay-1">
            Spaces that
            <br />
            <em>feel like home.</em>
          </h1>

          <p className="hero-description hero-reveal delay-2">
            Timeless interiors shaped around your life, your stories,
            and the moments that matter.
          </p>

          <div className="hero-actions hero-reveal delay-3">
            <a href="#projects" className="button button-light">
              Explore Our Work
              <span>↗</span>
            </a>

            <a href="#about" className="text-link light-link">
              Discover Tara Living
              <span>↓</span>
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <span>01 — 05</span>
          <span className="hero-line" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* INTRO + SERVICES */}
      <section className="intro section">
        <div className="organic-leaf leaf-one">❧</div>

        <div className="section-heading centered reveal">
          <p className="eyebrow">OUR PHILOSOPHY</p>

          <h2>
            Thoughtful design
            <br />
            <em>for how you live.</em>
          </h2>

          <p className="intro-copy">
            We believe the most beautiful spaces are the ones that feel
            unmistakably yours. Our approach blends natural materials,
            considered details and timeless design to create interiors
            that feel calm, personal and enduring.
          </p>
        </div>

        {/* SERVICES */}
        <div id="services" className="services-grid">
          {services.map((service, index) => (
            <article
              className={`service-card reveal delay-${
                (index % 4) + 1
              }`}
              key={service.number}
            >
              <div className="service-image">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />

                <span className="service-number">
                  {service.number}
                </span>
              </div>

              <div className="service-content">
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <div className="service-details">
                  <span className="service-details-label">
                    What we do
                  </span>

                  <div className="service-items">
                    {service.services.map((item, itemIndex) => (
                      <div
                        className="service-item"
                        key={itemIndex}
                      >
                        <span>{item}</span>

                        <span className="service-item-arrow">
                          ↗
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SERVICES CTA */}
        <div className="services-cta">
          <a href="#contact">
            <span>Start Your Project</span>

            <span className="services-cta-arrow">
              ↗
            </span>
          </a>
        </div>
      </section>

     {/* PROJECTS */}
<section id="projects" className="projects section">

  {/* HEADER */}
  <div className="section-top projects-top reveal">

    <div className="projects-heading">
      <p className="eyebrow">SELECTED PROJECTS</p>

      <h2>
        Spaces that
        <br />
        <em>tell a story.</em>
      </h2>
    </div>

    <div className="projects-intro">
      <p>
        A selection of thoughtfully designed spaces, shaped around
        the people who live, work and gather in them.
      </p>

      <Link href="/projects" className="outline-link">
        View all projects
        <span>↗</span>
      </Link>
    </div>

  </div>


  {/* EXPANDING PROJECT SHOWCASE */}
  <div className="project-showcase">

    {projects.slice(0, 5).map((project, index) => (
      <Link
        href={`/projects/${project.id}`}
        className={`project-panel ${
          activeProject === index ? "active" : ""
        }`}
        key={project.id}
        onMouseEnter={() => setActiveProject(index)}
        onFocus={() => setActiveProject(index)}
        onClick={() => setActiveProject(index)}
      >

        {/* IMAGE */}
        <Image
          src={getProjectImage(project.image)}
          alt={project.title}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 90vw, 70vw"
          className="project-panel-image"
        />

        {/* DARK GRADIENT */}
        <div className="project-panel-overlay" />


        {/* ACTIVE PROJECT INFORMATION */}
        <div className="project-panel-content">

          <div className="project-number">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="project-copy">

            <p className="project-panel-category">
              {project.category}
            </p>

            <h3>
              {project.title}
            </h3>

            <div className="project-meta">
              <span>{project.location}</span>
              <span>↗</span>
            </div>

          </div>

        </div>


        {/* COLLAPSED PANEL NUMBER */}
        <div className="project-collapsed-number">
          {String(index + 1).padStart(2, "0")}
        </div>

      </Link>
    ))}

  </div>

</section>

      {/* FOUNDERS */}
<section id="about" className="founders-section">
  {/* TOP HEADER */}
<div className="founders-top reveal">
  <h2 className="founders-heading">
    <span className="founders-heading-script">Meet the</span>
    <span className="founders-heading-main">FOUNDERS</span>
  </h2>

  <p className="founders-intro-text">
    Two perspectives. One approach to thoughtful spaces.
  </p>
</div>

  {/* FOUNDER ROWS */}
  <div className="founders-list">
    {[
      { person: founders[1], number: "01", reverse: false }, // Swathi
      { person: founders[0], number: "02", reverse: true },  // Suma
    ].map(({ person, number, reverse }, i) => (
      <article
        key={person.name}
        className={`founder-row ${reverse ? "founder-row-reverse" : ""} reveal ${
          i === 1 ? "delay-2" : ""
        }`}
      >
        {/* PHOTO */}
        <div className="founder-photo-wrap">
          <span className="founder-photo-frame" aria-hidden="true" />
          <div className="founder-photo">
            <Image
              src={person.image}
              alt={person.name}
              fill
              sizes="(max-width: 768px) 88vw, 260px"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="founder-content">
          <span className="founder-numeral" aria-hidden="true">
            {number}
          </span>

          <div className="founder-content-inner">
            <h3 className="founder-name">{person.name}</h3>
            <span className="founder-role">{person.role}</span>

            <p className="founder-quote">{person.quote}</p>
            <p className="founder-bio">{person.description}</p>

            <ul className="founder-tags">
              {person.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    ))}
  </div>
</section>

      {/* PROCESS */}
<ProcessSection processSteps={processSteps} />

      {/* WHY TARA LIVING */}
<section className="why-us-bento section">
  {/* HEADER */}
  <div className="why-bento-header reveal">
    <p className="eyebrow">WHY TARA LIVING</p>

    <h2>
      Designed for living.
      <br />
      <em>Made to belong.</em>
    </h2>

    <p className="why-bento-intro">
      Thoughtful interiors shaped around your lifestyle, your space,
      and the way you want to live.
    </p>
  </div>

  {/* BENTO GRID */}
  <div className="why-bento-grid">

    {/* LARGE LEFT CARD */}
    <div className="why-bento-card why-card-large reveal">
      <div className="why-card-image">
        <Image
          src="/images/service-3.jpg"
          alt="Tara Living interior design"
          fill
          sizes="(max-width: 768px) 100vw, 38vw"
        />
      </div>

      <div className="why-card-overlay">
        <span className="why-card-number">01</span>

        <div>
          <h3>Crafted around you</h3>

          <p>
            Every space begins with understanding how you live,
            what you love, and what makes a house feel like home.
          </p>
        </div>
      </div>
    </div>

    {/* TOP MIDDLE CARD */}
    <div className="why-bento-card why-card-small reveal delay-1">
      <div className="why-small-content">
        <span className="why-card-number">02</span>

        <div className="why-stat">
          <strong>10+</strong>
          <span>Years</span>
        </div>

        <h3>Experience that matters</h3>

        <p>
          A decade of creating refined, functional and
          timeless interiors.
        </p>
      </div>
    </div>

    {/* TOP RIGHT CARD */}
    <div className="why-bento-card why-card-small why-card-material reveal delay-2">
      <div className="material-image">
        <Image
          src="/images/service-1.jpg"
          alt="Interior material details"
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      <div className="material-content">
        <span className="why-card-number">03</span>

        <h3>Thoughtful details</h3>

        <p>
          Materials, textures and finishes selected to work
          beautifully together.
        </p>
      </div>
    </div>

    {/* WIDE BOTTOM CARD */}
    <div className="why-bento-card why-card-wide reveal delay-2">

      <div className="wide-content">
        <span className="why-card-number">04</span>

        <div>
          <h3>
            From first sketch
            <br />
            to final detail.
          </h3>

          <p>
            From space planning and material selection to
            execution and finishing touches, we bring the
            entire journey together.
          </p>

          <a href="#contact" className="why-bento-link">
            DISCOVER OUR PROCESS
            <span>↗</span>
          </a>
        </div>
      </div>

      <div className="wide-image">
        <Image
          src="/images/service-4.jpg"
          alt="Beautiful Tara Living interior"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

    </div>

  </div>
</section>

      {/* TESTIMONIALS */}
<section
  id="journal"
  className="testimonials-section"
>
  {/* CENTERED HEADER */}
  <div className="testimonials-header reveal">

    <p className="eyebrow">
      CLIENT STORIES
    </p>

    <h2>
      Spaces that
      <br />
      <em>feel like home.</em>
    </h2>

    <p className="testimonials-intro">
      Thoughtful spaces, meaningful experiences,
      and homes created around the people who
      live in them.
    </p>

  </div>

  {testimonials.length > 0 && (
    <div className="testimonials-carousel">

      {/* LEFT ARROW SPACE / CAROUSEL */}
      <div className="testimonials-track">
  {testimonials.map((testimonial, index) => {
    const total = testimonials.length;

    let relativePosition =
      (index - testimonialIndex + total) % total;

    if (relativePosition > total / 2) {
      relativePosition -= total;
    }

    const imageUrl = getMediaUrl(testimonial.image);

    let positionClass = "testimonial-slide-hidden";

    if (relativePosition === -1) {
      positionClass = "testimonial-slide-left";
    }

    if (relativePosition === 0) {
      positionClass = "testimonial-slide-active";
    }

    if (relativePosition === 1) {
      positionClass = "testimonial-slide-right";
    }

    return (
      <article
        key={testimonial.id}
        className={`testimonial-slide ${positionClass}`}
      >
        <div className="testimonial-card">

          {/* TOP */}
          <div className="testimonial-card-top">
            <div className="testimonial-rating">
              {"★".repeat(testimonial.rating)}
            </div>

            <span className="testimonial-property">
              {testimonial.property_type}
            </span>
          </div>

          {/* REVIEW */}
          <div className="testimonial-review">
            <span className="testimonial-quote">
              “
            </span>

            <p>
              {testimonial.review}
            </p>
          </div>

          {/* CLIENT */}
          <div className="testimonial-footer">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={testimonial.client_name}
                className="testimonial-client-image"
              />
            ) : (
              <div className="testimonial-client-placeholder">
                {testimonial.client_name.charAt(0)}
              </div>
            )}

            <div className="testimonial-client-info">
              <strong>
                {testimonial.client_name}
              </strong>

              <span>
                {testimonial.location}
              </span>
            </div>
          </div>

        </div>
      </article>
    );
  })}
</div>
    </div>
  )}

  {testimonials.length === 0 && (
    <div className="testimonials-empty">
      <p>
        Client stories will appear here soon.
      </p>
    </div>
  )}

</section>

      {/* =========================================================
    FINAL CTA / CONTACT SECTION
========================================================= */}

<section id="contact" className="final-cta">

  {/* BACKGROUND INTERIOR IMAGE */}
  <div className="final-cta-bg">
    <Image
      src="/images/footer1.jpg"
      alt="Tara Living interior"
      fill
      priority
      sizes="100vw"
    />
  </div>

  {/* SOFT OVERLAY */}
  <div className="final-cta-overlay" />


  <div className="final-cta-container">

    {/* =====================================================
        LEFT CONTENT
    ===================================================== */}

    <div className="final-cta-info">

      {/* EYEBROW */}
      <div className="final-cta-eyebrow">
        <span />
        <p>GET IN TOUCH</p>
        <span />
      </div>


      {/* HEADING */}
      <h2>
        Let&apos;s discuss
        <br />
        <em>your project</em>
      </h2>


      {/* DESCRIPTION */}
      <p className="final-cta-description">
        Tell us a little about your project and our team
        will get in touch with you. We&apos;d love to help you
        bring your dream space to life.
      </p>


      {/* =================================================
          CONTACT DETAILS
      ================================================= */}

      <div className="contact-details">

  {/* CALL */}
  <a
    href="tel:+918639114375"
    className="contact-detail"
    aria-label="Call Tara Living"
  >
    <div className="contact-icon">
      <span>⌕</span>
    </div>

    <div className="contact-detail-text">
      <strong>Call Us</strong>

      <span>
        +91 86391 14375
      </span>
    </div>
  </a>


  {/* EMAIL */}
  <a
    href="mailto:taraliving09@gmail.com"
    className="contact-detail"
    aria-label="Email Tara Living"
  >
    <div className="contact-icon">
      <span>✉</span>
    </div>
  
    <div className="contact-detail-text">
      <strong>Email Us</strong>

      <span>
        taraliving09@gmail.com
      </span>
    </div>
  </a>


  {/* LOCATION */}
  <a
    href="https://www.google.com/maps/search/?api=1&query=Hyderabad%2C%20India"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-detail"
    aria-label="Open Tara Living location in Google Maps"
  >
    <div className="contact-icon">
      <span>⌖</span>
    </div>

    <div className="contact-detail-text">
      <strong>Visit Us</strong>

      <span>
        Hyderabad, India
      </span>
    </div>
  </a>

</div>

      {/* =================================================
          HANDWRITTEN MESSAGE
      ================================================= */}

      <div className="vision-message">

        <span>
          Your Vision
        </span>

        <span>
          Our Priority
        </span>

        <div />

      </div>

    </div>



    {/* =====================================================
        RIGHT FORM
    ===================================================== */}

    <div className="final-cta-form-card">

      <form
        className="final-inquiry-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            ROW 1
        ================================================= */}

        <div className="final-form-row">

          {/* NAME */}
          <div className="final-form-field">

            <label htmlFor="name">
              FULL NAME <sup>*</sup>
            </label>

            <div className="final-input">

              <span className="final-input-icon">
                ♙
              </span>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                required
              />

            </div>

          </div>


          {/* EMAIL */}
          <div className="final-form-field">

            <label htmlFor="email">
              EMAIL <sup>*</sup>
            </label>

            <div className="final-input">

              <span className="final-input-icon">
                ✉
              </span>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    email: event.target.value,
                  })
                }
                required
              />

            </div>

          </div>

        </div>



        {/* =================================================
            ROW 2
        ================================================= */}

        <div className="final-form-row">

          {/* PHONE */}
          <div className="final-form-field">

            <label htmlFor="phone">
              PHONE <sup>*</sup>
            </label>

            <div className="final-input">

              <span className="final-input-icon phone-icon">
                ⌕
              </span>

              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    phone: event.target.value,
                  })
                }
                required
              />

            </div>

          </div>


          {/* CITY */}
          <div className="final-form-field">

            <label htmlFor="city">
              CITY <sup>*</sup>
            </label>

            <div className="final-input">

              <span className="final-input-icon">
                ⌖
              </span>

              <input
                id="city"
                type="text"
                placeholder="Your city"
                value={formData.city}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    city: event.target.value,
                  })
                }
                required
              />

            </div>

          </div>

        </div>



        {/* =================================================
            ROW 3
        ================================================= */}

        <div className="final-form-row">

          {/* PROPERTY */}
          <div className="final-form-field">

            <label htmlFor="property_type">
              PROPERTY TYPE <sup>*</sup>
            </label>

            <div className="final-input final-select">

              <span className="final-input-icon">
                ⌂
              </span>

              <select
                id="property_type"
                value={formData.property_type}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    property_type: event.target.value,
                  })
                }
                required
              >

                <option value="">
                  Select property type
                </option>

                <option value="Apartment">
                  Apartment
                </option>

                <option value="Villa">
                  Villa
                </option>

                <option value="Independent House">
                  Independent House
                </option>

                <option value="Office">
                  Office
                </option>

                <option value="Retail / Shop">
                  Retail / Shop
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              <span className="select-arrow">
                ⌄
              </span>

            </div>

          </div>


          {/* PROJECT */}
          <div className="final-form-field">

            <label htmlFor="project_type">
              PROJECT TYPE <sup>*</sup>
            </label>

            <div className="final-input final-select">

              <span className="final-input-icon">
                ▦
              </span>

              <select
                id="project_type"
                value={formData.project_type}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    project_type: event.target.value,
                  })
                }
                required
              >

                <option value="">
                  Select project type
                </option>

                <option value="Full Home Interior">
                  Full Home Interior
                </option>

                <option value="Living Room Interior">
                  Living Room Interior
                </option>

                <option value="Bedroom Interior">
                  Bedroom Interior
                </option>

                <option value="Modular Kitchen">
                  Modular Kitchen
                </option>

                <option value="Commercial Interior">
                  Commercial Interior
                </option>

                <option value="Renovation">
                  Renovation
                </option>

                <option value="Custom Furniture">
                  Custom Furniture
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              <span className="select-arrow">
                ⌄
              </span>

            </div>

          </div>

        </div>



        {/* =================================================
            BUDGET
        ================================================= */}

        <div className="final-form-field">

          <label htmlFor="budget">
            BUDGET <sup>*</sup>
          </label>

          <div className="final-input final-select">

            <span className="final-input-icon budget-icon">
              ₹
            </span>

            <select
              id="budget"
              value={formData.budget}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  budget: event.target.value,
                })
              }
              required
            >

              <option value="">
                Select your budget
              </option>

              <option value="Below ₹10L">
                Below ₹10L
              </option>

              <option value="₹10L - ₹15L">
                ₹10L - ₹15L
              </option>

              <option value="₹15L - ₹25L">
                ₹15L - ₹25L
              </option>

              <option value="₹25L - ₹40L">
                ₹25L - ₹40L
              </option>

              <option value="₹40L+">
                ₹40L+
              </option>

            </select>

            <span className="select-arrow">
              ⌄
            </span>

          </div>

        </div>



        {/* =================================================
            MESSAGE
        ================================================= */}

        <div className="final-form-field">

          <label htmlFor="message">
            TELL US ABOUT YOUR PROJECT <sup>*</sup>
          </label>

          <div className="final-textarea">

            <span className="textarea-icon">
              ▢
            </span>

            <textarea
              id="message"
              rows={3}
              placeholder="Tell us about your requirements, preferred style, timelines, or any specific details..."
              value={formData.message}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  message: event.target.value,
                })
              }
              required
            />

          </div>

        </div>



        {/* =================================================
            SUBMIT BUTTON
        ================================================= */}

        <button
          type="submit"
          className="final-submit-button"
          disabled={isSubmitting}
        >

          <span>
            {isSubmitting
              ? "Submitting..."
              : "Submit Inquiry"}
          </span>

          <span className="final-submit-arrow">
            →
          </span>

        </button>


        {/* MESSAGE */}
        {submitMessage && (
          <p className="final-submit-message">
            {submitMessage}
          </p>
        )}



        {/* =================================================
            TRUST ROW
        ================================================= */}

        <div className="final-trust-row">

          <div className="final-trust-item">
            <span>♧</span>
            <p>Free Consultation</p>
          </div>

          <div className="final-trust-divider" />

          <div className="final-trust-item">
            <span>◷</span>
            <p>Quick Response</p>
          </div>

          <div className="final-trust-divider" />

          <div className="final-trust-item">
            <span>♡</span>
            <p>Your Vision, Our Priority</p>
          </div>

        </div>

      </form>

    </div>

  </div>

</section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" className="brand footer-logo">
              <span className="brand-mark">
  <Image
    src="/images/logo1.png"
    alt="Tara Living"
    width={462}
    height={410}
    style={{
    width: "50px",
    height: "auto",
  }}
  />
</span>
              <span>
                <strong>TARA</strong>
                <small>LIVING</small>
              </span>
            </a>

            <p>
              Wellness-inspired interiors designed with beauty,
              balance and meaning.
            </p>

            <div className="socials">
  <a
    href="https://www.instagram.com/_taraliving?utm_source=qr"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <FaInstagram />
  </a>

  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
  >
    <FaFacebookF />
  </a>

  <a
    href="https://wa.me/918639114375"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp"
  >
    <FaWhatsapp />
  </a>
</div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>

            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#process">Process</a>
            <a href="#journal">Journal</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Services</h4>

            <a href="#services">Residential Interiors</a>
            <a href="#services">Commercial Interiors</a>
            <a href="#services">Design & Styling</a>
            <a href="#services">Renovation & Turnkey</a>
          </div>

          <div className="footer-column contact-column">
            <h4>Let&apos;s Connect</h4>

            <a href="tel:+919876543210">
              +91 86391 14375
            </a>

            <a href="mailto:taraliving09@gmail.com">
              taraliving09@gmail.com
            </a>

            <p>Hyderabad, India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Tara Living. All rights reserved.
          </span>

          <span>Designed with intention.</span>
        </div>
      </footer>
    </main>
    </>
  );
}