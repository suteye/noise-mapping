const {google} = require('googleapis');

exports.GetLocation = async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({version: 'v4', auth: client});

    // spreadsheet id
    const SPREADSHEET_ID = "1L5WGaMN_Ox_-9_wXpjDoLxPWWqZjKcXDKEf4MP5CyHU"

    const getLocation = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: "location!A2:F"
    });

    const data = getLocation.data.values.map(([timestamp , userdisplay, id, lat, long, address]) => ({
        timestamp: timestamp,
        id: id,
        userdisplay: userdisplay,
        address: address,
        latitude: lat,
        longitude: long,

    }));
    res.json(data);
}