/**
 * @Author Fabio Marcoccia
 * @email  fabio@marcoccia.net
 * @Date   01/06/2018
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory();
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
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
   *
   * @param s
   * @returns {string}
   */
  function hash(s) {
    /* Simple hash function. */
    let a = 1, c = 0, h, o;
    if (s) {
      a = 0;
      /*jshint plusplus:false bitwise:false*/
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
   *
   * @param {String} eventName
   * @param {Function} fn
   */
  function addFnInArray(eventName, fn){
    let randomicString = hash(fn.toString());
    subscriber[eventName].push({
      fn: fn,
      randomicString: randomicString
    })
  }

  /**
   *
   * @param {String} eventName
   * @returns {boolean} return true if already exsist eventName
   */
  function exsistEventName(eventName){
    const fns = subscriber[eventName];
    return typeof fns === 'object';

  }

  /**
   *
   * @param {String} eventName
   * @param {Function} fn
   */
  function registerSubscriber(eventName, fn){
    if(exsistEventName(eventName)){
      addFnInArray(eventName,fn);

    } else{
      subscriber[eventName] = [];
      addFnInArray(eventName,fn)
    }
    //console.info('subscriber ', subscriber)
  }

  /**
   *
   * @param {String} eventName
   * @param {Function} fn
   */
  function findFn(eventName, fn){
    const fns = subscriber[eventName];
    let hashToFind = hash(fn.toString());
    for(let i=0; i<fns.length;i++){
      if(hashToFind === fns[i].randomicString){
        fns.splice(i, 1);
        break;
      }
    }
  }

  /**
   *
   * @param {String} eventName
   * @param {Function} fn
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
        throw new Error('argument must be a string and function')
      }
      //console.info('subscribe event with name ', name);
      registerSubscriber(name,fn);
      return function(){
        unsubscribe(name, fn);
      }
    },
    emit: function(name,data){
      if(!exsistEventName(name)){
        throw new Error('event not exsist')
      }
      //console.info('emit event with name ', name)

      let fns = subscriber[name];
      for(let i =0; i<fns.length;i++){
        fns[i].fn(data);
      }
    }
  }
});
