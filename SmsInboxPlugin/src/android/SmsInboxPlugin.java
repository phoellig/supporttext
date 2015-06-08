/*
Copyright (C) 2013 by Pierre-Yves Orban

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
package org.apache.cordova.plugin.smsinboxplugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.List;
import java.util.ArrayList;

import android.app.Activity;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Telephony;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

public class SmsInboxPlugin extends CordovaPlugin {
	public final String ACTION_HAS_SMS_POSSIBILITY = "HasSMSPossibility";
	public final String ACTION_RECEIVE_SMS = "StartReception";
	public final String ACTION_STOP_RECEIVE_SMS = "StopReception";
	public final String ACTION_GET_MESSAGES = "getMessages";
	
	private CallbackContext callback_receive;
	private org.apache.cordova.plugin.smsinboxplugin.SmsReceiver smsReceiver = null;
	private boolean isReceiving = false;
	
	public SmsInboxPlugin() {
		super();
	}
	
	@Override
	public boolean execute(String action, JSONArray arg1,
			final CallbackContext callbackContext) throws JSONException {
		
		if (action.equals(ACTION_HAS_SMS_POSSIBILITY)) {
			
			Activity ctx = this.cordova.getActivity();
			if(ctx.getPackageManager().hasSystemFeature(PackageManager.FEATURE_TELEPHONY)){
				callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, true));
			} else {
				callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, false));
			}
			return true;
		}
		else if (action.equals(ACTION_RECEIVE_SMS)) {
			
			// if already receiving (this case can happen if the startReception is called
			// several times
			if(this.isReceiving) {
				// close the already opened callback ...
				PluginResult pluginResult = new PluginResult(
						PluginResult.Status.NO_RESULT);
				pluginResult.setKeepCallback(false);
				this.callback_receive.sendPluginResult(pluginResult);
				
				// ... before registering a new one to the sms receiver
			}
			this.isReceiving = true;
				
			if(this.smsReceiver == null) {
				this.smsReceiver = new SmsReceiver();
				IntentFilter fp = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
			    fp.setPriority(1000);
			    // fp.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
			    this.cordova.getActivity().registerReceiver(this.smsReceiver, fp);
			}
			
			this.smsReceiver.startReceiving(callbackContext);
	
			PluginResult pluginResult = new PluginResult(
					PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginResult);
			this.callback_receive = callbackContext;
			
			return true;
		}
		else if(action.equals(ACTION_STOP_RECEIVE_SMS)) {
			
			if(this.smsReceiver != null) {
				smsReceiver.stopReceiving();
			}

			this.isReceiving = false;
			
			// 1. Stop the receiving context
			PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(false);
			this.callback_receive.sendPluginResult(pluginResult);
			
			// 2. Send result for the current context
			pluginResult = new PluginResult(PluginResult.Status.OK);
			callbackContext.sendPluginResult(pluginResult);
			
			return true;
		} else if (action.equals(ACTION_GET_MESSAGES)) {
			Activity ctx = this.cordova.getActivity();
			ContentResolver resolver = ctx.getContentResolver();
            Cursor cursor = getCursor(resolver);
            if (cursor != null && cursor.moveToFirst()) {
                callbackContext.success(new JSONArray(getMessages(cursor)));
                cursor.close();
            } else {
            	callbackContext.error("No messages found.");
            }
			return true;
		}

		return false;
	}

    private static final String[] queriedColumns = new String[] {
            Telephony.Sms.Inbox.ADDRESS,
            Telephony.Sms.Inbox.SUBJECT,
            Telephony.Sms.Inbox.BODY,
            Telephony.Sms.Inbox.PERSON,
            Telephony.Sms.Inbox.DATE

    };

    private Cursor getCursor(ContentResolver cr) {
        String selection = null;
        String[] selectionArgs = null;
//        String selection = Telephony.Sms.Inbox.ADDRESS + " LIKE ?";
//        String[] selectionArgs = new String[] {
//                "%twosigma%"
//        };

        return cr.query(Telephony.Sms.Inbox.CONTENT_URI,
                queriedColumns,
                selection,
                selectionArgs,
                "date ASC");
    }

    private List<List<String>> getMessages(Cursor cursor) {
        List<List<String>> messages = new ArrayList<List<String>>();
        do {
            List<String> message = new ArrayList<String>();
            String address = cursor.getString(cursor.getColumnIndex(Telephony.Sms.Inbox.ADDRESS));
            System.out.println("Message from: " + address);
            for (String colName : queriedColumns) {
                message.add(cursor.getString(cursor.getColumnIndexOrThrow(colName)));
            }

            System.out.println("Message: " + message.toString());
            messages.add(message);
        } while (cursor.moveToNext());
        return messages;
    }
}
