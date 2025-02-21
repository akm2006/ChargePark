"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"



export function RadiusSelector({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (newValue) => {
    setLocalValue(newValue[0])
    onChange(newValue[0])
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="radius" className="text-sm font-medium text-white">
          Search Radius
        </Label>
        <span className="text-sm text-gray-400">
          {localValue >= 1000 ? `${(localValue / 1000).toFixed(1)}km` : `${localValue}m`}
        </span>
      </div>
      <Slider
        id="radius"
        min={500}
        max={5000}
        step={500}
        value={[localValue]}
        onValueChange={handleChange}
        className="[&_[role=slider]]:bg-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>500m</span>
        <span>5km</span>
      </div>
    </div>
  )
}

export default RadiusSelector;