// speak to you
var synth = window.speechSynthesis;
var voices = synth.getVoices();
var utterThis;
// set the default voice to use
for(i = 0; i < voices.length ; i++) {
  if(voices[i].default) {
    var defaultVoice = voices[i].name;
  }
}

// setup speech recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var speechRecognitionList = new SpeechGrammarList();
// list of words that we allow as valid input for this type of gammar
var actions = '#JSGF V1.0; grammar actions; public <action> = go back | go forward | refresh | change the world | yes ;'
speechRecognitionList.addFromString(actions, 1);
// establsh our speach recognition object
var recognition = new SpeechRecognition();
var globalaction = '';
// load in our supported words
recognition.grammars = speechRecognitionList;
// always listen
recognition.continuous = true;
// US
recognition.lang = 'en-US';
// word towards the final solution, this allows for partial matches
recognition.interimResults = true;
// only allow 1 thing as the recognized option
recognition.maxAlternatives = 1;

// if we get input, start to process
recognition.onresult = function(event) {
  // convert response into an action
  var action = event.results[event.results.length-1][0].transcript;
  action = action.trim();
  // make sure we have a final result
  if (event.results[event.results.length-1].isFinal == true) {
    console.log('Action:' + action + ' - Confidence: ' + event.results[event.results.length-1][0].confidence);
    switch (action) {
      case 'go back':
      case 'refresh':
      case 'go forward':
      case 'change the world':
        // for supported actions, confirm they want to do this
        talkToMe('Are you sure you want to' + action + '?');
        // set global action for confirmation
        globalaction = action;
      break;
      case 'yes':
        // ensure we have confirmation or swear at them
        if (globalaction == '') {
          talkToMe('Look, I enjoy our little chats but you really need to tell me what you want to do first.');
        }
        else {
          switch (globalaction) {
            case 'go back':
              window.history.back();
            break;
            case 'refresh':
              location.reload();
            break;
            case 'go forward':
              alert('There\'s no where to go');
            break;
            case 'change the world':
              window.location = 'https://elmsln.org/';
            break;
          }
        }
      break;
      default:
        talkToMe("I'm sorry I didn't catch that.");
        globalaction = '';
      break;
    }
  }
}
// log if nothing matches though I don't think this works
recognition.onnomatch = function(event) {
  console.log('I didnt recognise that action.');
}
// log if we get an error
recognition.onerror = function(event) {
  console.log('Error occurred in recognition: ' + event.error);
}

// talk to me
function talkToMe(text) {
  var utterThis = new SpeechSynthesisUtterance(text);
  utterThis.pitch = 1;
  utterThis.rate = 1;
  // THOU SPEAKITH
  synth.speak(utterThis);
}

// get this party started
function startScript() {
  // start the recognition and get this going
  recognition.start();
  var directions = document.querySelector('.readthis');
  talkToMe(directions.innerText);
}

startScript();