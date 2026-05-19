import fs from 'fs/promises';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Extract text from uploaded files based on their type.
 * Supports PDF, DOCX, and TXT files.
 */

/**
 * Extract text from a PDF file.
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} Extracted text
 */
// export const extractFromPDF = async (filePath) => {
//   try {
//     const data = await fs.readFile(filePath);
//     const uint8Array = new Uint8Array(data);
//     console.log("1 ")
//     const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
//     console.log("2")
//     const pdf = await loadingTask.promise;
//     console.log("3")

//     let text = '';

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       const strings = content.items.map(item => item.str);
//       text += strings.join(' ') + '\n';
//     }
//     console.log("4",text)
//     return text.trim();
//   } catch (err) {
//     console.error("PDFJS ERROR:", err);
//     return '';
//   }
// };

export const extractFromPDF = async (filePath) => {
  // pdf-parse needs a dynamic import because it uses require internally
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);

    return data.text?.trim() || '';
  } catch (error) {
    console.error("PDF extraction failed:", error);
    return '';
  }
  // const pdfParse = (await import('pdf-parse')).default;
  // const buffer = await fs.readFile(filePath);
  // const data = await pdfParse(buffer);
  // return data.text || '';
};

/**
 * Extract text from a DOCX file.
 * @param {string} filePath - Absolute path to the DOCX file
 * @returns {Promise<string>} Extracted text
 */
export const extractFromDOCX = async (filePath) => {
  const mammoth = await import('mammoth');
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
};

/**
 * Extract text from a TXT file.
 * @param {string} filePath - Absolute path to the TXT file
 * @returns {Promise<string>} File contents
 */
export const extractFromTXT = async (filePath) => {
  return fs.readFile(filePath, 'utf-8');
};

/**
 * Extract text from an image file using OCR (Tesseract.js).
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} Extracted text
 */
export const extractFromImage = async (filePath) => {
  const Tesseract = (await import('tesseract.js')).default;
  const result = await Tesseract.recognize(filePath, 'eng');
  return result.data.text || '';
};

/**
 * Extract text from any supported file type.
 * @param {string} filePath - Path to the file
 * @param {string} fileType - File extension (pdf, docx, txt, png, jpg, jpeg)
 * @returns {Promise<string>} Extracted text
 */
export const extractText = async (filePath, fileType) => {
  const absolutePath = path.resolve(filePath);

  switch (fileType.toLowerCase()) {
    case 'pdf':
      return extractFromPDF(absolutePath);
    case 'docx':
      return extractFromDOCX(absolutePath);
    case 'txt':
      return extractFromTXT(absolutePath);
    case 'png':
    case 'jpg':
    case 'jpeg':
      return extractFromImage(absolutePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};

export default { extractText, extractFromPDF, extractFromDOCX, extractFromTXT, extractFromImage };
