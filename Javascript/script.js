/* Student Grade Calculator - one file used by all pages */

const COMPONENTS = [
  { id: "quizzes",    label: "Quizzes",      entryLabel: "Quiz",     weight: 20 },
  { id: "activities", label: "Activities",   entryLabel: "Activity", weight: 20 },
  { id: "project",    label: "Project",      entryLabel: "Project",  weight: 15 },
  { id: "midterm",    label: "Midterm Exam", entryLabel: "Exam",     weight: 20, single: true },
  { id: "finalExam",  label: "Final Exam",   entryLabel: "Exam",     weight: 25, single: true }
];

const SCALE = [
  { min: 97, equivalent: "1.00", remarks: "Excellent" },
  { min: 94, equivalent: "1.25", remarks: "Superior" },
  { min: 91, equivalent: "1.50", remarks: "Very Good" },
  { min: 88, equivalent: "1.75", remarks: "Very Good" },
  { min: 85, equivalent: "2.00", remarks: "Good" },
  { min: 82, equivalent: "2.25", remarks: "Good" },
  { min: 79, equivalent: "2.50", remarks: "Satisfactory" },
  { min: 76, equivalent: "2.75", remarks: "Satisfactory" },
  { min: 75, equivalent: "3.00", remarks: "Passed" },
  { min: 0,  equivalent: "5.00", remarks: "Failed" }
];

