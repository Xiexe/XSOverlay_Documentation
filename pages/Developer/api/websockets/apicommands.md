# API Commands
Some API commands will return data back to your application, and some will not. 

You should handle these with the `OnMessage` event for your websocket client library.

>## ToggleLayoutMode
>_Toggles layout mode on or off._

>## TogglePerformanceStats
>_Toggles performance overlay on or off._

>## Create
>_Layout mode toolbar create button, creates an overlay._

>## Recenter
>_Layout mode toolbar recenter button, Recenters the overlay space._

>## Keyboard
>_Layout mode toolbar keyboard button. Summons / dismisses the keyboard._

>## Layouts
>_Layout mode toolbar layouts folder button. Summons / dismisses the layout folder._

>## Settings
>_Layout mode toolbar settings button. Summons / dismisses settings panel._

>## DeleteAll
>_Layout mode toolbar delete button. Deletes all active overlays._

>## WindowSwitcher
>_Layout mode toolbar grid view button._

>## MediaPlayPause
>_Toggles play / pause on media player_

>## MediaPrevious
>_Goes back to previous media._

>## MediaNext
>_Skips to next media._

>## WindowSettings
>_Toggles if the window settings panel is visible._

>## WindowSelect
>_Toggles if the window select panel is visible._

>## WindowDelete
>_Deletes the overlay that has ownership of the window toolbar._

>## UpdateMediaPlayerInformation
>_Updates the media player information with an XSOMediaObject._

>## SetXSOverlaySystemSetting
>_Sets a user settings._

>## SetActiveOverlaySetting
>_Sets a setting on the currently active overlay._

>## RequestShowTooltip
>_Requests to show a tooltip._

>## OpenSteamVRBindings
>_Opens the SteamVR Binding Dashboard Page for XSO_

>## SendNotification
>!>_Websocket notification format is slightly different from UDP notification format._
>_Sends a notification._
>![Notification Markup](../../../../img/notification/NotificationMarkup.png "Notification Markup")
>### Notification Object
>| Property | Type | Description | Default Value |
>| --- | --- | --- | --- |
>| `type` | `int` | The type of message to send. `1` defines a normal notification. | `1` |
>| `index` | `int` | Used for Media Player, changes the icon on the wrist. (depricated, see note below) | `0` |
>| `timeout` | `float` | How long the notification will stay on screen for in seconds. | `0.5f` |
>| `height` | `float` | Height notification will expand to if it has content other than a title. Default is 175. | `175` |
>| `opacity` | `float` | Opacity of the notification, to make it less intrusive. Setting to 0 will set to 1. | `1` |
>| `volume` | `float` | Notification sound volume. | `0.7f` |
>| `audioPath` | `string` | File path to .ogg audio file. Can be "default", "error", or "warning". Notification will be silent if left empty. | `""` |
>| `title` | `string` | Notification title, supports Rich Text Formatting. | `""` |
>| `content` | `string` | Notification content, supports Rich Text Formatting, if left empty, notification will be small. | `""` |
>| `useBase64Icon` | `bool` | Set to true if using Base64 for the icon image. | `false` |
>| `icon` | `string` | Base64 Encoded image, or file path to image. Can also be "default", "error", or "warning". | `""` |
>| `sourceApp` | `string` | Somewhere to put your app name for debugging purposes. | `""` |


>## RequestUpdateCursorCollisionTexture
>_Requests that the collision area for the panel be updated. Prevents cursor being visible on transparent parts of UI. May not update instantly._

>## SubscribeToEvents
>_Allows the application to subscribe to a set of tags that correspond to events that have return objects. See [Subscribing to Events](websockets#subscribing-to-events)_

>### Log
>_Logs a message to the output log._

>## RequestDateTime
>_Returns the current date and time, including session length, formatted based on User Setting_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateDateTime",
>    "jsonData": {
>        "Date": string,
>        "Time": string,
>        "CurrentSessionLength": string
>    }
>}
>```

>## RequestThemeUpdate
>_Returns the current theme colors in hexadecimal_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateTheme",
>    "jsonData": {
>        "HiTone": string,
>        "MidTone": string,
>        "DarkTone": string,
>        "ConstrastingTone": string,
>        "Error": string,
>        "Warning": string,
>        "Confirm": string,
>        "Accent": string,
>        "AccentHi": string
>    }
>}
>```

>## RequestSteamAvatar
>!>_This command uses the rawData field of XSOApiObject rather than the JsonData field._
>_Returns the steam avatar of the user_
>### Use
>```cs
>    XSOApiObject.target = "xsoverlay";
>    XSOApiObject.command = "RequestSteamAvatar";
>    XSOApiObject.rawData = "medium"; // can be large, medium, or small. defaults to medium if left empty
>
>    WebsocketClient.Send(JsonSerializer.Serialize(XSOAbiObject));
>```
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateSteamAvatar",
>    "jsonData": {},
>    "rawData": string // Avatar image .png encoded in base64.
>}
>```

>## RequestDeviceInformation 
>_Returns a list of devices and information about those devices_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateDeviceInformation",
>    "jsonData": {
>        [
>            {
>                "id": int, // Device ID according to SteamVR
>                "classification": int,
>                "type": int,
>                "lastUpdated": string, // ISO-8601 Time 
>                "lastBatteryUpdate": string, // ISO-8601 Time 
>                "connection": int, // connection status
>                "charging": bool, // charging status
>                "battery": int, // 0-100 battery life
>                "label": string, // shorthand label
>                "name": string, // SteamVR device name
>                "timeEstimate": string, // estimated time remaining
>                "runningBatterySecondsPerPecent": [ // How long in seconds it took for 1% battery to drain. Running list, contains last 5% drain.
>                    float,
>                    float,
>                    float,
>                    float,
>                    float
>                ],
>                "runningBatteryIndex": int, // current index for the running list above.
>                "fingerprint": string, // SteamVR unique fingerprint for the device. 
>                "deviceDidPingLowBattery": bool, // has this device pinged low battery yet
>                "friendlyName": string, // friendly name for the device. Not always used. 
>                "waitingForFirstRealBatteryUpdate": bool 
>            },
>            // ... more devices ...
>        ]
>    }
>}
>```


