/*
According to apache license

This is fork of christocracy cordova-plugin-background-geolocation plugin
https://github.com/christocracy/cordova-plugin-background-geolocation

Differences to original version:

1. new methods isLocationEnabled, mMessageReciever, handleMessage
*/

package com.tenforwardconsulting.bgloc.cordova;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

import com.marianhello.bgloc.BackgroundGeolocationFacade;
import com.marianhello.bgloc.Config;
import com.marianhello.bgloc.PluginDelegate;
import com.marianhello.bgloc.PluginException;
import com.marianhello.bgloc.cordova.ConfigMapper;
import com.marianhello.bgloc.cordova.PluginRegistry;
import com.marianhello.bgloc.cordova.headless.JsEvaluatorTaskRunner;
import com.marianhello.bgloc.data.BackgroundActivity;
import com.marianhello.bgloc.data.BackgroundLocation;
import com.marianhello.logging.LogEntry;
import com.marianhello.logging.LoggerManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collection;

public class BackgroundGeolocationPlugin extends CordovaPlugin implements PluginDelegate {

    public static final String LOCATION_EVENT = "location";
    public static final String STATIONARY_EVENT = "stationary";
    public static final String ACTIVITY_EVENT = "activity";
    public static final String FOREGROUND_EVENT = "foreground";
    public static final String BACKGROUND_EVENT = "background";
    public static final String AUTHORIZATION_EVENT = "authorization";
    public static final String START_EVENT = "start";
    public static final String STOP_EVENT = "stop";
    public static final String ABORT_REQUESTED_EVENT = "abort_requested";
    public static final String HTTP_AUTHORIZATION_EVENT = "http_authorization";

    public static final String ACTION_START = "start";
    public static final String ACTION_STOP = "stop";
    public static final String ACTION_CONFIGURE = "configure";
    public static final String ACTION_SWITCH_MODE = "switchMode";
    public static final String ACTION_LOCATION_ENABLED_CHECK = "isLocationEnabled";
    public static final String ACTION_SHOW_LOCATION_SETTINGS = "showLocationSettings";
    public static final String ACTION_SHOW_APP_SETTINGS = "showAppSettings";
    public static final String ACTION_GET_STATIONARY = "getStationaryLocation";
    public static final String ACTION_GET_ALL_LOCATIONS = "getLocations";
    public static final String ACTION_GET_VALID_LOCATIONS = "getValidLocations";
    public static final String ACTION_DELETE_LOCATION = "deleteLocation";
    public static final String ACTION_DELETE_ALL_LOCATIONS = "deleteAllLocations";
    public static final String ACTION_GET_CURRENT_LOCATION = "getCurrentLocation";
    public static final String ACTION_GET_CONFIG = "getConfig";
    public static final String ACTION_GET_LOG_ENTRIES = "getLogEntries";
    public static final String ACTION_CHECK_STATUS = "checkStatus";
    public static final String ACTION_REGISTER_EVENT_LISTENER = "addEventListener";
    public static final String ACTION_START_TASK = "startTask";
    public static final String ACTION_END_TASK = "endTask";
    public static final String ACTION_REGISTER_HEADLESS_TASK = "registerHeadlessTask";
    public static final String ACTION_FORCE_SYNC = "forceSync";

    private BackgroundGeolocationFacade facade;

    private CallbackContext callbackContext;

    private org.slf4j.Logger logger;

    public static class ErrorPluginResult {
        public static PluginResult from(String message, int code) {
            JSONObject json = new JSONObject();
            try {
                json.put("code", code);
                json.put("message", message);
            } catch (JSONException e) {
                // not interested
            }
            return new PluginResult(PluginResult.Status.ERROR, json);
        }

        public static PluginResult from(String message, Throwable cause, int code) {
            JSONObject json = new JSONObject();
            try {
                json.put("code", code);
                json.put("message", message);
                json.put("cause", from(cause));
            } catch (JSONException e) {
                // not interested
            }
            return new PluginResult(PluginResult.Status.ERROR, json);
        }

        public static PluginResult from(PluginException e) {
            JSONObject json = new JSONObject();
            try {
                json.put("code", e.getCode());
                json.put("message", e.getMessage());
                if (e.getCause() != null) {
                    json.put("cause", from(e.getCause()));
                }
            } catch (JSONException ex) {
                // not interested
            }

            return new PluginResult(PluginResult.Status.ERROR, json);
        }

