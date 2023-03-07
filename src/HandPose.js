import {Finger, FingerCurl, GestureDescription} from 'fingerpose'

export const CloseHandGesture = new GestureDescription('hand_close');

//CloseHandGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0)
CloseHandGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0)
CloseHandGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0)
CloseHandGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0)
CloseHandGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0)

export const OpenHandGesture = new GestureDescription('hand_open');

OpenHandGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
OpenHandGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
OpenHandGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
OpenHandGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)