var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')

// - SETUP -
// body-parser for JSON
app.use(bodyParser.json())

// Page token
var token = "EAAK9h7BPLV0BABWIuq5XvsX0K6iZCaxVvYygz7jQ7fd8koYi75zZCev7X8p1rSe5vu1SDHuaKYm18GE6I6nGqVxnj9ivGvKGBOe4FLrsR2UrDjtQkajLAYSZAfKiplciX4Hw4esGJGS4jKnbxtAJVSiOyJsHXcZD";

// To check the server is live
app.get('/hello',function(req,res){
  res.send('Live!')
})

// webhook setup and token verification
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'aiesecuk_hottogo') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});
// - SETUP -

// - FUNCTIONS -
// sendTextMessage function
function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// sendGenericMessage function
function sendGenericMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Do you know what is AIESEC?",
          "subtitle": "We are the biggest youth-led organisation",
          "image_url": "http://aiesec.org/wp-content/uploads/2014/11/AIESEC-Favicon-309x341.png",
          "buttons": [{
            "type": "web_url",
            "url": "http://www.aiesec.co.uk",
            "title": "Get to know more"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        },{
          "title": "What is Youth 4 Global Goals?",
          "subtitle": "A global movement led by youth to achieve the SDGs",
          "image_url": "http://s32.postimg.org/b65fsm2vp/Youth_4_Global_Goals_logo.png",
          "buttons": [{
            "type": "web_url",
            "title": "That's interesting",
            "url": "http://youth4gg.aiesec.co.uk",
          }],
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// main shit
app.post('/webhook', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      console.log(text)
      if (text === 'Generic') {
        sendGenericMessage(sender);
        continue;
      }
      if (event.postback) {
        text = JSON.stringify(event.postback);
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
        continue;
      }

      sendTextMessage(sender, "I'm a parrot! ECHO!: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000)
