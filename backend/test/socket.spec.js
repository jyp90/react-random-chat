const chai = require('chai');
const expect = chai.expect;
const io = require('socket.io-client');
require('../bin/www');

const SOCKET_URL = 'http://localhost:8080/';
const OPTIONS = {
  'transports': ['websocket'],
  'force new connection': true,
  'multiplex': false
};

let client;
let client2;

describe('Websocket server tests', () => {
  before((done) => {
    client = io.connect(SOCKET_URL, OPTIONS);
    client2 = io.connect(SOCKET_URL, OPTIONS);

    client.on('connect', () => {});
    client2.on('connect', () => {
      done();
    });
  });

  describe('requestRandomChat', () => {
    afterEach((done) => {
      client.disconnect();
      client2.disconnect();
      done();
    });

    it('emit initialConnect to client with object', (done) => {
      client.once('initialConnect', (data) => {
        const userName = Object.values(data.totalUserList).find(name => name === 'user01');
        expect(data.connected).to.equal(true);
        expect(userName).to.equal('user01');
        done();
      });

      client.emit('requestRandomChat', 'user01');
    });

    it('does not match if only one client request chat', (done) => {
      client.once('completeMatch', (data) => {
        expect(data.matched).to.equal(true);
      });

      client.emit('requestRandomChat', 'user01');
      done();
    });

    it('matches two clients if two clients request chat', (done) => {
      client.once('completeMatch', (data) => {
        expect(data.matched).to.equal(true);
        expect(data.partner.name).to.equal('user02');
        done();
      });

      client2.once('completeMatch', (data) => {
        expect(data.matched).to.equal(true);
        expect(data.partner.name).to.equal('user01');
        done();
      });

      client.emit('requestRandomChat', 'user01');
      client2.emit('requestRandomChat', 'user02');
      done();
    });
  });
});
