/* jshint jasmine: true */
/* global NativeStorage */
exports.defineAutoTests = function() {

  describe('Write/Read/Delete Tests', function() {
    it("checks if th plugin is available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('Booleans', function(done) {
      var dummyData = true;
      NativeStorage.set("dummy_ref_bool",
        dummyData,
        function(result) {
          NativeStorage.getBoolean("dummy_ref_bool",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_bool", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Boolean Failed");
            });
        },
        function(e) {
          fail("Write Boolean Failed");
        });
    });
    it('Ints', function(done) {
      var dummyData = 154243;
      NativeStorage.set("dummy_ref_int",
        dummyData,
        function(result) {
          NativeStorage.getInt("dummy_ref_int",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_int", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Int Failed");
            });
        },
        function(e) {
          fail("Write Int Failed");
        });
    });
    it('Doubles', function(done) {
      var dummyData = 12327.023;
      NativeStorage.set("dummy_ref_double",
        dummyData,
        function(result) {
          NativeStorage.getDouble("dummy_ref_double",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_double", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Double Failed");
            });
        },
        function(e) {
          fail("Write String Failed");
        });
    });
    it('Strings', function(done) {
      var dummyData = "sdadadfsjdhbfwehfnciu7834fybzx2lnqo8japf;ckamicoa.c.a/";
      NativeStorage.set("dummy_ref_str",
        dummyData,
        function(result) {
          NativeStorage.getString("dummy_ref_str",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_str", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read String Failed");
            });
        },
        function(e) {
          fail("Write String Failed");
        });
    });
    it('Objects', function(done) {
      var dummyData = {
        data1: "",
        data2: 2,
        data3: 3.0
      };
      NativeStorage.set("dummy_ref_obj",
        dummyData,
        function(result) {
          NativeStorage.getObject("dummy_ref_obj",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_obj", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Object Failed");
            });
        },
        function(e) {
          fail("Write Object Failed");
        });
    });
  });

  /* NEW API test */
  describe('Write/Read/Delete Tests new API', function() {
    it("Plugin available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('Booleans', function(done) {
      var dummyData = true;
      NativeStorage.setItem("dummy_ref_bool_new",
        dummyData,
        function(result) {
          NativeStorage.getItem("dummy_ref_bool_new",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_bool_new", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Boolean Failed");
            });
        },
        function(e) {
          fail("Write Boolean Failed");
        });
    });
    it('Ints', function(done) {
      var dummyData = 154243;
      NativeStorage.setItem("dummy_ref_int_new",
        dummyData,
        function(result) {
          NativeStorage.getItem("dummy_ref_int_new",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_int_new", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Int Failed");
            });
        },
        function(e) {
          fail("Write Int Failed");
        });
    });
    it('Doubles', function(done) {
      var dummyData = 12327.023;
      NativeStorage.setItem("dummy_ref_double_new",
        dummyData,
        function(result) {
          NativeStorage.getItem("dummy_ref_double_new",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_double_new", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Double Failed");
            });
        },
        function(e) {
          fail("Write String Failed");
        });
    });
    it('Strings', function(done) {
      var dummyData = "sdadadfsjdhbfwehfnciu7834fybzx2lnqo8japf;ckamicoa.c.a/";
      NativeStorage.setItem("dummy_ref_str_new",
        dummyData,
        function(result) {
          NativeStorage.getItem("dummy_ref_str_new",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_str_new", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read String Failed");
            });
        },
        function(e) {
          fail("Write String Failed");
        });
    });
    it('Objects', function(done) {
      var dummyData = {
        data1: "",
        data2: 2,
        data3: 3.0
      };
      NativeStorage.setItem("dummy_ref_obj_new",
        dummyData,
        function(result) {
          NativeStorage.getItem("dummy_ref_obj_new",
            function(result) {
              expect(result).toEqual(dummyData);
              NativeStorage.remove("dummy_ref_obj_new", function() {
                done();
              }, function(e) {
                fail("Delete Boolean Failed");
              });
            },
            function(e) {
              fail("Read Object Failed");
            });
        },
        function(e) {
          fail("Write Object Failed");
        });
    });
  });


  /* NEW API test */
  describe('Fail Tests new API', function() {
    it("Plugin available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('Null reference', function(done) {
      NativeStorage.setItem(null, "objbio",
        function(result) {
          fail("Item should not have been found, because ref is null " + result);
        },
        function(e) {
          expect(e.code).toEqual(3);
          done();
        });
    });

    it('Item Not Found', function(done) {
      NativeStorage.getItem("dummy_ref_fail",
        function(result) {
          fail("Item should not have been found " + result);
        },
        function(e) {
          expect(e.code).toEqual(2);
          done();
        });
    });

    it('bad JSON', function(done) {
      var a = {};
      a.a = a;
      NativeStorage.setItem("dummy_ref_bad_json", a, function(result) {
        fail("JSON stringify should give an error " + result);
      },
        function(e) {
          expect(e.code).toEqual(5);
          done();
        });
    });


  });

  /* NEW API test with Password encryption*/
  describe('Password encryption Tests new API', function() {
    it("Plugin available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('should store, retrieve and remove a secret item', function(done) {
      //reference, obj, encryptConfig, success, error
      NativeStorage.setSecretItem("ref_to_secret_value", "SomeVerySecretText", {
        mode: "password",
        value: "mySecretPassword"
      },
        function(result) {
          // Oke good we've set the secret
          expect(result).toEqual("SomeVerySecretText");
          // let's grab it back
          NativeStorage.getSecretItem("ref_to_secret_value", {
            mode: "password",
            value: "mySecretPassword"
          }, function(result) {
            // we've got it again, yes! :D
            // let's remove it
            NativeStorage.remove("ref_to_secret_value", function() {
              // We're done!
              done();
            }, function(e) {
              fail("Delete item Failed");
            });
          }, function(e) {
            fail("Get item Failed");
          });
        },
        function(e) {
          fail("Set item Failed");
        });
    });

  });

  /* NEW API test with Password encryption*/
  describe('Password encryption Error Tests new API', function() {
    it("Plugin available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('should invoke the error callback function for a secret item', function(done) {
      //reference, obj, encryptConfig, success, error
      NativeStorage.setSecretItem("ref_to_secret_value", "SomeVerySecretText", {
        mode: "password",
        value: "mySecretPassword"
      },
        function(result) {
          // Oke good we've set the secret
          expect(result).toEqual("SomeVerySecretText");
          // let's grab it back
          NativeStorage.getSecretItem("ref_to_secret_value", {
            mode: "password",
            value: "SomeOhterPassword"
          }, function(result) {
            // if we are in the browser
            if ((window.cordova && window.cordova.platformId === 'browser') || !(window.phonegap || window.cordova)) {
              done();
            }
            fail("We've giving the pasword so it shouldn't work");
            NativeStorage.remove("ref_to_secret_value", function() {
              fail("We shouldn't got here... maybe we are in a browser!");
            }, function(e) {
              fail("Delete item Failed");
            });
          },
            function(e) {
              done(e);
            });
        },
        function(e) {
          fail("Set item Failed");
        });
    });

  });


  /* NEW API test with clear() function*/
  describe('clear function', function() {
    it("Plugin available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('should invoke the error callback function with error code 2', function(done) {
      var a = {};
      NativeStorage.setItem("dummy_ref_clear", a, function(result) {
        expect(result).toEqual(a);
        NativeStorage.clear(function(result) {
          NativeStorage.getItem("dummy_ref_clear", function(result) {
            fail("Should not give a result");
          }, function(e) {
            expect(e.code).toEqual(2);
            done();
          });
        },
          function(e) {
            fail("Error when clearing native storage");
          });
      },
        function(e) {
          fail("Error when item is set");
        });
    });

  });

  describe('keys function', function() {
    it("Plugin available", function() {
      expect(NativeStorage).toEqual(jasmine.anything());
    });
    it('should return the keys', function(done) {
      var a = {};
      NativeStorage.setItem("dummy_ref_clear", a, function(result) {
        expect(result).toEqual(a);
        NativeStorage.keys(function(result) {
            expect(result).toContain('dummy_ref_clear');
            done();
          },
          function(e) {
            fail("Error when listing keys in native storage");
          });
      },
        function(e) {
          fail("Error when item is set");
        });
    });
  });
};