>## RequestLayoutModeState 
>_Returns the current open / closed state of Layout Mode_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateLayoutModeState",
>    "jsonData": {},
>    "rawData": bool // bool representing state of layout mode.
>}
>```

>## RequestMediaPlayerUpdate 
>_Returns the current media information_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateMediaPlayer",
>    "jsonData": {
>        "artist": string,
>        "title": string,
>        "albumTitle": string,
>        "albumArt": string, // Base64 string representing album art image.
>        "playbackStatus": bool // bool represeting playback state
>    }
>}
>```

>## RequestGetSettings
>_Returns user settings for the overlay_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateSettings",
>    "jsonData": {
>        "VersionNumber": int,
>        "KeyboardSoundpackName": string,
>        "KeyboardSoundpackIndex": int,
>        "ForceJISKeyboard": bool,
>        "KeyboardFormat": int,
>        "KeyboardOpacity": float,
>        "KeyboardTypingSounds": bool,
>        "WristOffsets": {
>            "x": float,
>            "y": float,
>            "z": float
>        },
>        "WristRotation": {
>            "x": float,
>            "y": float,
>            "z": float
>        },
>        "WristScale": float,
>        "DominantHand": int,
>        "Language": int,
>        "LanguageURL": string,
>        "InputMethod": int,
>        "AutomaticMouseControl": bool,
>        "DoubleClickDelay": float,
>        "DiscordRichPresence": bool,
>        "LowBatterySound": bool,
>        "LowBatteryWarningPercent": int,
>        "HapticsStrength": float,
>        "HideTooltips": bool,
>        "PointerScale": float,
>        "CaptureMethod": int,
>        "ShowWindowPreviews": bool,
>        "CurvedOverlays": bool,
>        "AutoRecenter": bool,
>        "InvertScaleGesture": bool,
>        "OverlayCurveBias": float,
>        "OverlayClipAngle": int,
>        "OverlayDefaultScale": float,
>        "OverlayDefaultOpacity": float,
>        "OverlayDefaultMinFPS": int,
>        "OverlayDefaultMaxFPS": int,
>        "AimTarget": int,
>        "AimAtTarget": bool,
>        "GrabSensitivity": float,
>        "PushSpeed": float,
>        "ScaleSpeed": float,
>        "PositionDampening": int,
>        "RotationDampening": int,
>        "SmartRollAngle": int,
>        "AllowWristMovement": bool,
>        "HideWristOverlay": bool,
>        "WristOpacity": float,
>        "WristClipAngle": int,
>        "ContinentalTimeFormat": bool,
>        "DateFormat": int,
>        "AutoMediaDetection": bool,
>        "MediaThemeing": bool,
>        "AlwaysShowDetailedInformation": bool,
>        "DefaultShowBatteryPercentage": bool,
>        "BatteryFontScale": int,
>        "UseDarkTheme": bool,
>        "AdaptiveColor": float,
>        "AccentColor": {
>            "r": float,
>            "g": float,
>            "b": float,
>            "a": float
>        },
>        "NotificationScale": float,
>        "NotificationOffsets": {
>            "x": float,
>            "y": float,
>            "z": float
>        },
>        "ForceHigherQualityOverlays": bool,
>        "BlockInputToBackgroundApplication": bool,
>        "InputBlockingBehavior": int,
>        "NightLight": bool,
>        "NightLightStartHour": int,
>        "NightLightEndHour": int,
>        "NightLightStartAMPM": bool,
>        "NightLightEndAMPM": bool,
>        "NightLightIntensity": float,
>        "NightLightSchedule": bool,
>        "AllowAdminPermissions": bool,
>        "UUID": string,
>        "SendAnalytics": bool
>    }
>}
>```

>## RequestUpdatedLanguageList 
>_Returns the list of possible languages_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateLanguageList",
>    "jsonData": {
>        "LanguageName": string,
>        "LanguageName2": string,
>        // ... more languages ...
>    }
>}
>```

>## RequestUpdatedLanguageMap
>_Returns the map of strings for the currently selected language_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateLanguageMap",
>    "jsonData": {
>        // Key value map that XSO uses to translate languages.
>        // Please look at translation files for the list of strings.
>    }
>}
>```

>## RequestAchievementInformation 
>_Returns list of achievements with a boolean for unlocked / locked for the user._
>### Returns
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateAchievementStatus",
>    "jsonData": {
>        "ACHIEVEMENT_NAME": bool,
>        "ACHIEVEMENT_NAME_1": bool,
>        "ACHIEVEMENT_NAME_2": bool,
>    }
>}
>```

>## RequestWindowList 
>_Returns a list of capturable windows._
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateWindowList",
>    "jsonData": {}
>}
>```

>## RequestActiveOverlayInformation
>_Requests the current active overlay. This is the overlay that has ownership of the window toolbar_
>### Return Object
>```json
>{
>    "target" : "yourappname",
>    "command": "UpdateActiveOverlayInformation",
>    "jsonData": {
>        "0": {
>            "id": int,
>            "title": string,
>            "icon": string, // base64 icon image
>            "windowPreview": string, // base64 preview image. Currently not used.
>            "appName": string,
>            "isDesktop": bool,
>            "isPrimaryDesktop": bool,
>            "isUWP": bool,
>            "isSystem": bool
>        }
>        // ... more entries ...
>    }
>}
>```