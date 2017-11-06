module.exports = {

  start: function () {
    console.log("START!");
  },
  update: function () {
    console.log("UPDATE!");
    this.somePrivateFunction();
  },
  somePrivateFunction: function () {
    console.log("PRIVATE FUNCTION");
    this.someOtherPrivateFunction();
  },
  someOtherPrivateFunction: function () {
    console.log("PRIVATE FUNCTION 22222");
  }
};