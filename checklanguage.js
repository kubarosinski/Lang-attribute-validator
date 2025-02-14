import axios from 'axios';
import * as cheerio from 'cheerio';
import XLSX from 'xlsx'; 

function loadUrlsFromExcel(filePath) {
    const workbook = XLSX.readFile(filePath); 
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const urls = [];

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
            urls.push(cell.v);
        }
    }

    return urls;
}

const filePath = 'please provide a correct file path'; 
const urls = loadUrlsFromExcel(filePath);

async function checkLanguage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const htmlLang = $('html').attr('lang');
        if (htmlLang) {
            console.log(`Lang attribute for URL ${url}: ${htmlLang}`);
        } else {
            console.log(`There is no lang attribute for URL ${url}`);
        }
    } catch (error) {
        console.error(`Error while processing URL ${url}:`, error.message);
    }
}

urls.forEach(url => {
    checkLanguage(url);
});