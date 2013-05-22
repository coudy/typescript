/// Copyright (c) 2012 Ecma International.  All rights reserved. 
/// Ecma International makes this code available under the terms and conditions set
/// forth on http://hg.ecmascript.org/tests/test262/raw-file/tip/LICENSE (the 
/// "Use Terms").   Any redistribution of this code must retain the above 
/// copyright and this notice and otherwise comply with the Use Terms.
/**
 * @path ch10/10.4/10.4.3/10.4.3-1-5-s.js
 * @description this is not coerced to an object in strict mode (function)
 * @onlyStrict
 */


function testcase() {

  function a()
  {
    'use strict';
    return typeof(this);
  } 

  function b()
  {
    return typeof(this);
  }

  function ab()
  {
  }

  return a.call(ab) === 'function' && b.call(ab) === 'function';
 }
runTestCase(testcase);
