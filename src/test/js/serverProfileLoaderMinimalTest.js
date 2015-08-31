var expect = require("expect.js");
var serverPropertiesLoader = require("../../../server-profile-loader");

describe('Minimal Test', function () {

  describe('Server Profile Loader', function () {

    it("should return 'undefined' when using no profile", function () {

      var properties = serverPropertiesLoader.loadProfile();

      expect(properties['webuml-projectmanager.baseUri']).to.be('undefined');
    });

    it("should contain 'localhost' when using 'local' profile", function () {

      var properties = serverPropertiesLoader.loadProfile('local');

      expect(properties['webuml-projectmanager.baseUri']).to.contain('localhost');
    });

  });

});