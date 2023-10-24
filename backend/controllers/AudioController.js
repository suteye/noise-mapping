const {google} = require('googleapis');

exports.GetAudio = async (req, res) => {
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
        range: "test!A2:K"
    });

    const data = getLocation.data.values.map(([date,time , userdisplay, id, sound, loudness, typeLocation, duration, Latitude, Longitude, Address]) => ({
        date: date,
        time: time,
        userdisplay: userdisplay,
        id: id,
        soundLink: sound,
        loudness: loudness,
        typeLocation: typeLocation,
        duration: duration,
        Latitude: Latitude,
        Longitude: Longitude,
        Address: Address
    }));
    res.json(data);
    console.log(data);
}