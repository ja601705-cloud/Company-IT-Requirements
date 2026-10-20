/* ===== Company IT Requirements: scripts ===== */

/* ----- Saudi Green Intro Screen ----- */

(function startIntroScreen() {
    const intro = document.getElementById("introScreen");

    if (!intro) return;

    // Apply professional Saudi green colors.
    intro.style.background =
        "linear-gradient(135deg, #033226 0%, #166534 55%, #15803D 100%)";

    // Style the intro text.
    const eyebrow = intro.querySelector(".intro-eyebrow");

    if (eyebrow) {
        eyebrow.style.color = "#BBF7D0";
    }

    // Style the loading bar.
    const loader = intro.querySelector(".intro-loader span");

    if (loader) {
        loader.style.background = "#BBF7D0";
    }

    // Keep the intro visible briefly, then reveal the dashboard.
    window.setTimeout(() => {
        intro.classList.add("intro-exit");

        // Remove the intro after the fade-out.
        window.setTimeout(() => {
            intro.remove();
        }, 750);
    }, 2500);
})();


/* ----- Added Features: Recent Activity & License Expiration Alerts ----- */

// Update Recent Activity Feed automatically
function updateActivityFeed() {
  const feed = document.getElementById("activityFeed");
  if (!feed) return;
  const sortedRecords = [...records].reverse().slice(0, 5);
  if (sortedRecords.length === 0) {
    feed.innerHTML = `<p style="color: var(--muted); font-size: 12px; margin: 0;">No recent activity recorded yet.</p>`;
    return;
  }
  feed.innerHTML = sortedRecords.map(r => {
    const title = r.name || r.domain || "New Record";
    const cat = r.category ? r.category.toUpperCase() : "GENERAL";
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg); border-radius: 8px; font-size: 12px;">
        <div>
          <span style="font-weight: 700; color: var(--blue); margin-right: 6px;">[${escapeHTML(cat)}]</span>
          <span>Added/Updated: <strong>${escapeHTML(title)}</strong></span>
        </div>
        <span style="color: var(--muted); font-size: 11px;">Just now</span>
      </div>
    `;
  }).join("");
}

// Check Expiring Licenses and Trial Periods
function checkExpiringLicenses() {
  const alertPanel = document.getElementById("expirationAlertPanel");
  const alertList = document.getElementById("alertList");
  const alertBadge = document.getElementById("alertCountBadge");
  if (!alertPanel || !alertList) return;

  const today = new Date();
  const alertThresholdDays = 30; // Alert before 30 days

  const expiringRecords = records.filter(r => {
    if (!r.renewalDate) return false;
    const renewal = new Date(r.renewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= alertThresholdDays;
  });

  if (expiringRecords.length === 0) {
    alertPanel.style.display = "none";
    return;
  }

  alertPanel.style.display = "block";
  alertBadge.textContent = `${expiringRecords.length} Expiring Soon`;

  alertList.innerHTML = expiringRecords.map(r => {
    const renewal = new Date(r.renewalDate);
    const diffTime = renewal - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const title = r.name || r.assignedTo || "User License";
    const userOrNotes = r.assignedTo ? `Assigned to: <strong>${escapeHTML(r.assignedTo)}</strong>` : (r.notes || "");

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#FFF5F5; border-radius:10px; font-size:12px; border:1px solid #FFE0E0;">
        <div>
          <strong style="color:var(--text);">${escapeHTML(title)}</strong> 
          <span style="color:var(--muted); margin-left:8px;">(${userOrNotes})</span>
        </div>
        <div>
          <span class="badge" style="background:#FFE2E5; color:var(--red);">Expires in ${daysLeft} days (${escapeHTML(r.renewalDate)})</span>
        </div>
      </div>
    `;
  }).join("");
}