// app.js - Richie Careers Application Logic

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE ---
  let activeView = "home";
  let activeFilter = "all";
  let currentModel = null;

  // --- SELECTORS ---
  const navLinks = document.querySelectorAll(".nav-link, .btn-request, .nav-logo");
  const viewSections = document.querySelectorAll(".view-section");
  const rosterGrid = document.getElementById("roster-grid");
  const blogsGrid = document.getElementById("blogs-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  
  // Navigation Toggle (Mobile)
  const navToggle = document.getElementById("nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");
  const navbar = document.getElementById("navbar");

  // Model Modal
  const modelModal = document.getElementById("model-modal");
  const modalClose = document.getElementById("modal-close");
  const modalImg = document.getElementById("modal-img");
  const modalName = document.getElementById("modal-name");
  const modalDivision = document.getElementById("modal-division");
  
  // Modal Stats
  const statHeight = document.getElementById("stat-height");
  const statDress = document.getElementById("stat-dress");
  const statBust = document.getElementById("stat-bust");
  const statSuit = document.getElementById("stat-suit");
  const statWaist = document.getElementById("stat-waist");
  const statHips = document.getElementById("stat-hips");
  const statShoes = document.getElementById("stat-shoes");
  const statHair = document.getElementById("stat-hair");
  const statEyes = document.getElementById("stat-eyes");
  const statNationality = document.getElementById("stat-nationality");
  const statCity = document.getElementById("stat-city");
  const statUnion = document.getElementById("stat-union");
  
  // Stats Rows (for conditional rendering)
  const rowDress = document.getElementById("row-dress");
  const rowBust = document.getElementById("row-bust");
  const rowSuit = document.getElementById("row-suit");
  const modalBookBtn = document.getElementById("modal-book-btn");

  // Forms
  const submissionForm = document.getElementById("submission-form");
  const contactForm = document.getElementById("general-contact-form");
  const requestForm = document.getElementById("request-form");
  const newsletterForm = document.getElementById("newsletter-form");
  const toastContainer = document.getElementById("toast-container");

  // --- SPA ROUTER ---
  const handleRouting = () => {
    const hash = window.location.hash.replace("#", "") || "home";
    
    // Close mobile menu if open
    navLinksContainer.classList.remove("open");
    navToggle.classList.remove("open");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update active view section
    viewSections.forEach(section => {
      section.classList.remove("active-view");
      if (section.id === `view-${hash}`) {
        section.classList.add("active-view");
      }
    });

    // Update active nav-link highlighting
    navLinks.forEach(link => {
      link.classList.remove("active");
      const linkView = link.getAttribute("data-view");
      if (linkView === hash) {
        link.classList.add("active");
      }
    });

    activeView = hash;
  };

  window.addEventListener("hashchange", handleRouting);
  // Run on initial load
  if (window.location.hash) {
    handleRouting();
  }

  // --- NAVBAR SCROLL EFFECT ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // --- MOBILE TOGGLE MENU ---
  navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("open");
    navToggle.classList.toggle("open");
  });

  // --- HERO SLIDE BACKGROUND CYCLE ---
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const heroBgImages = [
      "assets/hero_bg.png",
      "assets/female_model_one.png",
      "assets/male_model_one.png"
    ];
    let bgIndex = 0;
    setInterval(() => {
      bgIndex = (bgIndex + 1) % heroBgImages.length;
      heroSection.style.backgroundImage = `url('${heroBgImages[bgIndex]}')`;
    }, 6000);
  }

  // --- RENDER MODELS ROSTER ---
  const renderRoster = (filter = "all") => {
    if (!rosterGrid) return;
    rosterGrid.innerHTML = "";

    // Filter models
    const filteredModels = window.MODELS.filter(model => {
      if (filter === "all") return true;
      return model.division === filter;
    });

    if (filteredModels.length === 0) {
      rosterGrid.innerHTML = `<div class="no-models">No models found in this division.</div>`;
      return;
    }

    // Generate cards
    filteredModels.forEach(model => {
      const card = document.createElement("div");
      card.className = "model-card";
      card.setAttribute("data-id", model.id);
      
      // Select secondary details based on division
      const secondaryStat = model.division === "Women" ? `Bust: ${model.bust}` : `Suit: ${model.suit}`;

      card.innerHTML = `
        <div class="model-img-wrapper">
          <img src="${model.image}" alt="${model.name}" class="model-img" loading="lazy">
          <div class="model-overlay-card">
            <h3 class="model-card-name">${model.name}</h3>
            <div class="model-card-meta">
              <span>Height: ${model.height}</span>
              <span>${secondaryStat}</span>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openModelModal(model.id));
      rosterGrid.appendChild(card);
    });
  };

  // Initial roster render
  if (window.MODELS) {
    renderRoster("all");
  }

  // --- ROSTER DIVISION FILTERS ---
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active btn styling
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Render roster with division filter
      const filter = btn.getAttribute("data-filter");
      activeFilter = filter;
      renderRoster(filter);
    });
  });

  // --- RENDER BLOGS GRID ---
  const renderBlogs = () => {
    if (!blogsGrid || !window.BLOGS) return;
    blogsGrid.innerHTML = "";

    window.BLOGS.forEach(post => {
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        <div class="blog-meta">
          <span>By ${post.author}</span>
          <span>${post.date}</span>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.summary}</p>
        <a href="#about" class="blog-link">Read Article &rarr;</a>
      `;
      blogsGrid.appendChild(card);
    });
  };

  renderBlogs();

  // --- MODEL DETAIL MODAL ---
  const openModelModal = (modelId) => {
    const model = window.MODELS.find(m => m.id === modelId);
    if (!model) return;
    currentModel = model;

    // Load text details
    modalName.textContent = model.name;
    modalDivision.textContent = `${model.division}'s Division`;
    modalImg.src = model.image;
    modalImg.alt = model.name;

    // Load stats
    statHeight.textContent = model.height;
    statWaist.textContent = model.waist;
    statHips.textContent = model.hips || "N/A";
    statShoes.textContent = model.shoes;
    statHair.textContent = model.hair;
    statEyes.textContent = model.eyes;
    statNationality.textContent = model.nationality;
    statCity.textContent = model.city;
    statUnion.textContent = model.union;

    // Conditional stats rendering
    if (model.division === "Women") {
      rowDress.style.display = "flex";
      rowBust.style.display = "flex";
      rowSuit.style.display = "none";
      statDress.textContent = model.dress;
      statBust.textContent = model.bust;
    } else if (model.division === "Men") {
      rowDress.style.display = "none";
      rowBust.style.display = "none";
      rowSuit.style.display = "flex";
      statSuit.textContent = model.suit;
    } else {
      // Kids
      rowDress.style.display = "flex";
      rowBust.style.display = "none";
      rowSuit.style.display = "none";
      statDress.textContent = model.dress;
    }

    // Set up polaroid images selector
    const polaroidThumbs = document.querySelectorAll(".polaroid-thumb");
    polaroidThumbs.forEach((thumb, index) => {
      const img = thumb.querySelector("img");
      
      // Use model image as main, and hero image / alternate model image as other views to mimic catalog
      if (index === 0) {
        img.src = model.image;
        thumb.classList.add("active");
      } else if (index === 1) {
        img.src = "assets/hero_bg.png";
        thumb.classList.remove("active");
      } else {
        img.src = model.division === "Women" ? "assets/male_model_one.png" : "assets/female_model_one.png";
        thumb.classList.remove("active");
      }

      // Handle thumbnail switching
      thumb.onclick = () => {
        polaroidThumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        modalImg.src = img.src;
      };
    });

    // Book model button binds pre-selection
    modalBookBtn.onclick = () => {
      closeModelModal();
      window.location.hash = "#request";
      // Fill preselected model name field in Package Request Form
      const preselectedInput = document.getElementById("req-preselected");
      if (preselectedInput) {
        preselectedInput.value = model.name;
      }
    };

    // Open Modal
    modelModal.classList.add("open");
    document.body.style.overflow = "hidden"; // Lock background scroll
  };

  const closeModelModal = () => {
    modelModal.classList.remove("open");
    document.body.style.overflow = ""; // Restore scroll
    currentModel = null;
  };

  modalClose.addEventListener("click", closeModelModal);
  
  // Close modal when clicking overlay background
  modelModal.addEventListener("click", (e) => {
    if (e.target === modelModal) {
      closeModelModal();
    }
  });

  // --- PREMIUM TOAST ALERTS SYSTEM ---
  const showToast = (message, duration = 4000) => {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span style="color: var(--accent-gold); font-size: 1.1rem;">&#10003;</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, duration);
  };

  // --- SUBMISSIONS FORM ---
  if (submissionForm) {
    submissionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById("sub-first-name").value;
      const lastName = document.getElementById("sub-last-name").value;
      
      showToast(`Thank you, ${firstName} ${lastName}! Your model application has been submitted to Richie Careers Management. Our scouts will review your digitals.`);
      submissionForm.reset();
    });
  }

  // --- CLIENT PACKAGE REQUEST FORM ---
  if (requestForm) {
    requestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const company = document.getElementById("req-company").value;
      
      showToast(`Package inquiry sent successfully! Our Richie Careers relations managers will curate custom portfolios for ${company} within 24 hours.`);
      requestForm.reset();
    });
  }

  // --- GENERAL CONTACT FORM ---
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("con-name").value;
      
      showToast(`Message sent successfully! Thank you for contacting Richie Careers, ${name}.`);
      contactForm.reset();
    });
  }

  // --- NEWSLETTER SUBSCRIPTION ---
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      showToast("Thank you for subscribing to Richie Careers Newsletter! Modern modeling campaigns and editorials will be sent weekly.");
      newsletterForm.reset();
    });
  }
});
