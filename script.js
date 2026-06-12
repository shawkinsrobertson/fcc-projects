const drumPad = document.querySelectorAll(".drum-pad");
const display = document.getElementById("display");
const audioClip = document.querySelectorAll(".clip");

const padTitles = [
  {
    id: "Q",
    name:"Heater 1"
  },
  {
    id: "W",
    name:"Heater 2"
  },
  {
    id: "E",
    name:"Heater 3"
  },
  {
    id: "A",
    name:"Heater 4"
  },
  {
    id: "S",
    name:"Clap"
  },
  {
    id: "D",
    name:"Open-HH"
  },
  {
    id: "Z",
    name:"Kick-n'-Hat"
  },
  {
    id: "X",
    name:"Kick"
  },
  {
    id: "C",
    name:"Closed-HH"
  }
]

const playSound = (id) => {
  const soundSrc = Array.from(audioClip).find(audio => audio.id === id);
  soundSrc.play();
};

const findSoundName = (id) => {
  const pad = padTitles.find(pad => pad.id === id);

  return pad.name;
};

const connectKeydown = (key) => {
  
  const pad = Array.from(drumPad).find(pad => pad.id == key.toUpperCase());
  playSound(pad.id);
  display.innerText = findSoundName(pad.id);
}


drumPad.forEach(pad => 
pad.addEventListener("click", (event) => {
  playSound(event.target.id); display.innerText = findSoundName(event.target.id)}));

document.addEventListener("keydown", (event) => {connectKeydown(event.key)});
