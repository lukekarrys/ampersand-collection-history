var fs = require('fs');

function exampleCode (filename) {
    return fs.readFileSync(__dirname + '/' + filename + '.js', 'utf8')
    .replace(/\/\/ IGNORE[.\S\s]*?\/\/ ENDIGNORE\n/g, '')
    .replace('../collection-history', 'ampersand-collection-history')
    .replace(/^\s+|\s+$/g, '');
}

var README = fs.readFileSync(__dirname + '/README.md', 'utf8')
    .replace('{{ampersand}}', exampleCode('ampersand'))
    .replace('{{manual}}', exampleCode('manual'));

fs.writeFileSync(__dirname + '/../README.md', README);