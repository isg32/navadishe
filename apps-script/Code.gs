function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registrations');
    if (!sheet) {
      sheet = ss.insertSheet('Registrations');
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'School Name', 'Contact Person', 'Designation',
        'Phone', 'Email', 'City / District', 'Board',
        'Participating Class(es)', 'Approx. Students', 'Message'
      ]);
    }

    var p = e.parameter;

    // Ignore bot submissions caught by the honeypot field
    if (p.website) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'ignored' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      p.schoolName      || '',
      p.contactName      || '',
      p.designation      || '',
      p.phone            || '',
      p.email             || '',
      p.city              || '',
      p.board             || '',
      p.classLevel        || '',
      p.approxStudents    || '',
      p.message           || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by visiting the web app URL directly in a browser
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'Nava Dishe registration endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
