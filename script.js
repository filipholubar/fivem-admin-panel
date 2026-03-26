(() => {
  const SUPABASE_URL = "https://bxyfmorhcoukhqdedarr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eWZtb3JoY291a2hxZGVkYXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQyMzQsImV4cCI6MjA4OTUzMDIzNH0.FRyMWRACdFYpCAPgb-Xk5uMj_Y9WqPpx1WnlY5rViDc";

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let users = [];
  let tickets = [];
  let openedTicketId = null;
  let editingUserId = null;
  let editingTicketId = null;
  let currentUser = null;
  let currentUserProfile = null;
  let unreadCount = 0;

  const authScreen = document.getElementById("authScreen");
  const appShell = document.getElementById("appShell");

  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  const logoutBtn = document.getElementById("logoutBtn");
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  const githubLoginBtn = document.getElementById("githubLoginBtn");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");

  const userEmailPill = document.getElementById("userEmailPill");
  const profileMenuWrap = document.getElementById("profileMenuWrap");
  const profileDropdown = document.getElementById("profileDropdown");
  const profileDropdownName = document.getElementById("profileDropdownName");
  const profileDropdownEmail = document.getElementById("profileDropdownEmail");
  const openUsersSectionBtn = document.getElementById("openUsersSectionBtn");
  const openSettingsSectionBtn = document.getElementById("openSettingsSectionBtn");

  const usersTableBody = document.getElementById("usersTableBody");
  const ticketList = document.getElementById("ticketList");
  const activityList = document.getElementById("activityList");
  const searchInput = document.getElementById("searchInput");

  const totalUsers = document.getElementById("totalUsers");
  const onlineUsers = document.getElementById("onlineUsers");
  const openTickets = document.getElementById("openTickets");
  const staffCount = document.getElementById("staffCount");

  const analyticsUsers = document.getElementById("analyticsUsers");
  const analyticsOnline = document.getElementById("analyticsOnline");
  const analyticsOffline = document.getElementById("analyticsOffline");
  const analyticsTickets = document.getElementById("analyticsTickets");

  const userModalBackdrop = document.getElementById("userModalBackdrop");
  const ticketModalBackdrop = document.getElementById("ticketModalBackdrop");
  const ticketDetailBackdrop = document.getElementById("ticketDetailBackdrop");

  const userForm = document.getElementById("userForm");
  const ticketForm = document.getElementById("ticketForm");
  const ticketReplyForm = document.getElementById("ticketReplyForm");

  const userModalTitle = document.getElementById("userModalTitle");
  const ticketModalTitle = document.getElementById("ticketModalTitle");

  const userIdInput = document.getElementById("userId");
  const userNameInput = document.getElementById("userName");
  const userActivityInput = document.getElementById("userActivity");
  const userRoleInput = document.getElementById("userRole");
  const userStatusInput = document.getElementById("userStatus");

  const ticketIdInput = document.getElementById("ticketId");
  const ticketTitleInput = document.getElementById("ticketTitle");
  const ticketOwnerInput = document.getElementById("ticketOwner");
  const ticketStatusInput = document.getElementById("ticketStatus");

  const ticketDetailTitle = document.getElementById("ticketDetailTitle");
  const ticketDetailMeta = document.getElementById("ticketDetailMeta");
  const ticketMessages = document.getElementById("ticketMessages");
  const ticketReplyAuthor = document.getElementById("ticketReplyAuthor");
  const ticketReplyMessage = document.getElementById("ticketReplyMessage");

  const forgotEmailInput = document.getElementById("forgotEmail");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const addUserBtn = document.getElementById("addUserBtn");
  const addTicketBtn = document.getElementById("addTicketBtn");
  const closeUserModal = document.getElementById("closeUserModal");
  const closeTicketModal = document.getElementById("closeTicketModal");
  const closeTicketDetail = document.getElementById("closeTicketDetail");
  const seedDataBtn = document.getElementById("seedDataBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");
  const pageTitle = document.getElementById("pageTitle");
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");

  const navItems = document.querySelectorAll(".nav-item");
  const sections = {
    dashboard: document.getElementById("dashboardSection"),
    users: document.getElementById("usersSection"),
    tickets: document.getElementById("ticketsSection"),
    analytics: document.getElementById("analyticsSection"),
    settings: document.getElementById("settingsSection"),
  };

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  function setLoadingButton(button, loading, text = "Ukládám...") {
    if (!button) return;

    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = text;
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function getFormattedDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  function showAuth() {
    authScreen?.classList.remove("hidden");
    appShell?.classList.add("hidden");
  }

  function updateProfileDropdown() {
    if (profileDropdownEmail) {
      profileDropdownEmail.textContent = currentUser?.email || "bez e-mailu";
    }

    if (profileDropdownName) {
      profileDropdownName.textContent =
        currentUserProfile?.name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.email ||
        "Uživatel";
    }
  }

  function showApp(user) {
    currentUser = user;

    authScreen?.classList.add("hidden");
    appShell?.classList.remove("hidden");

    if (userEmailPill) {
      userEmailPill.textContent =
        currentUserProfile?.name ||
        user?.user_metadata?.full_name ||
        user?.email ||
        "User";
    }

    updateProfileDropdown();
  }

  function toggleProfileDropdown() {
    profileDropdown?.classList.toggle("hidden");
  }

  function closeProfileDropdown() {
    profileDropdown?.classList.add("hidden");
  }

  function switchAuthTab(mode) {
    const isLogin = mode === "login";

    loginTab?.classList.toggle("active", isLogin);
    registerTab?.classList.toggle("active", !isLogin);

    loginForm?.classList.add("hidden");
    registerForm?.classList.add("hidden");
    forgotPasswordForm?.classList.add("hidden");
    resetPasswordForm?.classList.add("hidden");

    requestAnimationFrame(() => {
      if (isLogin) {
        loginForm?.classList.remove("hidden");
      } else {
        registerForm?.classList.remove("hidden");
      }
    });
  }

  async function handleLogin(email, password) {
    const { error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
      showToast(error.message, "error");
      return false;
    }

    return true;
  }

  async function handleRegister(email, password) {
    const { error } = await db.auth.signUp({ email, password });

    if (error) {
      showToast(error.message, "error");
      return false;
    }

    showToast("Registrace proběhla. Zkontroluj e-mail pro potvrzení účtu.");
    switchAuthTab("login");
    return true;
  }

  async function handleLogout() {
    await db.auth.signOut();

    currentUser = null;
    currentUserProfile = null;
    unreadCount = 0;
    users = [];
    tickets = [];
    openedTicketId = null;
    editingUserId = null;
    editingTicketId = null;

    const ticketsBtn = document.querySelector('[data-section="tickets"]');
    if (ticketsBtn) ticketsBtn.textContent = "Tickety";

    if (userEmailPill) userEmailPill.textContent = "Uživatel";
    if (addUserBtn) addUserBtn.style.display = "";
    if (addTicketBtn) addTicketBtn.style.display = "";

    closeProfileDropdown();
    showAuth();
  }

  async function handleGoogleLogin() {
    await db.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
  }

  async function handleGithubLogin() {
    await db.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
  }

  async function handleForgotPasswordRequest(email) {
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });

    if (error) {
      console.error(error);
      showToast("Nepodařilo se odeslat email", "error");
      return false;
    }

    showToast("Reset link byl odeslán na email");
    return true;
  }

  function initializeCustomSelects() {
    const customSelects = document.querySelectorAll(".custom-select");

    customSelects.forEach((select) => {
      const trigger = select.querySelector(".select-trigger");
      const options = select.querySelectorAll(".select-option");
      const hiddenInput = select.querySelector('input[type="hidden"]');

      if (!trigger || !hiddenInput) return;

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();

        document.querySelectorAll(".custom-select").forEach((other) => {
          if (other !== select) other.classList.remove("open");
        });

        select.classList.toggle("open");
      });

      options.forEach((option) => {
        option.addEventListener("click", () => {
          const value = option.dataset.value;
          const label = option.textContent.trim();

          hiddenInput.value = value;
          select.querySelector(".select-value").textContent = label;

          options.forEach((item) => item.classList.remove("active"));
          option.classList.add("active");
          select.classList.remove("open");

          if (hiddenInput.id === "statusFilter") {
            renderUsers();
          }

          if (hiddenInput.id === "ticketDetailStatus" && openedTicketId) {
            updateTicketStatus(openedTicketId, value);
          }
        });
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".custom-select").forEach((select) => {
        select.classList.remove("open");
      });
    });
  }

  function setCustomSelectValue(inputId, value, label) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.value = value;
    const select = input.closest(".custom-select");
    if (!select) return;

    const valueNode = select.querySelector(".select-value");
    if (valueNode) valueNode.textContent = label;

    select.querySelectorAll(".select-option").forEach((option) => {
      option.classList.toggle("active", option.dataset.value === value);
    });
  }

  function switchSection(sectionKey) {
    Object.values(sections).forEach((section) => section?.classList.remove("active"));
    navItems.forEach((item) => item.classList.remove("active"));

    sections[sectionKey]?.classList.add("active");
    document.querySelector(`[data-section="${sectionKey}"]`)?.classList.add("active");

    const titles = {
      dashboard: "Admin Dashboard",
      users: "Správa uživatelů",
      tickets: "Ticket systém",
      analytics: "Analytika",
      settings: "Nastavení",
    };

    if (pageTitle) pageTitle.textContent = titles[sectionKey] || "Prism Dashboard";

    if (window.innerWidth <= 860) {
      sidebar?.classList.remove("active");
    }
  }

  async function fetchUsers() {
    const { data, error } = await db.from("users").select("*").order("id", { ascending: false });

    if (error) {
      console.error(error);
      showToast("Nepodařilo se načíst uživatele", "error");
      return;
    }

    users = data || [];
    renderUsers();
    renderStats();
  }

  async function fetchTickets() {
    const { data, error } = await db.from("tickets").select("*").order("id", { ascending: false });

    if (error) {
      console.error(error);
      showToast("Nepodařilo se načíst tickety", "error");
      return;
    }

    tickets = data || [];
    renderTickets();
    renderStats();
  }

  async function fetchRecentMessages(limit = 6) {
    const { data, error } = await db
      .from("ticket_messages")
      .select("id, author, message, created_at, ticket_id")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(error);
      if (activityList) {
        activityList.innerHTML = "<li>Nepodařilo se načíst aktivitu.</li>";
      }
      return;
    }

    renderActivities(data || []);
  }

  async function fetchTicketMessages(ticketId) {
    const { data, error } = await db
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      showToast("Nepodařilo se načíst zprávy", "error");
      return [];
    }

    return data || [];
  }

  function getFilteredUsers() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const filter = document.getElementById("statusFilter")?.value || "all";

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        (user.last_activity || "").toLowerCase().includes(term);

      const matchesStatus = filter === "all" ? true : user.status === filter;
      return matchesSearch && matchesStatus;
    });
  }

  function renderUsers() {
    if (!usersTableBody) return;

    const filteredUsers = getFilteredUsers();
    usersTableBody.innerHTML = "";

    if (!filteredUsers.length) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="6">Žádní uživatelé nenalezeni.</td>
        </tr>
      `;
      return;
    }

    filteredUsers.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(user.name)}</td>
        <td>${escapeHtml(user.email || "—")}</td>
        <td>${escapeHtml(user.role)}</td>
        <td><span class="status ${user.status.toLowerCase()}">${escapeHtml(user.status)}</span></td>
        <td>${escapeHtml(user.last_activity || "—")}</td>
        <td>
          <div class="action-group">
            <button class="action-btn" data-edit-user="${user.id}">Upravit</button>
            <button class="action-btn delete" data-delete-user="${user.id}">Smazat</button>
          </div>
        </td>
      `;
      usersTableBody.appendChild(tr);
    });
  }

  function renderTickets() {
    if (!ticketList) return;

    ticketList.innerHTML = "";

    if (!tickets.length) {
      ticketList.innerHTML = `
        <div class="ticket-card">
          <div class="ticket-meta">
            <h4>Žádné tickety</h4>
            <p>Zatím tu není žádný ticket.</p>
          </div>
        </div>
      `;
      return;
    }

    tickets.forEach((ticket) => {
      const card = document.createElement("div");
      card.className = "ticket-card";

      card.innerHTML = `
        <div class="ticket-meta">
          <h4>${escapeHtml(ticket.title)}</h4>
          <p>Autor: ${escapeHtml(ticket.owner_name)}</p>
          <p>Priorita: ${escapeHtml(ticket.priority || "Medium")}</p>
          <p>Přiřazeno: ${escapeHtml(ticket.assigned_to || "Nepřiřazeno")}</p>
        </div>

        <div class="action-group">
          <span class="ticket-status ${ticket.status.toLowerCase()}">${escapeHtml(ticket.status)}</span>
          <button class="action-btn" data-open-ticket="${ticket.id}">Otevřít</button>
          <button class="action-btn" data-edit-ticket="${ticket.id}">Upravit</button>
          <button class="action-btn delete" data-delete-ticket="${ticket.id}">Smazat</button>
        </div>
      `;

      ticketList.appendChild(card);
    });
  }

  function renderActivities(messages) {
    if (!activityList) return;

    activityList.innerHTML = "";

    if (!messages.length) {
      activityList.innerHTML = "<li>Zatím žádná aktivita.</li>";
      return;
    }

    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${escapeHtml(msg.author)}</strong> přidal zprávu • ${escapeHtml(getFormattedDate(msg.created_at))}`;
      activityList.appendChild(li);
    });
  }

  function renderStats() {
    const total = users.length;
    const online = users.filter((u) => u.status === "Online").length;
    const offline = users.filter((u) => u.status === "Offline").length;
    const staff = users.filter((u) => ["Owner", "Admin", "Support"].includes(u.role)).length;
    const open = tickets.filter((t) => t.status === "Open").length;

    if (totalUsers) totalUsers.textContent = total;
    if (onlineUsers) onlineUsers.textContent = online;
    if (openTickets) openTickets.textContent = open;
    if (staffCount) staffCount.textContent = staff;

    if (analyticsUsers) analyticsUsers.textContent = total;
    if (analyticsOnline) analyticsOnline.textContent = online;
    if (analyticsOffline) analyticsOffline.textContent = offline;
    if (analyticsTickets) analyticsTickets.textContent = open;
  }

  function openUserModal() {
    userModalBackdrop?.classList.remove("hidden");
  }

  function closeUserModalFn() {
    userModalBackdrop?.classList.add("hidden");
    userForm?.reset();
    editingUserId = null;

    if (userModalTitle) userModalTitle.textContent = "Přidat uživatele";
    setCustomSelectValue("userRole", "Owner", "Owner");
    setCustomSelectValue("userStatus", "Online", "Online");
  }

  function openTicketModal() {
    ticketModalBackdrop?.classList.remove("hidden");
  }

  function closeTicketModalFn() {
    ticketModalBackdrop?.classList.add("hidden");
    ticketForm?.reset();
    editingTicketId = null;

    if (ticketModalTitle) ticketModalTitle.textContent = "Přidat ticket";
    setCustomSelectValue("ticketStatus", "Open", "Open");
  }

  function openTicketDetailPanel() {
    ticketDetailBackdrop?.classList.remove("hidden");
  }

  function closeTicketDetailFn() {
    ticketDetailBackdrop?.classList.add("hidden");
    ticketReplyForm?.reset();
    openedTicketId = null;
  }

  async function createUser(payload) {
    const { error } = await db.from("users").insert(payload);

    if (error) {
      console.error(error);
      showToast("Uživatel nebyl vytvořen", "error");
      return false;
    }

    showToast("Uživatel byl vytvořen");
    await fetchUsers();
    return true;
  }

  async function updateUser(id, payload) {
    const { error } = await db.from("users").update(payload).eq("id", id);

    if (error) {
      console.error(error);
      showToast("Uživatel nebyl upraven", "error");
      return false;
    }

    showToast("Uživatel byl upraven");
    await fetchUsers();
    return true;
  }

  async function removeUser(id) {
    const { error } = await db.from("users").delete().eq("id", id);

    if (error) {
      console.error(error);
      showToast("Uživatele se nepodařilo smazat", "error");
      return false;
    }

    showToast("Uživatel byl smazán");
    await fetchUsers();
    return true;
  }

  async function createTicket(payload) {
    const { data, error } = await db.from("tickets").insert(payload).select().single();

    if (error) {
      console.error(error);
      showToast("Ticket nebyl vytvořen", "error");
      return null;
    }

    showToast("Ticket byl vytvořen");
    await fetchTickets();
    await fetchRecentMessages();
    return data;
  }

  async function updateTicket(id, payload) {
    const { error } = await db.from("tickets").update(payload).eq("id", id);

    if (error) {
      console.error(error);
      showToast("Ticket nebyl upraven", "error");
      return false;
    }

    showToast("Ticket byl upraven");
    await fetchTickets();
    return true;
  }

  async function removeTicket(id) {
    const { error } = await db.from("tickets").delete().eq("id", id);

    if (error) {
      console.error(error);
      showToast("Ticket nešel smazat", "error");
      return false;
    }

    showToast("Ticket byl smazán");
    await fetchTickets();
    await fetchRecentMessages();
    return true;
  }

  async function updateTicketStatus(id, status) {
    const { error } = await db.from("tickets").update({ status }).eq("id", id);

    if (error) {
      console.error(error);
      showToast("Status ticketu nešel změnit", "error");
      return;
    }

    showToast("Status ticketu byl změněn");
    await fetchTickets();

    if (openedTicketId === id) {
      const ticket = tickets.find((t) => t.id === id);
      if (ticket) {
        setCustomSelectValue("ticketDetailStatus", ticket.status, ticket.status);
        ticketDetailMeta.textContent = `Autor: ${ticket.owner_name} • Priorita: ${ticket.priority || "Medium"} • Přiřazeno: ${ticket.assigned_to || "Nepřiřazeno"}`;
      }
    }
  }

  async function addTicketMessage(ticketId, author, message) {
    const { error } = await db.from("ticket_messages").insert({
      ticket_id: ticketId,
      author,
      message,
    });

    if (error) {
      console.error(error);
      showToast("Zpráva nešla odeslat", "error");
      return false;
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Nová zpráva", {
        body: message,
      });
    }

    showToast("Zpráva byla odeslána");
    await fetchRecentMessages();
    return true;
  }

  function renderTicketMessages(messages) {
    if (!ticketMessages) return;

    ticketMessages.innerHTML = "";

    if (!messages.length) {
      ticketMessages.innerHTML = `
        <div class="ticket-message">
          <p>V ticketu zatím nejsou žádné zprávy.</p>
        </div>
      `;
      return;
    }

    messages.forEach((message) => {
      const item = document.createElement("div");
      item.className = "ticket-message";
      item.innerHTML = `
        <div class="ticket-message-head">
          <strong>${escapeHtml(message.author)}</strong>
          <span>${escapeHtml(getFormattedDate(message.created_at))}</span>
        </div>
        <p>${escapeHtml(message.message)}</p>
      `;
      ticketMessages.appendChild(item);
    });

    ticketMessages.scrollTop = ticketMessages.scrollHeight;
  }

  async function openTicketDetailPanelData(id) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;

    openedTicketId = id;

    if (ticketDetailTitle) ticketDetailTitle.textContent = ticket.title;
    if (ticketDetailMeta) {
      ticketDetailMeta.textContent = `Autor: ${ticket.owner_name} • Priorita: ${ticket.priority || "Medium"} • Přiřazeno: ${ticket.assigned_to || "Nepřiřazeno"}`;
    }

    setCustomSelectValue("ticketDetailStatus", ticket.status, ticket.status);

    const messages = await fetchTicketMessages(id);
    renderTicketMessages(messages);
    openTicketDetailPanel();
  }

  async function seedDemoData() {
    await db.from("ticket_messages").delete().neq("id", 0);
    await db.from("tickets").delete().neq("id", 0);
    await db.from("users").delete().neq("id", 0);

    const demoUsers = [
      {
        name: "Filip Holubář",
        email: "filip@example.com",
        role: "Owner",
        status: "Online",
        last_activity: "Dnes",
      },
      {
        name: "Simik",
        email: "simik@example.com",
        role: "Admin",
        status: "Away",
        last_activity: "Před 2 h",
      },
      {
        name: "Madlička",
        email: "madlicka@example.com",
        role: "Support",
        status: "Online",
        last_activity: "Před 18 min",
      },
      {
        name: "Test User",
        email: "user@example.com",
        role: "Member",
        status: "Offline",
        last_activity: "Včera",
      },
    ];

    await db.from("users").insert(demoUsers);

    const { data: insertedTickets } = await db
      .from("tickets")
      .insert([
        {
          title: "Whitelist žádost #184",
          owner_name: "Martin",
          status: "Open",
          priority: "High",
          assigned_to: currentUserProfile?.name || "Support",
        },
        {
          title: "Bug v inventáři",
          owner_name: "Simik",
          status: "Pending",
          priority: "Medium",
          assigned_to: "Admin",
        },
        {
          title: "Žádost o unban",
          owner_name: "Tomáš",
          status: "Closed",
          priority: "Low",
          assigned_to: "Owner",
        },
      ])
      .select();

    const messages = [];
    const ticketA = insertedTickets?.[0];
    const ticketB = insertedTickets?.[1];
    const ticketC = insertedTickets?.[2];

    if (ticketA) {
      messages.push(
        {
          ticket_id: ticketA.id,
          author: "Martin",
          message: "Ahoj, chtěl bych požádat o whitelist.",
        },
        {
          ticket_id: ticketA.id,
          author: "Support",
          message: "Pošli prosím víc informací o své postavě.",
        }
      );
    }

    if (ticketB) {
      messages.push({
        ticket_id: ticketB.id,
        author: "Simik",
        message: "Po otevření inventáře se někdy nezobrazí itemy.",
      });
    }

    if (ticketC) {
      messages.push(
        {
          ticket_id: ticketC.id,
          author: "Tomáš",
          message: "Chtěl bych požádat o přehodnocení banu.",
        },
        {
          ticket_id: ticketC.id,
          author: "Admin",
          message: "Žádost byla zkontrolována a uzavřena.",
        }
      );
    }

    if (messages.length) {
      await db.from("ticket_messages").insert(messages);
    }

    showToast("Demo data byla obnovena");
    await initializeAppData();
  }

  async function clearAllData() {
    await db.from("ticket_messages").delete().neq("id", 0);
    await db.from("tickets").delete().neq("id", 0);
    await db.from("users").delete().neq("id", 0);

    showToast("Všechna data byla smazána");
    await initializeAppData();
  }

  async function ensureUserProfile(user) {
    if (!user?.email) return;

    const { data } = await db.from("users").select("*").eq("email", user.email).maybeSingle();
    if (data) return;

    await db.from("users").insert({
      name: user.user_metadata?.full_name || user.email.split("@")[0],
      email: user.email,
      role: "Member",
      status: "Online",
      last_activity: "Právě přihlášen",
    });
  }

  async function loadCurrentUserProfile(user) {
    if (!user?.email) return;

    const { data, error } = await db.from("users").select("*").eq("email", user.email).maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (!data) {
      await db.from("users").insert({
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        email: user.email,
        role: "Member",
        status: "Online",
        last_activity: "Právě přihlášen",
      });

      return loadCurrentUserProfile(user);
    }

    currentUserProfile = data;
  }

  async function checkSession() {
    const { data, error } = await db.auth.getSession();

    if (error) {
      console.error(error);
      showAuth();
      return;
    }

    const hash = window.location.hash;

    if (hash.includes("type=recovery")) {
      loginForm.classList.add("hidden");
      registerForm.classList.add("hidden");
      forgotPasswordForm.classList.add("hidden");
      resetPasswordForm.classList.remove("hidden");
      showAuth();
      showToast("Nastav si nové heslo");
      return;
    }

    if (data.session) {
      currentUser = data.session.user;

      await ensureUserProfile(currentUser);
      await loadCurrentUserProfile(currentUser);

      showApp(currentUser);
      await initializeAppData();
      applyPermissions();
    } else {
      showAuth();
    }
  }

  function applyPermissions() {
    if (!currentUserProfile) return;

    if (addUserBtn) addUserBtn.style.display = "";
    if (addTicketBtn) addTicketBtn.style.display = "";

    const role = currentUserProfile.role;

    if (role !== "Owner" && addUserBtn) {
      addUserBtn.style.display = "none";
    }

    if (!["Owner", "Admin"].includes(role) && addTicketBtn) {
      addTicketBtn.style.display = "none";
    }
  }

  userForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = userForm.querySelector('button[type="submit"]');
    setLoadingButton(submitButton, true);

    const payload = {
      name: userNameInput.value.trim(),
      role: userRoleInput.value,
      status: userStatusInput.value,
      last_activity: userActivityInput.value.trim(),
    };

    const ok = editingUserId
      ? await updateUser(editingUserId, payload)
      : await createUser(payload);

    setLoadingButton(submitButton, false);
    if (ok) closeUserModalFn();
  });

  ticketForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = ticketForm.querySelector('button[type="submit"]');
    setLoadingButton(submitButton, true);

    const payload = {
      title: ticketTitleInput.value.trim(),
      owner_name: ticketOwnerInput.value.trim(),
      status: ticketStatusInput.value,
      priority: "Medium",
      assigned_to: currentUserProfile?.name || "Support",
    };

    let ok = false;

    if (editingTicketId) {
      ok = await updateTicket(editingTicketId, payload);
    } else {
      const created = await createTicket(payload);
      ok = !!created;

      if (created) {
        await addTicketMessage(created.id, payload.owner_name, "Ticket byl vytvořen.");
      }
    }

    setLoadingButton(submitButton, false);

    if (ok) {
      closeTicketModalFn();
      await initializeAppData();
    }
  });

  ticketReplyForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!openedTicketId) return;

    const author = ticketReplyAuthor.value.trim();
    const message = ticketReplyMessage.value.trim();
    if (!author || !message) return;

    const submitButton = ticketReplyForm.querySelector('button[type="submit"]');
    setLoadingButton(submitButton, true, "Odesílám...");

    const ok = await addTicketMessage(openedTicketId, author, message);

    setLoadingButton(submitButton, false);

    if (ok) {
      ticketReplyForm.reset();
      await openTicketDetailPanelData(openedTicketId);
    }
  });

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const ok = await handleLogin(email, password);
    if (ok) {
      await checkSession();
    }
  });

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    await handleRegister(email, password);
  });

  forgotPasswordForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = forgotEmailInput.value.trim();
    if (!email) {
      showToast("Zadej e-mail.", "error");
      return;
    }

    const ok = await handleForgotPasswordRequest(email);
    if (!ok) return;

    forgotPasswordForm.reset();
    forgotPasswordForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  resetPasswordForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = newPasswordInput.value.trim();
    const confirm = confirmPasswordInput.value.trim();

    if (password.length < 6) {
      showToast("Heslo musí mít alespoň 6 znaků", "error");
      return;
    }

    if (password !== confirm) {
      showToast("Hesla se neshodují", "error");
      return;
    }

    const { error } = await db.auth.updateUser({ password });

    if (error) {
      console.error(error);
      showToast("Změna hesla selhala", "error");
      return;
    }

    showToast("Heslo bylo změněno");

    resetPasswordForm.reset();
    resetPasswordForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    window.history.replaceState({}, document.title, window.location.pathname);
  });

  forgotPasswordBtn?.addEventListener("click", () => {
    loginForm?.classList.add("hidden");
    registerForm?.classList.add("hidden");
    resetPasswordForm?.classList.add("hidden");
    forgotPasswordForm?.classList.remove("hidden");

    const loginEmailValue = document.getElementById("loginEmail")?.value?.trim();
    if (loginEmailValue && forgotEmailInput) {
      forgotEmailInput.value = loginEmailValue;
    }
  });

  backToLoginBtn?.addEventListener("click", () => {
    forgotPasswordForm?.classList.add("hidden");
    resetPasswordForm?.classList.add("hidden");
    registerForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
  });

  logoutBtn?.addEventListener("click", handleLogout);
  googleLoginBtn?.addEventListener("click", handleGoogleLogin);
  githubLoginBtn?.addEventListener("click", handleGithubLogin);

  loginTab?.addEventListener("click", () => switchAuthTab("login"));
  registerTab?.addEventListener("click", () => switchAuthTab("register"));

  addUserBtn?.addEventListener("click", () => {
    editingUserId = null;
    userForm?.reset();
    if (userModalTitle) userModalTitle.textContent = "Přidat uživatele";
    setCustomSelectValue("userRole", "Owner", "Owner");
    setCustomSelectValue("userStatus", "Online", "Online");
    openUserModal();
  });

  addTicketBtn?.addEventListener("click", () => {
    editingTicketId = null;
    ticketForm?.reset();
    if (ticketModalTitle) ticketModalTitle.textContent = "Přidat ticket";
    setCustomSelectValue("ticketStatus", "Open", "Open");
    openTicketModal();
  });

  closeUserModal?.addEventListener("click", closeUserModalFn);
  closeTicketModal?.addEventListener("click", closeTicketModalFn);
  closeTicketDetail?.addEventListener("click", closeTicketDetailFn);

  userModalBackdrop?.addEventListener("click", (e) => {
    if (e.target === userModalBackdrop) closeUserModalFn();
  });

  ticketModalBackdrop?.addEventListener("click", (e) => {
    if (e.target === ticketModalBackdrop) closeTicketModalFn();
  });

  ticketDetailBackdrop?.addEventListener("click", (e) => {
    if (e.target === ticketDetailBackdrop) closeTicketDetailFn();
  });

  searchInput?.addEventListener("input", renderUsers);

  seedDataBtn?.addEventListener("click", async () => {
    const ok = window.confirm("Opravdu chceš obnovit demo data?");
    if (!ok) return;
    await seedDemoData();
  });

  clearDataBtn?.addEventListener("click", async () => {
    const ok = window.confirm("Opravdu chceš smazat všechna data?");
    if (!ok) return;
    await clearAllData();
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      switchSection(item.dataset.section);
    });
  });

  menuBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("active");
  });

  userEmailPill?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfileDropdown();
  });

  openUsersSectionBtn?.addEventListener("click", () => {
    switchSection("users");
    closeProfileDropdown();
  });

  openSettingsSectionBtn?.addEventListener("click", () => {
    switchSection("settings");
    closeProfileDropdown();
  });

  document.addEventListener("click", (e) => {
    if (!profileMenuWrap?.contains(e.target)) {
      closeProfileDropdown();
    }
  });

  document.addEventListener("click", async (e) => {
    const editUserBtn = e.target.closest("[data-edit-user]");
    const deleteUserBtn = e.target.closest("[data-delete-user]");
    const editTicketBtn = e.target.closest("[data-edit-ticket]");
    const deleteTicketBtn = e.target.closest("[data-delete-ticket]");
    const openTicketBtn = e.target.closest("[data-open-ticket]");

    if (editUserBtn) {
      const id = Number(editUserBtn.dataset.editUser);
      const user = users.find((u) => u.id === id);
      if (!user) return;

      editingUserId = id;
      if (userModalTitle) userModalTitle.textContent = "Upravit uživatele";

      userIdInput.value = user.id;
      userNameInput.value = user.name;
      userActivityInput.value = user.last_activity || "";

      setCustomSelectValue("userRole", user.role, user.role);
      setCustomSelectValue("userStatus", user.status, user.status);
      openUserModal();
    }

    if (deleteUserBtn) {
      const id = Number(deleteUserBtn.dataset.deleteUser);
      const ok = window.confirm("Opravdu chceš smazat tohoto uživatele?");
      if (ok) await removeUser(id);
    }

    if (editTicketBtn) {
      const id = Number(editTicketBtn.dataset.editTicket);
      const ticket = tickets.find((t) => t.id === id);
      if (!ticket) return;

      editingTicketId = id;
      if (ticketModalTitle) ticketModalTitle.textContent = "Upravit ticket";

      ticketIdInput.value = ticket.id;
      ticketTitleInput.value = ticket.title;
      ticketOwnerInput.value = ticket.owner_name;
      setCustomSelectValue("ticketStatus", ticket.status, ticket.status);
      openTicketModal();
    }

    if (deleteTicketBtn) {
      const id = Number(deleteTicketBtn.dataset.deleteTicket);
      const ok = window.confirm("Opravdu chceš smazat tento ticket?");
      if (ok) {
        await removeTicket(id);
        if (openedTicketId === id) closeTicketDetailFn();
      }
    }

    if (openTicketBtn) {
      const id = Number(openTicketBtn.dataset.openTicket);
      await openTicketDetailPanelData(id);
      unreadCount = 0;

      const ticketsBtn = document.querySelector('[data-section="tickets"]');
      if (ticketsBtn) {
        ticketsBtn.textContent = "Tickety";
      }
    }
  });

  db.channel("realtime-users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      async () => {
        await fetchUsers();

        if (currentUser) {
          await loadCurrentUserProfile(currentUser);
          applyPermissions();
          updateProfileDropdown();

          if (userEmailPill) {
            userEmailPill.textContent =
              currentUserProfile?.name ||
              currentUser?.user_metadata?.full_name ||
              currentUser?.email ||
              "User";
          }
        }
      }
    )
    .subscribe();

  db.channel("realtime-tickets")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tickets" },
      () => {
        fetchTickets();
      }
    )
    .subscribe();

  db.channel("realtime-messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "ticket_messages" },
      async () => {
        if (openedTicketId) {
          await openTicketDetailPanelData(openedTicketId);
        }

        await fetchRecentMessages();

        unreadCount++;
        const ticketsBtn = document.querySelector('[data-section="tickets"]');
        if (ticketsBtn && !openedTicketId) {
          ticketsBtn.textContent = `Tickety (${unreadCount})`;
        }
      }
    )
    .subscribe();

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  initializeCustomSelects();
  checkSession();
})();