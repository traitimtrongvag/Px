const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const originalImg = document.getElementById("originalImg");
const downloadBtn = document.getElementById("downloadBtn");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    originalImg.src = img.src;
    pixelizeToBlackAndWhite(img);
  };
  img.src = URL.createObjectURL(file);
});

function pixelizeToBlackAndWhite(img, pixelSize = 10) {
  canvas.width = img.width;
  canvas.height = img.height;

  // Resize nhỏ tạm
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  const smallW = Math.floor(img.width / pixelSize);
  const smallH = Math.floor(img.height / pixelSize);

  tempCanvas.width = smallW;
  tempCanvas.height = smallH;

  tempCtx.drawImage(img, 0, 0, smallW, smallH);

  // Chuyển từng pixel thành trắng/đen
  const imgData = tempCtx.getImageData(0, 0, smallW, smallH);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    const bw = gray > 128 ? 255 : 0;
    data[i] = data[i+1] = data[i+2] = bw;
  }
  tempCtx.putImageData(imgData, 0, 0);

  // Phóng to để thành pixel trắng đen
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, canvas.width, canvas.height);
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixelized_bw.png";
  link.href = canvas.toDataURL();
  link.click();
});
