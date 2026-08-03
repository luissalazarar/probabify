import { twentiesEvents } from "./twenties.js";
import { thirtiesEvents } from "./thirties.js";
import { fortiesEvents } from "./forties.js";
import { fiftiesEvents } from "./fifties.js";
import { sixtiesEvents } from "./sixties.js";
import { mediaEvents } from "./media.js";
import { specialEvents } from "./special.js";
import { decadeExtraEvents } from "./decadeExtras.js";
import { originBranchEvents } from "./originBranches.js";
import { backgroundEvents } from "./backgroundEvents.js";
import { peruvianScandalEvents } from "./peruvianScandals.js";
import { nationalCrisisEvents } from "./nationalCrises.js";
import { statConsequenceEvents } from "./statConsequences.js";
import { deferredConsequenceEvents } from "./deferredConsequences.js";
import { originLongArcEvents } from "./originLongArcs.js";
import { relevanceCallbackEvents } from "./relevanceCallbacks.js";
import { applyPeruvianLore } from "../peruvianLore.js";
import { globalizeNationalEvents } from "./globalizeEvents.js";
import { applyStatCausality } from "../statCausality.js";
import { applyNarrativeCausality } from "../narrativeCausality.js";
import { applySpecialCaseCausality } from "../specialCases.js";

const RAW_EVENTS = [
  ...twentiesEvents,
  ...thirtiesEvents,
  ...fortiesEvents,
  ...fiftiesEvents,
  ...sixtiesEvents,
  ...mediaEvents,
  ...specialEvents,
  ...decadeExtraEvents,
  ...originBranchEvents,
  ...backgroundEvents,
  ...peruvianScandalEvents,
  ...nationalCrisisEvents,
  ...statConsequenceEvents,
  ...deferredConsequenceEvents,
  ...originLongArcEvents,
  ...relevanceCallbackEvents,
];

export const EVENTS = applySpecialCaseCausality(applyNarrativeCausality(applyPeruvianLore(applyStatCausality(globalizeNationalEvents(RAW_EVENTS)))));
