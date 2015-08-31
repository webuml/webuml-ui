/*
 * Based on:
 *
 * Canvas2Image v0.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */


export = Canvas2Image;

class Canvas2Image {

  // check if we have canvas support
  private bHasCanvas: boolean = false;
  private bHasImageData: boolean = false;
  private oCanvas = document.createElement("canvas");
  private strDownloadMime: string;
  private bHasBase64: boolean = false;
  private bHasDataURL: boolean = false;

  constructor() {

    if (this.oCanvas.getContext("2d")) {
      this.bHasCanvas = true;
    }

    // no canvas, bail out.
    if (!this.bHasCanvas) {
      throw "No canvas found!";
    }

    this.bHasImageData = !!(this.oCanvas.getContext("2d").getImageData);
    this.bHasDataURL = !!(this.oCanvas.toDataURL);
    this.bHasBase64 = !!(window.btoa);
    this.strDownloadMime = "image/octet-stream";
  }

  private static readCanvasData(oCanvas) {
    var iWidth = parseInt(oCanvas.width);
    var iHeight = parseInt(oCanvas.height);
    return oCanvas.getContext("2d").getImageData(0, 0, iWidth, iHeight);
  }

// base64 encodes either a string or an array of charcodes

  private static encodeData(data) {
    var strData = "";
    if (typeof data == "string") {
      strData = data;
    } else {
      var aData = data;
      for (var i = 0; i < aData.length; i++) {
        strData += String.fromCharCode(aData[i]);
      }
    }
    return btoa(strData);
  }

// creates a base64 encoded string containing BMP data
// takes an imagedata object as argument

  private static createBMP(oData) {
    var aHeader = [];

    var iWidth = oData.width;
    var iHeight = oData.height;

    aHeader.push(0x42); // magic 1
    aHeader.push(0x4D);

    var iFileSize = iWidth * iHeight * 3 + 54; // total header size = 54 bytes
    aHeader.push(iFileSize % 256);
    iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256);
    iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256);
    iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256);

    aHeader.push(0); // reserved
    aHeader.push(0);
    aHeader.push(0); // reserved
    aHeader.push(0);

    aHeader.push(54); // dataoffset
    aHeader.push(0);
    aHeader.push(0);
    aHeader.push(0);

    var aInfoHeader = [];
    aInfoHeader.push(40); // info header size
    aInfoHeader.push(0);
    aInfoHeader.push(0);
    aInfoHeader.push(0);

    var iImageWidth = iWidth;
    aInfoHeader.push(iImageWidth % 256);
    iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256);
    iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256);
    iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256);

    var iImageHeight = iHeight;
    aInfoHeader.push(iImageHeight % 256);
    iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256);
    iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256);
    iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256);

    aInfoHeader.push(1); // num of planes
    aInfoHeader.push(0);

    aInfoHeader.push(24); // num of bits per pixel
    aInfoHeader.push(0);

    aInfoHeader.push(0); // compression = none
    aInfoHeader.push(0);
    aInfoHeader.push(0);
    aInfoHeader.push(0);

    var iDataSize = iWidth * iHeight * 3;
    aInfoHeader.push(iDataSize % 256);
    iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256);
    iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256);
    iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256);

    for (var i = 0; i < 16; i++) {
      aInfoHeader.push(0);	// these bytes not used
    }

    var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

    var aImgData = oData.data;

    var strPixelData = "";
    var y = iHeight;
    do {
      var iOffsetY = iWidth * (y - 1) * 4;
      var strPixelRow = "";
      for (var x = 0; x < iWidth; x++) {
        var iOffsetX = 4 * x;

        strPixelRow += String.fromCharCode(aImgData[iOffsetY + iOffsetX + 2]);
        strPixelRow += String.fromCharCode(aImgData[iOffsetY + iOffsetX + 1]);
        strPixelRow += String.fromCharCode(aImgData[iOffsetY + iOffsetX]);
      }
      for (var c = 0; c < iPadding; c++) {
        strPixelRow += String.fromCharCode(0);
      }
      strPixelData += strPixelRow;
    } while (--y);

    return Canvas2Image.encodeData(aHeader.concat(aInfoHeader)) + Canvas2Image.encodeData(strPixelData);
  }


// sends the generated file to the client

  private static saveFile(data: string) {
    return data;
  }


  private static makeDataURI(data: string, mime: string) {
    return "data:" + mime + ";base64," + data;
  }

  // generates a <img> object containing the imagedata
  private static makeImageObject(source: string) {
    var oImgElement = document.createElement("img");
    oImgElement.src = source;
    return oImgElement;
  }


  private scaleCanvas(oCanvas, width: number, height: number) {
    if (width && height) {
      var oSaveCanvas = document.createElement("canvas");
      oSaveCanvas.width = width;
      oSaveCanvas.height = height;
      oSaveCanvas.style.width = width + "px";
      oSaveCanvas.style.height = height + "px";

      var oSaveCtx = oSaveCanvas.getContext("2d");
      // make background white
      oSaveCtx.fillStyle = "#ffffff";
      oSaveCtx.fillRect(0, 0, width, height);

      // preserve aspect ratio
      var w = Math.min(width, height * oCanvas.width / oCanvas.height) | 0;
      var h = Math.min(height, width * oCanvas.height / oCanvas.width) | 0;

      // centering the image to copz
      var offset_X = width - (width >> 1) - (w >> 1);
      var offset_Y = height - (height >> 1) - (h >> 1);

      // copy and scale image
      oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, offset_X, offset_Y, w, h);
      return oSaveCanvas;
    }
    return this.oCanvas;
  }

  saveAsPNG(oCanvas, returnImage: boolean, width: number, height: number): any {
    if (!this.bHasDataURL) {
      return false;
    }
    var oScaledCanvas = this.scaleCanvas(oCanvas, width, height);
    var strData = oScaledCanvas.toDataURL("image/png");
    if (returnImage) {
      return Canvas2Image.makeImageObject(strData);
    }
    return strData.replace("image/png", this.strDownloadMime);
  }


  saveAsJPEG(oCanvas, returnImage: boolean, width: number, height: number): any {
    if (!this.bHasDataURL) {
      return false;
    }

    var oScaledCanvas = this.scaleCanvas(oCanvas, width, height);
    var strMime = "image/jpeg";
    var strData = oScaledCanvas.toDataURL(strMime);

    // check if browser actually supports jpeg by looking for the mime type in the data uri.
    // if not, return false
    if (strData.indexOf(strMime) != 5) {
      return false;
    }

    if (returnImage) {
      return Canvas2Image.makeImageObject(strData);
    }
    return strData.replace(strMime, this.strDownloadMime);
  }


  saveAsBMP(oCanvas, returnImage: boolean, width: number, height: number): any {
    if (!(this.bHasImageData && this.bHasBase64)) {
      return false;
    }

    var oScaledCanvas = this.scaleCanvas(oCanvas, width, height);

    var oData = Canvas2Image.readCanvasData(oScaledCanvas);
    var strImgData = Canvas2Image.createBMP(oData);
    if (returnImage) {
      return Canvas2Image.makeImageObject(Canvas2Image.makeDataURI(strImgData, "image/bmp"));
    }
    return Canvas2Image.makeDataURI(strImgData, this.strDownloadMime);
  }


}