import type { DeviceLayout } from '../types'

import bossDd8Image from '@/assets/devices/pedals/boss-dd8.png'
import bossMt2Image from '@/assets/devices/pedals/boss-mt2.png'
import bossOd1Image from '@/assets/devices/pedals/boss-od1.png'
import bigmuffPiImage from '@/assets/devices/pedals/bigmuff-pi.png'
import ibanezTs9Image from '@/assets/devices/pedals/ibanez-ts9.png'
import fenderTwinReverb65Image from '@/assets/devices/amps/fender-twinreverb-65.png'
import marshallJcm800Image from '@/assets/devices/amps/marshall-jcm800.png'
import orangeTh100Image from '@/assets/devices/amps/orange-th100.png'
import woxAc30Image from '@/assets/devices/amps/wox-ac30.png'

export const deviceLayouts: Record<string, DeviceLayout> = {
  //Pedals
  'boss-dd8': {
    image: bossDd8Image,
    aspectRatio: 0.56,
    knobDefaultSize: 18,
    hideKnobLabels: true,
    paramPositions: {
      'mix':      { x: 19, y: 16 },
      'feedback': { x: 39, y: 16 },
      'time':     { x: 61, y: 16 },
      'tone':     { x: 81, y: 16 },
    },
    led:        { x: 50, y: 6.5, size: 5 },
    footswitch: { x: 50, y: 72,  size: 32 },
    showNameLabel: false,
  },

  'boss-mt2': {
    image: bossMt2Image,
    aspectRatio: 0.667,
    knobDefaultSize: 12,
    knobLabelColor: '#ffffff',
    paramPositions: {
      'level': { x: 24, y: 13 },
      'dist':  { x: 40, y: 19 },
      'low':   { x: 60, y: 19 },
      'high':  { x: 76, y: 13 },
    },
    footswitch: { x: 50, y: 72, size: 38 },
    showNameLabel: false,
  },

  'boss-od1': {
    image: bossOd1Image,
    aspectRatio: 0.8,
    knobDefaultSize: 17,
    knobLabelColor: '#ffffff',
    knobValueColor: '#ffffff',
    paramPositions: {
      'level':     { x: 35, y: 13 },
      'overdrive': { x: 63, y: 13 },
    },
    footswitch: { x: 50, y: 72, size: 36 },
    showNameLabel: false,
  },

  'bigmuff-pi': {
    image: bigmuffPiImage,
    aspectRatio: 0.667,
    knobDefaultSize: 16,
    knobLabelColor: '#ffffff',
    paramPositions: {
      'volume':  { x: 22, y: 44 },
      'tone':    { x: 50, y: 51 },
      'sustain': { x: 78, y: 44 },
    },
    footswitch: { x: 50, y: 79, size: 22 },
    showNameLabel: false,
  },

  'ibanez-ts9': {
    image: ibanezTs9Image,
    aspectRatio: 1,
    knobDefaultSize: 13,
    knobLabelColor: '#1a1a22',
    knobValueColor: '#ffffff',
    paramPositions: {
      'drive': { x: 34, y: 10 },
      'tone':  { x: 50, y: 18 },
      'level': { x: 66, y: 10 },
    },
    footswitch: { x: 50, y: 74, size: 50 },
    showNameLabel: false,
  },
  //Amps
  'fender-twinreverb-65': {
    image: fenderTwinReverb65Image,
    aspectRatio: 1.5,
    knobDefaultSize: 5,
    knobLabelColor: '#ffffff',
    paramPositions: {
      'volume':    { x: 14, y: 18 },
      'treble':    { x: 25, y: 18 },
      'middle':    { x: 36, y: 18 },
      'bass':      { x: 47, y: 18 },
      'reverb':    { x: 58, y: 18 },
      'speed':     { x: 69, y: 18 },
      'intensity': { x: 80, y: 18 },
    },
    led: { x: 87, y: 19, size: 2.4 },
    showNameLabel: false,
  },

  'marshall-jcm800': {
    image: marshallJcm800Image,
    aspectRatio: 1.5,
    knobDefaultSize: 6,
    knobLabelColor: '#ffffff',
    knobValueColor: '#ffffff',
    paramPositions: {
      'presence': { x: 35, y: 74 },
      'bass':     { x: 46, y: 74 },
      'middle':   { x: 57, y: 74 },
      'treble':   { x: 68, y: 74 },
      'master':   { x: 78, y: 74 },
      'pre-amp':  { x: 89, y: 74 },
    },
    led: { x: 25, y: 73, size: 2.0 },
    showNameLabel: false,
  },

  'orange-th100': {
    image: orangeTh100Image,
    aspectRatio: 1.5,
    knobDefaultSize: 4.2,
    knobLabelColor: '#ffffff',
    toggleLabelColor: '#1a1a22',
    hideKnobLabels: true,
    togglePositions: {
      'power':   { x: 18, y: 63, width: 2.1, height: 9.5, topLabel: 'OFF', bottomLabel: 'ON' },
      'output':  { x: 22, y: 63, width: 2.1, height: 9.5, topLabel: 'FULL', bottomLabel: 'HALF' },
      'channel': { x: 28, y: 63, width: 2.1, height: 9.5, topLabel: 'DIRTY', bottomLabel: 'CLEAN' },
    },
    paramPositions: {
      'dirty-volume': { x: 40, y: 62 },
      'dirty-shape':  { x: 46, y: 62 },
      'dirty-gain':   { x: 52, y: 62 },
      'clean-treble': { x: 60.4, y: 62 },
      'clean-bass':   { x: 67, y: 62 },
      'clean-volume': { x: 73, y: 62 },
    },
    led: { x: 33, y: 62, size: 1.2 },
    showNameLabel: false,
  },

  'wox-ac30': {
    image: woxAc30Image,
    aspectRatio: 1.5,
    knobDefaultSize: 4.5,
    knobLabelColor: '#ffffff',
    paramPositions: {
      'normal-vol':    { x: 33, y: 20 },
      'brilliant-vol': { x: 44, y: 20 },
      'bass':          { x: 55, y: 20 },
      'treble':        { x: 65, y: 20 },
      'cut':           { x: 74, y: 20 },
      'master':        { x: 84, y: 20 },
    },
    showNameLabel: false,
  },
}

export function getDeviceLayout(deviceId: string): DeviceLayout | undefined {
  return deviceLayouts[deviceId]
}

export function hasDeviceLayout(deviceId: string): boolean {
  return deviceId in deviceLayouts
}
