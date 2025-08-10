

function formatDateToDDMMYYYY(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

async function loadFilteredApplications(gazettedValue) {
  document.getElementById("filterSection").style.display = "none";

  const query = new URLSearchParams();
  query.append("status", "Pending");
  query.append("gazetted", gazettedValue);

  const res = await fetch(`/api/applications?${query.toString()}`);
  const data = await res.json();

  const tbody = document.getElementById("appBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    document.getElementById("tableSection").style.display = "none";
    alert(`No ${gazettedValue} Pending Applications found.`);
    return;
  }

  document.getElementById("tableSection").style.display = "block";

  document.getElementById("headerBar").style.display = "flex";

  document.getElementById("tableTitle").textContent =
    gazettedValue + " I-Card Application List";

  data.forEach((app, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${app.emp_no}</td>
      <td>${app.name}</td>
      <td>${app.designation}</td>
      <td>${formatDateToDDMMYYYY(app.submittedAt || app.application_date)}</td>
      <td>${app.department}</td>
      <td>${app.station}</td>
      <td>${app.bill_unit}</td>
      <td>${app.address}</td>
      <td>${app.mobile}</td>
      <td>${app.emergency_name}</td>
      <td>${app.emergency_number}</td>
      
      <td>${formatDateToDDMMYYYY(app.submittedAt)}</td>
      <td><img src="/uploads/${
        app.uploadedFiles?.photo
      }" alt="Photo" style="object-fit: contain;" /></td>
      <td><img src="/uploads/${
        app.uploadedFiles?.signature
      }" alt="Signature" width="150" style="object-fit: contain;" /></td>
      <td>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
          `Emp No: ${app.emp_no}, Name: ${app.name}, Desig: ${app.designation}, Dept: ${app.department}`
        )}" alt="QR Code" height="50"/>
      </td>
    `;

    // Add family members
    for (let i = 0; i < 6; i++) {
      const fam = app.familyMembers?.[i];
      if (fam) {
        tr.innerHTML += `
          <td>${fam.name || ""}</td>
          <td>${fam.bloodGroup || ""}</td>
          <td>${fam.relationship || ""}</td>
          <td>${formatDateToDDMMYYYY(fam.dob) || ""}</td>
          <td>${fam.idMark || ""}</td>
        `;
      } else {
        tr.innerHTML += `<td colspan="5">--</td>`;
      }
    }

    tr.innerHTML += `
      <td>${app.status || "Pending"}</td>
      <td>
        <select class="action-btn status-dropdown" onchange="updateStatus(this, '${
          app._id || app.id
        }')">
          <option disabled selected>Update</option>
          <option>Pending</option>
          <option>Printing (Draft)</option>
          <option>Printing (To be Sent)</option>
          <option>Printing (Sent)</option>
          <option>Closed</option>
          <option>Rejected</option>
        </select>
      </td>
      <td><button class="action-btn" onclick="viewApp('${
        app._id || app.id
      }')">View</button></td>
      <td><button class="action-btn" onclick="downloadApp('${
        app._id || app.id
      }')">Download</button></td>
    `;

    tbody.appendChild(tr);
  });
}

async function loadApplications() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const status = document.getElementById("status").value;

  const query = new URLSearchParams();
  if (from) query.append("from", from);
  if (to) query.append("to", to);
  if (status) query.append("status", status);

  const res = await fetch(`/api/applications?${query.toString()}`);
  const data = await res.json();

  if (data.length === 0) {
    document.getElementById("tableSection").style.display = "none";
    alert("No applications found for selected filter.");
    return;
  }

  const tbody = document.getElementById("appBody");
  tbody.innerHTML = "";

  document.getElementById("tableSection").style.display = "block"; //show the table

  data.forEach((app, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${app.emp_no}</td>
        <td>${app.name}</td>
        <td>${app.designation}</td>
        <td>${formatDateToDDMMYYYY(app.dob)}</td>
        <td>${app.department}</td>
        <td>${app.station}</td>
        <td>${app.bill_unit}</td>
        <td>${app.address}</td>
        <td>${app.mobile}</td>
        <td>${app.emergency_name}</td>
        <td>${app.emergency_number}</td>
        <td>${formatDateToDDMMYYYY(
          app.submittedAt || app.application_date
        )}</td>
        <td><img src="/uploads/${app.uploadedFiles?.photo}" alt="Photo" /></td>
        <td><img src="/uploads/${
          app.uploadedFiles?.signature
        }" alt="Signature" style="max-width: 120px; height: auto;" /></td>
        <td>
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
    `Emp No: ${app.emp_no}, Name: ${app.name}, Desig: ${app.designation}, Dept: ${app.department}`
  )}" alt="QR Code" height="50"/>
</td>
        
      `;

    // Append up to 6 family members
    for (let i = 0; i < 6; i++) {
      const fam = app.familyMembers?.[i];
      if (fam) {
        tr.innerHTML += `
            <td>${fam.name || ""}</td>
            <td>${fam.bloodGroup || ""}</td>
            <td>${fam.relationship || ""}</td>
            <td>${formatDateToDDMMYYYY(fam.dob) || ""}</td>
            <td>${fam.idMark || ""}</td>
          `;
      } else {
        tr.innerHTML += `<td colspan="5">--</td>`;
      }
    }

    tr.innerHTML += `
        <td>${app.status || "Pending"}</td>
        <td>
  <select class="action-btn status-dropdown" onchange="updateStatus(this, '${
    app._id || app.id
  }')">
    <option disabled selected>Update</option>
    <option>Pending</option>
    <option>Printing (Draft)</option>
    <option>Printing (To be Sent)</option>
    <option>Printing (Sent)</option>
    <option>Closed</option>
    <option>Rejected</option>
  </select>
</td>
<td><button class="action-btn" onclick="viewApp('${
      app._id || app.id
    }')">View</button></td>
        <td><button class="action-btn" onclick="downloadApp('${
          app._id || app.id
        }')">Download</button></td>
      `;

    tbody.appendChild(tr);
  });
}

function updateStatus(selectElement, id) {
  const newStatus = selectElement.value;

  fetch(`/api/status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((res) => {
      if (res.ok) {
        alert("✅ Status updated to " + newStatus);
        loadApplications(); // Refresh the table
      } else {
        alert("❌ Failed to update status");
      }
    })
    .catch((err) => {
      console.error("❌ Error updating status:", err);
      alert("❌ Network error");
    });
}

function downloadApp(id) {
  window.open(`/api/download/${id}`, "_blank");
}
async function viewApp(id) {
  try {
    const res = await fetch(`/api/preview/${id}`);
    const html = await res.text();

    document.getElementById("previewContent").innerHTML = html;
    document.getElementById("previewModal").style.display = "block";
    document.getElementById("modalBackdrop").style.display = "block";
  } catch (err) {
    alert("❌ Failed to load preview");
    console.error(err);
  }
}

function closeModal() {
  document.getElementById("previewModal").style.display = "none";
  document.getElementById("modalBackdrop").style.display = "none";
}

document.getElementById("status").addEventListener("change", function () {
  const submitBtn = document.getElementById("submitBtn");
  if (this.value !== "") {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

document.getElementById("logoutLink").addEventListener("click", function (e) {
  e.preventDefault();

  fetch("/logout", {
    method: "POST",
  }).then(() => {
    window.location.replace("/index_user.html"); // Redirect after logout
  });
});

function printApplication(formType) {
  const url = `http://localhost:3000/api/print-all/${formType}`;
  window.open(url, "_blank", "width=900,height=1000");
}

// document.addEventListener("DOMContentLoaded", () => {
//   // Initial load of applications
//   loadApplications();
// });
