const chai = require('chai');
const expect = chai.expect;
const io = require('socket.io-client');
require('../bin/www');

const SOCKET_URL = 'http://localhost:8080/';
const OPTIONS = {
  'transports': ['websocket'],
  'force new connection': true
};

let client;

describe('Websocket server tests', () => {
  before((done) => {
    client = io.connect(SOCKET_URL, OPTIONS);

    client.on('connect', () => {
      console.log('client connect');
      done();
    });
  });

  after((done) => {
    client.disconnect();
    done();
  });

  it('request random chat', (done) => {
    const client = io.connect(SOCKET_URL, OPTIONS);

    client.once('connect', () => {
      console.log('connected');
      client.once('requestRandomChat', (userName) => {

        expect(userName).to.equal('user01');
        client.disconnect();
        done();
      });

      client.emit('requestRandomChat', 'user01');
      done();
    });
  });
});
