/* Nexus - App Script */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Navbar ---
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 2. Scroll Reveal Animations ---
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = (window.innerHeight / 10) * 8.5;
    reveals.forEach(reveal => {
      const top = reveal.getBoundingClientRect().top;
      if (top < triggerBottom) {
        reveal.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // --- 3. Interactive Systems Blueprint (Before / After) ---
  const blueprintGrid = document.getElementById('blueprint-grid');
  const btnBefore = document.getElementById('btn-blueprint-before');
  const btnAfter = document.getElementById('btn-blueprint-after');

  const blueprints = {
    before: `
      <div class="blueprint-card glass-card negative">
        <div class="blueprint-card-header">
          <div class="blueprint-icon danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3>Zillow Flex & API Sync</h3>
        </div>
        <p class="blueprint-card-body">
          Leads sync with delayed intervals. Stage updates in FollowUpBoss fail to push back to Zillow, putting your Flex compliance score at risk and causing team lead-routing penalties.
        </p>
      </div>
      
      <div class="blueprint-card glass-card negative">
        <div class="blueprint-card-header">
          <div class="blueprint-icon danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3>Lead Routing Rules</h3>
        </div>
        <p class="blueprint-card-body">
          No instant speed-to-lead auto-responders. New leads wait in a round-robin queue. Response times exceed 10 minutes, losing Zillow Flex live transfers and Premier callbacks.
        </p>
      </div>

      <div class="blueprint-card glass-card negative">
        <div class="blueprint-card-header">
          <div class="blueprint-icon danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>
          <h3>Database Cleanliness</h3>
        </div>
        <p class="blueprint-card-body">
          Dozens of duplicate tags, conflicting custom fields, and thousands of neglected cold contacts. Agents don't know who has been called or when a lead was last active.
        </p>
      </div>

      <div class="blueprint-card glass-card negative">
        <div class="blueprint-card-header">
          <div class="blueprint-icon danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          </div>
          <h3>Agent Daily Workflows</h3>
        </div>
        <p class="blueprint-card-body">
          Agents spend half their day manually searching for leads or scrolling through random sorting lists. Zero accountability, leading to low dial volume and forgotten follow-ups.
        </p>
      </div>
    `,
    after: `
      <div class="blueprint-card glass-card positive">
        <div class="blueprint-card-header">
          <div class="blueprint-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3>API Alignment & Compliance</h3>
        </div>
        <p class="blueprint-card-body">
          Nexus establishes real-time two-way stage sync. FollowUpBoss updates push back instantly to Zillow, maintaining a perfect compliance score and securing top-tier lead routing.
        </p>
      </div>
      
      <div class="blueprint-card glass-card positive">
        <div class="blueprint-card-header">
          <div class="blueprint-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3>Automated Routing & SMS</h3>
        </div>
        <p class="blueprint-card-body">
          Automated text responses and ring groups fire in seconds. Lead response times are guaranteed under 60 seconds, capturing every Flex transfer and Premier callback.
        </p>
      </div>

      <div class="blueprint-card glass-card positive">
        <div class="blueprint-card-header">
          <div class="blueprint-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3>Standardized Clean Database</h3>
          <span class="badge-status" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-lime); padding: 0.15rem 0.4rem; border-radius: 3px; font-size: 0.65rem; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.15); margin-left: auto;">Optimized</span>
        </div>
        <p class="blueprint-card-body">
          Purged duplicate tags, archived cold contacts, and consolidated fields. Managers get clean reporting and agents have a single, reliable source of truth.
        </p>
      </div>

      <div class="blueprint-card glass-card positive">
        <div class="blueprint-card-header">
          <div class="blueprint-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3>Inbox Zero Workflows</h3>
        </div>
        <p class="blueprint-card-body">
          Agents focus exclusively on 5 core smart lists that guide their dials based on real-time activity. Clear daily task rules drive massive dial velocity and accountability.
        </p>
      </div>
    `
  };

  const setBlueprint = (stateName) => {
    if (!blueprintGrid) return;
    blueprintGrid.style.opacity = '0';
    blueprintGrid.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      blueprintGrid.innerHTML = blueprints[stateName];
      blueprintGrid.style.opacity = '1';
      blueprintGrid.style.transform = 'translateY(0)';
    }, 200);
  };

  if (btnBefore && btnAfter) {
    btnBefore.addEventListener('click', () => {
      btnBefore.classList.add('active');
      btnAfter.classList.remove('active');
      setBlueprint('before');
    });

    btnAfter.addEventListener('click', () => {
      btnAfter.classList.add('active');
      btnBefore.classList.remove('active');
      setBlueprint('after');
    });
  }


  // --- 4. Pricing Toggle System ---
  const pricingCheckbox = document.getElementById('pricing-checkbox');
  const lblOneTime = document.getElementById('lbl-one-time');
  const lblRecurring = document.getElementById('lbl-recurring');
  
  // Left pricing card elements
  const cardLeftTitle = document.getElementById('card-left-title');
  const cardLeftDesc = document.getElementById('card-left-desc');
  const cardLeftPrice = document.getElementById('card-left-price');
  const cardLeftFeatures = document.getElementById('card-left-features');
  const cardLeftBtn = document.getElementById('card-left-btn');

  // Right pricing card elements
  const cardRightTitle = document.getElementById('card-right-title');
  const cardRightDesc = document.getElementById('card-right-desc');
  const cardRightPrice = document.getElementById('card-right-price');
  const cardRightFeatures = document.getElementById('card-right-features');
  const cardRightBtn = document.getElementById('card-right-btn');
  const cardRightBadge = document.getElementById('card-right-badge');

  // Data packages
  const packages = {
    oneTime: {
      left: {
        title: "System Inspection & Audit",
        desc: "A thorough check-up of your Zillow routing and FUB architecture.",
        price: "$0",
        btnText: "Claim Free Audit",
        features: [
          "Zillow API Integration Check",
          "Speed-to-lead Response Analysis",
          "Tag & Folder Clutter Identification",
          "Factual Performance Report"
        ]
      },
      right: {
        title: "Done-For-You Setup",
        desc: "A complete rebuild of lists, tags, and automation sequences.",
        price: "$1,499<span>one-time</span>",
        badge: "Recommended",
        btnText: "Get Started",
        features: [
          "Full Tag & Field Deduplication",
          "5 Core FollowUpBoss Smart Lists",
          "Automated Speed-to-lead action plans",
          "1-on-1 team training session (60m)",
          "14 days of post-launch bug support"
        ]
      }
    },
    recurring: {
      left: {
        title: "Ongoing Systems Support",
        desc: "Ongoing maintenance to keep workflows and routing clean.",
        price: "$499<span>/ month</span>",
        btnText: "Subscribe Now",
        features: [
          "Bi-weekly smart list inspection",
          "Pipeline routing alignment checks",
          "1 text sequence adjustment per month",
          "Direct email technical support",
          "No long-term contracts"
        ]
      },
      right: {
        title: "Conversion Success Consulting",
        desc: "Dedicated systems optimization and conversion advisory to drive agent output.",
        price: "$999<span>/ month</span>",
        badge: "Popular Support",
        btnText: "Subscribe Now",
        features: [
          "Bi-weekly agent speed-to-lead audit",
          "Drip text sequence updates & A/B testing",
          "Custom lead routing rules adjustments",
          "Bi-weekly team check-in call (30m)",
          "Priority Slack & email technical support"
        ]
      }
    }
  };

  const updatePricingDOM = (isRecurring) => {
    const data = isRecurring ? packages.recurring : packages.oneTime;
    
    // Add transition styling
    const cards = [document.getElementById('pricing-card-left'), document.getElementById('pricing-card-right')];
    cards.forEach(card => {
      card.style.opacity = '0.5';
      card.style.transform = 'scale(0.98)';
    });

    setTimeout(() => {
      // Update Left Card
      cardLeftTitle.textContent = data.left.title;
      cardLeftDesc.textContent = data.left.desc;
      cardLeftPrice.innerHTML = data.left.price;
      cardLeftBtn.textContent = data.left.btnText;
      cardLeftFeatures.innerHTML = data.left.features.map(f => `
        <li class="price-feature-item">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${f}
        </li>
      `).join('');

      // Update Right Card
      cardRightTitle.textContent = data.right.title;
      cardRightDesc.textContent = data.right.desc;
      cardRightPrice.innerHTML = data.right.price;
      cardRightBtn.textContent = data.right.btnText;
      if (data.right.badge) {
        cardRightBadge.style.display = 'block';
        cardRightBadge.textContent = data.right.badge;
      } else {
        cardRightBadge.style.display = 'none';
      }
      cardRightFeatures.innerHTML = data.right.features.map(f => `
        <li class="price-feature-item">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${f}
        </li>
      `).join('');

      // Restore styling
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      });
    }, 200);
  };

  pricingCheckbox.addEventListener('change', () => {
    const isChecked = pricingCheckbox.checked;
    if (isChecked) {
      lblOneTime.classList.remove('active');
      lblRecurring.classList.add('active');
      updatePricingDOM(true);
    } else {
      lblOneTime.classList.add('active');
      lblRecurring.classList.remove('active');
      updatePricingDOM(false);
    }
  });

  // Sync labels click to switch toggle checkbox
  lblOneTime.addEventListener('click', () => {
    if (pricingCheckbox.checked) {
      pricingCheckbox.checked = false;
      pricingCheckbox.dispatchEvent(new Event('change'));
    }
  });

  lblRecurring.addEventListener('click', () => {
    if (!pricingCheckbox.checked) {
      pricingCheckbox.checked = true;
      pricingCheckbox.dispatchEvent(new Event('change'));
    }
  });


  // --- 5. Audit Request Form Submission ---
  const auditForm = document.getElementById('audit-request-form');
  const formContainer = document.getElementById('contact-form-container');

  auditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch values to verify
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const teamSize = document.getElementById('form-team-size').value;
    const budget = document.getElementById('form-zillow-budget').value;
    const comments = document.getElementById('form-comments').value;

    // Submit via FormSubmit AJAX to trynexustoday@gmail.com
    fetch("https://formsubmit.co/ajax/trynexustoday@gmail.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Name: name,
        Email: email,
        TeamSize: teamSize,
        ZillowSpend: budget,
        BottleneckNotes: comments
      })
    })
    .then(response => response.json())
    .then(data => console.log('FormSubmit Success:', data))
    .catch(error => console.log('FormSubmit Error:', error));

    // Log internally for debugging
    console.log('--- Nexus Audit Submission ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Team Size:', teamSize);
    console.log('Zillow Spend:', budget);
    console.log('Comments:', comments);
    console.log('--------------------------------');

    // Trigger success layout transition
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateY(10px)';

    setTimeout(() => {
      formContainer.innerHTML = `
        <div class="form-success-state">
          <div class="success-icon-wrapper">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 class="success-title">Request Received</h3>
          <p class="success-desc">
            Thanks, <strong>${name}</strong>. We've logged your request. We will review your bottleneck notes and follow up at <strong>${email}</strong> within 48 business hours to schedule your audit call.
          </p>
        </div>
      `;
      formContainer.style.opacity = '1';
      formContainer.style.transform = 'translateY(0)';
    }, 300);
  });
});
