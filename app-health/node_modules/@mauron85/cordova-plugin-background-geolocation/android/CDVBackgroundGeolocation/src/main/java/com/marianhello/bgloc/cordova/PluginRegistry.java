package com.marianhello.bgloc.cordova;

public class PluginRegistry {
    private String headlessTask;

    private static PluginRegistry instance;

    private PluginRegistry() {
    }

    public String getHeadlessTask() {
        return headlessTask;
    }

    public void registerHeadlessTask(String headlessTask) {
        this.headlessTask = headlessTask;
    }

    public static PluginRegistry getInstance() {
        if (instance == null) {
            instance = new PluginRegistry();
        }
        return instance;
    }
}
