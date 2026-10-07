import { animate, inView, stagger } from "https://esm.sh/framer-motion@12.23.24?bundle";

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = [0.22, 1, 0.36, 1];

function run(elements, keyframes, options = {}) {
  const items = Array.from(elements || []).filter(Boolean);
  if (!items.length) return;
  if (reducedMotion) {
    items.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }
  animate(items, keyframes, {
    duration: 0.65,
    ease,
    ...options
  });
}

function getSectionMotionElements(section) {
  const heading = section.querySelector(".section-heading");
  const index = section.querySelector(".section-index");
  const items = section.querySelectorAll(
    ".education-list article, .experience-item, .project, .academic-grid article, .services-grid article, .skill-table > div, .cert-list article"
  );
  const rules = section.querySelectorAll(".section-heading > span");
  return { heading, index, items, rules };
}

function setHidden(elements) {
  if (reducedMotion) return;
  Array.from(elements || []).filter(Boolean).forEach((el) => {
    el.style.opacity = "0";
  });
}

function hideSection(section) {
  if (reducedMotion) return;

  const { heading, index, items, rules } = getSectionMotionElements(section);
  const targets = [
    heading,
    index,
    ...Array.from(items),
    ...Array.from(rules)
  ].filter(Boolean);

  if (targets.length) {
    animate(targets, {
      opacity: 0,
      y: 18
    }, {
      duration: 0.35,
      ease
    });
  }
}

function revealSection(section) {
  if (reducedMotion) return;

  const { heading, index, items, rules } = getSectionMotionElements(section);

  const heading = section.querySelector(".section-heading");
  const index = section.querySelector(".section-index");
  const items = section.querySelectorAll(
    ".education-list article, .experience-item, .project, .academic-grid article, .skill-table > div, .cert-list article"
  );

  if (heading) {
    run([heading], { opacity: [0, 1], y: [28, 0] }, { duration: 0.7 });
  }
  if (index) {
    run([index], { opacity: [0, 1], x: [-12, 0] }, { duration: 0.45 });
  }
  if (items.length) {
    run(items, { opacity: [0, 1], y: [24, 0] }, {
      delay: stagger(0.075),
      duration: 0.55
    });
  }
}

function setupHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const title = hero.querySelector("h1");
  const kicker = hero.querySelector(".kicker");
  const meta = hero.querySelectorAll(".hero-meta span");
  const foot = hero.querySelector(".hero-foot");
  const nodes = hero.querySelectorAll(".node");
  const connectors = hero.querySelectorAll(".connector");
  const diagramNote = hero.querySelector(".diagram-note");

  if (title) {
    title.innerHTML = [
      '<span class="hero-line">Sheikh</span>',
      '<span class="hero-line"><i>Mohammad</i></span>',
      '<span class="hero-line">Rakib.</span>'
    ].join("");

    const lines = title.querySelectorAll(".hero-line");
    if (reducedMotion) {
      lines.forEach((line) => (line.style.opacity = "1"));
    } else {
      lines.forEach((line) => {
        line.style.display = "block";
        line.style.opacity = "0";
      });
      run(lines, { opacity: [0, 1], y: [42, 0] }, {
        delay: stagger(0.11),
        duration: 0.72
      });
    }
  }

  if (!reducedMotion) {
    run([kicker], { opacity: [0, 1], y: [18, 0] }, { delay: 0.2, duration: 0.55 });
    run(meta, { opacity: [0, 1], y: [-10, 0] }, {
      delay: stagger(0.08),
      duration: 0.4
    });
    run(nodes, { opacity: [0, 1], scale: [0.72, 1] }, {
      delay: stagger(0.13, { startDelay: 0.35 }),
      duration: 0.5
    });
    run(connectors, { opacity: [0, 1] }, {
      delay: stagger(0.12, { startDelay: 0.55 }),
      duration: 0.35
    });
    run([diagramNote, foot], { opacity: [0, 1], y: [12, 0] }, {
      delay: 0.8,
      duration: 0.45
    });

    nodes.forEach((node, index) => {
      inView(node, () => {
        animate(node, { scale: [1, 1.06, 1] }, {
          duration: 1.6,
          delay: index * 0.12,
          ease: "easeInOut"
        });
      }, { amount: 0.5 });
    });
  }
}

