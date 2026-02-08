const models = [
  {
    name: "iPhone 15",
    size: { width: 1179, height: 2556 },
    safeInset: 140,
    camera: { x: 90, y: 120, width: 270, height: 270 },
    description: "6.1\" base model with diagonal camera cutout.",
  },
  {
    name: "iPhone 15 Plus",
    size: { width: 1290, height: 2796 },
    safeInset: 150,
    camera: { x: 100, y: 135, width: 300, height: 300 },
    description: "6.7\" base model with extra vertical canvas.",
  },
  {
    name: "iPhone 15 Pro",
    size: { width: 1179, height: 2556 },
    safeInset: 150,
    camera: { x: 80, y: 100, width: 320, height: 320 },
    description: "6.1\" Pro with triple camera + LiDAR.",
  },
  {
    name: "iPhone 15 Pro Max",
    size: { width: 1290, height: 2796 },
    safeInset: 165,
    camera: { x: 90, y: 120, width: 340, height: 340 },
    description: "6.7\" Pro Max with extended telephoto module.",
  },
];

const canvas = document.getElementById("templateCanvas");
const ctx = canvas.getContext("2d");
const modelSelect = document.getElementById("modelSelect");
const modelHint = document.getElementById("modelHint");
const backgroundColor = document.getElementById("backgroundColor");
const accentColor = document.getElementById("accentColor");
const textInput = document.getElementById("textInput");
const textColor = document.getElementById("textColor");
const textSize = document.getElementById("textSize");
const patternSelect = document.getElementById("patternSelect");
const showGuides = document.getElementById("showGuides");
const showBleed = document.getElementById("showBleed");
const downloadBtn = document.getElementById("downloadBtn");
const canvasSize = document.getElementById("canvasSize");
const safeArea = document.getElementById("safeArea");

const state = {
  modelIndex: 0,
  background: backgroundColor.value,
  accent: accentColor.value,
  text: textInput.value,
  textColor: textColor.value,
  textSize: Number(textSize.value),
  pattern: patternSelect.value,
  showGuides: showGuides.checked,
  showBleed: showBleed.checked,
};

const render = () => {
  const model = models[state.modelIndex];
  canvas.width = model.size.width;
  canvas.height = model.size.height;
  canvasSize.textContent = `${model.size.width} × ${model.size.height}px`;

  const bleed = 40;
  const safe = model.safeInset;
  safeArea.textContent = `${model.size.width - safe * 2} × ${model.size.height - safe * 2}px`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, state.background);
  gradient.addColorStop(1, state.accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPattern(state.pattern, model);

  ctx.fillStyle = state.textColor;
  ctx.font = `600 ${state.textSize}px "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
  ctx.shadowBlur = 12;
  ctx.fillText(state.text.toUpperCase(), canvas.width / 2, canvas.height * 0.72);
  ctx.shadowBlur = 0;

  if (state.showBleed) {
    ctx.strokeStyle = "rgba(248, 250, 252, 0.45)";
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 20]);
    ctx.strokeRect(bleed, bleed, canvas.width - bleed * 2, canvas.height - bleed * 2);
    ctx.setLineDash([]);
  }

  if (state.showGuides) {
    ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
    ctx.lineWidth = 4;
    ctx.strokeRect(safe, safe, canvas.width - safe * 2, canvas.height - safe * 2);

    ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
    ctx.fillRect(model.camera.x, model.camera.y, model.camera.width, model.camera.height);

    ctx.strokeStyle = "rgba(248, 250, 252, 0.9)";
    ctx.lineWidth = 3;
    ctx.strokeRect(model.camera.x, model.camera.y, model.camera.width, model.camera.height);

    ctx.fillStyle = "rgba(248, 250, 252, 0.9)";
    ctx.font = "600 32px \"Inter\", sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Camera Cutout", model.camera.x, model.camera.y + model.camera.height + 40);
  }
};

const drawPattern = (pattern, model) => {
  switch (pattern) {
    case "grid":
      drawGrid();
      break;
    case "rays":
      drawRays(model);
      break;
    case "dots":
      drawDots();
      break;
    default:
      break;
  }
};

const drawGrid = () => {
  ctx.strokeStyle = "rgba(248, 250, 252, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

const drawDots = () => {
  ctx.fillStyle = "rgba(248, 250, 252, 0.12)";
  for (let x = 40; x < canvas.width; x += 80) {
    for (let y = 40; y < canvas.height; y += 80) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawRays = (model) => {
  const centerX = model.size.width / 2;
  const centerY = model.size.height * 0.2;
  ctx.strokeStyle = "rgba(248, 250, 252, 0.12)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i += 1) {
    const angle = (Math.PI * 2 * i) / 40;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * model.size.width,
      centerY + Math.sin(angle) * model.size.height
    );
    ctx.stroke();
  }
};

models.forEach((model, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = model.name;
  modelSelect.appendChild(option);
});

const updateState = (key, value) => {
  state[key] = value;
  if (key === "modelIndex") {
    modelHint.textContent = models[value].description;
  }
  render();
};

modelSelect.addEventListener("change", (event) =>
  updateState("modelIndex", Number(event.target.value))
);
backgroundColor.addEventListener("input", (event) => updateState("background", event.target.value));
accentColor.addEventListener("input", (event) => updateState("accent", event.target.value));
textInput.addEventListener("input", (event) => updateState("text", event.target.value));
textColor.addEventListener("input", (event) => updateState("textColor", event.target.value));
textSize.addEventListener("input", (event) => updateState("textSize", Number(event.target.value)));
patternSelect.addEventListener("change", (event) => updateState("pattern", event.target.value));
showGuides.addEventListener("change", (event) => updateState("showGuides", event.target.checked));
showBleed.addEventListener("change", (event) => updateState("showBleed", event.target.checked));

const downloadPNG = () => {
  const link = document.createElement("a");
  link.download = `${models[state.modelIndex].name.replace(/\s+/g, "-")}-template.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

modelHint.textContent = models[0].description;
modelSelect.value = "0";

render();

window.addEventListener("resize", render);

if (downloadBtn) {
  downloadBtn.addEventListener("click", downloadPNG);
}
