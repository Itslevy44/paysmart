const fs = require('fs');

const logPath = 'build_log_4.txt';

try {
    const data = fs.readFileSync(logPath, 'utf8');
    const lines = data.split('\n');
    let errorLines = [];
    let capturing = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('Error:') || line.includes('failed to resolve')) {
            capturing = true;
            errorLines = [line]; // Start fresh on new error
        } else if (capturing) {
            errorLines.push(line);
            if (errorLines.length > 20) { // limiting context
                capturing = false;
            }
        }
    }

    if (errorLines.length > 0) {
        console.log("LAST ERROR FOUND:");
        console.log(errorLines.join('\n'));
    } else {
        console.log("NO ERROR FOUND via simple search. Dumping last 20 lines:");
        console.log(lines.slice(-20).join('\n'));
    }

} catch (err) {
    console.error("Error reading log:", err);
}
