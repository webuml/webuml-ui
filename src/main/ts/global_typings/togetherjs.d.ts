interface TogetherJS_hub {
  on(type: string, callback: (msg: any)=>void):void;
}

interface TogetherJS_config {
  (name: string, value: any):void;
  get(name: string):any;
  close(name: string):void;
  track(name: string, callback: ()=>void):void;
}

interface TogetherJS {
  (obj?: any):void;
  hub:TogetherJS_hub;
  send(msg: any):void;
  shareUrl():string;
  reinitialize():void;
  refreshUserData():void;
  config:TogetherJS_config;
  running:boolean;
  pageLoaded:Date;
}

declare var TogetherJS: TogetherJS;

declare module "TogetherJS" {
export = TogetherJS;
}