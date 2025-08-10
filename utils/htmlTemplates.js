function generatePDFHTML(form) {
  // (your existing HTML template content, trimmed for brevity)
  // Copy your full ID card HTML here and return as string
  return `
    <html><head><style>body{font-family:Arial}</style></head>
    <body>
      <h2>East Coast Railway ID</h2>
      <p>Name: ${form.name}</p>
      <p>Emp No: ${form.emp_no}</p>
      <!-- Use form.photoDataURI and form.signatureDataURI -->
    </body>
    </html>
  `;
}

function generateHTML2(form) {
  const familyRows = (form.familyMembers || [])
    .map(m => `<tr>
      <td>${m.name}</td>
      <td>${m.bloodGroup}</td>
      <td>${m.relationship}</td>
      <td>${m.dob}</td>
      <td>${m.idMark}</td>
    </tr>`)
    .join("");

  return `
    <html><head><title>Preview</title></head><body>
      <h2>ID No: ${form.emp_no}</h2>
      <p>Name: ${form.name}</p>
      <table border="1"><tr><th>Name</th><th>Blood Group</th><th>Relation</th><th>DOB</th><th>ID Mark</th></tr>
      ${familyRows}</table>
    </body></html>
  `;
}

module.exports = { generatePDFHTML, generateHTML2 };
