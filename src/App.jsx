import { useState, useMemo, useRef } from "react";

const INITIAL_STUDENTS = [
  { id: 1, name: "Aisha Mehta", email: "aisha.mehta@university.edu", age: 21 },
  { id: 2, name: "Carlos Rivera", email: "c.rivera@university.edu", age: 23 },
  { id: 3, name: "Priya Nair", email: "priya.nair@university.edu", age: 20 },
  { id: 4, name: "James Okafor", email: "j.okafor@university.edu", age: 22 },
  { id: 5, name: "Sofia Chen", email: "sofia.chen@university.edu", age: 24 },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: "", email: "", age: "" };

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
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const nextId = useRef(INITIAL_STUDENTS.length + 1);

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const simulate = (cb) => {
    setLoading(true);
    setTimeout(() => {
      cb();
      setLoading(false);
    }, 600);
  };

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

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    if (modal.type === "add") {
      simulate(() => {
        setStudents((s) => [
          ...s,
          {
            id: nextId.current++,
            name: form.name.trim(),
            email: form.email.trim(),
            age: +form.age,
          },
        ]);
        showToast("Student added successfully!");
        closeModal();
      });
    } else {
      simulate(() => {
        setStudents((s) =>
          s.map((st) =>
            st.id === modal.student.id
              ? { ...st, name: form.name.trim(), email: form.email.trim(), age: +form.age }
              : st
          )
        );
        showToast("Student updated successfully!");
        closeModal();
      });
    }
  };

  const handleDelete = () => {
    simulate(() => {
      setStudents((s) => s.filter((st) => st.id !== deleteTarget.id));
      showToast("Student deleted.", "danger");
      setDeleteTarget(null);
    });
  };

  const s = {
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
    brandLabel: {
      fontSize: 11,
      letterSpacing: "0.18em",
      color: "#f59e0b",
      textTransform: "uppercase",
      display: "block",
      marginBottom: 4,
    },
    title: {
      fontSize: 32,
      fontWeight: 700,
      color: "#fafaf8",
      margin: 0,
      letterSpacing: "-0.03em",
      fontFamily: "'Syne', 'Georgia', serif",
    },
    subtitle: { fontSize: 13, color: "#6b7280", margin: "4px 0 0" },
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
    },
    searchIcon: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6b7280",
      fontSize: 14,
      pointerEvents: "none",
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
    btnEdit: {
      background: "transparent",
      border: "1px solid #2a2d35",
      borderRadius: 6,
      padding: "5px 12px",
      color: "#a3cfff",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "'DM Mono', monospace",
      marginRight: 8,
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
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.72)",
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
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes loadSlide { from { width: 0 } to { width: 100% } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        tbody tr:hover td { background: #1a1d25 !important; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {loading && <div style={s.loadBar} />}

      {toast && (
        <div style={s.toast}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: toast.type === "danger" ? "#ef4444" : "#22c55e",
            display: "inline-block", flexShrink: 0,
          }} />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <span style={s.brandLabel}>Dashboard</span>
          <h1 style={s.title}>Students</h1>
          <p style={s.subtitle}>Manage student records · {students.length} total</p>
        </div>
        <button style={s.btnPrimary} onClick={openAdd}>+ Add Student</button>
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.searchInput}
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button style={s.btnSecondary} onClick={() => downloadCSV(filtered)}>
          ↓ Export CSV{filtered.length !== students.length ? ` (${filtered.length} rows)` : ""}
        </button>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {["#", "Name", "Email", "Age", "Actions"].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ ...s.td, textAlign: "center", padding: "48px 0", color: "#4b5563" }}>
                  {search ? "No students match your search." : "No students yet. Add one!"}
                </td>
              </tr>
            ) : (
              filtered.map((st, i) => (
                <tr key={st.id}>
                  <td style={{ ...s.td, color: "#4b5563", fontSize: 11 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: "#fafaf8" }}>{st.name}</td>
                  <td style={{ ...s.td, color: "#9ca3af" }}>{st.email}</td>
                  <td style={s.td}>
                    <span style={s.badge}>{st.age}</span>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnEdit} onClick={() => openEdit(st)}>Edit</button>
                    <button style={s.btnDel} onClick={() => setDeleteTarget(st)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={s.modalBox}>
            <h2 style={s.modalTitle}>
              {modal.type === "add" ? "Add New Student" : "Edit Student"}
            </h2>
            {[
              { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Jane Smith" },
              { name: "email", label: "Email Address", type: "email", placeholder: "e.g. jane@uni.edu" },
              { name: "age", label: "Age", type: "number", placeholder: "e.g. 21" },
            ].map((field) => (
              <div key={field.name} style={s.field}>
                <label style={s.label}>{field.label}</label>
                <input
                  style={{
                    ...s.input,
                    borderColor: errors[field.name] ? "#ef4444" : "#2a2d35",
                  }}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleFormChange}
                />
                {errors[field.name] && <p style={s.errMsg}>{errors[field.name]}</p>}
              </div>
            ))}
            <div style={s.modalFooter}>
              <button style={s.btnSecondary} onClick={closeModal}>Cancel</button>
              <button
                style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}
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
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div style={{ ...s.modalBox, maxWidth: 380 }}>
            <h2 style={{ ...s.modalTitle, marginBottom: 12 }}>Delete Student?</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 24px" }}>
              You're about to remove{" "}
              <strong style={{ color: "#fafaf8" }}>{deleteTarget.name}</strong> from the
              records. This action cannot be undone.
            </p>
            <div style={s.modalFooter}>
              <button style={s.btnSecondary} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button style={s.btnDanger} onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
