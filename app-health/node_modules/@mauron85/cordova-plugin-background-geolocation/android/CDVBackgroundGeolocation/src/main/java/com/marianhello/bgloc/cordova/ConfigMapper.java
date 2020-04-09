package com.marianhello.bgloc.cordova;

import com.marianhello.bgloc.Config;
import com.marianhello.bgloc.data.ArrayListLocationTemplate;
import com.marianhello.bgloc.data.HashMapLocationTemplate;
import com.marianhello.bgloc.data.LocationTemplate;
import com.marianhello.bgloc.data.LocationTemplateFactory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Map;

/**
 * Created by finch on 29.11.2017.
 */

public class ConfigMapper {
    public static Config fromJSONObject (JSONObject jObject) throws JSONException {
        Config config = new Config();

        if (jObject.has("stationaryRadius")) {
            config.setStationaryRadius(jObject.getDouble("stationaryRadius"));
        }
        if (jObject.has("distanceFilter")) {
            config.setDistanceFilter(jObject.getInt("distanceFilter"));
        }
        if (jObject.has("desiredAccuracy")) {
            config.setDesiredAccuracy(jObject.getInt("desiredAccuracy"));
        }
        if (jObject.has("debug")) {
            config.setDebugging(jObject.getBoolean("debug"));
        }
        if (jObject.has("notificationsEnabled")) {
            config.setNotificationsEnabled(jObject.getBoolean("notificationsEnabled"));
        }
        if (jObject.has("notificationTitle")) {
            config.setNotificationTitle(!jObject.isNull("notificationTitle") ? jObject.getString("notificationTitle") : Config.NullString);
        }
        if (jObject.has("notificationText")) {
            config.setNotificationText(!jObject.isNull("notificationText") ? jObject.getString("notificationText") : Config.NullString);
        }
        if (jObject.has("stopOnTerminate")) {
            config.setStopOnTerminate(jObject.getBoolean("stopOnTerminate"));
        }
        if (jObject.has("startOnBoot")) {
            config.setStartOnBoot(jObject.getBoolean("startOnBoot"));
        }
        if (jObject.has("locationProvider")) {
            config.setLocationProvider(jObject.getInt("locationProvider"));
        }
        if (jObject.has("interval")) {
            config.setInterval(jObject.getInt("interval"));
        }
        if (jObject.has("fastestInterval")) {
            config.setFastestInterval(jObject.getInt("fastestInterval"));
        }
        if (jObject.has("activitiesInterval")) {
            config.setActivitiesInterval(jObject.getInt("activitiesInterval"));
        }
        if (jObject.has("notificationIconColor")) {
            config.setNotificationIconColor(!jObject.isNull("notificationIconColor") ? jObject.getString("notificationIconColor") : Config.NullString);
        }
        if (jObject.has("notificationIconLarge")) {
            config.setLargeNotificationIcon(!jObject.isNull("notificationIconLarge") ? jObject.getString("notificationIconLarge") : Config.NullString);
        }
        if (jObject.has("notificationIconSmall")) {
            config.setSmallNotificationIcon(!jObject.isNull("notificationIconSmall") ? jObject.getString("notificationIconSmall") : Config.NullString);
        }
        if (jObject.has("startForeground")) {
            config.setStartForeground(jObject.getBoolean("startForeground"));
        }
        if (jObject.has("stopOnStillActivity")) {
            config.setStopOnStillActivity(jObject.getBoolean("stopOnStillActivity"));
        }
        if (jObject.has("url")) {
            config.setUrl(!jObject.isNull("url") ? jObject.getString("url") : Config.NullString);
        }
        if (jObject.has("syncUrl")) {
            config.setSyncUrl(!jObject.isNull("syncUrl") ? jObject.getString("syncUrl") : Config.NullString);
        }
        if (jObject.has("syncThreshold")) {
            config.setSyncThreshold(jObject.getInt("syncThreshold"));
        }
        if (jObject.has("httpHeaders")) {
            config.setHttpHeaders(jObject.getJSONObject("httpHeaders"));
        }
        if (jObject.has("maxLocations")) {
            config.setMaxLocations(jObject.getInt("maxLocations"));
        }
        if (jObject.has("postTemplate")) {
            if (jObject.isNull("postTemplate")) {
                config.setTemplate(LocationTemplateFactory.getDefault());
            } else {
                Object postTemplate = jObject.get("postTemplate");
                config.setTemplate(LocationTemplateFactory.fromJSON(postTemplate));
            }
        }

        return config;
    }

    public static JSONObject toJSONObject(Config config) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("stationaryRadius", config.getStationaryRadius());
        json.put("distanceFilter", config.getDistanceFilter());
        json.put("desiredAccuracy", config.getDesiredAccuracy());
        json.put("debug", config.isDebugging());
        json.put("notificationsEnabled", config.getNotificationsEnabled());
        json.put("notificationTitle", config.getNotificationTitle() != Config.NullString ? config.getNotificationTitle() : JSONObject.NULL);
        json.put("notificationText", config.getNotificationText() != Config.NullString ? config.getNotificationText() : JSONObject.NULL);
        json.put("notificationIconLarge", config.getLargeNotificationIcon() != Config.NullString ? config.getLargeNotificationIcon() : JSONObject.NULL);
        json.put("notificationIconSmall", config.getSmallNotificationIcon() != Config.NullString ? config.getSmallNotificationIcon() : JSONObject.NULL);
        json.put("notificationIconColor", config.getNotificationIconColor() != Config.NullString ? config.getNotificationIconColor() : JSONObject.NULL);
        json.put("stopOnTerminate", config.getStopOnTerminate());
        json.put("startOnBoot", config.getStartOnBoot());
        json.put("startForeground", config.getStartForeground());
        json.put("locationProvider", config.getLocationProvider());
        json.put("interval", config.getInterval());
        json.put("fastestInterval", config.getFastestInterval());
        json.put("activitiesInterval", config.getActivitiesInterval());
        json.put("stopOnStillActivity", config.getStopOnStillActivity());
        json.put("url", config.getUrl() != Config.NullString ? config.getUrl() : JSONObject.NULL);
        json.put("syncUrl", config.getSyncUrl() != Config.NullString  ? config.getSyncUrl() : JSONObject.NULL);
        json.put("syncThreshold", config.getSyncThreshold());
        json.put("httpHeaders", new JSONObject(config.getHttpHeaders()));
        json.put("maxLocations", config.getMaxLocations());
        LocationTemplate tpl = config.getTemplate();
        Object template = JSONObject.NULL;
        if (tpl instanceof HashMapLocationTemplate) {
            Map map = ((HashMapLocationTemplate)tpl).toMap();
            if (map != null) {
                template = new JSONObject(map);
            }
        } else if (tpl instanceof ArrayListLocationTemplate) {
            Object[] keys = ((ArrayListLocationTemplate)tpl).toArray();
            if (keys != null) {
                template = new JSONArray(Arrays.asList(keys));
            }
        }

        json.put("postTemplate", template);

        return json;
    }
}
