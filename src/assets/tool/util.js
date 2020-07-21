function mbOrPc(w){
  if(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)){
    require("../css/"+w+".css");
  }else{
    require("../css/"+w+".css");
    require("../css/"+w+"-pc.css");
  }
}
export{
  mbOrPc
}
