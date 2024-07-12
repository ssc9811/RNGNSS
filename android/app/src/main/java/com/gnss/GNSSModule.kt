package com.gnss

import android.content.Context
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat

class GNSSModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val locationManager: LocationManager = reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
    private val locationListener: LocationListener

    init {
        locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                // Location changed
            }

            override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }
    }

    override fun getName(): String {
        return "GNSSModule"
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        try {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                promise.reject("Permission not granted")
                return
            }

            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0f, locationListener)
            val location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
            if (location != null) {
                val locationMap = Arguments.createMap().apply {
                    putDouble("latitude", location.latitude)
                    putDouble("longitude", location.longitude)
                }
                promise.resolve(locationMap)
            } else {
                promise.reject("Location not available")
            }
        } catch (e: SecurityException) {
            promise.reject(e)
        }
    }
}
