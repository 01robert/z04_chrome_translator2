// 创建一个 48x48 的图标
const size = 48;
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

// 绘制圆角矩形背景
ctx.fillStyle = '#4285f4';
ctx.beginPath();
ctx.roundRect(0, 0, size, size, 8);
ctx.fill();

// 绘制翻译图标
ctx.strokeStyle = 'white';
ctx.lineWidth = 3;
ctx.lineCap = 'round';

// 绘制 "T" 字母
ctx.fillStyle = 'white';
ctx.font = 'bold 28px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('译', size/2, size/2);

// 将图标转换为 Base64
const iconData = canvas.toDataURL('image/png'); 