const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => pixelize(img);
  img.src = URL.createObjectURL(file);
});

function pixelize(img, pixelSize = 10) {
  canvas.width = img.width;
  canvas.height = img.height;

  // Resize small
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = Math.floor(img.width / pixelSize);
  tempCanvas.height = Math.floor(img.height / pixelSize);

  tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

  // Stretch pixel
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    tempCanvas,
    0, 0, tempCanvas.width, tempCanvas.height,
    0, 0, canvas.width, canvas.height
  );
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixelized.png";
  link.href = canvas.toDataURL();
  link.click();
});
