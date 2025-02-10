// Variables para botones
let button, stop, frictionButton, simular = false, frictionEnabled = true;

// Variables de constantes para el sistema
let masa, longitudCuerda, radioDisco, angulo;
let sliderMasa, sliderL, sliderAngulo;
let inputMasa, inputL, inputAngulo;

// Variables de cambio (sliders)
let valorMasa, valorAngulo, valorLongitudC;

let widthX = 1293, heightY = 580;
let positionSliderX = 850;
let positionTextX = positionSliderX - 250;

// Variables del péndulo
let angle, bob, len, origin, mass, angleV = 0, angleA = 0;
let gravity = 0.4, damping = 0.99;
let velocityData = [];
let time = 0;

function setup() {
  createCanvas(widthX, heightY);
  controles();
  barrasControl();
  angleMode(RADIANS);

  // Péndulo
  origin = createVector(widthX / 3, 100);
  len = 300;
  angle = PI / 6;
  bob = createVector();
  mass = 15;
}

function draw() {
  background(10, 139, 39);
  mostrarInformacion();
  obtenerValores();
  simularCaso();
  dibujarGrafico();
}

function controles() {
  button = createButton("Iniciar/Pausar");
  button.position(widthX - 300, 500);
  button.mousePressed(() => simular = !simular);

  stop = createButton("Reiniciar");
  stop.position(widthX - 200, 500);
  stop.mousePressed(() => {
    simular = false;
    angle = sliderAngulo.value();
    angleV = 0;
    velocityData = [];
    time = 0;
  });

  frictionButton = createButton("Activar/Desactivar Fricción");
  frictionButton.position(widthX - 800, 600);
  frictionButton.mousePressed(() => frictionEnabled = !frictionEnabled);
}

function barrasControl() {
  sliderMasa = createSlider(2, 50, 15, 1);
  sliderMasa.position(positionSliderX, 170);
  inputMasa = createInput(sliderMasa.value());
  inputMasa.position(positionSliderX + 180, 170);
  inputMasa.size(50);

  sliderL = createSlider(100, 400, 300, 1);
  sliderL.position(positionSliderX, 250);
  inputL = createInput(sliderL.value());
  inputL.position(positionSliderX + 180, 250);
  inputL.size(50);

  sliderAngulo = createSlider(-PI / 4, PI / 4, PI / 6, 0.01);
  sliderAngulo.position(positionSliderX, 320);
  inputAngulo = createInput((sliderAngulo.value() * 180 / PI).toFixed(2));
  inputAngulo.position(positionSliderX + 180, 320);
  inputAngulo.size(50);
}

function mostrarInformacion() {
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text(`Masa (kg):`, positionTextX, 100);
  text(`Longitud Cuerda (cm):`, positionTextX, 180);
  text(`Ángulo (°):`, positionTextX, 255);
}

function obtenerValores() {
  valorMasa = sliderMasa.value();
  inputMasa.value(valorMasa);
  valorLongitudC = sliderL.value();
  inputL.value(valorLongitudC);
  valorAngulo = sliderAngulo.value();
  inputAngulo.value((valorAngulo * 180 / PI).toFixed(2));
}

function simularCaso() {
  stroke(5);
  strokeWeight(4);
  line(origin.x, origin.y, bob.x, bob.y);
  fill(54, 25, 117);
  circle(bob.x, bob.y, 30+valorMasa*2);

  if (simular) {
    let force = (-1 * valorMasa * gravity * sin(angle)) / valorLongitudC;
    angleA = force;
    angleV += angleA;
    if (frictionEnabled) {
      angleV *= damping;
    }
    angle += angleV;

    velocityData.push({ time: time, velocity: angleV });
    time += 1;
  }

  bob.x = valorLongitudC * sin(angle) + origin.x;
  bob.y = valorLongitudC * cos(angle) + origin.y;

  fill(255);
  textSize(20);
  textAlign(LEFT);
  text(`Velocidad Angular (rad/s): ${angleV.toFixed(4)}`, 50, 400);
  text(`Aceleración Angular (rad/s²): ${angleA.toFixed(4)}`, 50, 450);
}

function dibujarGrafico() {
  push();
  translate(750, 400);
  stroke(2);
  line(0, 50, 200, 50);
  line(0, 0, 0, 100);
  fill(255);
  textSize(12);
  text("Velocidad Angular", -30, -10);
  text("Tiempo", 180, 70);
  stroke(255, 0, 0);
  noFill();
  beginShape();
  for (let i = 0; i < velocityData.length; i++) {
    let x = map(velocityData[i].time, 0, velocityData.length, 0, 200);
    let y = map(velocityData[i].velocity, -1, 1, 100, 0);
    vertex(x, y);
  }
  endShape();
  pop();
}
