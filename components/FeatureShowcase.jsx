"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/FeatureShowcase.module.css";
import { features } from "@/lib/features";

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [released, setReleased] = useState(false); // after last feature, release sticky
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // detect small screen

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Observe when the section is in view (to start/stop auto-advance)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance while sticky + in view; after last, release sticky
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!released && inView && !hasPlayed && !isMobile) { // skip on mobile
      timerRef.current = setInterval(() => {
        setActive((prev) => {
          if (prev < features.length - 1) {
            return prev + 1;
          } else {
            setReleased(true);
            setHasPlayed(true);
            clearInterval(timerRef.current);
            return prev;
          }
        });
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inView, released, hasPlayed, isMobile]);

  const goTo = (i) => {
    setActive(i);
    if (i < features.length - 1) setReleased(false);
  };

  const next = () => {
    if (active === features.length - 1) return;
    goTo(active + 1);
  };

  const prev = () => {
    if (active === 0) return;
    goTo(active - 1);
  };

  // Scroll lock effect, only on desktop
  useEffect(() => {
    if (!isMobile && inView && !released && !hasPlayed) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto"; // restore scroll
    }
  }, [inView, released, hasPlayed, isMobile]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div
        className={`${styles.stickyWrap} ${
          released || isMobile ? styles.released : ""
        }`} // release sticky on mobile
      >
        <div className={styles.container}>
          <div className={styles.left}>
            <h4 className={styles.featureNo}>
              {features[active].title} <span className={styles.dash}>-</span>
            </h4>
            <h2 className={styles.heading}>{features[active].heading}</h2>
            <ul className={styles.bullets}>
              {features[active].bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>

            <div className={styles.arrows}>
              <button aria-label="Previous feature" onClick={prev} disabled={active === 0}>
                ←
              </button>
              <button
                aria-label="Next feature"
                onClick={next}
                disabled={active === features.length - 1}
              >
                →
              </button>
            </div>
          </div>

          <div className={styles.center}>
            <div className={styles.phone}>
              <div
                className={styles.screen}
                style={{
                  backgroundImage: `url(${features[active].screenBg})`,
                  backgroundSize: features[active].bgSize || "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>

          <div className={styles.right}>
            <h3 className={styles.showcaseTitle}>Feature Showcase</h3>
            <ul className={styles.list}>
              {features.map((f, i) => (
                <li
                  key={f.id}
                  className={`${styles.item} ${i === active ? styles.active : ""}`}
                  onClick={() => goTo(i)}
                >
                  {f.label} : {f.heading}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.benefits}>
        <h2>Why Apple is the best place to buy iPhone.</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.icon}>🔄</div>
            <h3>Save with Apple Trade In.</h3>
            <p>
              Get ₹16,000–₹62,200 in credit towards iPhone 16 or iPhone 16 Pro
              when you trade in iPhone 12 or higher.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>💳</div>
            <h3>Monthly payment options are available.</h3>
            <p>Choose the easy way to finance with convenient monthly payment options.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🚚</div>
            <h3>Get flexible delivery and easy pickup.</h3>
            <p>Get free delivery or pickup at your Apple Store.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
