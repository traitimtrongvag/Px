document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('upload');
  const originalImg = document.getElementById('originalImg');
  const canvas = document.getElementById('canvas');
  const downloadBtn = document.getElementById('downloadBtn');
  const ctx = canvas.getContext('2d');

  // Khi người dùng chọn ảnh
  uploadInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        originalImg.src = event.target.result;
        
        originalImg.onload = function() {
          // Thiết lập kích thước canvas bằng với ảnh gốc
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;
          
          // Vẽ ảnh gốc lên canvas
          ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
          
          // Xử lý pixel hóa ảnh
          pixelateImage();
        };
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Hàm pixel hóa ảnh đen trắng
  function pixelateImage() {
    const pixelSize = 10; // Kích thước mỗi pixel (có thể điều chỉnh)
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        // Lấy vị trí pixel trung tâm của khối
        const centerX = Math.min(x + Math.floor(pixelSize/2), canvas.width - 1);
        const centerY = Math.min(y + Math.floor(pixelSize/2), canvas.height - 1);
        
        // Tính vị trí trong mảng dữ liệu
        const pos = (centerY * canvas.width + centerX) * 4;
        
        // Chuyển sang màu xám (đen trắng)
        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Áp dụng màu xám cho cả khối pixel
        for (let py = y; py < y + pixelSize && py < canvas.height; py++) {
          for (let px = x; px < x + pixelSize && px < canvas.width; px++) {
            const blockPos = (py * canvas.width + px) * 4;
            data[blockPos] = gray;     // R
            data[blockPos + 1] = gray; // G
            data[blockPos + 2] = gray; // B
            // Alpha giữ nguyên
          }
        }
      }
    }
    
    // Đưa dữ liệu đã xử lý trở lại canvas
    ctx.putImageData(imgData, 0, 0);
  }

  // Nút tải ảnh
  downloadBtn.addEventListener('click', function() {
    if (canvas.width > 0) {
      const link = document.createElement('a');
      link.download = 'pixel-art.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      alert('Vui lòng tải lên ảnh trước!');
    }
  });
});
