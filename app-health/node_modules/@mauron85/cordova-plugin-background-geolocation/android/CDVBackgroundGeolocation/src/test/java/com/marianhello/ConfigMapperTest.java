package com.marianhello;

import com.marianhello.bgloc.Config;
import com.marianhello.bgloc.cordova.ConfigMapper;
import com.marianhello.bgloc.data.ArrayListLocationTemplate;
import com.marianhello.bgloc.data.HashMapLocationTemplate;
import com.marianhello.bgloc.data.LocationTemplate;
import com.marianhello.bgloc.data.LocationTemplateFactory;

import junit.framework.Assert;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by finch on 15.12.2017.
 */

@RunWith(RobolectricTestRunner.class)
public class ConfigMapperTest {
    @Test
    public void testDefaultToJSONObject() throws JSONException {
        Config config = Config.getDefault();
        JSONObject jConfig = ConfigMapper.toJSONObject(config);
        Assert.assertEquals(config.getStationaryRadius(), jConfig.getDouble("stationaryRadius"), 0f);
        Assert.assertEquals(config.getDistanceFilter().intValue(), jConfig.getInt("distanceFilter"));
        Assert.assertEquals(config.getDesiredAccuracy().intValue(), jConfig.getInt("desiredAccuracy"));
        Assert.assertEquals(config.isDebugging().booleanValue(), jConfig.getBoolean("debug"));
        Assert.assertEquals(config.getNotificationTitle(), jConfig.getString("notificationTitle"));
        Assert.assertEquals(config.getNotificationText(), jConfig.getString("notificationText"));
        Assert.assertEquals(config.getStopOnTerminate().booleanValue(), jConfig.getBoolean("stopOnTerminate"));
        Assert.assertEquals(config.getStartOnBoot().booleanValue(), jConfig.getBoolean("startOnBoot"));
        Assert.assertEquals(config.getLocationProvider().intValue(), jConfig.getInt("locationProvider"));
        Assert.assertEquals(config.getInterval().intValue(), jConfig.getInt("interval"));
        Assert.assertEquals(config.getFastestInterval().intValue(), jConfig.getInt("fastestInterval"));
        Assert.assertEquals(config.getActivitiesInterval().intValue(), jConfig.getInt("activitiesInterval"));
        Assert.assertEquals(config.getNotificationIconColor(), jConfig.getString("notificationIconColor"));
        Assert.assertEquals(config.getLargeNotificationIcon(), jConfig.getString("notificationIconLarge"));
        Assert.assertEquals(config.getSmallNotificationIcon(), jConfig.getString("notificationIconSmall"));
        Assert.assertEquals(config.getStartForeground().booleanValue(), jConfig.getBoolean("startForeground"));
        Assert.assertEquals(config.getStopOnStillActivity().booleanValue(), jConfig.getBoolean("stopOnStillActivity"));
        Assert.assertEquals(config.getUrl(), jConfig.getString("url"));
        Assert.assertEquals(config.getSyncUrl(), jConfig.getString("syncUrl"));
        Assert.assertEquals(config.getSyncThreshold().intValue(), jConfig.getInt("syncThreshold"));
        Assert.assertEquals(new JSONObject(config.getHttpHeaders()).toString(), jConfig.getJSONObject("httpHeaders").toString());
        Assert.assertEquals(config.getMaxLocations().intValue(), jConfig.getInt("maxLocations"));
        Assert.assertEquals(LocationTemplateFactory.getDefault().toString(), jConfig.get("postTemplate").toString());
    }

    @Test
    public void testNullableProps() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("url", JSONObject.NULL);
        json.put("syncUrl", JSONObject.NULL);
        json.put("notificationIconColor", JSONObject.NULL);
        json.put("notificationTitle", JSONObject.NULL);
        json.put("notificationText", JSONObject.NULL);
        json.put("notificationIconLarge", JSONObject.NULL);
        json.put("notificationIconSmall", JSONObject.NULL);

        Config config = ConfigMapper.fromJSONObject(json);

        Assert.assertEquals(Config.NullString, config.getUrl());
        Assert.assertTrue(config.hasUrl());
        Assert.assertFalse(config.hasValidUrl());

        Assert.assertEquals(Config.NullString, config.getSyncUrl());
        Assert.assertTrue(config.hasSyncUrl());
        Assert.assertFalse(config.hasValidSyncUrl());

        Assert.assertEquals(Config.NullString, config.getNotificationIconColor());
        Assert.assertFalse(config.hasNotificationIconColor());

