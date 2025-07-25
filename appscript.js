const ssId = "ํYOUR_SPREADSHEET_ID"; // Replace with your Google Spreadsheet ID
// You can find this ID in the URL of your Google Spreadsheet, it looks like this:
// https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
// Make sure to replace YOUR_SPREADSHEET_ID with the actual ID of your spreadsheet
// This spreadsheet will be used to store user consent, audio data, and location data

var FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID"; // Replace with your Google Drive Folder ID where audio files will be saved
// This folder should have permissions set to allow the script to write files into it
// You can find the folder ID in the URL of the folder in Google Drive, it looks like this: https://drive.google.com/drive/folders/YOUR_GOOGLE_DRIVE_FOLDER_ID
// Make sure to replace YOUR_GOOGLE_DRIVE_FOLDER_ID with the actual ID of your folder
var REPLY_URL = "https://api.line.me/v2/bot/message/reply";

var ACCESS_TOKEN =
  "YOUR_LINE_CHANNEL_ACCESS_TOKEN"; // Replace with your LINE Channel Access Token
// You can find this token in your LINE Developers Console under the Messaging API settings of your channel
// Make sure to replace YOUR_LINE_CHANNEL_ACCESS_TOKEN with the actual token of your LINE channel
// This token is used to authenticate your requests to the LINE Messaging API

const ss = SpreadsheetApp.openById(ssId);
const sheetConsent = ss.getSheetByName("การยินยอม");
const sheetSound = ss.getSheetByName("เสียง");
const sheetLocation = ss.getSheetByName("location");
const sheetData = ss.getSheetByName("test")

// function concatData(){
//   var lastRowSound = sheetSound.getLastRow() + 1;
//   var lastRowLocation = sheetLocation.getLastRow() + 1;
//   var lasRowData = sheetData.getLastRow() + 1;

//   var date = sheetSound.getRange(lastRowSound - 1, 1).getValue().split(" ")[0];
//   var displayName = sheetSound.getRange(lastRowSound - 1, 2).getValue();
//   var userId = sheetSound.getRange(lastRowSound - 1, 3).getValue();
//   var url = sheetSound.getRange(lastRowSound - 1, 4).getValue();
//   var level =    sheetSound.getRange(lastRowSound - 1, 5).getValue();
//   var place = sheetSound.getRange(lastRowSound - 1, 6).getValue();
//   var duration = sheetSound.getRange(lastRowSound - 1, 7).getValue();

//   var time = sheetSound.getRange(lastRowSound - 1, 1).getValue().split(" ")[1];

//   var lat =  sheetLocation.getRange(lastRowLocation - 1, 4).getValue();
//   var long = sheetLocation.getRange(lastRowLocation - 1, 5).getValue();
//   var address = sheetLocation.getRange(lastRowLocation - 1, 6).getValue();
//   //and time put AM or PM in the end of time  
//   if(time.split(":")[0] > 12){
//     time = time + " PM";
//   } else {
//     time = time + " AM";
//   }

//   //if all data has value then concat data in sheetData

//   //concat data in sheetData
//   sheetData.getRange(lasRowData , 1).setValue(date);
//   sheetData.getRange(lasRowData - 1, 2).setValue(time);
//   sheetData.getRange(lasRowData - 1, 3).setValue(displayName);
//   sheetData.getRange(lasRowData - 1, 4).setValue(userId);
//   sheetData.getRange(lasRowData - 1, 5).setValue(url);
//   sheetData.getRange(lasRowData - 1, 6).setValue(level);
//   sheetData.getRange(lasRowData - 1, 7).setValue(place);
//   sheetData.getRange(lasRowData - 1, 8).setValue(duration);
//   sheetData.getRange(lasRowData - 1, 9).setValue(lat);
//   sheetData.getRange(lasRowData - 1, 10).setValue(long);
//   sheetData.getRange(lasRowData - 1, 11).setValue(address);



