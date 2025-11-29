import convert, { Unit } from "convert-units"

export function convertWeightToBase(value: number, unit: string) {
  return convert(value).from(unit as Unit).to("mcg")
}

export function convertBaseWeightToUnit(value:number, unit: string ){
  return convert(value).from("mcg").to(unit as Unit)
}

export function convertBaseDurationToUnit(value:number, unit: string ){
  return convert(value).from("ms").to(unit as Unit)
}

export function isImperialDistance(unit: string) {
  return ["mi", "ft", "in", "yd", "mile", "foot", "inch", "yard"].includes(unit)
}