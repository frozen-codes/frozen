import {exec} from 'child_process';

exec('git archive --format=zip --output ./vscode-activity-bar-template.zip HEAD', (error, stdout, stderr) => {
    if (stdout.length > 0) {
        console.log(stdout);
    }
    if (stderr.length > 0) {
        console.log(stderr);
    }
    if (error !== null) {
        console.log(`exec error: ${error}`);
    }
});