//   Logger.log(date + " "+ time + " " + displayName + " " + userId + " " + url + " " + level + " " + place + " " + lat + " " + long + " " + address);

// }
// concatData();

function TestDump(e) {
  var data = JSON.parse(e.postData.contents).events[0];
  sendMsg(REPLY_URL, {
    replyToken: data.replyToken,
    messages: [
      {
        type: "text",
        text: "test",
      },
    ],
  });
}

function checkUserInSheet(userId) {
  const getUserID = sheetConsent
    .getRange(2, 3, sheetConsent.getLastRow() - 1, 1)
    .getValues();
  for (let i = 0; i < getUserID.length; i++) {
    var row = getUserID[i];
    // Logger.log(row[0]);
    if (row[0] == userId) {
      return true;
    }
  }
  return false;
}

function checkUserHasAcceptConsent(userId) {
  const getUserID = sheetConsent
    .getRange(2, 3, sheetConsent.getLastRow() - 1, 1)
    .getValues();
  const getConsent = sheetConsent
    .getRange(2, 4, sheetConsent.getLastRow() - 1, 1)
    .getValues();
  for (let i = 0; i < getUserID.length; i++) {
    var col = getUserID[i];
    var col2 = getConsent[i];
    if (col[0] == userId && col2[0] == "ยินยอม") {
      return true;
    }
  }
  return false;
}

function logvalues() 
// This function is for debugging purposes to log values in the console 
{ 
  const getUserID = sheetConsent
    .getRange(2, 3, sheetConsent.getLastRow() - 1, 1)
    .getValues();
  var arr1d = [].concat.apply([], getUserID);
  Logger.log(arr1d.indexOf("XXXXXXXXX"));

  Logger.log(
    sheetConsent
      .getRange("F" + getUserIdIndex("XXXXXXXXX"))
      .getValue()
  );

  Logger.log(
    typeof sheetConsent
      .getRange("F" + getUserIdIndex("XXXXXXXXX"))
      .getValue()
  );
}

function getUserIdIndex(userId) {
  const getUserID = sheetConsent
    .getRange(2, 3, sheetConsent.getLastRow() - 1, 1)
    .getValues();
  var arr1d = [].concat.apply([], getUserID);
  return parseInt(arr1d.indexOf(userId)) + 2;
}

function sendMsg(url, payload) {
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "post",
    payload: JSON.stringify(payload),
  });
}

function getAudio(id) {
  var url = "https://api-data.line.me/v2/bot/message/" + id + "/content";
  var data = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "get",
  });

  var audio = data.getBlob().setName(Number(new Date()) + ".mp3");
  return audio;
}

function saveAudio(blob) {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var file = folder.createFile(blob);
    return file.getUrl();
  } catch (e) {
    return false;
  }
}

function getUserDisplayName(userId) {
  var url = "https://api.line.me/v2/bot/profile/" + userId;
  var data = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "get",
  });

  var displayName = JSON.parse(data.getContentText()).displayName;

  return displayName;
}