        Assert.assertEquals(Config.NullString, config.getNotificationTitle());
        Assert.assertTrue(config.hasNotificationTitle());

        Assert.assertEquals(Config.NullString, config.getNotificationText());
        Assert.assertTrue(config.hasNotificationText());

        Assert.assertEquals(Config.NullString, config.getLargeNotificationIcon());
        Assert.assertFalse(config.hasLargeNotificationIcon());

        Assert.assertEquals(Config.NullString, config.getSmallNotificationIcon());
        Assert.assertFalse(config.hasSmallNotificationIcon());
    }

    @Test
    public void testNullablePropsToJSONObject() throws JSONException {
        Config config = new Config();
        config.setUrl(Config.NullString);
        config.setSyncUrl(Config.NullString);
        config.setNotificationIconColor(Config.NullString);
        config.setNotificationTitle(Config.NullString);
        config.setNotificationText(Config.NullString);
        config.setLargeNotificationIcon(Config.NullString);
        config.setSmallNotificationIcon(Config.NullString);

        JSONObject json = ConfigMapper.toJSONObject(config);

        Assert.assertEquals(JSONObject.NULL, json.get("url"));
        Assert.assertEquals(JSONObject.NULL, json.get("syncUrl"));
        Assert.assertEquals(JSONObject.NULL, json.get("notificationIconColor"));
        Assert.assertEquals(JSONObject.NULL, json.get("notificationTitle"));
        Assert.assertEquals(JSONObject.NULL, json.get("notificationText"));
        Assert.assertEquals(JSONObject.NULL, json.get("notificationIconLarge"));
        Assert.assertEquals(JSONObject.NULL, json.get("notificationIconSmall"));
    }

    @Test
    public void testNullHashMapTemplateToJSONObject() {
        Config config = new Config();
        LocationTemplate tpl = new HashMapLocationTemplate((HashMapLocationTemplate)null);
        config.setTemplate(tpl);

        try {
            JSONObject jConfig = ConfigMapper.toJSONObject(config);
            Assert.assertEquals(JSONObject.NULL, jConfig.get("postTemplate"));
        } catch (JSONException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void testEmptyHashMapTemplateToJSONObject() {
        Config config = new Config();
        HashMap map = new HashMap();
        LocationTemplate tpl = new HashMapLocationTemplate(map);
        config.setTemplate(tpl);

        try {
            JSONObject jConfig = ConfigMapper.toJSONObject(config);
            Assert.assertEquals("{}", jConfig.get("postTemplate").toString());
        } catch (JSONException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void testHashMapTemplateToJSONObject() {
        Config config = new Config();
        HashMap map = new HashMap();
        map.put("foo", "bar");
        map.put("pretzels", 123);
        LocationTemplate tpl = new HashMapLocationTemplate(map);
        config.setTemplate(tpl);

        try {
            JSONObject jConfig = ConfigMapper.toJSONObject(config);
            Assert.assertEquals("{\"foo\":\"bar\",\"pretzels\":123}", jConfig.get("postTemplate").toString());
        } catch (JSONException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void testNullArrayListLocationTemplateToJSONObject() {
        Config config = new Config();
        LocationTemplate tpl = new ArrayListLocationTemplate((ArrayListLocationTemplate)null);
        config.setTemplate(tpl);

        try {
            JSONObject jConfig = ConfigMapper.toJSONObject(config);
            Assert.assertEquals(JSONObject.NULL, jConfig.get("postTemplate"));
        } catch (JSONException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void testEmptyArrayListLocationTemplateToJSONObject() {
        Config config = new Config();
        ArrayList list = new ArrayList();
        LocationTemplate tpl = new ArrayListLocationTemplate(list);
        config.setTemplate(tpl);

        try {
            JSONObject jConfig = ConfigMapper.toJSONObject(config);
            Assert.assertEquals("[]", jConfig.get("postTemplate").toString());
        } catch (JSONException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void testArrayListLocationTemplateToJSONObject() {
        Config config = new Config();
        ArrayList list = new ArrayList();
        list.add("foo");
        list.add(123);
        list.add("foo");

        LocationTemplate tpl = new ArrayListLocationTemplate(list);
        config.setTemplate(tpl);

        try {
            JSONObject jConfig = ConfigMapper.toJSONObject(config);
            Assert.assertEquals("[\"foo\",123,\"foo\"]", jConfig.get("postTemplate").toString());
        } catch (JSONException e) {
            Assert.fail(e.getMessage());
        }
    }
}
