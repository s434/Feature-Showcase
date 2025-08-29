import FeatureShowcase from "@/components/FeatureShowcase";

export default function Home() {
  return (
    <main>
      {/* filler above so you scroll *into* the sticky section 
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <p style={{ color: "#334155" }}>Scroll down to see the Feature Showcase</p>
      </div> */}

      <FeatureShowcase />

      {/* content after, so you can keep scrolling once sticky releases 
      <section style={{ height: "120vh", display: "grid", placeItems: "center" }}>
        <h2>Thanks for scrolling ✨</h2> 
      </section> */}
    </main>
  );
}
