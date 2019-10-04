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
let client2;

describe('Websocket server tests', () => {

  describe('requestRandomChat', () => {
    beforeEach((done) => {
      client = io.connect(SOCKET_URL, OPTIONS);
      client2 = io.connect(SOCKET_URL, OPTIONS);

      client.on('connect', () => {
        setTimeout(done, 100);
      });
    });
    after((done) => {
      client.disconnect();
      client2.disconnect();
      done();
    });

    it('emit initialConnect to client with object', (done) => {
      client.on('initialConnect', (data) => {
        const userName = Object.values(data.totalUserList).find(name => name === 'user01');
        expect(data.connected).to.equal(true);
        expect(userName).to.equal('user01');
        client.disconnect();
        done();
      });

      client.emit('requestRandomChat', 'user01');
    });

    it('does not match if only one client request chat', (done) => {
      client.on('completeMatch', (data) => {
        expect(data.matched).to.equal(false);
        client.disconnect();
      });

      client.emit('requestRandomChat', 'user01');
      done();
    });

    it('matches two clients if two clients request chat', (done) => {
      client = io.connect(SOCKET_URL, OPTIONS);
      client2 = io.connect(SOCKET_URL, OPTIONS);
      client2.on('connect', () => {
        setTimeout(done, 100);
      });

      client2.on('completeMatch', (data) => {
        expect(data.matched).to.equal(true);
        expect(data.partner.name).to.equal('user01');
      });

      client.emit('requestRandomChat', 'user01');
      client2.emit('requestRandomChat', 'user02');
    });
  });

  describe('requestDisconnection', () => {
    before((done) => {
      client = io.connect(SOCKET_URL, OPTIONS);
      client2 = io.connect(SOCKET_URL, OPTIONS);

      client.on('connect', () => {
        setTimeout(done, 100);
      });
    });
    after((done) => {
      client.disconnect();
      client2.disconnect();
      done();
    });
  });
});
