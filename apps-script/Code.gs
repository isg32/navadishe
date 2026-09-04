function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registrations');
    if (!sheet) {
      sheet = ss.insertSheet('Registrations');
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'School Name', 'School Address', 'City', 'District',
        'State', 'Pin-code', 'School Board', 'Branch Name',
        'School Contact Number', 'School Email Id',
        'Principal Name', 'Principal Mobile Number', 'Principal Email Id',
        'Coordinator Name', 'Coordinator Mobile Number', 'Coordinator Email Id',
        'Students Class 1st-9th', 'Students Class 10th', 'Students Class 11th', 'Students Class 12th',
        'News First POC Name', 'News First POC Mobile Number',
        'Vendor Name', 'Vendor Mobile Number', 'Test Date',
        'Message'
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
      p.schoolName            || '',
      p.schoolAddress         || '',
      p.city                  || '',
      p.district              || '',
      p.state                 || '',
      p.pincode                || '',
      p.board                  || '',
      p.branchName             || '',
      p.schoolPhone            || '',
      p.schoolEmail            || '',
      p.principalName          || '',
      p.principalPhone         || '',
      p.principalEmail         || '',
      p.coordinatorName        || '',
      p.coordinatorPhone       || '',
      p.coordinatorEmail       || '',
      p.studentsClass1to9      || '',
      p.studentsClass10        || '',
      p.studentsClass11        || '',
      p.studentsClass12        || '',
      p.newsFirstPocName       || '',
      p.newsFirstPocPhone      || '',
      p.vendorName             || '',
      p.vendorPhone            || '',
      p.testDate               || '',
      p.message                || ''
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
