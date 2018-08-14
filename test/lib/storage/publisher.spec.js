var mongoose = require('mongoose');
let Publisher = require('./../../../lib/storage/publisher');
var config = require('./../../../lib/config');

const expect = require('chai');

describe('Publisher', function() {

  before(function(done) {
    var publisher = new Publisher({
      to_chat_id: 1234,
      from_chat_type: 'channel',
      from_chat_id: 1232,
      to_chat_type: 'group'
    });

    publisher.save(function(error) {
      if (error) console.log('error' + error.message);
    });
    done();
  });

  after(function(done) {
    Publisher.remove({}, function() {   
    });
    done();
  });

  it('return array', function(done) {
    Publisher.find({}, function(err, publishers) {
      console.log(publishers);
      expect(publishers).to.be.an('array');
    });
    done();
  });
});