function setupSections() {
  document.querySelectorAll(".section").forEach((section) => {
    if (section.classList.contains("hero")) return;
    const { heading, index, items, rules } = getSectionMotionElements(section);
    setHidden([heading, index, ...Array.from(items), ...Array.from(rules)]);

    inView(section, () => {
      revealSection(section);

      if (!reducedMotion && rules.length) {
        run(rules, { opacity: [0, 1], x: [-18, 0] }, { duration: 0.5 });
      }

      return () => hideSection(section);
    }, { amount: 0.16 });
  });
}

function setupProfileAndSpecialSections() {
  const profile = document.querySelector("#profile");
  if (profile) {
    const copy = profile.querySelectorAll(".profile-copy > p, .contact-strip");
    setHidden(copy);
    inView(profile, () => {
      if (copy.length) run(copy, { opacity: [0, 1], y: [22, 0] }, {
        delay: stagger(0.1, { startDelay: 0.25 }),
        duration: 0.55
      });
      return () => {
        if (reducedMotion || !copy.length) return;
        animate(Array.from(copy), { opacity: 0, y: 18 }, { duration: 0.35, ease });
      };
    }, { amount: 0.18 });
  }

  const award = document.querySelector(".award");
  if (award) {
    setHidden([award]);
    inView(award, () => {
      run([award], { opacity: [0, 1], x: [30, 0] }, { duration: 0.7 });
      return () => {
        if (reducedMotion) return;
        animate(award, { opacity: 0, x: 30 }, { duration: 0.35, ease });
      };
    }, { amount: 0.25 });
  }

  const contact = document.querySelector(".contact");
  if (contact) {
    const heading = contact.querySelector("h2");
    const top = contact.querySelector(".contact-top");
    const bottom = contact.querySelector(".contact-bottom");

    if (heading) {
      heading.innerHTML = '<span class="contact-line">Let’s connect</span><span class="contact-line"><i>the next system.</i></span>';
    }

    const contactLines = contact.querySelectorAll(".contact-line");
    setHidden([top, bottom, ...Array.from(contactLines)]);

    inView(contact, () => {
      if (reducedMotion) return;
      run([top], { opacity: [0, 1], y: [-12, 0] }, { duration: 0.45 });
      run(contactLines, { opacity: [0, 1], y: [42, 0] }, {
        delay: stagger(0.12, { startDelay: 0.15 }),
        duration: 0.75
      });
      run([bottom], { opacity: [0, 1], y: [20, 0] }, { delay: 0.45, duration: 0.55 });

      return () => {
        if (reducedMotion) return;
        animate([top, bottom, ...Array.from(contactLines)].filter(Boolean), {
          opacity: 0,
          y: 22
        }, { duration: 0.35, ease });
      };
    }, { amount: 0.2 });
  }
}

function setupHoverMotion() {
  if (reducedMotion) return;

  document.querySelectorAll(".project, .academic-grid article, .services-grid article, .skill-table > div, .cert-list article").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      animate(card, { y: -4 }, { duration: 0.2, ease: "easeOut" });
    });
    card.addEventListener("mouseleave", () => {
      animate(card, { y: 0 }, { duration: 0.25, ease });
    });
  });

  document.querySelectorAll(".node").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      animate(node, { scale: 1.07 }, { duration: 0.18 });
    });
    node.addEventListener("mouseleave", () => {
      animate(node, { scale: 1 }, { duration: 0.2 });
    });
  });
}

setupHero();
setupSections();
setupProfileAndSpecialSections();
setupHoverMotion();
