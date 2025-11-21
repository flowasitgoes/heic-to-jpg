const fs = require('fs-extra');
const path = require('path');
const convert = require('heic-convert');

async function convertHeicToJpg(inputDir, outputDir) {
  try {
    // 確保輸出資料夾存在
    await fs.ensureDir(outputDir);

    // 讀取輸入資料夾中的所有檔案
    const files = await fs.readdir(inputDir);

    // 過濾出 .heic 和 .HEIC 檔案
    const heicFiles = files.filter(file => 
      file.toLowerCase().endsWith('.heic')
    );

    if (heicFiles.length === 0) {
      console.log('沒有找到 HEIC 檔案！');
      return;
    }

    console.log(`找到 ${heicFiles.length} 個 HEIC 檔案，開始轉換...\n`);

    // 轉換每個檔案
    for (const file of heicFiles) {
      const inputPath = path.join(inputDir, file);
      const outputFileName = path.basename(file, path.extname(file)) + '.jpg';
      const outputPath = path.join(outputDir, outputFileName);

      try {
        console.log(`正在轉換: ${file} -> ${outputFileName}`);

        // 讀取 HEIC 檔案
        const inputBuffer = await fs.readFile(inputPath);

        // 轉換為 JPG
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.92
        });

        // 寫入輸出檔案
        await fs.writeFile(outputPath, outputBuffer);

        console.log(`✓ 完成: ${outputFileName}\n`);
      } catch (error) {
        console.error(`✗ 轉換失敗 ${file}:`, error.message);
      }
    }

    console.log('所有轉換完成！');
  } catch (error) {
    console.error('發生錯誤:', error);
  }
}

// 主程式
const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

convertHeicToJpg(inputDir, outputDir);

