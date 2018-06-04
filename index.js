/**
 * @author Fabio Marcoccia
 */

(function (root, factory) {
  //Support AMD
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory();
    });
    //Support CommonJS
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    //Browser console
    window.publisher = factory();
  }
})(( typeof window === 'object' && window ) || this, function () {
  'use strict';
  //
  // variable
  //
  const subscriber = {};

  //
  // private methods
  //

  /**
   * @param {string} message
   */
  function throwable(message) {
    throw new Error(message);
  }

  /**
   * @param {string} s
   * @returns {string} hash to input
   */
  function hash(s) {
    let a = 1, c = 0, h, o;
    if (s) {
      a = 0;
      for (h = s.length - 1; h >= 0; h--) {
        o = s.charCodeAt(h);
        a = (a<<6&268435455) + o + (o<<14);
        c = a & 266338304;
        a = c!==0?a^c>>21:a;
      }
    }
    return String(a);
  }

  /**
   * @param {string} eventName
   * @param {function} fn
   */
  function addFnInArray(eventName, fn){
    let randomString = hash(fn.toString());
    subscriber[eventName].push({
      fn: fn,
      randomString: randomString
    })
  }

  /**
   * @param {string} eventName
   * @returns {boolean} true if already exist eventName
   */
  function existEventName(eventName){
    const fns = subscriber[eventName];
    return typeof fns === 'object';
  }

  /**
   * @param {string} eventName
   * @param {function} fn
   */
  function registerSubscriber(eventName, fn){
    if(existEventName(eventName)){
      addFnInArray(eventName,fn);

    } else{
      subscriber[eventName] = [];
      addFnInArray(eventName,fn)
    }
  }

  /**
   * @param {string} eventName
   * @param {function} fn
   */
  function findFn(eventName, fn){
    const fns = subscriber[eventName];
    let hashToFind = hash(fn.toString());
    let indexFnToDelete = fns.findIndex( f => f.randomString === hashToFind);
    fns.splice(indexFnToDelete, 1);
  }

  /**
   * @param {string} eventName
   * @param {function} fn
   */
  function unsubscribe(eventName, fn){
    const fns = subscriber[eventName];
    if(fns.length === 1){
      delete subscriber[eventName];
    } else {
      findFn(eventName, fn);
    }
  }

  //
  // public methods
  //
  return {
    subscribe: function(name, fn){
      if(typeof fn !== "function" || typeof name !== "string"){
        const errorMessage = 'first argument must be a string second argument must be a function';
        throwable(errorMessage);
      }
      registerSubscriber(name,fn);
      return function(){
        unsubscribe(name, fn);
      }
    },
    emit: function(name,data){
      if(!existEventName(name)){
        const errorMessage = 'event not exist';
        throwable(errorMessage);
      }

      let fns = subscriber[name];
      for(let i=0; i<fns.length;i++){
        fns[i].fn(data);
      }
    }
  }
});
