document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('upload');
  const originalImg = document.getElementById('originalImg');
  const canvas = document.getElementById('canvas');
  const downloadBtn = document.getElementById('downloadBtn');
  const detailInput = document.getElementById('detailLevel');
  const ctx = canvas.getContext('2d');
  
  // Màu sắc mới (trắng sáng và xám đậm)
  const lightColor = [245, 245, 245];  // Trắng sáng
  const darkColor = [80, 80, 80];     // Xám đậm
  let detailLevel = 5;

  uploadInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        originalImg.src = event.target.result;
        
        originalImg.onload = function() {
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;
          applyPixelEffect();
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  function applyPixelEffect() {
    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Tính pixelSize dựa trên detailLevel
    const pixelSize = Math.max(1, Math.floor(12 - detailLevel));

    // Chuyển đổi màu
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
      const [r, g, b] = gray > 150 ? lightColor : darkColor; // Ngưỡng điều chỉnh thành 150
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
    }

    // Áp dụng hiệu ứng pixel
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        const centerX = Math.min(x + Math.floor(pixelSize/2), canvas.width-1);
        const centerY = Math.min(y + Math.floor(pixelSize/2), canvas.height-1);
        const pos = (centerY * canvas.width + centerX) * 4;

        for (let py = y; py < y+pixelSize && py < canvas.height; py++) {
          for (let px = x; px < x+pixelSize && px < canvas.width; px++) {
            const blockPos = (py * canvas.width + px) * 4;
            data[blockPos] = data[pos];
            data[blockPos+1] = data[pos+1];
            data[blockPos+2] = data[pos+2];
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  detailInput.addEventListener('input', function() {
    detailLevel = parseInt(this.value);
    if (originalImg.src) {
      applyPixelEffect();
    }
  });

  downloadBtn.addEventListener('click', function() {
    if (canvas.width > 0) {
      const link = document.createElement('a');
      link.download = 'pixel-art.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  });
});