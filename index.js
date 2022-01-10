#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const BinWrapper = require('bin-wrapper');

const version = '4.7.1';

const defaultBinInstallBase = 'https://saucelabs.com/downloads';
const binWrapper = (binInstallURL = null, binInstallBase = null) => {
    const bw = new BinWrapper();
    if (binInstallURL) {
        bw.src(binInstallURL, '', '')
    } else {
        const base = binInstallBase || defaultBinInstallBase;
        bw.src(`${base}/sc-${version}-osx.zip`, 'darwin')
            .src(`${base}/sc-${version}-linux.tar.gz`, 'linux')
            .src(`${base}/sc-${version}-win32.zip`, 'win32')
            .version(`v${version}`);
    }
    const binName = process.platform.startsWith('win') ? 'sc.exe' : 'sc';
    bw.dest(path.join(__dirname, 'bin'))
        .use(path.join('bin', binName));

    return bw;
}

/* istanbul ignore next */
async function main (b, args) {
	await b.run(['--version']);
	const sauceConnectProcess = spawn(b.path(), args, {
		stdio: [process.stdin, process.stdout, process.stderr]
	});
    sauceConnectProcess.on('exit', function (code) {
        /* eslint-disable */
        process.exit(code);
        /* eslint-enable */
    });
}

/* istanbul ignore if */
if (require.main === module) {
    const bw = binWrapper(process.env.SAUCECONNECT_INSTALL_BINARY, process.env.SAUCECONNECT_INSTALL_BINARY_MIRROR);
	main(bw, process.argv.slice(2));
}

module.exports = main;
module.exports.binWrapper = binWrapper;
