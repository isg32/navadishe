// Two separate sheet tabs, one per form:
// - "Website Leads": the public quick-lead form (index.html) — Name, District, Phone, callback.
// - "School Registrations": the dashboard's full Disha-style form (dashboard.html).
var WEBSITE_SHEET_NAME = 'Website Leads';
var WEBSITE_HEADERS = ['Timestamp', 'Name', 'District', 'Phone', 'Request Callback'];

var DASHBOARD_SHEET_NAME = 'School Registrations';
var DASHBOARD_HEADERS = [
  'Timestamp', 'School Name', 'School Address', 'City', 'District', 'State', 'Pin-code',
  'School Board', 'Branch Name', 'School Contact Number', 'School Email Id',
  'Principal Name', 'Principal Mobile Number', 'Principal Email Id',
  'Coordinator Name', 'Coordinator Mobile Number', 'Coordinator Email Id',
  'Students Class 1st-9th', 'Students Class 10th', 'Students Class 11th', 'Students Class 12th',
  'News First POC Name', 'News First POC Mobile Number',
  'Vendor Name', 'Vendor Mobile Number', 'Test Date',
  'Message'
];

function getOrCreateSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function appendWebsiteRow_(p) {
  var sheet = getOrCreateSheet_(WEBSITE_SHEET_NAME, WEBSITE_HEADERS);
  var row = {
    'Timestamp': new Date(),
    'Name': p.name || '',
    'District': p.district || '',
    'Phone': p.phone || '',
    'Request Callback': p.requestCallback ? 'Yes' : 'No'
  };
  sheet.appendRow(WEBSITE_HEADERS.map(function (h) { return row[h]; }));
}

function appendDashboardRow_(p) {
  var sheet = getOrCreateSheet_(DASHBOARD_SHEET_NAME, DASHBOARD_HEADERS);
  var row = {
    'Timestamp': new Date(),
    'School Name': p.schoolName || '',
    'School Address': p.schoolAddress || '',
    'City': p.city || '',
    'District': p.district || '',
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
  sheet.appendRow(DASHBOARD_HEADERS.map(function (h) { return row[h]; }));
}

function doPost(e) {
  try {
    var p = e.parameter;

    // Ignore bot submissions caught by the honeypot field
    if (p.website) {
      return jsonOutput_({ result: 'ignored' });
    }

    if (p.source === 'Dashboard') {
      appendDashboardRow_(p);
    } else {
      appendWebsiteRow_(p);
    }

    return jsonOutput_({ result: 'success' });

  } catch (err) {
    return jsonOutput_({ result: 'error', error: err.toString() });
  }
}

// GET with no params: lets you sanity-check the deployment by visiting the
// web app URL directly in a browser.
// GET with ?action=list&key=<READ_KEY>&sheet=website|dashboard: returns every
// row of the requested sheet as JSON, for the dashboard's list views.
// READ_KEY is a Script Property (Project Settings -> Script properties) — it
// must match the SHEET_READ_KEY env var the Vercel proxy (api/leads.js)
// sends, so the sheets can't be read by anyone who merely has the exec URL.
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

  var isWebsite = params.sheet === 'website';
  var name = isWebsite ? WEBSITE_SHEET_NAME : DASHBOARD_SHEET_NAME;
  var defaultHeaders = isWebsite ? WEBSITE_HEADERS : DASHBOARD_HEADERS;
  var sheet = getOrCreateSheet_(name, defaultHeaders);

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
