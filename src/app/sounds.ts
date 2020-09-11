import { debounce } from "./core/utils";
import zzfx from "./ZzFX.micro";

var dbSFX = debounce(zzfx, 48, true);
export var sfx = (data, debounce = false) =>
  debounce ? dbSFX(...data) : zzfx(...data);