const STORAGE_KEY = "gradeCalculatorRecords";

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch (e) { return []; }
}
function saveRecords(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function isFailed(remarks) { return remarks === "Failed"; }

function showMessage(text, type) {
  const box = document.getElementById("message");
  if (!box) return;
  box.textContent = text;
  box.className = "message " + type;
  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(function () { box.classList.add("hidden"); }, 3500);
}

/* HOME PAGE */
if (document.getElementById("statTotal")) {
  const records = loadRecords();
  const passed = records.filter(function (r) { return !isFailed(r.remarks); }).length;
  const average = records.length
    ? records.reduce(function (sum, r) { return sum + r.percentage; }, 0) / records.length
    : null;
  document.getElementById("statTotal").textContent = records.length;
  document.getElementById("statPassed").textContent = passed;
  document.getElementById("statFailed").textContent = records.length - passed;
  document.getElementById("statAverage").textContent = average === null ? "--" : average.toFixed(2) + "%";
}

/* CALCULATOR PAGE - flexible components: weights + any number of scores */
const form = document.getElementById("gradeForm");
if (form) {
  const componentsBox = document.getElementById("components");
  const resultSection = document.getElementById("result");
  const detailsBox = document.getElementById("detailsBox");
  const toggleBtn = document.getElementById("toggleDetails");

  function fmt(n) { return String(Math.round(n * 100) / 100); }

  function showError(id, message) {
    document.getElementById("err-" + id).textContent = message;
    document.getElementById(id).classList.toggle("invalid", message !== "");
  }

  /* ---------- build the component blocks ---------- */
  function renumber(box) {
    const c = COMPONENTS.find(function (x) { return x.id === box.getAttribute("data-id"); });
    const rows = box.querySelectorAll(".entry");
    rows.forEach(function (row, i) {
      row.querySelector(".entry-name").textContent = c.single ? "Score" : c.entryLabel + " " + (i + 1);
      const removeBtn = row.querySelector(".btn-remove");
      if (removeBtn) removeBtn.disabled = rows.length === 1;
    });
  }

  function addEntry(box, items) {
    const c = COMPONENTS.find(function (x) { return x.id === box.getAttribute("data-id"); });
    const row = document.createElement("div");
    row.className = "entry";
    row.innerHTML =
      '<span class="entry-name"></span>' +
      '<input type="number" class="score" min="0" step="any" placeholder="Score" aria-label="Score">' +
      '<span class="of">out of</span>' +
      '<input type="number" class="items" min="1" step="any" placeholder="Items" aria-label="Total items" value="' + items + '">' +
      (c.single ? "" : '<button type="button" class="btn btn-small btn-remove">Remove</button>');
    box.querySelector(".entries").appendChild(row);
    renumber(box);
    return row;
  }

  function buildComponents() {
    componentsBox.innerHTML = COMPONENTS.map(function (c) {
      return '<div class="component" data-id="' + c.id + '">' +
        '<div class="component-head">' +
          '<h3>' + c.label + '</h3>' +
          '<label class="weight">Weight <input type="number" class="weight-input" min="0" max="100" step="any" value="' + c.weight + '"> %</label>' +
        '</div>' +
        '<div class="entries"></div>' +
        '<div class="component-foot">' +
          (c.single ? "" : '<button type="button" class="btn btn-light btn-add">+ Add ' + c.entryLabel + '</button>') +
          '<span class="component-result"></span>' +
        '</div>' +
        '<span class="error component-error"></span>' +
      '</div>';
    }).join("");
    componentsBox.querySelectorAll(".component").forEach(function (box) { addEntry(box, ""); });
  }

  /* ---------- read one component: total score / total items ---------- */
  function readComponent(box, mark) {
    const result = { earned: 0, total: 0, error: "" };
    box.querySelectorAll(".entry").forEach(function (row) {
      const s = row.querySelector(".score");
      const i = row.querySelector(".items");
      let msg = "";
      if (s.value === "" || i.value === "") msg = "Fill in every row, or remove the empty ones.";
      else if (Number(i.value) <= 0) msg = "Items must be more than 0.";
      else if (Number(s.value) < 0) msg = "A score can't be negative.";
      else if (Number(s.value) > Number(i.value)) msg = "A score can't be higher than its items.";

      s.classList.toggle("invalid", mark && msg !== "");
      i.classList.toggle("invalid", mark && msg !== "");

      if (msg) { if (!result.error) result.error = msg; }
      else { result.earned += Number(s.value); result.total += Number(i.value); }
    });
    return result;
  }

  /* ---------- live preview ---------- */
  function updatePreview() {
    let weightTotal = 0;
    componentsBox.querySelectorAll(".component").forEach(function (box) {
      const data = readComponent(box, false);
      weightTotal += Number(box.querySelector(".weight-input").value) || 0;
      box.querySelector(".component-result").textContent = data.total > 0
        ? fmt(data.earned) + " / " + fmt(data.total) + " = " + (data.earned / data.total * 100).toFixed(2) + "%"
        : "";
    });
    const total = Math.round(weightTotal * 100) / 100;
    const el = document.getElementById("weightTotal");
    el.textContent = "Total weight: " + total + "% " + (total === 100 ? "(OK)" : "(must be 100%)");
    el.className = "weight-total " + (total === 100 ? "ok" : "bad");
  }

  /* ---------- validation ---------- */
  function validate() {
    let valid = true;
    const name = document.getElementById("studentName").value.trim();
    const subject = document.getElementById("subject").value.trim();

    if (name === "") { showError("studentName", "Student name is required."); valid = false; }
    else if (!/^[A-Za-z.'\- ]+$/.test(name)) { showError("studentName", "Use letters only."); valid = false; }
    else { showError("studentName", ""); }

    if (subject === "") { showError("subject", "Subject is required."); valid = false; }
    else { showError("subject", ""); }

    let weightTotal = 0;
    componentsBox.querySelectorAll(".component").forEach(function (box) {
      const wInput = box.querySelector(".weight-input");
      const w = wInput.value;
      let msg = "";
      if (w === "" || Number(w) < 0 || Number(w) > 100) msg = "Weight must be 0 to 100.";
      wInput.classList.toggle("invalid", msg !== "");
      weightTotal += Number(w) || 0;

      const needsScores = Number(w) > 0;
      const data = readComponent(box, needsScores);
      if (!msg && needsScores) {
        if (data.error) msg = data.error;
        else if (data.total === 0) msg = "Add at least one score.";
      }
      box.querySelector(".component-error").textContent = msg;
      if (msg) valid = false;
    });

    const total = Math.round(weightTotal * 100) / 100;
    document.getElementById("err-weights").textContent =
      total === 100 ? "" : "Weights add up to " + total + "%. They must add up to 100%.";
    if (total !== 100) valid = false;

    return valid;
  }

  /* ---------- calculation: weighted average ---------- */
  function calculateFinalGrade() {
    let total = 0;
    const breakdown = [];
    componentsBox.querySelectorAll(".component").forEach(function (box) {
      const c = COMPONENTS.find(function (x) { return x.id === box.getAttribute("data-id"); });
      const weight = Number(box.querySelector(".weight-input").value);
      const data = readComponent(box, false);
      const pct = data.total > 0 ? data.earned / data.total * 100 : 0;
      const contribution = pct * weight / 100;
      total += contribution;
      breakdown.push({ label: c.label, weight: weight, earned: data.earned, items: data.total, pct: pct, contribution: contribution });
    });
    return { percentage: Math.round(total * 100) / 100, breakdown: breakdown };
  }

  function getRemarks(percentage) {
    return SCALE.find(function (row) { return percentage >= row.min; });
  }

  function showResult(record, breakdown) {
    document.getElementById("resultName").textContent = record.name + " - " + record.subject;
    document.getElementById("resPercent").textContent = record.percentage.toFixed(2) + "%";
    document.getElementById("resEquiv").textContent = record.equivalent;
    const remarksEl = document.getElementById("resRemarks");
    remarksEl.textContent = record.remarks;
    remarksEl.className = "big " + (isFailed(record.remarks) ? "failed" : "passed");

    document.getElementById("detailsBody").innerHTML = breakdown.map(function (b) {
      return "<tr><td>" + b.label + "</td><td>" + fmt(b.weight) + "%</td><td>" +
        (b.items > 0 ? fmt(b.earned) + " / " + fmt(b.items) : "-") + "</td><td>" +
        b.pct.toFixed(2) + "%</td><td>" + b.contribution.toFixed(2) + "</td></tr>";
    }).join("");

    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- events ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) {
      showMessage("Please fix the errors in the form.", "error");
      resultSection.classList.add("hidden");
      return;
    }
    const calc = calculateFinalGrade();
    const row = getRemarks(calc.percentage);
    const record = {
      name: document.getElementById("studentName").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      percentage: calc.percentage,
      equivalent: row.equivalent,
      remarks: row.remarks
    };
    showResult(record, calc.breakdown);
    const records = loadRecords();
    records.push(record);
    saveRecords(records);
    showMessage("Grade calculated and added to the summary.", "success");
  });

  componentsBox.addEventListener("click", function (event) {
    const addBtn = event.target.closest(".btn-add");
    const removeBtn = event.target.closest(".btn-remove");

    if (addBtn) {
      const box = addBtn.closest(".component");
      const rows = box.querySelectorAll(".entry");
      // copy "items" from the last row, so 4 quizzes of 15 items is quick to enter
      const lastItems = rows.length ? rows[rows.length - 1].querySelector(".items").value : "";
      addEntry(box, lastItems).querySelector(".score").focus();
      updatePreview();
    } else if (removeBtn) {
      const box = removeBtn.closest(".component");
      removeBtn.closest(".entry").remove();
      renumber(box);
      updatePreview();
    }
  });

  componentsBox.addEventListener("input", function (event) {
    event.target.classList.remove("invalid");
    event.target.closest(".component").querySelector(".component-error").textContent = "";
    document.getElementById("err-weights").textContent = "";
    updatePreview();
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    document.getElementById("studentName").value = "";
    document.getElementById("subject").value = "";
    showError("studentName", "");
    showError("subject", "");
    document.getElementById("err-weights").textContent = "";
    buildComponents();
    updatePreview();
    resultSection.classList.add("hidden");
  });

  toggleBtn.addEventListener("click", function () {
    const hidden = detailsBox.classList.toggle("hidden");
    toggleBtn.textContent = hidden ? "Show Computation" : "Hide Computation";
  });

  ["studentName", "subject"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { showError(id, ""); });
  });

  buildComponents();
  updatePreview();
}

