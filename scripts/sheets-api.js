// sheets-api.js
// Google Sheets API

import { API_KEY } from "../secrets.js";

// ======================
// Config and constants
// ======================

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SPREADSHEET_ID = '18y6RXhgfxD02iBzKMnwfrMINQbdMEOG7DrD8QmVr3sQ';
const RANGE = 'Form Responses 1!A:C';

// ======================
// GAPI Utilities
// ======================

// // Initialize the GAPI client and fetch the values

export async function loadGapiScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function initGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC]
  });
}

export async function fetchSheetValues() {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = response.result.values || [];

  return rows.slice(1).map(row => ({
    date: row[0] || '',
    value: row[1] || '',
    description: row[2] || ''
  }));
}



