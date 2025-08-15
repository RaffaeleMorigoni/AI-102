/*
 * Helper script to generate an import_report.json and summary.csv from a directory
 * containing exam questions. The directory should contain subfolders per chapter,
 * each with PNG/JPG files and optional metadata JSON files.
 *
 * Usage:
 *   node scripts/generateImportReport.js [sourceDir]
 *
 * Example:
 *   node scripts/generateImportReport.js public/questions/AI-102
 */
const fs = require('fs');
const path = require('path');

function generate(sourceDir) {
  const chapters = [];
  const questions = [];
  const absSource = path.resolve(sourceDir);
  const chapterDirs = fs
    .readdirSync(absSource)
    .filter((name) => fs.statSync(path.join(absSource, name)).isDirectory());
  chapterDirs.forEach((chapterId) => {
    chapters.push({ id: chapterId, name: chapterId, progress: 0 });
    const chapterPath = path.join(absSource, chapterId);
    const files = fs.readdirSync(chapterPath);
    files.forEach((file) => {
      if (/\.(png|jpe?g)$/i.test(file)) {
        const id = file.substring(0, file.lastIndexOf('.'));
        const image = `/questions/${chapterId}/${file}`;
        const metaPath = path.join(chapterPath, `${id}.json`);
        let meta = {};
        if (fs.existsSync(metaPath)) {
          try {
            meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
          } catch (err) {
            console.warn(`Errore di parsing per ${metaPath}:`, err);
          }
        }
        const question = {
          id,
          chapterId,
          type: meta.type || 'unknown',
          image,
          answers: meta.answers,
          correct: meta.correct,
          explanation: meta.explanation,
          dragTargets: meta.dragTargets,
          dragSources: meta.dragSources,
        };
        questions.push(question);
      }
    });
  });
  // Write report
  const report = { chapters, questions };
  const outputPath = path.join(absSource, 'import_report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  // Write summary CSV
  const summaryLines = [
    'chapterId,id,type,image,hasMetadata,answersCount,correctCount',
  ];
  questions.forEach((q) => {
    summaryLines.push([
      q.chapterId,
      q.id,
      q.type,
      q.image,
      q.answers ? 'yes' : 'no',
      q.answers ? q.answers.length : 0,
      q.correct ? q.correct.length : 0,
    ].join(','));
  });
  fs.writeFileSync(path.join(absSource, 'summary.csv'), summaryLines.join('\n'));
  console.log(`Creati import_report.json e summary.csv in ${absSource}`);
}

const sourceDir = process.argv[2] || 'public/questions';
generate(sourceDir);