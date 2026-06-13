import fs from 'fs';
import readline from 'readline';

const transcriptPath = 'C:\\Users\\vinhnn\\.gemini\\antigravity-ide\\brain\\6a434ca4-54af-410a-8cf4-155de4d62749\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

for await (const line of rl) {
  if (line.includes('export_test_run')) {
    const parsed = JSON.parse(line);
    console.log(JSON.stringify(parsed, null, 2));
  }
}
