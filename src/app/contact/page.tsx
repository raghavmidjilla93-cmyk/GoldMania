import Link from "next/link";
import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h1 className="title" style={{ margin: 0 }}>Contact Us</h1>
          <Link href="/" className="btn btn-secondary" style={{ padding: "10px 14px" }}>
            Home
          </Link>
        </div>

        <section className="card" style={{ padding: 16 }}>
          <p className="muted">Reach out to us for enquiries or custom orders.</p>

          <form style={{ display: "grid", gap: 12, marginTop: 14 }}>
            <input className="input" placeholder="Your Name" />
            <input className="input" placeholder="Your Phone or Email" />
            <textarea className="input" placeholder="Message" rows={4} />
            <button type="button" className="btn btn-primary">Send</button>
          </form>
        </section>
      </main>
    </>
  );
}
