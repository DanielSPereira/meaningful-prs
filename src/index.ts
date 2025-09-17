import * as fs from 'fs';
import * as path from 'path';
import { analyzeCV } from './analyzeCv.ts';

async function main() {
  const cvDir = path.join(process.cwd(), 'cv');
  const cv = fs.readdirSync(cvDir)[0];
  const validPdf = cv?.endsWith('.pdf')
  
  if (!validPdf) throw Error('No Curriculum found!');
  
  console.log(`Analyzing: ${cv}`);
  
  const result = await analyzeCV(`${cvDir}/${cv}`);
  
  console.log(`\nScore: ${result.score}/10`);
  console.log('\nFeedback:');
  console.log(result.feedback);
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
});
