import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import java.util.Map;

import android.app.Activity;

public class NativeStorage extends CordovaPlugin {
    public static final String TAG = "Native Storage";
    private SharedPreferences sharedPref;
    private SharedPreferences.Editor editor;

    public NativeStorage() {
    }


    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.v(TAG, "Init NativeStorage");
        String PREFS_NAME = preferences.getString("NativeStorageSharedPreferencesName", "NativeStorage");
        sharedPref = cordova.getActivity().getSharedPreferences(PREFS_NAME, Activity.MODE_PRIVATE);
        editor = sharedPref.edit();
    }

    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (("remove").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        String ref = args.getString(0);
                        editor.remove(ref);
                        boolean success = editor.commit();
                        if (success) callbackContext.success();
                        else callbackContext.error("Remove operation failed");
                    } catch (Exception e) {
                        Log.e(TAG, "Removing failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("clear").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        editor.clear();
                        boolean success = editor.commit();
                        if (success) callbackContext.success();
                        else callbackContext.error("Clear operation failed");
                    } catch (Exception e) {
                        Log.e(TAG, "Clearing failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("putBoolean").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        Boolean bool = args.getBoolean(1);
                        editor.putBoolean(ref, bool);
                        boolean success = editor.commit();
                        if (success) callbackContext.success(String.valueOf(bool));
                        else callbackContext.error("Write failed");
                    } catch (Exception e) {
                        Log.e(TAG, "PutBoolean failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("getBoolean").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        //System.out.println("Receveived reference: " + ref);
                        Boolean bool = sharedPref.getBoolean(ref, false);
                        callbackContext.success(String.valueOf(bool));
                    } catch (Exception e) {
                        Log.e(TAG, "PutBoolean failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("putInt").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        int anInt = args.getInt(1);
                        editor.putInt(ref, anInt);
                        boolean success = editor.commit();
                        if (success) callbackContext.success(anInt);
                        else callbackContext.error("Write failed");
                    } catch (Exception e) {
                        Log.e(TAG, "PutInt failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("getInt").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        //System.out.println("Receveived reference: "+ref);
                        int anInt = sharedPref.getInt(ref, -1);
                        callbackContext.success(anInt);
                    } catch (Exception e) {
                        Log.e(TAG, "GetInt failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("putDouble").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        float f = (float) args.getDouble(1);
                        //Log.v(TAG,"Float value: "+f);
                        editor.putFloat(ref, f);
                        boolean success = editor.commit();
                        if (success) callbackContext.success(Float.toString(f));
                        else callbackContext.error("Write failed");
                    } catch (Exception e) {
                        Log.e(TAG, "PutFloat failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("getDouble").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        //System.out.println("Receveived reference: " + ref);
                        float f = sharedPref.getFloat(ref, (float) -1.0);
                        callbackContext.success(Float.toString(f));
                    } catch (Exception e) {
                        Log.e(TAG, "GetFloat failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("putString").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        String aString = args.getString(1);
                        editor.putString(ref, aString);
                        boolean success = editor.commit();
                        if (success) callbackContext.success(aString);
                        else callbackContext.error("Write failed");
                    } catch (Exception e) {
                        Log.e(TAG, "PutString failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("getString").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        //System.out.println("Receveived reference: " + ref);
                        String s = sharedPref.getString(ref, "null");
                        callbackContext.success(s);
                    } catch (Exception e) {
                        Log.e(TAG, "GetString failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("setItem").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        String aString = args.getString(1);
                        editor.putString(ref, aString);
                        boolean success = editor.commit();
                        if (success) callbackContext.success(aString);
                        else callbackContext.error(1); //nativeWrite failed
                    } catch (Exception e) {
                        Log.e(TAG, "setItem :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("setItemWithPassword").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        /* getting arguments */
                        String ref = args.getString(0);
                        String aString = args.getString(1);
                        String pwd = args.getString(2);

                        String ciphertext = "";
                        try {
                            ciphertext = Crypto.encrypt(aString, pwd);
                        } catch (InvalidKeySpecException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (NoSuchAlgorithmException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (NoSuchPaddingException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (InvalidAlgorithmParameterException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (InvalidKeyException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (BadPaddingException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        } catch (IllegalBlockSizeException e) {
                            e.printStackTrace();
                            callbackContext.error(e.getMessage());
                        }
                        if (!ciphertext.equals("")) {
                            editor.putString(ref, ciphertext);
                            boolean success = editor.commit();
                            if (success) callbackContext.success(aString);
                            else callbackContext.error(1); //nativeWrite failed
                        } else {
                            callbackContext.error("Encryption failed");
                        }

                    } catch (Exception e) {
                        Log.e(TAG, "setItem :", e);
                        e.printStackTrace();
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("getItem").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        //System.out.println("Receveived reference: " + ref);
                        String s = sharedPref.getString(ref, "nativestorage_null");
                        if (s.equals("nativestorage_null")) {
                            callbackContext.error(2);  // item not found
                        } else callbackContext.success(s);
                    } catch (Exception e) {
                        Log.e(TAG, "getItem failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("getItemWithPassword").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
            /* getting arguments */
                        String ref = args.getString(0);
                        String pwd = args.getString(1);
                        //System.out.println("Receveived reference: " + ref);
                        String ciphertext = sharedPref.getString(ref, "nativestorage_null");
                        if (ciphertext.equals("nativestorage_null")) {
                            callbackContext.error(2);  // item not found
                        } else {
                            try {
                                String plaintext = Crypto.decryptPbkdf2(ciphertext, pwd);
                                callbackContext.success(plaintext);
                            } catch (InvalidKeySpecException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (NoSuchAlgorithmException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (NoSuchPaddingException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (InvalidAlgorithmParameterException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (InvalidKeyException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (UnsupportedEncodingException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (BadPaddingException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            } catch (IllegalBlockSizeException e) {
                                e.printStackTrace();
                                callbackContext.error(e.getMessage());
                            }
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "getItem failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        if (("keys").equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        Map<String, ?> allEntries = sharedPref.getAll();
                        callbackContext.success(new JSONArray(allEntries.keySet()));
                    } catch (Exception e) {
                        Log.e(TAG, "Get keys failed :", e);
                        callbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }

        return false;

    }
}
