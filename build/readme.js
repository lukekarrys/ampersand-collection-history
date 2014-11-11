var fs = require('fs');

var example = fs.readFileSync(__dirname + '/example.js', 'utf8')
    .replace(/\/\/ IGNORE[.\S\s]*?\/\/ ENDIGNORE\n/g, '')
    .replace('../collection-history', 'ampersand-collection-history')
    .replace(/^\s+|\s+$/g, '');
var README = fs.readFileSync(__dirname + '/README.md', 'utf8')
    .replace('{{example.js}}', example);

fs.writeFileSync(__dirname + '/../README.md', README);