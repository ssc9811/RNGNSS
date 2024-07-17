package com.gnss

import android.content.Context
import android.location.GnssMeasurementsEvent
import android.location.GnssNavigationMessage
import android.location.GnssStatus
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import androidx.core.content.ContextCompat
import android.content.pm.PackageManager
import android.util.Log
import com.facebook.react.bridge.WritableMap

class GNSSModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val locationManager: LocationManager = reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager

    // 위치 변경을 감지하는 리스너
    private val locationListener: LocationListener = object : LocationListener {
        override fun onLocationChanged(location: Location) {
            Log.d("GNSSModule", "Location changed: ${location}, ${location.latitude}, ${location.longitude}")
            Log.d("GNSSModule", "Location changed: ${location}")
            // 위치 변경 이벤트를 JS로 전송
            sendEvent("onLocationChanged", Arguments.createMap().apply {
                putDouble("latitude", location.latitude)
                putDouble("longitude", location.longitude)
            })
        }

        override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
        override fun onProviderEnabled(provider: String) {}
        override fun onProviderDisabled(provider: String) {}
    }

    // GNSS 상태 콜백
    private val gnssStatusCallback = object : GnssStatus.Callback() {
        override fun onStarted() {
            Log.d("GNSSModule", "GNSS started")
            sendEvent("onGnssStarted", null)
        }

        override fun onStopped() {
            Log.d("GNSSModule", "GNSS stopped")
            sendEvent("onGnssStopped", null)
        }

        override fun onSatelliteStatusChanged(status: GnssStatus) {
            Log.d("GNSSModule", "Satellite status changed")
            val satellites = Arguments.createArray()
            for (i in 0 until status.satelliteCount) {
                val satellite = Arguments.createMap().apply {
                    putInt("svid", status.getSvid(i))
                    putDouble("cn0DbHz", status.getCn0DbHz(i).toDouble())
                    putBoolean("usedInFix", status.usedInFix(i))
                }
                satellites.pushMap(satellite)
            }
            sendEvent("onSatelliteStatusChanged", Arguments.createMap().apply {
                putArray("satellites", satellites)
            })
        }
    }

    // GNSS 측정 이벤트 콜백
    private val gnssMeasurementsEventCallback = object : GnssMeasurementsEvent.Callback() {
        override fun onGnssMeasurementsReceived(event: GnssMeasurementsEvent) {
            Log.d("GNSSModule", "GNSS Measurements received")
            sendEvent("onGnssMeasurementsReceived", Arguments.createMap().apply {
                putString("measurements", event.toString())
            })
        }

        override fun onStatusChanged(status: Int) {
            Log.d("GNSSModule", "GNSS Measurements status changed: $status")
            sendEvent("onGnssMeasurementsStatusChanged", Arguments.createMap().apply {
                putInt("status", status)
            })
        }
    }

    // GNSS 네비게이션 메시지 콜백
    private val gnssNavigationMessageCallback = object : GnssNavigationMessage.Callback() {
        override fun onGnssNavigationMessageReceived(event: GnssNavigationMessage) {
            Log.d("GNSSModule", "GNSS Navigation Message received")
            sendEvent("onGnssNavigationMessageReceived", Arguments.createMap().apply {
                putString("navigationMessage", event.toString())
            })
        }

        override fun onStatusChanged(status: Int) {
            Log.d("GNSSModule", "GNSS Navigation Message status changed: $status")
            sendEvent("onGnssNavigationMessageStatusChanged", Arguments.createMap().apply {
                putInt("status", status)
            })
        }
    }

    override fun getName(): String {
        return "GNSSModule"
    }

    // 현재 위치를 가져오는 메소드
    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        try {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.e("GNSSModule", "Permission not granted")
                promise.reject("Permission not granted")
                return
            }
            // 위치 업데이트 요청
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000L, 1f, locationListener)
            val location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
            if (location != null) {
                Log.d("GNSSModule", "Location 정보, ${location}, ${location.latitude}, ${location.longitude}")
                val locationMap = Arguments.createMap().apply {
                    putDouble("latitude", location.latitude)
                    putDouble("longitude", location.longitude)
                }
                Log.d("GNSSModule", "locationMap 정보, ${locationMap}")
                promise.resolve(locationMap)
            } else {
                Log.e("GNSSModule", "Location not available")
                promise.reject("Location not available")
            }
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // GNSS 상태 업데이트를 시작하는 메소드
    @ReactMethod
    fun startGnssStatusUpdates(promise: Promise) {
        try {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.e("GNSSModule", "Permission not granted")
                promise.reject("Permission not granted")
                return
            }

            // GNSS 상태 콜백 등록
            locationManager.registerGnssStatusCallback(gnssStatusCallback)
            promise.resolve("GNSS status updates started")
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // GNSS 상태 업데이트를 중지하는 메소드
    @ReactMethod
    fun stopGnssStatusUpdates(promise: Promise) {
        try {
            // GNSS 상태 콜백 등록 해제
            locationManager.unregisterGnssStatusCallback(gnssStatusCallback)
            promise.resolve("GNSS status updates stopped")
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // GNSS 측정 업데이트를 시작하는 메소드
    @ReactMethod
    fun startGnssMeasurementsUpdates(promise: Promise) {
        try {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.e("GNSSModule", "Permission not granted")
                promise.reject("Permission not granted")
                return
            }

            // GNSS 측정 콜백 등록
            locationManager.registerGnssMeasurementsCallback(gnssMeasurementsEventCallback)
            promise.resolve("GNSS measurements updates started")
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // GNSS 측정 업데이트를 중지하는 메소드
    @ReactMethod
    fun stopGnssMeasurementsUpdates(promise: Promise) {
        try {
            // GNSS 측정 콜백 등록 해제
            locationManager.unregisterGnssMeasurementsCallback(gnssMeasurementsEventCallback)
            promise.resolve("GNSS measurements updates stopped")
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // GNSS 네비게이션 메시지 업데이트를 시작하는 메소드
    @ReactMethod
    fun startGnssNavigationMessageUpdates(promise: Promise) {
        try {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.e("GNSSModule", "Permission not granted")
                promise.reject("Permission not granted")
                return
            }

            // GNSS 네비게이션 메시지 콜백 등록
            locationManager.registerGnssNavigationMessageCallback(gnssNavigationMessageCallback)
            promise.resolve("GNSS navigation message updates started")
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // GNSS 네비게이션 메시지 업데이트를 중지하는 메소드
    @ReactMethod
    fun stopGnssNavigationMessageUpdates(promise: Promise) {
        try {
            // GNSS 네비게이션 메시지 콜백 등록 해제
            locationManager.unregisterGnssNavigationMessageCallback(gnssNavigationMessageCallback)
            promise.resolve("GNSS navigation message updates stopped")
        } catch (e: SecurityException) {
            Log.e("GNSSModule", "SecurityException: ${e.message}")
            promise.reject(e)
        }
    }

    // 이벤트를 JS로 보내는 헬퍼 메소드
    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
