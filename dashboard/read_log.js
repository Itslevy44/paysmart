const fs = require('fs');
try {
    const content = fs.readFileSync('build_log.txt', 'utf16le'); // Try utf16le first
    console.log(content);
} catch (e) {
    try {
        const content = fs.readFileSync('build_log.txt', 'utf8');
        console.log(content);
    } catch (e2) {
        console.error("Failed to read file");
    }
}
