document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('upload');
  const originalImg = document.getElementById('originalImg');
  const canvas = document.getElementById('canvas');
  const downloadBtn = document.getElementById('downloadBtn');
  const ctx = canvas.getContext('2d');
  let pixelSize = 10; // Độ lớn của mỗi pixel (có thể điều chỉnh)

  // Xử lý khi chọn ảnh
  uploadInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(event) {
        originalImg.src = event.target.result;
        
        originalImg.onload = function() {
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;
          applyPixelateEffect();
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Hàm chuyển ảnh thành pixel đen trắng
  function applyPixelateEffect() {
    // Vẽ ảnh gốc lên canvas
    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
    
    // Lấy dữ liệu pixel
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Xử lý từng khối pixel
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        // Lấy màu trung bình của khối
        const avgColor = getAverageGrayColor(x, y, pixelSize, data);
        
        // Tô màu đen trắng cho cả khối
        fillBlock(x, y, pixelSize, avgColor, data);
      }
    }

    // Cập nhật canvas
    ctx.putImageData(imageData, 0, 0);
  }

  // Tính màu xám trung bình của một khối pixel
  function getAverageGrayColor(startX, startY, blockSize, data) {
    let totalR = 0, totalG = 0, totalB = 0, count = 0;

    for (let y = startY; y < startY + blockSize && y < canvas.height; y++) {
      for (let x = startX; x < startX + blockSize && x < canvas.width; x++) {
        const pos = (y * canvas.width + x) * 4;
        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];
        
        // Chuyển sang grayscale (công thức tiêu chuẩn)
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        totalR += gray;
        totalG += gray;
        totalB += gray;
        count++;
      }
    }

    return [
      Math.round(totalR / count),
      Math.round(totalG / count),
      Math.round(totalB / count)
    ];
  }

  // Tô màu đen trắng cho một khối pixel
  function fillBlock(startX, startY, blockSize, color, data) {
    for (let y = startY; y < startY + blockSize && y < canvas.height; y++) {
      for (let x = startX; x < startX + blockSize && x < canvas.width; x++) {
        const pos = (y * canvas.width + x) * 4;
        data[pos] = color[0];     // R
        data[pos + 1] = color[1]; // G
        data[pos + 2] = color[2]; // B
        // Giữ nguyên alpha (data[pos + 3])
      }
    }
  }

  // Tải ảnh
  downloadBtn.addEventListener('click', function() {
    if (canvas.width > 0) {
      const link = document.createElement('a');
      link.download = 'pixel-art-bw.png';
      link.href = canvas.toDataURL();
      link.click();
    } else {
      alert('Vui lòng chọn ảnh trước!');
    }
  });
});