/* SUMMARY PAGE */
const summaryBody = document.getElementById("summaryBody");
if (summaryBody) {
  const summaryInfo = document.getElementById("summaryInfo");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterRemarks");

  function renderSummary() {
    const all = loadRecords();
    const term = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    const visible = all.map(function (r, i) { return { record: r, index: i }; })
      .filter(function (item) {
        const text = (item.record.name + " " + item.record.subject).toLowerCase();
        return text.indexOf(term) !== -1 && (filter === "all" || item.record.remarks === filter);
      });

    if (visible.length === 0) {
      const msg = all.length === 0 ? "No grades yet." : "No results found.";
      summaryBody.innerHTML = '<tr><td colspan="6" class="empty">' + msg + "</td></tr>";
      summaryInfo.textContent = "";
      return;
    }

    summaryBody.innerHTML = visible.map(function (item) {
      const r = item.record;
      return "<tr>" +
        "<td>" + escapeHTML(r.name) + "</td>" +
        "<td>" + escapeHTML(r.subject) + "</td>" +
        "<td>" + r.percentage.toFixed(2) + "%</td>" +
        "<td>" + r.equivalent + "</td>" +
        '<td class="' + (isFailed(r.remarks) ? "failed" : "passed") + '">' + r.remarks + "</td>" +
        '<td><button class="btn btn-small" data-index="' + item.index + '">Delete</button></td>' +
        "</tr>";
    }).join("");

    const passed = visible.filter(function (item) { return !isFailed(item.record.remarks); }).length;
    const average = visible.reduce(function (sum, item) { return sum + item.record.percentage; }, 0) / visible.length;
    summaryInfo.textContent = "Showing: " + visible.length + " | Passed: " + passed +
      " | Failed: " + (visible.length - passed) + " | Average: " + average.toFixed(2) + "%";
  }

  summaryBody.addEventListener("click", function (event) {
    const index = event.target.getAttribute("data-index");
    if (index === null) return;
    if (!confirm("Delete this record?")) return;
    const records = loadRecords();
    records.splice(Number(index), 1);
    saveRecords(records);
    showMessage("Record deleted.", "info");
    renderSummary();
  });

  document.getElementById("clearAllBtn").addEventListener("click", function () {
    if (loadRecords().length === 0) { showMessage("There is nothing to clear.", "info"); return; }
    if (confirm("Delete ALL records?")) {
      saveRecords([]);
      showMessage("All records cleared.", "info");
      renderSummary();
    }
  });

  searchInput.addEventListener("input", renderSummary);
  filterSelect.addEventListener("change", renderSummary);
  renderSummary();
}
