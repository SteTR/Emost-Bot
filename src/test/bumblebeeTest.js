const Bumblebee = require('bumblebee-hotword-node');
const fs = require('fs');

fs.createReadStream()

function createNewBee()
{
    const bee = new Bumblebee();
    bee.addHotword('bumblebee');
    bee.on('hotword', (hotword =>
    {
        console.log('hotword detected')
        bee.stop();
    }));
    return bee;
}
for (var i = 0; i < 100; i++)
{
    createNewBee().start();
}
console.log('\n Started speech recognition');