        private static JSONObject from(Throwable e) {
            JSONObject error = new JSONObject();
            try {
                error.put("message", e.getMessage());
            } catch (JSONException e1) {
                // not interested
            }
            return error;
        }
    }

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();

        logger = LoggerManager.getLogger(BackgroundGeolocationPlugin.class);
        facade = new BackgroundGeolocationFacade(this.getContext(), this);
        facade.resume();
    }

    public boolean execute(String action, final JSONArray data, final CallbackContext callbackContext) {
        Context context = getContext();

        if (ACTION_REGISTER_EVENT_LISTENER.equals(action)) {
            logger.debug("Registering event listeners");
            this.callbackContext = callbackContext;

            return true;
        }
        else if (ACTION_START.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    start();
                }
            });

            return true;
        } else if (ACTION_STOP.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    facade.stop();
                }
            });

            return true;
        } else if (ACTION_SWITCH_MODE.equals(action)) {
            try {
                int mode = data.getInt(0);
                facade.switchMode(mode);
            } catch (JSONException e) {
                logger.error("Switch mode error: {}", e.getMessage());
                sendError(new PluginException(e.getMessage(), PluginException.JSON_ERROR));
            }

            return true;
        } else if (ACTION_CONFIGURE.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        Config config = ConfigMapper.fromJSONObject(data.getJSONObject(0));
                        facade.configure(config);
                        callbackContext.success();
                    } catch (JSONException e) {
                        logger.error("Configuration error: {}", e.getMessage());
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Configuration error", e, PluginException.CONFIGURE_ERROR));
                    } catch (PluginException e) {
                        logger.error("Configuration error: {}", e.getMessage());
                        callbackContext.sendPluginResult(ErrorPluginResult.from(e));
                    }
                }
            });

            return true;
        } else if (ACTION_LOCATION_ENABLED_CHECK.equals(action)) {
            logger.debug("Location services enabled check");
            try {
                callbackContext.success(facade.locationServicesEnabled() ? 1 : 0);
            } catch (PluginException e) {
                logger.error("Location service checked failed: {}", e.getMessage());
                callbackContext.sendPluginResult(ErrorPluginResult.from(e));
            }

            return true;
        } else if (ACTION_SHOW_LOCATION_SETTINGS.equals(action)) {
            BackgroundGeolocationFacade.showLocationSettings(context);

            return true;
        } else if (ACTION_SHOW_APP_SETTINGS.equals(action)) {
            BackgroundGeolocationFacade.showAppSettings(context);

            return true;
        } else if (ACTION_GET_STATIONARY.equals(action)) {
            try {
                BackgroundLocation stationaryLocation = facade.getStationaryLocation();
                if (stationaryLocation != null) {
                    callbackContext.success(stationaryLocation.toJSONObject());
                } else {
                    callbackContext.success();
                }
            } catch (JSONException e) {
                logger.error("Getting stationary location failed: {}", e.getMessage());
                callbackContext.sendPluginResult(ErrorPluginResult.from("Getting stationary location failed", e, PluginException.JSON_ERROR));
            }

            return true;
        } else if (ACTION_GET_ALL_LOCATIONS.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        callbackContext.success(getAllLocations());
                    } catch (JSONException e) {
                        logger.error("Getting all locations failed: {}", e.getMessage());
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Converting locations to JSON failed", e, PluginException.JSON_ERROR));
                    }
                }
            });

            return true;
        } else if (ACTION_GET_VALID_LOCATIONS.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        callbackContext.success(getValidLocations());
                    } catch (JSONException e) {
                        logger.error("Getting valid locations failed: {}", e.getMessage());
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Converting locations to JSON failed", e, PluginException.JSON_ERROR));
                    }
                }
            });

            return true;
        } else if (ACTION_DELETE_LOCATION.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        Long locationId = data.getLong(0);
                        facade.deleteLocation(locationId);
                        callbackContext.success();
                    } catch (JSONException e) {
                        logger.error("Delete location failed: {}", e.getMessage());
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Delete location failed", e, PluginException.JSON_ERROR));
                    }
                }
            });

            return true;
        } else if (ACTION_DELETE_ALL_LOCATIONS.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    facade.deleteAllLocations();
                    callbackContext.success();
                }
            });

            return true;
        } else if (ACTION_GET_CURRENT_LOCATION.equals(action)) {
            runOnWebViewThread(new Runnable() {
                @Override
                public void run() {
                    int timeout = data.optInt(0, Integer.MAX_VALUE);
                    long maximumAge = data.optLong(1, Long.MAX_VALUE);
                    boolean enableHighAccuracy = data.optBoolean(2, false);
                    try {
                        BackgroundLocation location = facade.getCurrentLocation(timeout, maximumAge, enableHighAccuracy);
                        callbackContext.success(location.toJSONObject());
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(ErrorPluginResult.from(e.getMessage(), 2));
                    } catch (PluginException e) {
                        callbackContext.sendPluginResult(ErrorPluginResult.from(e));
                    }
                }
            });

            return true;
        } else if (ACTION_GET_CONFIG.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        Config config = facade.getConfig();
                        callbackContext.success(ConfigMapper.toJSONObject(config));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Error getting config", e, PluginException.JSON_ERROR));
                    }
                }
            });

            return true;
        } else if (ACTION_GET_LOG_ENTRIES.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        int limit = data.getInt(0);
                        int offset = data.getInt(1);
                        String minLevel = data.getString(2);
                        callbackContext.success(getLogs(limit, offset, minLevel));
                    } catch (Exception e) {
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Getting logs failed", e, PluginException.SERVICE_ERROR));
                    }
                }
            });

            return true;
        } else if (ACTION_CHECK_STATUS.equals(action)) {
            runOnWebViewThread(new Runnable() {
                public void run() {
                    try {
                        callbackContext.success(checkStatus());
                    } catch (Exception e) {
                        callbackContext.sendPluginResult(ErrorPluginResult.from("Checking status failed", e, PluginException.SERVICE_ERROR));
                    }
                }
            });

            return true;
        } else if (ACTION_START_TASK.equals(action)) {
            callbackContext.success(1);
            return true;
        } else if (ACTION_END_TASK.equals(action)) {
            callbackContext.success();
            return true;
        } else if (ACTION_REGISTER_HEADLESS_TASK.equals(action)) {
            logger.debug("Registering headless task");
            try {
                PluginRegistry.getInstance().registerHeadlessTask(data.getString(0));
                facade.registerHeadlessTask(JsEvaluatorTaskRunner.class.getName());
            } catch (JSONException e) {
                callbackContext.sendPluginResult(ErrorPluginResult.from("Registering headless task failed", e, PluginException.JSON_ERROR));
            }
            return true;
        } else if (ACTION_FORCE_SYNC.equals(action)) {
            logger.debug("Forced location sync requested");
            facade.forceSync();
            return true;
        }

        return false;
    }

    private void start() {
        facade.start();
    }

    /**
     * Called when the system is about to start resuming a previous activity.
     *
     * @param multitasking		Flag indicating if multitasking is turned on for app
     */
    public void onPause(boolean multitasking) {
        logger.info("App will be paused multitasking={}", multitasking);
        facade.pause();
        sendEvent(BACKGROUND_EVENT);
    }

    /**
     * Called when the activity will start interacting with the user.
     *
     * @param multitasking		Flag indicating if multitasking is turned on for app
     */
    public void onResume(boolean multitasking) {
        logger.info("App will be resumed multitasking={}", multitasking);
        facade.resume();
        sendEvent(FOREGROUND_EVENT);
    }

    /**
     * Called when the activity is becoming visible to the user.
     */
    public void onStart() {
        logger.info("App is visible");
    }

    /**
     * Called when the activity is no longer visible to the user.
     */
    public void onStop() {
        logger.info("App is no longer visible");
    }

    /**
     * The final call you receive before your activity is destroyed.
     * Checks to see if it should turn off
     */
    @Override
    public void onDestroy() {
        logger.info("Destroying plugin");
        facade.destroy();
        super.onDestroy();
    }

    public Activity getActivity() {
        return cordova.getActivity();
    }

    public Context getContext() {
        return getActivity().getApplicationContext();
    }

    protected Application getApplication() {
        return getActivity().getApplication();
    }

    private void sendEvent(String name) {
        if (callbackContext == null) {
            return;
        }
        JSONObject event = new JSONObject();
        try {
            event.put("name", name);
            PluginResult result = new PluginResult(PluginResult.Status.OK, event);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        } catch (JSONException e) {
            logger.error("Error sending event {}: {}", name, e.getMessage());
        }
    }

    private void sendEvent(String name, JSONObject payload) {
        if (callbackContext == null) {
            return;
        }
        JSONObject event = new JSONObject();
        try {
            event.put("name", name);
            event.put("payload", payload);
            PluginResult result = new PluginResult(PluginResult.Status.OK, event);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        } catch (JSONException e) {
            logger.error("Error sending event {}: {}", name, e.getMessage());
        }
    }

    private void sendEvent(String name, Integer payload) {
        if (callbackContext == null) {
            return;
        }
        JSONObject event = new JSONObject();
        try {
            event.put("name", name);
            event.put("payload", payload);
            PluginResult result = new PluginResult(PluginResult.Status.OK, event);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        } catch (JSONException e) {
            logger.error("Error sending event {}: {}", name, e.getMessage());
        }
    }

    private void sendError(PluginException e) {
        if (callbackContext == null) {
            return;
        }
        PluginResult result = ErrorPluginResult.from(e);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    private void runOnUiThread(Runnable runnable) {
        getActivity().runOnUiThread(runnable);
    }

    private void runOnWebViewThread(Runnable runnable) {
        cordova.getThreadPool().execute(runnable);
    }

    private JSONArray getAllLocations() throws JSONException {
        JSONArray jsonLocationsArray = new JSONArray();
        Collection<BackgroundLocation> locations = facade.getLocations();
        for (BackgroundLocation location : locations) {
            jsonLocationsArray.put(location.toJSONObjectWithId());
        }
        return jsonLocationsArray;
    }

    private JSONArray getValidLocations() throws JSONException {
        JSONArray jsonLocationsArray = new JSONArray();
        Collection<BackgroundLocation> locations = facade.getValidLocations();
        for (BackgroundLocation location : locations) {
            jsonLocationsArray.put(location.toJSONObjectWithId());
        }
        return jsonLocationsArray;
    }

    private JSONArray getLogs(Integer limit, int offset, String minLevel) throws Exception {
        JSONArray jsonLogsArray = new JSONArray();
        Collection<LogEntry> logEntries = facade.getLogEntries(limit, offset, minLevel);
        for (LogEntry logEntry : logEntries) {
            jsonLogsArray.put(logEntry.toJSONObject());
        }
        return jsonLogsArray;
    }

    private JSONObject checkStatus() throws JSONException, PluginException {
        JSONObject json = new JSONObject();
        json.put("isRunning", facade.isRunning());
        json.put("hasPermissions", facade.hasPermissions()); //@Deprecated
        json.put("locationServicesEnabled", facade.locationServicesEnabled());
        json.put("authorization", facade.getAuthorizationStatus());

        return json;
    }

    @Override
    public void onAuthorizationChanged(int authStatus) {
        sendEvent(AUTHORIZATION_EVENT, authStatus);
    }

    @Override
    public void onLocationChanged(BackgroundLocation location) {
        try {
            sendEvent(LOCATION_EVENT, location.toJSONObjectWithId());
        } catch (JSONException e) {
            logger.error("Error converting location to json: {}", e.getMessage());
            sendError(new PluginException(e.getMessage(), PluginException.JSON_ERROR));
        }
    }

    @Override
    public void onStationaryChanged(BackgroundLocation location) {
        try {
            sendEvent(STATIONARY_EVENT, location.toJSONObjectWithId());
        } catch (JSONException e) {
            logger.error("Error converting location to json: {}", e.getMessage());
            sendError(new PluginException(e.getMessage(), PluginException.JSON_ERROR));
        }
    }

    @Override
    public void onActivityChanged(BackgroundActivity activity) {
        try {
            sendEvent(ACTIVITY_EVENT, activity.toJSONObject());
        } catch (JSONException e) {
            logger.error("Error converting activity to json: {}", e.getMessage());
            sendError(new PluginException(e.getMessage(), PluginException.JSON_ERROR));
        }
    }

    @Override
    public void onServiceStatusChanged(int status) {
        switch (status) {
            case BackgroundGeolocationFacade.SERVICE_STARTED:
                sendEvent(START_EVENT);
                return;
            case BackgroundGeolocationFacade.SERVICE_STOPPED:
                sendEvent(STOP_EVENT);
                return;
        }
    }

    @Override
    public void onAbortRequested() {
        sendEvent(ABORT_REQUESTED_EVENT, 0);
    }

    @Override
    public void onHttpAuthorization() {
        sendEvent(HTTP_AUTHORIZATION_EVENT);
    }

    @Override
    public void onError(PluginException e) {
        sendError(e);
    }
}
