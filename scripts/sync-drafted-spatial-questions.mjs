import { readFile, writeFile } from "node:fs/promises";

const path = new URL("../data/stimuli.json", import.meta.url);
const stimuli = JSON.parse(await readFile(path, "utf8"));

const drafted = {
  "823405e0-599f-4fd8-ae71-4d901edc36b0": [["intrinsic", "Was the building positioned above the bridge?", "No"], ["intrinsic", "Were the sailboats positioned in front of the bridge?", "Yes"], ["absolute", "Was the building positioned in the lower portion of the image?", "Yes"], ["absolute", "Was the green grass positioned on the lower right side of the image?", "No"]],
  "b9c9e75c-e81b-4dab-aafe-12045660422f": [["intrinsic", "Was the sunset positioned to the right of the tree?", "Yes"], ["intrinsic", "Was the canopy most densely concentrated to the left of the water?", "Yes"], ["absolute", "Was the closest tree positioned on the right side of the image?", "No"], ["absolute", "Was the water positioned on the lower-right side of the image?", "Yes"]],
  "bb029ac1-a5eb-4d1e-99b8-887a63dc14c0": [["intrinsic", "Was the building positioned to the left side of the narrow alleyway?", "Yes"], ["intrinsic", "Were the carriages positioned in front of the narrow alleyway?", "Yes"], ["absolute", "Were the three carriages positioned on the bottom left of the image?", "No"], ["absolute", "Was the narrow alleyway positioned on the right side of the image?", "Yes"]],
  "bf6c7c73-82e8-4ef7-8ac8-71920c8eb2b9": [["intrinsic", "Was the town positioned to the left of the young woman?", "Yes"], ["intrinsic", "Was the umbrella held by the woman’s right hand?", "No"], ["absolute", "Was the young woman positioned on the right side of the image?", "Yes"], ["absolute", "Were the sailboats positioned in the foreground of the image?", "No"]],
  "c1059816-1dc7-4af1-a5b3-26772de84b08": [["intrinsic", "Was Abraham Lincoln positioned to the right of the woman in the chariot?", "Yes"], ["intrinsic", "Were the horses positioned on the right side of Abraham Lincoln?", "No"], ["absolute", "Was the woman in the chariot positioned in the center-left part of the image?", "No"], ["absolute", "Was the U.S. Capitol building positioned in the foreground of the image?", "No"]],
  "c50ee8c2-db92-4e58-a6b8-0243dfe829d8": [["intrinsic", "Was the skull positioned to the right of the man?", "Yes"], ["intrinsic", "Was the hourglass positioned to the left of the skull?", "No"], ["absolute", "Was the man positioned in the center of the image?", "Yes"], ["absolute", "Was the gnarled tree positioned on the left side of the image?", "No"]],
  "c77f8b64-98a2-4b3c-b270-1863ece147c5": [["intrinsic", "Was the woman positioned above the stone coffin?", "Yes"], ["intrinsic", "Was the white cloth positioned on the left side of the stone coffin?", "Yes"], ["absolute", "Was the stone coffin positioned in the upper portion of the image?", "No"], ["absolute", "Were the nude, babyish putti most densely concentrated in the center of the image?", "Yes"]],
  "c9c0f26e-a559-43ab-b517-0384e347ade8": [["intrinsic", "Was the older woman positioned to the right of the bearded man?", "Yes"], ["intrinsic", "Was the young girl positioned in front of the older bearded man?", "Yes"], ["absolute", "Was the older bearded man positioned near the center of the image?", "Yes"], ["absolute", "Were the two cloaked, older men positioned on the left side of the image?", "No"]],
  "d24bdec0-5069-4768-96bd-583ca9629c0f": [["intrinsic", "Were the dark green trees positioned to the left of the ruined building?", "Yes"], ["intrinsic", "Was the pile of stone rubble positioned in front of the standing wall?", "Yes"], ["absolute", "Was the standing wall positioned in the foreground of the image?", "Yes"], ["absolute", "Was the ruined building positioned in the foreground of the image?", "No"]],
  "d25ae4f0-6e09-4ae3-9229-5d45ca3dec56": [["intrinsic", "Was the grassy hill positioned in front of the people?", "Yes"], ["intrinsic", "Was the stone wall positioned at the bottom of the grassy hill?", "Yes"], ["absolute", "Was the grassy hill positioned on the right side of the image?", "No"], ["absolute", "Were the two people positioned on the bottom left side of the image?", "Yes"]],
  "d37bc3dc-c3e0-4019-9725-f33404d7d5bc": [["intrinsic", "Was the ornate building positioned on the right side of the plaza?", "Yes"], ["intrinsic", "Was the bridge to the right of the plaza?", "No"], ["absolute", "Was the canal positioned on the left side of the image?", "Yes"], ["absolute", "Was the plaza positioned on the left side of the image?", "No"]],
  "00209fb1-64a2-4961-9ccc-8c6c06117df2": [["intrinsic", "Was the yellowed pine tree positioned to the left of the house?", "Yes"], ["intrinsic", "Was the garden positioned behind the house?", "No"], ["absolute", "Was the house positioned in the background of the image?", "Yes"], ["absolute", "Was the pine tree positioned in the foreground of the image?", "Yes"]],
  "03da43fa-743f-49d5-92ad-d521accc5759": [["intrinsic", "Was the nude woman positioned to the right of the standing man? ", "Yes"], ["intrinsic", "Was the standing man positioned to the left of the hammock?", "Yes"], ["absolute", "Were the nude woman and standing man positioned on the left of the image?", "No"], ["absolute", "Was the hammock positioned near the center of the image?", "Yes"]],
  "17b4aa42-79e9-4356-8231-9299f1c3a279": [["intrinsic", "Was the young man positioned to the left of the angel?", "No"], ["intrinsic", "Was the young man holding a fish in his right hand?", "No"], ["absolute", "Was the small white dog positioned in the lower-left area of the image?", "Yes"], ["absolute", "Was the gold vessel positioned in the center of the image?", "No"]],
  "26352a3f-c669-4371-ac6e-8d6899f17836": [["intrinsic", "Was the seated man positioned to the right of the younger boy? ", "Yes"], ["intrinsic", "Was the seated man positioned in front of the woman holding the baby? ", "No"], ["absolute", "Were the women in white dresses positioned on the left side of the image? ", "No"], ["absolute", "Was the younger boy positioned on the left side of the image?", "Yes"]]
};

for (const stimulus of stimuli) {
  const questions = drafted[stimulus.uuid];
  stimulus.spatialQuestions = questions
    ? questions.map(([frameOfReference, question, correctAnswer], index) => ({
        id: `r${stimulus.rowIndex}_q_${frameOfReference}_${index + 1}`,
        frameOfReference,
        question,
        options: ["Yes", "No"],
        correctAnswer
      }))
    : [];
}

await writeFile(path, `${JSON.stringify(stimuli, null, 2)}\n`);
