/**
 * Created by Christian on 30.08.2016.
 * christian@helbighof.de
 */

var package = Windows.ApplicationModel.Package.current;
var service = package.id.name

var NativeStorageProxy = {
    getItem: function (win, fail, args) {
        try {
            var key = args[0];
            var vault = new Windows.Security.Credentials.PasswordVault();
            var passwordCredential = vault.retrieve(service, key);
            win(passwordCredential.password);
        } catch (e) {
            fail(2);
        }
    },
    setItem: function (win, fail, args) {
        try {
            var key = args[0];
            var value = args[1];
            var vault = new Windows.Security.Credentials.PasswordVault();
            vault.add(new Windows.Security.Credentials.PasswordCredential(service, key, value));
            win(value);
        } catch (e) {
            fail(1);
        }
    },
    clear: function (win, fail, args) {
        //todo: Clear all values in NativeStorage
        try {
            var vault = new Windows.Security.Credentials.PasswordVault();
            var iVectorView = vault.retrieveAll();
            if (iVectorView == null)
                win();
            for (var i = 0; i < iVectorView.size; i++) {
                vault.remove(iVectorView[i]);
            }
            win();
        } catch (e) {
            fail();
        }
    },
    putString: function (win, fail, args) {
        try {
            var key = args[0];
            var value = args[1];
            var vault = new Windows.Security.Credentials.PasswordVault();
            vault.add(new Windows.Security.Credentials.PasswordCredential(service, key, value));
            win(value);
        } catch (e) {
            fail(1);
        }
    },
    getString: function (win, fail, args) {
        try {
            var key = args[0];
            var vault = new Windows.Security.Credentials.PasswordVault();
            var passwordCredential = vault.retrieve(service, key);
            win(passwordCredential.password);
        } catch (e) {
            fail(2);
        }
    },
    putBoolean: function (win, fail, args) {
        try {
            var key = args[0];
            var value = args[1];
            var vault = new Windows.Security.Credentials.PasswordVault();
            vault.add(new Windows.Security.Credentials.PasswordCredential(service, key, value));
            win(value);
        } catch (e) {
            fail(1);
        }
    },
    getBoolean: function (win, fail, args) {
        try {
            var key = args[0];
            var vault = new Windows.Security.Credentials.PasswordVault();
            var passwordCredential = vault.retrieve(service, key);
            win(passwordCredential.password);
        } catch (e) {
            fail(2);
        }
    },
    putInt: function (win, fail, args) {
        try {
            var key = args[0];
            var value = args[1];
            var vault = new Windows.Security.Credentials.PasswordVault();
            vault.add(new Windows.Security.Credentials.PasswordCredential(service, key, value));
            win(value);
        } catch (e) {
            fail(1);
        }
    },
    getInt: function (win, fail, args) {
        try {
            var key = args[0];
            var vault = new Windows.Security.Credentials.PasswordVault();
            var passwordCredential = vault.retrieve(service, key);
            win(parseInt(passwordCredential.password));
        } catch (e) {
            fail(2);
        }
    },
    putDouble: function (win, fail, args) {
        try {
            var key = args[0];
            var value = args[1];
            var vault = new Windows.Security.Credentials.PasswordVault();
            vault.add(new Windows.Security.Credentials.PasswordCredential(service, key, value));
            win(value);
        } catch (e) {
            fail(1);
        }
    },
    getDouble: function (win, fail, args) {
        try {
            var key = args[0];
            var vault = new Windows.Security.Credentials.PasswordVault();
            var passwordCredential = vault.retrieve(service, key);
            win(passwordCredential.password);
        } catch (e) {
            fail(2);
        }
    },
    remove: function (win, fail, args) {
        try {
            var key = args[0];
            var vault = new Windows.Security.Credentials.PasswordVault();
            var passwordCredential = vault.retrieve(service, key);
            if (passwordCredential) {
                vault.remove(passwordCredential);
            }
            win(key);
        } catch (e) {
            fail(2);
        }
    },
    keys: function (win, fail) {
        try {
            var vault = new Windows.Security.Credentials.PasswordVault();
            var all = vault.retrieveAll();
            var keys = [];
            for(var i=0;i<all.Size;i++) {
              keys.push(all.GetAt(i).UserName);
            }
            win(keys);
        } catch (e) {
            fail(2);
        }
    },
};

require("cordova/exec/proxy").add("NativeStorage", NativeStorageProxy);
