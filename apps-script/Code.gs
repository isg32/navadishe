// Shared column order for the "Registrations" sheet. Both the public quick-lead
// form (index.html) and the internal dashboard's full registration form
// (dashboard.html) write into this same sheet/tab — each just leaves whatever
// columns don't apply to it blank.
var HEADERS = [
  'Timestamp', 'Source', 'Name', 'District', 'Phone', 'Request Callback',
  'School Name', 'School Address', 'City', 'State', 'Pin-code', 'School Board', 'Branch Name',
  'School Contact Number', 'School Email Id',
  'Principal Name', 'Principal Mobile Number', 'Principal Email Id',
  'Coordinator Name', 'Coordinator Mobile Number', 'Coordinator Email Id',
  'Students Class 1st-9th', 'Students Class 10th', 'Students Class 11th', 'Students Class 12th',
  'News First POC Name', 'News First POC Mobile Number',
  'Vendor Name', 'Vendor Mobile Number', 'Test Date',
  'Message'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Registrations');
  if (!sheet) {
    sheet = ss.insertSheet('Registrations');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function doPost(e) {
  try {
    var sheet = getSheet_();
    var p = e.parameter;

    // Ignore bot submissions caught by the honeypot field
    if (p.website) {
      return jsonOutput_({ result: 'ignored' });
    }

    var row = {
      'Timestamp': new Date(),
      'Source': p.source || 'Website',
      'Name': p.name || '',
      'District': p.district || '',
      'Phone': p.phone || '',
      'Request Callback': p.requestCallback ? 'Yes' : 'No',
      'School Name': p.schoolName || '',
      'School Address': p.schoolAddress || '',
      'City': p.city || '',
      'State': p.state || '',
      'Pin-code': p.pincode || '',
      'School Board': p.board || '',
      'Branch Name': p.branchName || '',
      'School Contact Number': p.schoolPhone || '',
      'School Email Id': p.schoolEmail || '',
      'Principal Name': p.principalName || '',
      'Principal Mobile Number': p.principalPhone || '',
      'Principal Email Id': p.principalEmail || '',
      'Coordinator Name': p.coordinatorName || '',
      'Coordinator Mobile Number': p.coordinatorPhone || '',
      'Coordinator Email Id': p.coordinatorEmail || '',
      'Students Class 1st-9th': p.studentsClass1to9 || '',
      'Students Class 10th': p.studentsClass10 || '',
      'Students Class 11th': p.studentsClass11 || '',
      'Students Class 12th': p.studentsClass12 || '',
      'News First POC Name': p.newsFirstPocName || '',
      'News First POC Mobile Number': p.newsFirstPocPhone || '',
      'Vendor Name': p.vendorName || '',
      'Vendor Mobile Number': p.vendorPhone || '',
      'Test Date': p.testDate || '',
      'Message': p.message || ''
    };

    sheet.appendRow(HEADERS.map(function (h) { return row[h]; }));

    return jsonOutput_({ result: 'success' });

  } catch (err) {
    return jsonOutput_({ result: 'error', error: err.toString() });
  }
}

// GET with no params: lets you sanity-check the deployment by visiting the
// web app URL directly in a browser.
// GET with ?action=list&key=<READ_KEY>: returns every row as JSON for the
// dashboard's "All Registrations" view. READ_KEY is a Script Property (set it
// under Project Settings -> Script properties) — it must match the
// SHEET_READ_KEY env var the Vercel proxy (api/leads.js) sends, so the sheet
// contents can't be read by anyone who merely has the deployed exec URL.
function doGet(e) {
  var params = (e && e.parameter) || {};

  if (params.action === 'list') {
    return handleList_(params);
  }

  return jsonOutput_({ status: 'Nava Dishe registration endpoint is live' });
}

function handleList_(params) {
  var readKey = PropertiesService.getScriptProperties().getProperty('READ_KEY');
  if (!readKey || params.key !== readKey) {
    return jsonOutput_({ result: 'error', error: 'Unauthorized' });
  }

  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2) {
    return jsonOutput_({ result: 'success', rows: [] });
  }

  var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var val = values[i][c];
      obj[headers[c]] = (val instanceof Date) ? val.toISOString() : val;
    }
    rows.push(obj);
  }

  return jsonOutput_({ result: 'success', rows: rows });
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
