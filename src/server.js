const { byCode, byName } = require('./constants')
const hid = require('node-hid')
const dgram = require('dgram')

const PORT = 33333
const HOST = '255.255.255.255'
const client = dgram.createSocket('udp4')

client.on('listening', function () {
    const address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true);
});

const device = new hid.HID('/dev/hidraw0')
device.on('data', data => {
	client.send(data, 0, data.length, PORT, HOST, ((err, bytes) => {
		if (err) console.log(err);
	}));
})

client.bind(PORT)
