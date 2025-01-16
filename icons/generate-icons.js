// 这是一个用于生成三种尺寸图标的脚本
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function generateIcon(size) {
    canvas.width = size;
    canvas.height = size;
    
    // 背景
    ctx.fillStyle = '#4285f4';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.2);
    ctx.fill();
    
    // 文字
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T', size/2, size/2);
    
    return canvas.toDataURL('image/png');
}

// 生成三种尺寸的图标
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const iconData = generateIcon(size);
    // 将 iconData 保存为对应尺寸的 PNG 文件
}); 