import XLSX from 'xlsx';
import * as fs from 'fs';

import Log from '../utils/logger.ts';

const logger = new Log({ path: './logs' });

const filePath = 'D:/mo7-project/xxn-project/数据汇总回传2025.8.26-mo7.xlsx';

handleExcel(filePath);

function handleExcel(filePath: string): void {
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    logger.error(`错误：文件不存在 - ${filePath}`);
    return;
  }

  logger.info(`正在读取Excel文件：${filePath}`);

  // 读取Excel文件
  const workbook = XLSX.readFile(filePath);

  // 获取工作表名称列表
  const sheetNames = workbook.SheetNames;

  logger.info(`\n文件包含 ${sheetNames.length} 个工作表：`);

  // 遍历每个工作表
  sheetNames.forEach((sheetName, index) => {
    logger.info(`\n--- 工作表 ${index + 1}: ${sheetName} ---`);

    // 获取当前工作表
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表转换为JSON格式
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      logger.info('该工作表为空');
      return;
    }

    // 获取字段名称（第一行数据的键）
    const headers = Object.keys(jsonData[0]);
    headers.forEach((header, i) => {
      logger.info(`${i + 1}. ${header}`);
    });

    logger.info('\n数据内容：');
    // 遍历并打印数据内容
    let key = '';
    let insertKey = '';

    jsonData.forEach((row, rowIndex) => {
      logger.info(`行:${rowIndex + 1}:`);
      let result = '';
      headers.forEach((header) => {
        const val = row[header];

        if (val == '沟通情况') {
          key = header;
        } else if (header == key && val) {
          logger.info(`===发送请求:${val}`);
          result = `AI分析结果:${val}`;
        }

        if (val == '意向类型') {
          insertKey = header;
        } else if (header == insertKey && result) {
          logger.info(`---插入AI分析-header:${header}-index:${rowIndex}-result:${result}`);
          // 在对应行插入AI分析结果
          jsonData[rowIndex][header] = result;
        }
      });
    });

    logger.info(`\n该工作表共有 ${jsonData.length} 行数据`);
  });
}
