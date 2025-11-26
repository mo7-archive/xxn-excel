// 正确的ES模块导入方式
import XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'path/to/excel/数据.xlsx';

function handleExcel(filePath: string): void {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error(`错误：文件不存在 - ${filePath}`);
      return;
    }

    console.log(`正在读取Excel文件：${filePath}`);

    // 读取Excel文件
    const workbook = XLSX.readFile(filePath);

    // 获取工作表名称列表
    const sheetNames = workbook.SheetNames;

    console.log(`\n文件包含 ${sheetNames.length} 个工作表：`);

    // 遍历每个工作表
    sheetNames.forEach((sheetName, index) => {
      console.log(`\n--- 工作表 ${index + 1}: ${sheetName} ---`);

      // 获取当前工作表
      const worksheet = workbook.Sheets[sheetName];

      // 将工作表转换为JSON格式
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        console.log('该工作表为空');
        return;
      }

      // 获取字段名称（第一行数据的键）
      const headers = Object.keys(jsonData[0]);
      console.log('字段名称：');
      headers.forEach((header, i) => {
        console.log(`${i + 1}. ${header}`);
      });

      console.log('\n数据内容：');
      // 遍历并打印数据内容
      jsonData.forEach((row, rowIndex) => {
        console.log(`\n行 ${rowIndex + 1}:`);
        headers.forEach((header) => {
          console.log(`  ${header}: ${row[header]}`);
        });
      });

      console.log(`\n该工作表共有 ${jsonData.length} 行数据`);
    });
  } catch (error) {
    console.error('处理Excel文件时发生错误：', error);
  }
}
