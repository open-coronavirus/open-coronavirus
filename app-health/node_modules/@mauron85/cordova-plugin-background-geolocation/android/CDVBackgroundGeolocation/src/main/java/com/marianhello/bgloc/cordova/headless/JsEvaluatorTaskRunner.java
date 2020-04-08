package com.marianhello.bgloc.cordova.headless;

import android.content.Context;

import com.evgenii.jsevaluator.JsEvaluator;
import com.evgenii.jsevaluator.interfaces.JsCallback;
import com.marianhello.bgloc.cordova.PluginRegistry;
import com.marianhello.bgloc.headless.AbstractTaskRunner;
import com.marianhello.bgloc.headless.Task;

public class JsEvaluatorTaskRunner extends AbstractTaskRunner {
    private JsEvaluator mJsEvaluator;
    public static String BUNDLE_KEY = "JS";

    public JsEvaluatorTaskRunner() {}

    @Override
    public void runTask(final Task task) {
        String headlessTask = PluginRegistry.getInstance().getHeadlessTask();

        if (headlessTask == null) {
            task.onError("Cannot run task due missing jsEvaluator. Did you called setFunction?");
            return;
        }

        JsCallback callback = new JsCallback() {
            @Override
            public void onResult(String value) {
                task.onResult(value);
            }

            @Override
            public void onError(String errorMessage) {
                task.onError(errorMessage);
            }
        };

        String jsTask = new StringBuilder()
                .append("function task(name, paramsString) {")
                .append("var params = JSON.parse(paramsString);")
                .append("var task = { name: name, params: params };")
                .append("return(" + headlessTask + ")(task);")
                .append("}").toString();

        mJsEvaluator.callFunction(jsTask, callback, "task", task.getName(), task.toString());
    }

    @Override
    public void setContext(Context context) {
        super.setContext(context);
        mJsEvaluator = new JsEvaluator(context);
    }
}
