// See https://stackoverflow.com/a/60172354/3253311

const readFileSync = require('fs').readFileSync;
const execSync = require('child_process').execSync;

// australiaeast, brazilsouth, canadacentral, centralindia, centralus, centraluseuap, eastasia, eastus, eastus2, francecentral, japaneast, japanwest, koreacentral, northcentralus, northeurope, southcentralus, southeastasia, uksouth, westcentralus, westeurope, westus, westus2, and southafricanorth
const azureRegion = 'canadacentral';

const azureTranslationKey = readFileSync('.azureTranslationKey', { encoding: 'utf8' });

execSync(`yarn json-autotranslate --service azure --delete-unused-strings --type keybased --matcher i18next --input ./src/i18n/locales --config ${azureTranslationKey},${azureRegion}`);