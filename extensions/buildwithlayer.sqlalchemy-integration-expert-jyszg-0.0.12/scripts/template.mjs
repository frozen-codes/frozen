/**
 * README!!!
 * 
 * This script is used to fill in template files with environment variables and move the contents to target files.
 * 
 * To run this script, execute the following command:
 * CODEWL_ENV_VAR1=VALUE1 CODEWL_ENV_VAR2=VALUE2 node scripts/template.mjs
 * 
 * or provide the environment variables in a .env file and run the script:
 * node scripts/template.mjs
 * 
 * WARNING: sometimes some of the CODEWL variables are set in your local terminal.  
 * This will cause the templating script to fail.  To fix run `unset CODEWL_ENV_VAR1` for each variable that is set.
 */
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { regex } from './pattenToMatch.mjs';

const isVerbose = process.argv.includes('--verbose');

// ---------- Validation Tests ----------
// Test if .env exists and load it if it does
if (fs.existsSync('./.env')) {
    config({ path: './.env' });
    fs.readFileSync('./.env', 'utf8').match(/^[A-Za-z0-9_]+/gm).forEach((envName) => {
        process.env[envName] = btoa(process.env[envName] || '');
    });
}

// Throw an error if no ENV variables are prefixed with CODEWL_
if (!Object.keys(process.env).some((key) => key.startsWith('CODEWL_'))) {
    throw new Error('No environment variables found with the prefix CODEWL_');
}

// throw error if CODEWL_ variables are not all uppercase
if (!Object.keys(process.env).every((key) => !key.startsWith('CODEWL_') || key === key.toUpperCase())) {
    throw new Error('Not all CODEWL_ environment variables are uppercase');
}

const directory = './';
const templateDirectory = './templates';
const templateFiles = fs.readdirSync(templateDirectory).map((file) => ({
    filePath: path.join(templateDirectory, file),
    variables: []
}));
const templateFileNames = templateFiles.map((file) => path.basename(file.filePath.replace('.temp', '')));
const ignore = ['node_modules', 'scripts', '.git', '.vscode', 'templates', '.github'];

/**
 * Creates a file map object that maps template file names to their corresponding file paths.
 *
 * @param {string} directory - The directory to search for template files.
 * @param {string[]} [ignore=[]] - An optional array of file or directory names to ignore during the search.
 * @param {boolean} [verbose=false] - An optional flag to enable verbose logging during the search.
 * @returns {Object} - The file map object with template file names as keys and their corresponding file paths as values.
 *      Example: { 'extension.temp.ts': 'src/extension.ts' }
 * 
 * Notes:
 * Script does not support matching template to multiple files of the same name:
 *      Example: extension.ts.temp -> extension.ts && extension.ts.temp -> src/extension.ts will not work
 */
const createFileMap = (directory, ignore = [], verbose = isVerbose) => {
    const fileMap = {};

    const populateFileMap = (directory, ignore = [], verbose = isVerbose) => {
        const files = fs.readdirSync(directory);
        const filesToSearch = [];

        files.forEach((file) => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (verbose) {
                console.log(`Looking at file: ${filePath}`);
            }

            if (stats.isDirectory() && !ignore.includes(file)) {
                filesToSearch.push(...populateFileMap(filePath, ignore));
            } else if (stats.isFile() && !ignore.includes(file) && templateFileNames.includes(path.basename(filePath))) {
                const filetemp = file.replace(path.extname(file), '.temp' + path.extname(file));
                fileMap[filetemp] = filePath;
            }
        });

        return filesToSearch;
    };

    populateFileMap(directory, ignore, verbose);

    return fileMap;
};

const templateFileMap = createFileMap(directory, ignore, false);



/**
 * Replaces placeholders in template files with corresponding environment variables and moves the contents to target files.
 * @param {Object} templateFiles - An object containing template file paths as keys and target file paths as values.
 * @param {boolean} [verbose=false] - A flag indicating whether to log verbose output.
 * @throws {Error} If an environment variable is not found in the env file.
 */
const moveTemplateContents = (templateFiles, verbose = isVerbose) => {
    Object.entries(templateFiles).forEach(([templateFile, targetFile]) => {
        let templateContent = fs.readFileSync(path.join("./templates", templateFile), 'utf8');
        const matches = templateContent.match(regex);
        if (matches) {
            matches.forEach((match) => {
                const envVar = process.env[match.slice(1)];
                const envVariableDecoded = Buffer.from(envVar, 'base64').toString('utf8');
                if (envVariableDecoded || envVariableDecoded === "") {
                    templateContent = templateContent.replace(match, envVariableDecoded);

                    if (verbose) {
                        console.log(`Variable ${match} filled in file ${targetFile}: ${envVariableDecoded} of type ${typeof envVariableDecoded}`);
                    }
                } else {
                    console.log(`\nEnvironment variable **${match.slice(1)}** not found in env file.\n`);
                    throw new Error(`There was likely a mismatch in enviorment variables in .env and the true required variables. Run template.mjs locally to see mismatch.`);
                }
            });
        }
        fs.writeFileSync(targetFile, templateContent, 'utf8');

    });
};

moveTemplateContents(templateFileMap);