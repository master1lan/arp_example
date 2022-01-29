/**
 * 暴露两种方法获得mac地址和注销mac地址
 */
function macSet() {
  this.hasOwnSet = new Set();
  this.allowAlphabet = '0123456789ABCDEF';
  const doNoUseMAC = 'FF:FF:FF:FF:FF:FF';
  this.hasOwnSet.add(doNoUseMAC);
}

macSet.prototype.addMacAddress = function () {
  let macAddress = '';
  do {
    for (var i = 0; i < 6; i++) {
      macAddress += this.allowAlphabet.charAt(Math.round(Math.random() * 15));
      macAddress += this.allowAlphabet.charAt(Math.round(Math.random() * 15));
      if (i != 5) macAddress += ':';
    }
  } while (this.hasOwnSet.has(macAddress));
  this.hasOwnSet.add(macAddress);
  return macAddress;
};

macSet.prototype.removeMacAddress = function (macAddress) {
  this.hasOwnSet.delete(macAddress);
};

const MACSet = new macSet();

export default MACSet;

// let test=MACSet.addMacAddress();
// console.log(MACSet);
// MACSet.removeMacAddress(test);
// console.log(MACSet)
