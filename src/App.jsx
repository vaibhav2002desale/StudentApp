import { useState, useMemo, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = "https://studentapp-5dh0.onrender.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: "", email: "", age: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required.";
  if (!form.email.trim()) errs.email = "Email is required.";
  else if (!emailRegex.test(form.email)) errs.email = "Enter a valid email.";
  if (!form.age) errs.age = "Age is required.";
  else if (isNaN(form.age) || +form.age < 1 || +form.age > 120)
    errs.age = "Enter a valid age (1–120).";
  return errs;
}

function downloadCSV(students) {
  const header = ["Name", "Email", "Age"];
  const rows = students.map((s) => [s.name, s.email, s.age]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | { type: 'add' | 'edit', student? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // ── Fetch all students from the backend ──────────────────────────────────
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      showToast(`Failed to load students: ${err.message}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // ── Derived state ────────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Modal helpers ────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setModal({ type: "add" });
  };

  const openEdit = (student) => {
    setForm({ name: student.name, email: student.email, age: String(student.age) });
    setErrors({});
    setModal({ type: "edit", student });
  };

  const closeModal = () => setModal(null);

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  // ── CRUD: Add (POST) ─────────────────────────────────────────────────────
  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          age: +form.age,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      await fetchStudents();
      showToast("Student added successfully!");
      closeModal();
    } catch (err) {
      showToast(`Failed to add student: ${err.message}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  // ── CRUD: Edit (PUT) ─────────────────────────────────────────────────────
  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students/${modal.student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          age: +form.age,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      await fetchStudents();
      showToast("Student updated successfully!");
      closeModal();
    } catch (err) {
      showToast(`Failed to update student: ${err.message}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  // ── CRUD: Delete (DELETE) ────────────────────────────────────────────────
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      await fetchStudents();
      showToast("Student deleted.", "danger");
      setDeleteTarget(null);
    } catch (err) {
      showToast(`Failed to delete student: ${err.message}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  // ── Unified form submit (dispatches to add or edit) ──────────────────────
  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    if (modal.type === "add") {
      handleAdd();
    } else {
      handleEdit();
    }
  };

  // ── Styles (unchanged) ───────────────────────────────────────────────────
  const styles = {
    root: {
      minHeight: "100vh",
      background: "#0d0f14",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8e6df",
      padding: "40px 24px",
    },
    header: {
      maxWidth: 900,
      margin: "0 auto 32px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
    },
    brand: { display: "flex", flexDirection: "column", gap: 4 },
    brandLabel: {
      fontSize: 11,
      letterSpacing: "0.18em",
      color: "#f59e0b",
      textTransform: "uppercase",
    },
    title: {
      fontSize: 32,
      fontWeight: 700,
      color: "#fafaf8",
      margin: 0,
      letterSpacing: "-0.03em",
      fontFamily: "'Syne', 'Georgia', serif",
    },
    subtitle: { fontSize: 13, color: "#6b7280", margin: "4px 0 0", letterSpacing: "0.01em" },
    btnPrimary: {
      background: "#f59e0b",
      color: "#0d0f14",
      border: "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontSize: 13,
      fontWeight: 700,
      fontFamily: "'DM Mono', monospace",
      cursor: "pointer",
      letterSpacing: "0.04em",
      transition: "all 0.15s",
    },
    btnSecondary: {
      background: "transparent",
      color: "#9ca3af",
      border: "1px solid #2a2d35",
      borderRadius: 8,
      padding: "9px 18px",
      fontSize: 13,
      fontFamily: "'DM Mono', monospace",
      cursor: "pointer",
      transition: "all 0.15s",
    },
    btnDanger: {
      background: "transparent",
      color: "#ef4444",
      border: "1px solid #ef4444",
      borderRadius: 8,
      padding: "8px 16px",
      fontSize: 13,
      fontFamily: "'DM Mono', monospace",
      cursor: "pointer",
      transition: "all 0.15s",
    },
    toolbar: {
      maxWidth: 900,
      margin: "0 auto 20px",
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignItems: "center",
    },
    searchWrap: { flex: 1, minWidth: 200, position: "relative" },
    searchInput: {
      width: "100%",
      background: "#161820",
      border: "1px solid #2a2d35",
      borderRadius: 8,
      padding: "10px 14px 10px 36px",
      color: "#e8e6df",
      fontSize: 13,
      fontFamily: "'DM Mono', monospace",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    },
    searchIcon: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6b7280",
      fontSize: 14,
    },
    tableWrap: {
      maxWidth: 900,
      margin: "0 auto",
      background: "#161820",
      borderRadius: 12,
      border: "1px solid #1f2229",
      overflow: "hidden",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      background: "#1c1f28",
      padding: "13px 18px",
      textAlign: "left",
      fontSize: 10,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#6b7280",
      fontWeight: 600,
      borderBottom: "1px solid #2a2d35",
    },
    td: {
      padding: "14px 18px",
      fontSize: 13,
      borderBottom: "1px solid #1a1d25",
      verticalAlign: "middle",
    },
    badge: {
      display: "inline-block",
      background: "#1c1f28",
      border: "1px solid #2a2d35",
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 12,
      color: "#9ca3af",
    },
    actionsCell: { display: "flex", gap: 8, alignItems: "center" },
    btnEdit: {
      background: "transparent",
      border: "1px solid #2a2d35",
      borderRadius: 6,
      padding: "5px 12px",
      color: "#a3cfff",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "'DM Mono', monospace",
      transition: "all 0.15s",
    },
    btnDel: {
      background: "transparent",
      border: "1px solid #2a2d35",
      borderRadius: 6,
      padding: "5px 12px",
      color: "#f87171",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "'DM Mono', monospace",
      transition: "all 0.15s",
    },
    emptyRow: {
      textAlign: "center",
      padding: "48px 0",
      color: "#4b5563",
      fontSize: 13,
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      backdropFilter: "blur(4px)",
    },
    modalBox: {
      background: "#161820",
      border: "1px solid #2a2d35",
      borderRadius: 14,
      padding: "32px",
      width: "100%",
      maxWidth: 440,
      boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: "#fafaf8",
      margin: "0 0 24px",
      fontFamily: "'Syne','Georgia',serif",
      letterSpacing: "-0.02em",
    },
    field: { marginBottom: 18 },
    label: {
      display: "block",
      fontSize: 10,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#6b7280",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      background: "#0d0f14",
      border: "1px solid #2a2d35",
      borderRadius: 8,
      padding: "10px 13px",
      color: "#e8e6df",
      fontSize: 13,
      fontFamily: "'DM Mono', monospace",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    },
    errMsg: { color: "#f87171", fontSize: 11, marginTop: 4 },
    modalFooter: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28 },
    loadBar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
      zIndex: 200,
      animation: "loadSlide 0.6s ease forwards",
    },
    toast: {
      position: "fixed",
      bottom: 28,
      right: 24,
      zIndex: 300,
      background: "#1c1f28",
      border: "1px solid #2a2d35",
      borderRadius: 10,
      padding: "12px 20px",
      fontSize: 13,
      color: "#e8e6df",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      animation: "fadeUp 0.3s ease",
    },
    toastDot: (type) => ({
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: type === "danger" ? "#ef4444" : "#22c55e",
      flexShrink: 0,
    }),
    countBadge: {
      fontSize: 11,
      color: "#6b7280",
      marginLeft: 4,
    },
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes loadSlide { from { width: 0 } to { width: 100% } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:translateY(0) } }
        tr:hover td { background: #1a1d25 !important; }
      `}</style>

      {loading && <div style={styles.loadBar} />}

      {toast && (
        <div style={styles.toast}>
          <span style={styles.toastDot(toast.type)} />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandLabel}>Dashboard</span>
          <h1 style={styles.title}>Students</h1>
          <p style={styles.subtitle}>
            Manage student records · {students.length} total
          </p>
        </div>
        <button style={styles.btnPrimary} onClick={openAdd}>+ Add Student</button>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>⌕</span>
          <input
            style={styles.searchInput}
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2d35")}
          />
        </div>
        <button
          style={styles.btnSecondary}
          onClick={() => downloadCSV(filtered)}
          onMouseEnter={(e) => { e.target.style.color = "#e8e6df"; e.target.style.borderColor = "#6b7280"; }}
          onMouseLeave={(e) => { e.target.style.color = "#9ca3af"; e.target.style.borderColor = "#2a2d35"; }}
        >
          ↓ Export CSV
          {filtered.length !== students.length && (
            <span style={styles.countBadge}>({filtered.length} rows)</span>
          )}
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.emptyRow}>
                  {loading
                    ? "Loading students…"
                    : search
                    ? "No students match your search."
                    : "No students yet. Add one!"}
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ ...styles.td, color: "#4b5563", fontSize: 11 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#fafaf8" }}>{s.name}</td>
                  <td style={{ ...styles.td, color: "#9ca3af" }}>{s.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{s.age}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsCell}>
                      <button
                        style={styles.btnEdit}
                        onClick={() => openEdit(s)}
                        onMouseEnter={(e) => { e.target.style.borderColor = "#a3cfff"; e.target.style.background = "#1c2535"; }}
                        onMouseLeave={(e) => { e.target.style.borderColor = "#2a2d35"; e.target.style.background = "transparent"; }}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.btnDel}
                        onClick={() => setDeleteTarget(s)}
                        onMouseEnter={(e) => { e.target.style.borderColor = "#f87171"; e.target.style.background = "#2a1a1a"; }}
                        onMouseLeave={(e) => { e.target.style.borderColor = "#2a2d35"; e.target.style.background = "transparent"; }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>
              {modal.type === "add" ? "Add New Student" : "Edit Student"}
            </h2>
            {[
              { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Jane Smith" },
              { name: "email", label: "Email Address", type: "email", placeholder: "e.g. jane@uni.edu" },
              { name: "age", label: "Age", type: "number", placeholder: "e.g. 21" },
            ].map((field) => (
              <div key={field.name} style={styles.field}>
                <label style={styles.label}>{field.label}</label>
                <input
                  style={{
                    ...styles.input,
                    borderColor: errors[field.name] ? "#ef4444" : "#2a2d35",
                  }}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleFormChange}
                  onFocus={(e) => { if (!errors[field.name]) e.target.style.borderColor = "#f59e0b"; }}
                  onBlur={(e) => { if (!errors[field.name]) e.target.style.borderColor = "#2a2d35"; }}
                />
                {errors[field.name] && <p style={styles.errMsg}>{errors[field.name]}</p>}
              </div>
            ))}
            <div style={styles.modalFooter}>
              <button
                style={styles.btnSecondary}
                onClick={closeModal}
                onMouseEnter={(e) => { e.target.style.borderColor = "#6b7280"; e.target.style.color = "#e8e6df"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#2a2d35"; e.target.style.color = "#9ca3af"; }}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.btnPrimary, opacity: loading ? 0.6 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving…" : modal.type === "add" ? "Add Student" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div style={{ ...styles.modalBox, maxWidth: 380 }}>
            <h2 style={{ ...styles.modalTitle, marginBottom: 12 }}>Delete Student?</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 24px" }}>
              You're about to remove{" "}
              <strong style={{ color: "#fafaf8" }}>{deleteTarget.name}</strong> from the
              records. This action cannot be undone.
            </p>
            <div style={styles.modalFooter}>
              <button
                style={styles.btnSecondary}
                onClick={() => setDeleteTarget(null)}
                onMouseEnter={(e) => { e.target.style.borderColor = "#6b7280"; e.target.style.color = "#e8e6df"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#2a2d35"; e.target.style.color = "#9ca3af"; }}
              >
                Cancel
              </button>
              <button
                style={styles.btnDanger}
                onClick={handleDelete}
                disabled={loading}
                onMouseEnter={(e) => { e.target.style.background = "#2a1a1a"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
              >
                {loading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
