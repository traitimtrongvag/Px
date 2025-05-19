document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('upload');
  const originalImg = document.getElementById('originalImg');
  const canvas = document.getElementById('canvas');
  const downloadBtn = document.getElementById('downloadBtn');
  const ctx = canvas.getContext('2d');
  let pixelSize = 4; // GIẢM pixelSize để tăng độ nét

  uploadInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        originalImg.src = event.target.result;
        
        originalImg.onload = function() {
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;
          applyBlackWhitePixelEffect();
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  function applyBlackWhitePixelEffect() {
    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Thuật toán threshold đen trắng (không có màu xám)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Chỉ giữ lại đen (0) hoặc trắng (255)
      const bw = gray > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = bw;
    }

    // Pixel hóa sau khi đã chuyển đen trắng
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        const centerX = Math.min(x + Math.floor(pixelSize/2), canvas.width - 1);
        const centerY = Math.min(y + Math.floor(pixelSize/2), canvas.height - 1);
        const pos = (centerY * canvas.width + centerX) * 4;
        const bwValue = data[pos];

        for (let py = y; py < y + pixelSize && py < canvas.height; py++) {
          for (let px = x; px < x + pixelSize && px < canvas.width; px++) {
            const blockPos = (py * canvas.width + px) * 4;
            data[blockPos] = data[blockPos + 1] = data[blockPos + 2] = bwValue;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  downloadBtn.addEventListener('click', function() {
    if (canvas.width > 0) {
      const link = document.createElement('a');
      link.download = 'pure-bw-pixel-art.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  
const pixelSizeInput = document.getElementById('pixelSize');
pixelSizeInput.addEventListener('input', function() {
  pixelSize = parseInt(this.value);
  if (originalImg.src) applyBlackWhitePixelEffect();
});
  });
});
