# Layout System
!>_Layouts are save at `[XSOverlayInstallationDirectory]/XSOverlay_Data/StreamingAssets/Layouts/`_

> Layouts allow you to save window positions, rotations, and settings to a preset that can later be loaded. They are currently serialized to `.json` file format, located in the directory mentioned above. Layouts will try to load window captures by first trying to match the window title as it was when saved, if it fails to do so, it will then fall back to trying to use the Process Name (I.E. Discord.exe, Firefox.exe), Class Name, or Window Image name. Failing to match any of these will result in the overlay automatically being deleted. 

!> _Saving a layout to the last slot (8) will automatically load that layout on startup._

# Empty layout example
```json
"LayoutFormatVersion": 2,
"SavedWindowCount": 0,
"WindowPositions": [],
"WindowRotations": [],
"WindowScales": [],
"WindowOpacities": [],
"WindowCurvatures": [],
"WindowModLock": [],
"WindowModBlockMouse": [],
"WindowModAutoHide": [],
"WindowModPin": [],
"WindowIsDesktopCapture": [],
"WindowIsWindowCapture": [],
"WindowIsRotated90": [],
"WindowIsRotated180": [],
"WindowIsRotated270": [],
"WindowUpdateRateMin": [],
"WindowUpdateRateMax": [],
"WindowAttachedToDevice": [],
"AttachedIndex": [],
"AttachedCustomIndex": [],
"WindowMonitorIndex": [],
"WindowTitle": [],
"FallbackCapturePath": [],
"WindowResolution": [],
"WindowClassName": [],
"WindowImageName": [],
"WindowProcessName": []
```