function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0]; //convert request srting in JSON format into JavaScript object

  // if new add friend event is detected then send flex message to user for PDPA consent
  if (event.type == "follow") {
    if (checkUserInSheet(event.source.userId) == true) {
      // check if user is already in sheet
      sendMsg(REPLY_URL, {
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: "ขอบคุณที่เข้าร่วมโครงการวิจัยนี้",
          },
        ],
      });
    } else {
      sendMsg(REPLY_URL, {
        replyToken: event.replyToken,
        messages: [
          {
            type: "flex",
            altText: "Flex Message",
            contents: {
              type: "bubble",
              hero: {
                type: "image",
                url: "https://img.freepik.com/free-vector/personal-data-protection-gdpr-isometric-illustration_1284-57394.jpg?w=826&t=st=1674662423~exp=1674663023~hmac=1b1c2382cfa21c1013487a80e1ebe1bec4b563de30f2abd9090bb0d4a706797a",
                size: "full",
                aspectRatio: "20:13",
                aspectMode: "cover",
                action: {
                  type: "uri",
                  uri: "http://linecorp.com/",
                },
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "แบบฟอร์มการเข้าร่วม",
                    weight: "bold",
                    size: "lg",
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    margin: "lg",
                    spacing: "sm",
                    contents: [
                      {
                        type: "box",
                        layout: "baseline",
                        spacing: "sm",
                        contents: [
                          {
                            type: "text",
                            text: "ข้าพเจ้าเข้าใจและตกลงที่จะเข้าร่วมโครงการวิจัยนี้",
                            wrap: true,
                            color: "#666666",
                            size: "sm",
                            flex: 5,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "horizontal",
                spacing: "sm",
                contents: [
                  {
                    type: "button",
                    style: "primary",
                    height: "sm",
                    action: {
                      type: "message",
                      label: "ยินยอม",
                      text: "ยินยอม",
                    },
                  },
                  {
                    type: "button",
                    style: "primary",
                    height: "sm",
                    action: {
                      type: "message",
                      label: "ไม่ยินยอม",
                      text: "ไม่ยินยอม",
                    },
                    color: "#FF0000",
                  },
                ],
              },
            },
          },
        ],
      });
    }
  }

  var time = event.timestamp;
  var userMsg = event.message.text;
  var userId = event.source.userId;
  var displayName = getUserDisplayName(userId);

  var d = new Date(parseInt(time));
  var formattedDate = Utilities.formatDate(d, "GMT+7", "dd/MM/yyyy HH:mm:ss");
  var dateParts = formattedDate.split(" ");
  var date = dateParts[0];
  var time = dateParts[1];

  var lastRowConsent = sheetConsent.getLastRow() + 1;
  var lastRowSound = sheetSound.getLastRow() + 1;
  var lastRowLocation = sheetLocation.getLastRow() + 1;
  var lasRowData = sheetData.getLastRow() + 1;
  if (userMsg == "ยินยอม") {
    sendMsg(REPLY_URL, {
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: "ขอขอบคุณที่ยินยอมในการทำแบบสำรวจนี้ โปรดไว้วางใจได้ว่าแบบสอบถามจะถูกบันทึกโดยไม่ระบุชื่อและข้อมูลส่วนบุคคล 🗂️",
        },
        {
          type: "text",
          text: "ท่านสามรถเริ่มเก็บข้อมูลได้ตามวิธีดังรูปด้านล่างค่ะ",
        },
        {
          type: "image",
          originalContentUrl:
            "https://drive.google.com/uc?export=view&id=1RySUnbRSL-GrtW2-_uwhwXcIfnHfhTOF",
          previewImageUrl:
            "https://drive.google.com/uc?export=view&id=1RySUnbRSL-GrtW2-_uwhwXcIfnHfhTOF",
        },
      ],
    });
    
    if(checkUserInSheet(userId) == true){
      sheetConsent.getRange(getUserIdIndex(userId), 1).setValue(formattedDate);
      sheetConsent.getRange(getUserIdIndex(userId), 2).setValue(displayName);
      sheetConsent.getRange(getUserIdIndex(userId), 3).setValue(userId);
      sheetConsent.getRange(getUserIdIndex(userId), 4).setValue("ยินยอม");
      sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
      sheetConsent.getRange(getUserIdIndex(userId),6).setValue("FALSE");
      sheetConsent.getRange(getUserIdIndex(userId),7).setValue(0);
    } else {
      sheetConsent.getRange(lastRowConsent, 1).setValue(formattedDate);
      sheetConsent.getRange(lastRowConsent, 2).setValue(displayName);
      sheetConsent.getRange(lastRowConsent, 3).setValue(userId);
      sheetConsent.getRange(lastRowConsent, 4).setValue("ยินยอม");
      sheetConsent.getRange(lastRowConsent, 5).setValue(-1);
      sheetConsent.getRange(lastRowConsent,6).setValue("FALSE");
      sheetConsent.getRange(lastRowConsent,7).setValue(0);
    }
    
    
  } else if (userMsg == "ไม่ยินยอม") {
    sendMsg(REPLY_URL, {
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: "ขอบคุณที่เข้าร่วมโครงการวิจัยนี้",
        },
      ],
    });

    if(checkUserInSheet(userId) == true){
      sheetConsent.getRange(getUserIdIndex(userId), 1).setValue(formattedDate);
      sheetConsent.getRange(getUserIdIndex(userId), 2).setValue(displayName);
      sheetConsent.getRange(getUserIdIndex(userId), 3).setValue(userId);
      sheetConsent.getRange(getUserIdIndex(userId), 4).setValue("ไม่ยินยอม");
      sheetConsent.getRange(getUserIdIndex(userId), 5).setValue("");
      sheetConsent.getRange(getUserIdIndex(userId),6).setValue("");
      sheetConsent.getRange(getUserIdIndex(userId),7).setValue("");
    } else {
      sheetConsent.getRange(lastRowConsent, 1).setValue(formattedDate);
      sheetConsent.getRange(lastRowConsent, 2).setValue(displayName);
      sheetConsent.getRange(lastRowConsent, 3).setValue(userId);
      sheetConsent.getRange(lastRowConsent, 4).setValue("ไม่ยินยอม");
      sheetConsent.getRange(lastRowConsent, 5).setValue("");
      sheetConsent.getRange(lastRowConsent,6).setValue("");
      sheetConsent.getRange(lastRowConsent,7).setValue("");
    }
  }

  if (userMsg == "เริ่มเก็บข้อมูล") {
    if (checkUserHasAcceptConsent(userId) == true) {
      //ถ้ายินยอมแล้ว
    sheetConsent.getRange(getUserIdIndex(userId), 6).setValue(true); //set start_process = true ใน sheet เพื่อเริ่มเก็บข้อมูล
    sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
    sheetConsent.getRange(getUserIdIndex(userId),7).setValue(0);
    }
  }

  if (sheetConsent.getRange("F" + getUserIdIndex(userId)).getValue() == true) {
    // ถ้า start_process = true
    if (sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() == -1) {
      // ถ้ายังไม่ได้เก็บข้อมูลเสียง
      if (sheetConsent.getRange("G" + getUserIdIndex(userId)).getValue() == 0) {
        // ถ้ายังไม่ได้ส่งข้อความสอนอัดเสียง ให้ส่งข้อความสอนอัดเสียง
        sheetConsent
          .getRange(getUserIdIndex(userId), 7)
          .setValue(
            sheetConsent.getRange("G" + getUserIdIndex(userId)).getValue() + 1
          );
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "ขอขอบคุณที่ยินยอมในการทำแบบสำรวจนี้ โปรดไว้วางใจได้ว่าแบบสอบถามจะถูกบันทึกโดยไม่ระบุชื่อและข้อมูลส่วนบุคคล 🗂️",
            },
            {
              type: "text",
              text: "🎙️ 🔊 หากมีการบันทึกเสียง โปรดบันทึกเสียง ประมาณ10วินาที",
            },
            {
              type: "image",
              originalContentUrl:
                "https://drive.google.com/uc?export=view&id=1f1atbJmaMaKKskpnHK9JN0EScAbT6Zrs",
              previewImageUrl:
                "https://drive.google.com/uc?export=view&id=1f1atbJmaMaKKskpnHK9JN0EScAbT6Zrs",
            },
          ],
        });
      }
    }
    if (sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() == 0) {
      if (event.message.type == "audio") {
        try {
          var audio = getAudio(event.message.id);
          var url = saveAudio(audio);
          sendMsg(REPLY_URL, {
            replyToken: event.replyToken,
            messages: [
              {
                type: "flex",
                altText: "ประเภทของสถานที่",
                contents: {
                  body: {
                    type: "box",
                    contents: [
                      {
                        size: "lg",
                        type: "text",
                        weight: "bold",
                        text: "ประเภทของสถานที่",
                      },
                      {
                        margin: "lg",
                        type: "box",
                        layout: "horizontal",
                        spacing: "sm",
                        contents: [
                          {
                            style: "primary",
                            height: "sm",
                            type: "button",
                            action: {
                              type: "message",
                              label: "อุตสาหกรรม",
                              text: "อุตสาหกรรม",
                            },
                          },
                          {
                            action: {
                              type: "message",
                              label: "บ้าน",
                              text: "บ้าน",
                            },
                            height: "sm",
                            type: "button",
                            style: "primary",
                          },
                          {
                            action: {
                              text: "คาเฟ่",
                              type: "message",
                              label: "คาเฟ่",
                            },
                            type: "button",
                            height: "sm",
                            style: "primary",
                          },
                        ],
                      },
                      {
                        type: "box",
                        contents: [
                          {
                            offsetTop: "xs",
                            action: {
                              type: "message",
                              label: "ที่ทำงาน",
                              text: "ที่ทำงาน",
                            },
                            style: "primary",
                            height: "sm",
                            type: "button",
                            margin: "none",
                            offsetBottom: "none",
                          },
                          {
                            margin: "md",
                            offsetBottom: "none",
                            offsetTop: "xs",
                            type: "button",
                            style: "primary",
                            height: "sm",
                            action: {
                              type: "message",
                              label: "มหาวิทยาลัย",
                              text: "มหาวิทยาลัย",
                            },
                          },
                        ],
                        layout: "horizontal",
                      },
                      {
                        layout: "horizontal",
                        type: "box",
                        contents: [
                          {
                            height: "sm",
                            style: "primary",
                            action: {
                              text: "ตลาด",
                              type: "message",
                              label: "ตลาด",
                            },
                            type: "button",
                            offsetTop: "xs",
                          },
                          {
                            margin: "md",
                            height: "sm",
                            offsetTop: "xs",
                            type: "button",
                            style: "primary",
                            action: {
                              type: "message",
                              label: "สถานที่บันเทิง",
                              text: "สถานที่บันเทิง",
                            },
                          },
                        ],
                      },
                      {
                        contents: [
                          {
                            offsetBottom: "none",
                            style: "primary",
                            offsetTop: "xs",
                            type: "button",
                            margin: "none",
                            height: "sm",
                            action: {
                              label: "ใกล้สนามบิน",
                              type: "message",
                              text: "ใกล้สนามบิน",
                            },
                          },
                        ],
                        type: "box",
                        layout: "horizontal",
                      },
                    ],
                    layout: "vertical",
                  },
                  type: "bubble",
                  footer: {
                    spacing: "sm",
                    contents: [],
                    type: "box",
                    layout: "horizontal",
                  },
                },
              },
            ],
          });
        } catch (e) {
          Logger.log(e);
        }

        sheetData.getRange(lasRowData, 1).setValue(date);
        sheetData.getRange(lasRowData  , 2).setValue(time);
        sheetData.getRange(lasRowData , 3).setValue(displayName);
        sheetData.getRange(lasRowData , 4).setValue(userId);
        sheetData.getRange(lasRowData , 5).setValue(url);
        sheetData.getRange(lasRowData , 8).setValue(event.message.duration);
        sheetConsent
          .getRange(getUserIdIndex(userId), 5)
          .setValue(
            sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() + 1
          );
      } else if (event.message.type != "audio") {
        sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
        sheetConsent.getRange(getUserIdIndex(userId),6).setValue("FALSE");
        sheetConsent.getRange(getUserIdIndex(userId),7).setValue(5);
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "ขออภัยค่ะ คุณยังไม่ได้มีการอัดเสียงส่งเข้ามาค่ะ",
            },
            {
              type: "text",
              text: "กรุณาเริ่มต้นกระบวนการใหม่อีกครั้งค่ะ",
            },
          ],
        });
      }
    }

    //ขั้นตอนส่งข้อมูลประเภทสถานที่
    if (sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() == 1) {
      if ( userMsg == "ใกล้สนามบิน" || userMsg == "สถานที่บันเทิง" || userMsg == "ตลาด" || userMsg == "มหาวิทยาลัย" || userMsg == "ที่ทำงาน" || userMsg == "คาเฟ่" || userMsg == "บ้าน" ||userMsg == "อุตสาหกรรม") {
        //ส่งให้กดเลือกระดับความดันของเสียง
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              altText: "ระดับความดันของเสียง",
              contents: {
                body: {
                  layout: "vertical",
                  type: "box",
                  contents: [
                    {
                      text: "ระดับความดังของเสียง",
                      type: "text",
                      size: "xl",
                      weight: "bold",
                    },
                    {
                      layout: "baseline",
                      contents: [
                        {
                          text: "จะเรียงจากไม่รบกวนไปรบกวนอย่างมากที่สุด",
                          type: "text",
                          color: "#999999",
                          size: "sm",
                          margin: "md",
                        },
                      ],
                      margin: "md",
                      type: "box",
                    },
                    {
                      contents: [
                        {
                          height: "md",
                          color: "#5fb21b",
                          style: "primary",
                          margin: "lg",
                          type: "button",
                          action: {
                            type: "message",
                            text: "ไม่รบกวน",
                            label: "ไม่รบกวน",
                          },
                        },
                        {
                          style: "primary",
                          height: "md",
                          type: "button",
                          action: {
                            text: "รบกวนเล็กน้อย",
                            type: "message",
                            label: "รบกวนเล็กน้อย",
                          },
                          color: "#9fc819",
                        },
                        {
                          type: "button",
                          height: "md",
                          style: "primary",
                          action: {
                            label: "รบกวนพอสมควร",
                            type: "message",
                            text: "รบกวนพอสมควร",
                          },
                          color: "#efc142",
                        },
                        {
                          action: {
                            text: "รบกวนอย่างมาก",
                            label: "รบกวนอย่างมาก",
                            type: "message",
                          },
                          height: "md",
                          color: "#f9a919",
                          style: "primary",
                          type: "button",
                        },
                        {
                          style: "primary",
                          color: "#fe0200",
                          action: {
                            text: "รบกวนอย่างมากที่สุด",
                            label: "รบกวนอย่างมากที่สุด",
                            type: "message",
                          },
                          height: "md",
                          type: "button",
                        },
                      ],
                      spacing: "sm",
                      layout: "vertical",
                      type: "box",
                    },
                  ],
                },
                size: "mega",
                type: "bubble",
              },
              type: "flex",
            },
          ],
        });
        sheetData.getRange(lasRowData - 1, 7).setValue(userMsg);
        sheetConsent
          .getRange(getUserIdIndex(userId), 5)
          .setValue(
            sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() + 1
          );
      } else if (
        userMsg != "ใกล้สนามบิน" ||
        userMsg != "สถานที่บันเทิง" ||
        userMsg != "ตลาด" ||
        userMsg != "มหาวิทยาลัย" ||
        userMsg != "ที่ทำงาน" ||
        userMsg != "คาเฟ่" ||
        userMsg != "บ้าน" ||
        userMsg != "อุตสาหกรรม"
      ) {
        
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "ขออภัยค่ะ คุณยังไม่ได้เลือกประเภทสถานที่ค่ะ",
            },
            {
              type: "text",
              text: "กรุณาเริ่มต้นกระบวนการใหม่อีกครั้งค่ะ",
            },
          ],
        });
        sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
        sheetConsent.getRange(getUserIdIndex(userId),6).setValue("FALSE");
        sheetConsent.getRange(getUserIdIndex(userId),7).setValue(0);
      }
    }

    //ขั้นตอนส่งข้อมูลระดับความดังของเสียง
    if (sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() == 2) {
      if(userMsg == 'ไม่รบกวน' || userMsg == 'รบกวนเล็กน้อย' || userMsg == 'รบกวนพอสมควร' || userMsg == 'รบกวนอย่างมาก' || userMsg == 'รบกวนอย่างมากที่สุด'){
        sendMsg(REPLY_URL, {
          'replyToken': event.replyToken,
          'messages': [{
              "text": "โปรดส่งตำแหน่งที่คุณบันทึกเสียงให้น้องซาวหน่อยนะคะ",
              "quickReply": {
                "items": [
                  {
                    "imageUrl": "https://cdn-icons-png.flaticon.com/512/819/819814.png",
                    "type": "action",
                    "action": {
                      "label": "Location",
                      "text": "Location",
                      "type": "location"
                    }
                  }
                ]
              },
              "type": "text"
  
          } ]
        });
        sheetData.getRange(lasRowData - 1, 6).setValue(userMsg);
        sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(3);
      } else if(userMsg != 'ไม่รบกวน' || userMsg != 'รบกวนเล็กน้อย' || userMsg != 'รบกวนพอสมควร' || userMsg != 'รบกวนอย่างมาก' || userMsg != 'รบกวนอย่างมากที่สุด'){
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "ขออภัยค่ะ คุณยังไม่ได้เลือกระดับความดันของเสียงค่ะ",
            },
            {
              type: "text",
              text: "กรุณาเริ่มต้นกระบวนการใหม่อีกครั้งค่ะ",
            },
          ],
        });
        sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
        sheetConsent.getRange(getUserIdIndex(userId),6).setValue("FALSE");
        sheetConsent.getRange(getUserIdIndex(userId),7).setValue(0);
      }
    }

    //ขั้นตอนส่งตำแหน่งที่บันทึกเสียง
    if (sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() == 3) {
      if (event.message.type == "location") {
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "ขอบคุณสำหรับข้อมูลค่ะ ขอให้คุณมีวันที่ดีนะคะ 🤍♻️",
            },
            {
              type: "text",
              text: "หากต้องการส่งข้อมูลเพิ่มเติม กรุณากดปุ่มเริ่มต้นกระบวนการใหม่ค่ะ",
            },
             {
              type: "image",
              originalContentUrl:
              "https://drive.google.com/uc?export=view&id=1RySUnbRSL-GrtW2-_uwhwXcIfnHfhTOF",
              previewImageUrl:
              "https://drive.google.com/uc?export=view&id=1RySUnbRSL-GrtW2-_uwhwXcIfnHfhTOF",
            },
          ],
        });
        sheetData.getRange(lasRowData - 1 , 9).setValue(event.message.latitude);
        sheetData.getRange(lasRowData - 1 , 10).setValue(event.message.longitude);
        sheetData.getRange(lasRowData - 1, 11).setValue(event.message.address);
        sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
        sheetConsent.getRange(getUserIdIndex(userId),6).setValue("FALSE");
        sheetConsent.getRange(getUserIdIndex(userId),7).setValue(0);
      } else if (event.message.type != "location") {
        sendMsg(REPLY_URL, {
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "ขออภัยค่ะ คุณยังไม่ได้ส่งตำแหน่งที่บันทึกเสียงค่ะ",
            },
            {
              type: "text",
              text: "กรุณาเริ่มต้นกระบวนการใหม่อีกครั้งค่ะ",
            },
          ],
        });
        sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(-1);
        sheetConsent.getRange(getUserIdIndex(userId),6).setValue("FALSE");
        sheetConsent.getRange(getUserIdIndex(userId),7).setValue(0);
      }
    }

    if (sheetConsent.getRange("E" + getUserIdIndex(userId)).getValue() == -1) {
                sheetConsent.getRange(getUserIdIndex(userId), 5).setValue(0);
    }

  }
  return ContentService.createTextOutput(
    JSON.stringify({ content: "post ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
