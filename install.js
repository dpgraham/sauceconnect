const { binWrapper } = require('./index.js');

// install.js is executed during the npm installation step.
// To re-use BinWrapper logic, and limit changes, we force BinWrapper to
// execute "sauceconnect --version".
// So we are 100% sure that the sauceconnect binary will be available for the next
// execution.
async function install () {
  console.info('Fetching sauceconnect binary');
  const bw = binWrapper();
  bw.run(['--version'])
    .then(() => {
      console.info(`Installation succeed`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(`Installation failed: ${e}`);
      process.exit(1);
    });
}

if (require.main === module) {
	install();
}

module.exports = install;
