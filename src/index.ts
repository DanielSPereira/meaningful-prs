import * as fs from 'fs';
import * as path from 'path';
import kleur from 'kleur';
import { analyzeCV } from './analyzeCv.ts';

async function main() {
  const cvDir = path.join(process.cwd(), 'cv');
  const cv = fs.readdirSync(cvDir)[0];
  const validPdf = cv?.endsWith('.pdf')
  
  if (!validPdf) throw Error('No Curriculum found!');
  
  console.log(kleur.cyan('📄 Analyzing:'), kleur.white(cv));
  
  const result = await analyzeCV(`${cvDir}/${cv}`);
  
  console.log(kleur.green(`\n📊 Score:`), kleur.white(`${result.score}/10`));
  console.log(kleur.yellow('\n💡 Feedback:'));
  console.log(kleur.white(`   ${result.feedback}`));
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
});
