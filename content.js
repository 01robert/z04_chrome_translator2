let isTranslationBoxVisible = false;
let translationTimer = null;

// 创建翻译框
function createTranslationBox() {
  const box = document.createElement('div');
  box.className = 'translation-box';
  box.innerHTML = `
    <div class="translation-content">
      <div class="source-text" contenteditable="true" placeholder="输入或粘贴要翻译的文本"></div>
      <div class="translated-text"></div>
    </div>
  `;

  // 监听输入事件
  const sourceText = box.querySelector('.source-text');
  sourceText.addEventListener('input', handleInputChange);
  
  document.body.appendChild(box);
  return box;
}

// 处理输入变化
function handleInputChange(event) {
  const text = event.target.textContent.trim();
  
  // 清除之前的定时器
  if (translationTimer) {
    clearTimeout(translationTimer);
  }
  
  // 如果有文本，设置新的定时器
  if (text) {
    const translatedTextElement = event.target.parentElement.querySelector('.translated-text');
    translatedTextElement.classList.add('loading');
    
    translationTimer = setTimeout(async () => {
      try {
        const translatedText = await translateText(text);
        translatedTextElement.textContent = translatedText;
      } finally {
        translatedTextElement.classList.remove('loading');
      }
    }, 500);
  } else {
    event.target.parentElement.querySelector('.translated-text').textContent = '';
  }
}

// 处理选中文本变化
function handleSelectionChange() {
  if (!isTranslationBoxVisible) return;
  
  const box = document.querySelector('.translation-box');
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    // 更新源文本
    box.querySelector('.source-text').textContent = selectedText;
    // 触发输入事件来启动翻译
    box.querySelector('.source-text').dispatchEvent(new Event('input'));
  }
}

// 检测文本语言
function detectLanguage(text) {
  // 简单的语言检测：如果包含中文字符则认为是中文
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

// 翻译函数
async function translateText(text) {
  // 检测源语言
  const sourceLanguage = detectLanguage(text);
  const targetLanguage = sourceLanguage === 'zh' ? 'en' : 'zh';
  
  try {
  const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
  );
  const data = await response.json();
    
    if (data.responseStatus === 200) {
  return data.responseData.translatedText;
    } else {
      throw new Error('翻译失败');
    }
  } catch (error) {
    return `翻译出错: ${error.message}`;
  }
}

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'toggleTranslation') {
    const box = document.querySelector('.translation-box') || createTranslationBox();
    
    if (!isTranslationBoxVisible) {
      // 开启翻译
      isTranslationBoxVisible = true;
      box.style.display = 'block';
      
      // 添加选中文本变化监听
      document.addEventListener('selectionchange', handleSelectionChange);
      
      // 立即处理当前选中的文本
      handleSelectionChange();
    } else {
      // 关闭翻译
      isTranslationBoxVisible = false;
      box.style.display = 'none';
      
      // 移除选中文本变化监听
      document.removeEventListener('selectionchange', handleSelectionChange);
      
      // 清除定时器
      if (translationTimer) {
        clearTimeout(translationTimer);
        translationTimer = null;
      }
    }
  }
}); 