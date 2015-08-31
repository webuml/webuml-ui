var expect = require("expect.js");

(function extend_ExpectJs() {
  var util = require("util");
  expect.Assertion.prototype.lessThanOrEqual =
      expect.Assertion.prototype.belowOrEqual = function (n) {
        this.assert(
                this.obj <= n
            , 'expected ' + util.inspect(this.obj) + ' to be below or equal ' + n
            , 'expected ' + util.inspect(this.obj) + ' to be above or equal ' + n);
        return this;
      };
})();

describe('Canvas2ImageTest', function () {

  describe('Preserve Asect ratio', function () {

    it("should preserve the original canvas's aspect ratio", function () {

      var width = 128;
      var height = 96;

      var oCanvas = {
        width: 800,
        height: 1300
      };

      var w = Math.min(width, height * oCanvas.width / oCanvas.height) | 0;
      var h = Math.min(height, width * oCanvas.height / oCanvas.width) | 0;

      expect(w).to.be.lessThanOrEqual(128);
      expect(w).to.be.greaterThan(50);

      expect(h).to.be.lessThanOrEqual(96);
      expect(h).to.be.greaterThan(50);
    });

  });

})
;