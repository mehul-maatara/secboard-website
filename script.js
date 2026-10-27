(function () {
  var root = document.documentElement;
  var storageKey = "secboard-theme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function systemTheme() {
    return media.matches ? "dark" : "light";
  }

  function currentMode() {
    return localStorage.getItem(storageKey) || "auto";
  }

  function apply(mode) {
    var resolved = mode === "auto" ? systemTheme() : mode;
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-theme-mode", mode);
    document.querySelectorAll('input[name="theme"]').forEach(function (input) {
      input.checked = input.value === mode;
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "dark" ? "#070b14" : "#ffffff");
  }

  apply(currentMode());

  document.querySelectorAll('input[name="theme"]').forEach(function (input) {
    input.addEventListener("change", function () {
      if (!input.checked) return;
      localStorage.setItem(storageKey, input.value);
      apply(input.value);
    });
  });

  media.addEventListener("change", function () {
    if (currentMode() === "auto") apply("auto");
  });

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var tabs = document.querySelectorAll(".shot-tabs button");
  var figure = document.getElementById("showcase-figure");
  var image = document.getElementById("showcase-image");
  var caption = document.getElementById("showcase-caption");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (other) {
        other.setAttribute("aria-selected", other === tab ? "true" : "false");
      });
      image.src = tab.getAttribute("data-src");
      image.alt = tab.getAttribute("data-alt");
      caption.textContent = tab.getAttribute("data-caption");
    });
  });

  var stack = document.getElementById("stack");
  if (stack) {
    var overview = document.getElementById("stack-overview");
    var detail = document.getElementById("stack-detail");
    var back = document.getElementById("stack-back");
    var live = document.getElementById("stack-live");
    var barTitle = document.getElementById("stack-bar-title");
    var kicker = document.getElementById("stack-detail-kicker");
    var title = document.getElementById("stack-detail-title");
    var job = document.getElementById("stack-detail-job");
    var features = document.getElementById("stack-detail-features");
    var more = document.getElementById("stack-detail-more");
    var caption = document.getElementById("stack-detail-caption");
    var shot = document.getElementById("stack-detail-shot");
    var shots = {
      secops: ["assets/secops-dashboard.png", "SecOps dashboard: posture, severity, aging, and mean time to remediate."],
      finops: ["assets/finops-dashboard.png", "FinOps dashboard: spend, estimated waste, and the cost posture score."],
      perfops: ["assets/overview.png", "Overview. Performance checks sit beside security and cost."],
      aiops: ["assets/overview.png", "Overview. AI workload governance is its own practice, beside security and cost."],
      incidentops: ["assets/vulnerabilities.png", "The vulnerability queue stays in SecOps. Incident records and postmortems live in IncidentOps."],
      dataops: ["assets/overview.png", "Overview. Data health is its own practice on the same list of systems."],
      discovery: ["assets/overview.png", "Overview with the shared asset inventory the agent discovery fills."],
      engineering: ["assets/scan-executions.png", "Scan executions: tool, target, agent, and whether the run was manual or scheduled."],
      aws: ["assets/cloud-posture.png", "Cloud posture: severity, service, region, and resource."],
      azure: ["assets/overview.png", "The same workspace sits on the Azure subscriptions you already run."],
      gcp: ["assets/overview.png", "The same workspace sits on the Google Cloud projects you already run."],
      private: ["assets/scan-executions.png", "An agent on a cloud you operate yourself sends results back to the same workspace."],
      vmware: ["assets/overview.png", "Overview. VMware guests stay linked to the hypervisor that hosts them."],
      baremetal: ["assets/scan-executions.png", "Scans and discovery runs against hosts with no hypervisor."],
      local: ["assets/scan-executions.png", "Scans run by the agent on machines in your network."]
    };
    var openId = null;
    var panels = {
      secops: {
        kicker: "Security",
        title: "SecOps",
        job: "Open risks, how serious they are, and who should fix them.",
        href: "#secops",
        features: [
          "Posture score, open critical, and open high",
          "Items overdue past SLA and known exploited CVEs",
          "Open versus closed, and the closure rate",
          "Severity, status, aging, and mean time to remediate",
          "Cloud check results, coverage warnings, and asset exposure"
        ]
      },
      finops: {
        kicker: "Cost",
        title: "FinOps",
        job: "The bill, the waste, and the resources nobody owns.",
        href: "#finops",
        features: [
          "Spend this month and last month",
          "A forecast of the monthly bill and an estimate of waste",
          "Resources that are running, and resources nobody owns",
          "Daily spend for the last 30 days, by the services that cost the most",
          "Idle, wasted, orphaned, or untracked cost problems"
        ]
      },
      perfops: {
        kicker: "Performance",
        title: "PerfOps",
        job: "Are services meeting the targets we set?",
        href: "#perfops",
        features: [
          "Targets you declare: availability, response time, and error rate",
          "A missed target, or a result that is getting worse",
          "A host with little capacity left, and certificates close to expiry",
          "Deploy frequency, lead time, change failure rate, and time to restore",
          "Your live metrics platform stays in place"
        ]
      },
      aiops: {
        kicker: "AI workloads",
        title: "AI-Ops",
        job: "Are our models known, safe, and worth the spend?",
        href: "#aiops",
        features: [
          "Daily usage and cost by model, and by app or team when labeled",
          "A finding when spend jumps above its recent baseline",
          "A finding when a model appears that nobody registered",
          "Idle endpoints, and endpoints that answer without authentication",
          "Prompts and answers are not stored"
        ]
      },
      incidentops: {
        kicker: "Incidents",
        title: "IncidentOps",
        job: "What happened, who ran it, and what will we change?",
        href: "#incidentops",
        features: [
          "Status, severity, owner, and the systems involved",
          "Alerts from your existing tools, grouped into one record",
          "An on-call roster, computed from the rotation you set",
          "A postmortem whose action items become owned findings",
          "Paging stays with the on-call tool you already run"
        ]
      },
      dataops: {
        kicker: "Data health",
        title: "DataOps",
        job: "Is the data fresh, stable, and owned?",
        href: "#dataops",
        features: [
          "How far behind a table is",
          "Volume that jumps off its recent baseline",
          "A schema that no longer matches the snapshot you pinned",
          "Quality rules your team writes, such as nulls or duplicates",
          "Read-only checks. The measurement is stored, not the rows"
        ]
      },
      discovery: {
        kicker: "Platform",
        title: "Agent discovery",
        job: "The agent finds the hosts and puts them on one asset list. A sweep, a credentialed read, a configured source, or AWS inventory.",
        href: "#architecture",
        features: [
          "A policy sets the scope, the schedule, and what to leave out",
          "A sweep finds hosts when you have no licensed scanner",
          "SSH, WinRM, SMB, and SNMP fill in the host you can reach",
          "vCenter, Active Directory over WinRM, and Kubernetes join the same list",
          "The agent checks in with its own identity over mutual TLS"
        ]
      },
      engineering: {
        kicker: "Platform",
        title: "Platform engineering",
        job: "The workspace the practices share. Scans, AWS posture, one findings queue, reports, and the software on each host.",
        href: "#architecture",
        features: [
          "Run a scan now, or on a schedule",
          "AWS posture keeps the severity, the service, the region, and the resource",
          "Every scanner lands in one queue, with known-exploited status and an owner",
          "Framework status sits beside the open work, and a report can be exported",
          "Packages, listening services, and container image contents stay on the host"
        ]
      },
      aws: {
        kicker: "Estate",
        title: "AWS",
        job: "Accounts you already run. Inventory, cost, and posture read from there.",
        href: "#architecture",
        features: [
          "Cloud inventory of the resources in the account",
          "Cost reads through AWS Cost Explorer",
          "Cloud posture checks by severity, service, region, and resource",
          "Coverage warnings when permissions skip a check",
          "The same practice views apply on this estate"
        ]
      },
      azure: {
        kicker: "Estate",
        title: "Azure",
        job: "Subscriptions you already run. The same practices and the same inventory.",
        href: "#architecture",
        features: [
          "The practices sit on the subscriptions you already operate",
          "The asset list is the same list the other estates use",
          "An agent stays on your side of the account",
          "Results come back into the same workspace",
          "You still review the evidence before you change anything"
        ]
      },
      gcp: {
        kicker: "Estate",
        title: "GCP",
        job: "Projects you already run. The same practices and the same inventory.",
        href: "#architecture",
        features: [
          "The practices sit on the projects you already operate",
          "The asset list is the same list the other estates use",
          "An agent stays on your side of the account",
          "Results come back into the same workspace",
          "You still review the evidence before you change anything"
        ]
      },
      private: {
        kicker: "Estate",
        title: "Private cloud",
        job: "Other clouds you operate yourself. The agent and the inventory stay the same.",
        href: "#architecture",
        features: [
          "The same practices sit on a cloud you run",
          "An agent on that estate sends results back",
          "Discovered hosts join the same asset list",
          "Scanners stay where they are installed",
          "You still review the evidence before you change anything"
        ]
      },
      vmware: {
        kicker: "Estate",
        title: "VMware",
        job: "vCenter and ESXi guests, with the hypervisor kept as the parent of each VM.",
        href: "#architecture",
        features: [
          "A vCenter source lists the guests it hosts",
          "Each VM keeps a link to its hypervisor",
          "A sensor can still find a guest the hypervisor list missed",
          "Scans run against the guest, not the hypervisor console",
          "The same asset list holds the hypervisor and the guests"
        ]
      },
      baremetal: {
        kicker: "Estate",
        title: "Bare metal",
        job: "Hosts with no hypervisor. Found by sweep, SSH, WinRM, or SNMP.",
        href: "#architecture",
        features: [
          "A sensor sweep finds live hosts on the subnet",
          "SSH, WinRM, and SNMP fill in the host when you allow it",
          "Hardware details stay on the asset",
          "No hypervisor is required",
          "Findings still name the tool, the target, and the original result"
        ]
      },
      local: {
        kicker: "Estate",
        title: "Local servers",
        job: "Machines on your network. An agent checks in, or a sensor finds them.",
        href: "#architecture",
        features: [
          "An agent installed on the server checks in",
          "A sensor finds servers that have no agent yet",
          "The tools installed on that machine do the scanning",
          "You can see if the agent is online, busy, or offline",
          "Each customer's data stays separate"
        ]
      }
    };

    function reveal(view) {
      view.hidden = false;
      view.classList.remove("is-in");
      void view.offsetWidth;
      view.classList.add("is-in");
    }

    function parkOnStack() {
      stack.scrollIntoView({ behavior: "auto", block: "start" });
    }

    function showOverview(fromHistory) {
      var previous = openId;
      openId = null;
      detail.hidden = true;
      reveal(overview);
      barTitle.textContent = "OpsGuru · The stack";
      stack.querySelectorAll("[data-stack]").forEach(function (button) {
        button.setAttribute("aria-pressed", "false");
      });
      live.textContent = "The full stack.";
      if (!fromHistory && history.state && history.state.secboardStack) {
        history.replaceState(null, "", location.pathname + location.search + location.hash);
      }
      if (!previous) return;
      var tile = stack.querySelector('[data-stack="' + previous + '"]');
      if (tile) tile.focus({ preventScroll: true });
      parkOnStack();
      requestAnimationFrame(parkOnStack);
    }

    function showDetail(id, fromHistory) {
      var panel = panels[id];
      if (!panel) return;
      openId = id;
      stack.querySelectorAll("[data-stack]").forEach(function (button) {
        button.setAttribute("aria-pressed", button.getAttribute("data-stack") === id ? "true" : "false");
      });
      kicker.textContent = panel.kicker;
      title.textContent = panel.title;
      job.textContent = panel.job;
      features.replaceChildren();
      panel.features.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        features.appendChild(li);
      });
      if (panel.href) {
        more.hidden = false;
        more.href = panel.href;
      } else {
        more.hidden = true;
        more.removeAttribute("href");
      }
      var image = shots[id];
      if (image) {
        shot.src = image[0];
        shot.alt = image[1];
        caption.textContent = image[1];
      }
      overview.hidden = true;
      reveal(detail);
      barTitle.textContent = "OpsGuru · " + panel.title;
      live.textContent = panel.title + ".";
      back.focus({ preventScroll: true });
      parkOnStack();
      if (!fromHistory) {
        history.pushState({ secboardStack: id }, "", location.href);
      }
    }

    stack.addEventListener("click", function (event) {
      var button = event.target.closest("[data-stack]");
      if (!button || !stack.contains(button)) return;
      showDetail(button.getAttribute("data-stack"), false);
    });

    back.addEventListener("click", function () {
      showOverview(false);
    });

    window.addEventListener("popstate", function () {
      var stateId = history.state && history.state.secboardStack;
      if (stateId && panels[stateId]) showDetail(stateId, true);
      else if (openId) {
        showOverview(true);
        setTimeout(parkOnStack, 0);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !openId) return;
      if (!stack.parentElement.contains(event.target) && event.target !== document.body) return;
      event.preventDefault();
      showOverview(false);
    });
  }

  var dialog = document.getElementById("lightbox");
  var dialogImage = document.getElementById("lightbox-image");
  if (figure && dialog) {
    figure.addEventListener("click", function () {
      dialogImage.src = image.src;
      dialogImage.alt = image.alt;
      dialog.showModal();
    });
    dialog.querySelector("[data-close]").addEventListener("click", function () {
      dialog.close();
    });
  }
})();
