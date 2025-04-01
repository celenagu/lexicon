// sheets-api.js
// Google Sheets API

import { API_KEY, CLIENT_ID } from "../secrets.js";

// Discovery doc URL for APIs used by quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

const SPREADSHEET_ID = '18y6RXhgfxD02iBzKMnwfrMINQbdMEOG7DrD8QmVr3sQ';
const RANGE = 'Form Responses 1!B:B';


// // Callback after the API client is loaded. Loads the
// // discovery doc to initialize the API.
// export async function initGapiAndFetch(callback) {
//     await gapi.client.init({
//         apiKey: API_KEY,
//         discoveryDocs: [DISCOVERY_DOC],
//     });
//     getTerms(callback);
// }

// // https://docs.google.com/spreadsheets/d/18y6RXhgfxD02iBzKMnwfrMINQbdMEOG7DrD8QmVr3sQ/edit?usp=sharing

// async function getTerms(callback) {
// let response;
// try {
//     response = await gapi.client.sheets.spreadsheets.values.get({
//     spreadsheetId: SPREADSHEET_ID,
//     range: RANGE,
//     });
// } catch (err) {
//     document.getElementById('content').innerText = err.message;
//     return;
// }
// const range = response.result;

// // Flatten to string to display
// const output = range.values.reduce(
//     (str, row) => `${str}${row[0]}, ${row[4]}\n`,
//     'Name, Major:\n');
// document.getElementById('content').innerText = output;
// }

// Initialize the GAPI client and fetch the values
export async function initGapiAndFetch(callback) {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
  
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });
  
      const values = response.result.values;
      if (callback) callback(values);
    } catch (err) {
      console.error('Google Sheets API error:', err);
      document.querySelector('.left').innerText = 'Failed to load data.';
    }
  }

