# OSC Endpoints
OSC is a way to get different devices and applications to talk to each other. 

***
# Configuration

XSOverlay, by default, is configured to listen for OSC messages on port `9000`. This can be changed by editing the `ExternalMessageAPIConfig.json` file located in the `[XSOverlayInstallDirectory]/XSOverlay_Data/StreamingAssets/Plugins/Config/` directory.

The following options can be configured:

| Option | Description | Default Value |
| --- | --- | --- |
| `OscSendPort` | The TCP port to send OSC messages on. | `9000` |
| `OscListenPort` | The UDP port to recieve OSC messages on. | `9001` |
| `OscOutputPath` | The prefix that is applied to all OSC parameters | `/avatar/parameters/` |


!>_XSOverlay **ONLY** sends messages. It cannot recieve any inputs. XSOverlay also does not currently support OSCQuery_

***

# Endpoints

The following endpoints are available for use with XSOverlay

## Boolean

The following endpoints are boolean values that are either `1` or `0`. `1` is `true`, `0` is `false`.

| Endpoint | Description |
| --- | --- |
|  isOverlayOpen| Sends `1` if the overlay is open, `0` if it is not. |
| isKeyboardOpen | Sends `1` if the keyboard is open, `0` if it is not. |
| isWristVisible |  Sends `1` if the wrist is visible, `0` if it is not. |

## Float

The following endpoints are percentages between `0` and `1` that track battery life. If the device has a battery life of `50%`, the endpoint will set to `0.5`.

| Endpoint | Description |
| --- | --- |
|leftControllerBattery | Sends the battery percentage of the left controller. |
|rightControllerBattery | Sends the battery percentage of the right controller. |
|averageControllerBattery | Sends the average percentage between all of your controllers. |
|averageTrackerBattery | Sends the average percentage of all of your trackers. |

## Integer

The following endpoints are integers with a value between `0` and `255`. 

| Endpoint | Description |
| --- | --- |
| openOverlayCount | Sends the number overlays that are currently open on a user's XSOverlay. |