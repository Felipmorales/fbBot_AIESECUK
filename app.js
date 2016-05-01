var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')

// - SETUP -
// body-parser for JSON
app.use(bodyParser.json())

// Receipt variable
//var ordernum = 100;

// Port
app.listen(process.env.PORT || 3000)

// Page token
var token = "EAAK9h7BPLV0BABWIuq5XvsX0K6iZCaxVvYygz7jQ7fd8koYi75zZCev7X8p1rSe5vu1SDHuaKYm18GE6I6nGqVxnj9ivGvKGBOe4FLrsR2UrDjtQkajLAYSZAfKiplciX4Hw4esGJGS4jKnbxtAJVSiOyJsHXcZD";

// Welcome message
function WelcomeMessage() {
  messageData = {
      "text": "Welcome to AIESEC UK! Just say Hi and our AI assistant will help you.",
   }
  request({
    url: 'https://graph.facebook.com/v2.6/7271269619/thread_settings',
    qs: {access_token:token},
    method: 'POST',
    json: {
      setting_type: 'call_to_actions',
      thread_state: 'new_thread',
      call_to_actions: [{message: messageData}]
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
  console.log('Runnnnning');
}

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
// Get User information
// sender = user
function getInfoUser(sender){
  request({
    url: 'https://graph.facebook.com/v2.6/'+sender+'?access_token='+token+'&fields=first_name,last_name,profile_pic',
    method: 'GET'
  }, function(error, response, body) {
        var parsedBody = JSON.parse(body);
        var first_name = parsedBody.first_name;
        var last_name = parsedBody.last_name;
        var profile_pic = parsedBody.profile_pic;
        sendTextMessage(sender,"Hello "+first_name+"! Thank you for getting in touch with AIESEC UK. I'm an automated assistant created to guide you in this leadership journey. How can I be useful today? BTW You look awesome in your profile picture!")
        sendInputImageMessage(sender,profile_pic);
        //console.log(sender);
  })
}

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

// sendTextWithImagesMessage function
function sendInputImageMessage(sender,imgurl) {
  var theimage = imgurl;
  messageData = {
    "attachment": {
      "type": "image",
      "payload": {
        "url": theimage
      }
     }
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


// sendTextWithImagesMessage function
function sendImageMessage(sender) {
  messageData = {
    "attachment": {
      "type": "image",
      "payload": {
        "url": "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/732px-Real_Madrid_CF.svg.png"
      }
     }
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

// Function to send button messages
function sendButtonsMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload":{
        "template_type": "button",
        "text": "Where would you like to volunteer this summer?",
        "buttons":[
        {
          "type": "web_url",
          "title": "Egypt",
          "url": "http://www.egyptwhereitallbegins.com"
        },
        {
          "type": "web_url",
          "title": "Brazil",
          "url": "http://impactbrazil.org/"
        },
        {
          "type": "web_url",
          "title": "India",
          "url": "http://discover.aiesec.in/"
        }
      ]
      }
    }
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

// sendReceiptMessage function
function sendReceiptMessage(sender, time) {
  var order = time;
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "receipt",
        "recipient_name": "Felipe Morales",
        "order_number": '1'+order,
        "currency": "GBP",
        "payment_method": "Visa 4447",
        "elements": {
          "title": "Global Volunteer - Brazil",
          "subtitle": "X4Change - Fortaleza",
          "quantity": 1,
          "price": 350,
          "currency": "GBP",
          "image_url": "http://www.getmetravelled.com/wp-content/uploads/2015/07/best-places-of-fortaleza.jpg",
          },
         "address":{
           "street_1": "17 Woolridge way",
           "street_2": "Loddiges road",
           "city": "London",
           "state": "London",
           "postal_code": "E9 6PP",
           "country": "UK"
         },
         "summary":{
           "subtotal":350,
           "total_tax":0,
           "total_cost":350
         }
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

// Posting function
app.post('/webhook', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    recipient = event.recipient.id;
    time = req.body.entry[0].time;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      console.log(text)
      if (text === 'Generic') {
        sendGenericMessage(sender);
        continue;
      }
     if (text === 'Receipt') {
        console.log('Timestamp:'+time);
        sendReceiptMessage(sender,time);
        continue;
      }
     if (text === 'Images') {
         sendImageMessage(sender);
         continue;
      }
     if (text === 'Options') {
         sendButtonsMessage(sender);
         continue;
     }
      if (event.postback) {
        text = JSON.stringify(event.postback);
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
        continue;
      }
      getInfoUser(sender);
      //Erase the comment lines to set the WelcomeMessage
      //WelcomeMessage();
      //console.log('Recipient: '+recipient)
      //sendTextMessage(sender,"I'm a parrot! ECHO!: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});
